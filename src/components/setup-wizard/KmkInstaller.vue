<template>
  <div class="p-4 mt-4">
    <p class="max-w-md">
      KMK is a capable firmware for keyboards using the rp2040. You can let
      kmk automatically install here or do the procedure manually
    </p>
    <div class="keyboard-check m-4 flex flex-col justify-center" v-if="selectedkeyboard.hasKmk">
      <span class="text-right">KMK</span>
      <span class="badge badge-success">installed</span>
      <button class="btn btn-sm btn-primary block mt-4" @click="$emit('next')">
        Next
      </button>
    </div>
    <button v-else-if="kmkInstallState !== 'done'" class="btn btn-sm btn-primary mt-8" @click="updateKMK">
      install KMK
    </button>
    <div v-if="['downloading'].includes(kmkInstallState)">
      <p class="m-4 mt-8">{{ kmkInstallState }}</p>
      <div
          class="radial-progress bg-primary text-primary-content border-4 border-primary"
          :style="{ '--value': progress }"
      >
        {{ progress }}%
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import {ref} from "vue";
import {selectedkeyboard} from "@/store";

const progress = ref(0);
const kmkInstallState = ref("");

const updateKMK = async () => {
  await (window as any).electronAPI.updateKMK();
  kmkInstallState.value = "downloading";
};

(window as any).electronAPI.onUpdateKmkProgress((_event, value) => {
  console.log("kmk progress", value);
  // dont go back from done
  if(kmkInstallState.value !== 'done'){
    kmkInstallState.value = value.state;
    progress.value = value.progress;
    if(value.state ==='done') {
      selectedkeyboard.value.hasKmk = true
    }
  }
})
</script>
