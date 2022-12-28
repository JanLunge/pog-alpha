<script setup lang="ts">
import { ref } from "vue";
import KeyboardConfig from "@/components/setup-wizard/KeyboardConfig.vue";

const selectedkeyboard = ref({
  path: "",
  hasKmk: false,
  hasCode: false,
  hasBoot: false,
  codeContents: undefined
});
const openFolderModal = async () => {
  selectedkeyboard.value = await (window as any).electronAPI.openFile();
  if(selectedkeyboard.value.path) {wizardStep.value = 1;}
  console.log(selectedkeyboard);
};

const updateKMK = async () => {
  await (window as any).electronAPI.updateKMK();
};

const openKeymapConfigurator = () => {
  wizardStep.value = 2;
};

const wizardStep = ref(0)
</script>

<template>
  <main class="pt-8 h-full">
    <div class="hero h-full" v-if="wizardStep === 0">
      <div class="hero-content text-center">
        <div class="max-w-md">
          <h1 class="text-5xl font-bold">pog</h1>
          <p class="pt-6">Effortlessly customize your keyboard with Pog</p>
          <p class="py-6">
            Now select the Circuit Python drive of your keyboard to get started.
          </p>
          <button class="btn btn-primary" @click="openFolderModal">
            Select Keyboard Drive
          </button>
        </div>
      </div>
    </div>
    <div class="hero min-h-full bg-base-200" v-else-if="wizardStep === 1">
      <div class="hero-content text-center">
        <div class="max-w-md">
          <h1 class="text-5xl font-bold mb-2">Keyboard Overview</h1>
          <div class="badge badge-primary badge-outline p-4 m-2">Keyboard: {{selectedkeyboard.path}}</div>
          <button
            class="btn btn-xs btn-outline"
            @click="wizardStep--"
          >
            select a different keyboard
          </button>
          <p>complete your keyboard setup with these steps</p>
          <div class="mt-8 flex flex-col">
            <div class="keyboard-check">
              <span class="text-right">KMK</span>
              <span class="badge badge-success" v-if="selectedkeyboard.hasKmk"
                >installed</span
              >
              <button class="btn btn-xs btn-error" @click="updateKMK" v-else>
                install KMK
              </button>
            </div>
            <div class="keyboard-check">
              <span class="text-right">keyboard config</span>
              <span class="badge badge-success"  v-if="selectedkeyboard.hasCode"
                >exists</span
              >
              <button
                class="btn btn-xs btn-error"
                v-else
                @click="openKeymapConfigurator"
              >
                configure keyboard
              </button>
            </div>
            <div class="keyboard-check">
              <span class="text-right">boot config</span>
              <span class="badge badge-success" v-if="selectedkeyboard.hasBoot"
                >exists</span
              >
              <button class="btn btn-xs btn-info" v-else>
                configure usb drive
              </button>
            </div>
            <div v-if="selectedkeyboard.hasKmk && selectedkeyboard.hasCode" class="mt-4">
              <p class="p-2">
                Essentials are ready to go
              </p>
              <button
                  class="btn btn-sm btn-primary"
                  @click="openKeymapConfigurator"
              >
                configure keyboard
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-else-if="wizardStep === 2">
      <div class="btn btn-xs" @click="wizardStep--">back</div>
      <keyboard-config :code-contents="selectedkeyboard.codeContents" :layoutContents="selectedkeyboard.layoutContents"></keyboard-config>
    </div>
  </main>
</template>
<style>
.keyboard-check {
  @apply grid grid-cols-2 gap-2 items-center mb-4;
}
</style>
