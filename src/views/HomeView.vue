<script setup lang="ts">
import { ref } from "vue";
import KeyboardConfig from "@/components/setup-wizard/KeyboardConfig.vue";
import NewKeyboardSetup from "@/views/newKeyboardSetup.vue";

import { selectedKeyboard } from "@/store";
import router from "@/router";
import { openFolderModal } from "@/helpers/electron";

const wizardStep = ref(0);
const selectKeyboard = async () => {
  const selection = await openFolderModal();
  if (!selection.path) return;
  selectedKeyboard.value = selection;
  if (selectedKeyboard.value.hasConfig) {
    wizardStep.value = 2;
    router.push("/keymap");
  } else {
    wizardStep.value = 1;
  }
};
</script>

<template>
  <main class="h-full w-full">
    <div
      class="h-full p-2 text-center w-full flex flex-col items-center"
      v-if="wizardStep === 0"
    >
      <h1 class="text-5xl font-bold">pog</h1>
      <p class="pt-6">Effortlessly customize your keyboard with Pog</p>
      <div class="divider"></div>

      <!--      <div class="p-8">-->
      <!--        <p class="pb-4 text-xl">Your Keyboards</p>-->
      <!--        <div class="flex items-center justify-center">-->
      <!--          <div-->
      <!--            class="w-48 h-24 border rounded border-gray-500 flex items-center justify-center"-->
      <!--          >-->
      <!--            0xcb New Horizons-->
      <!--          </div>-->
      <!--        </div>-->
      <!--      </div>-->
      <!--      <div class="divider">OR</div>-->

      <div class="m-4 flex-grow justify-center flex flex-col">
        <p class="pb-2">select a keyboard drive to continue</p>
        <p>(Note: your controller needs to be running <a href="https://circuitpython.org/downloads" target="_blank" class="link">circuit python</a>)</p>
        <button class="btn btn-primary mt-4" @click="selectKeyboard">
          Select Keyboard Drive
        </button>
      </div>
    </div>
    <new-keyboard-setup
      :selected-keyboard="selectedKeyboard"
      @back="wizardStep--"
      @next="
        wizardStep++;
        $router.push('/keymap');
      "
      v-else-if="wizardStep === 1"
    ></new-keyboard-setup>
    <div v-else-if="wizardStep === 2">
      <keyboard-config
        :code-contents="selectedKeyboard.codeContents"
        :config-contents="selectedKeyboard.configContents"
      ></keyboard-config>
    </div>
  </main>
</template>
<style></style>
