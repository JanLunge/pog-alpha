<template>
  <div class="p-4 mt-4">
    <p>
      <a href="https://kmkfw.io/" target="_blank" class="link">KMK</a> is a
      capable firmware for keyboards using the rp2040.
      </p>
    <p>Before you proceed make sure you installed <a class="link" href="https://circuitpython.org/downloads" target="_blank">circuit python</a> on your controller</p>
    <p>
      You can let kmk
      automatically install to this keyboard
      <span class="font-mono">{{ selectedKeyboard.path }}</span>
    </p>
    <div
      class="keyboard-check m-4 flex flex-col justify-center"
      v-if="selectedKeyboard.hasKmk"
    >
      <span class="text-right">KMK</span>
      <span class="badge badge-success">installed</span>
      <button class="btn btn-sm btn-primary block mt-4" @click="$emit('next')">
        Next
      </button>
    </div>
    <button
      v-else-if="kmkInstallState !== 'done'"
      class="btn btn-sm btn-primary mt-8"
      @click="updateKMK"
    >
      install KMK
    </button>
    <div v-if="['downloading'].includes(kmkInstallState)">
      <p class="m-4 mt-8">{{ kmkInstallState }}</p>
      <div
        class="radial-progress bg-primary text-primary-content border-4 border-primary"
        :style="{ '--value': progress }"
      >
        {{ progress === NaN ? "Done" : progress  }}%
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref } from "vue";
import { selectedKeyboard } from "@/store";

const progress = ref(0);
const kmkInstallState = ref("");

const updateKMK = async () => {
  await (window as any).electronAPI.updateKMK();
  kmkInstallState.value = "downloading";
};

(window as any).electronAPI.onUpdateKmkProgress(
  (_event: Event, value: { state: string; progress: number }) => {
    console.log("kmk progress", value);
    // don't go back from done
    if (kmkInstallState.value !== "done") {
      kmkInstallState.value = value.state;
      console.log('progress',value.progress)
      progress.value = Math.round(value.progress);
      if (value.state === "done") {
        selectedKeyboard.value.hasKmk = true;
      }
    }
  }
);
</script>
