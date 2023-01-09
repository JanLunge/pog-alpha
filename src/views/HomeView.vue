<script setup lang="ts">
import { ref } from "vue";
import KeyboardConfig from "@/components/setup-wizard/KeyboardConfig.vue";
import NewKeyboardSetup from "@/views/newKeyboardSetup.vue";

import { selectedkeyboard } from "@/store";

const openFolderModal = async () => {
  selectedkeyboard.value = await (window as any).electronAPI.openFile();
  if (selectedkeyboard.value.path) {
    wizardStep.value = 1;
  }
  console.log(selectedkeyboard);
};

const wizardStep = ref(0);
</script>

<template>
  <main class="h-full w-full pt-8">
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
        <p class="pb-4">select a keyboard drive to continue</p>
        <button class="btn btn-primary" @click="openFolderModal">
          Select Keyboard Drive
        </button>
      </div>
    </div>
    <div class="min-h-full" v-else-if="wizardStep === 1">
      <new-keyboard-setup
        :selected-keyboard="selectedkeyboard"
        @back="wizardStep--"
        @next="wizardStep++"
      ></new-keyboard-setup>
    </div>
    <div v-else-if="wizardStep === 2">
      <!--      <div class="btn btn-xs" @click="wizardStep&#45;&#45;">back</div>-->
      <keyboard-config
        :code-contents="selectedkeyboard.codeContents"
        :layoutContents="selectedkeyboard.layoutContents"
      ></keyboard-config>
    </div>
  </main>
</template>
<style>
.keyboard-check {
  @apply grid grid-cols-2 gap-2 items-center mb-4;
}
</style>
