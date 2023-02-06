<template>
  <div
    class="text-center flex flex-col items-center w-full h-full"
    v-if="selectedKeyboard"
  >
    <div class="flex-grow-0">
      <h1 class="text-5xl font-bold my-4 mt-8">Initial Keyboard Setup</h1>
      <div class="flex">
        <div class="badge badge-primary badge-outline p-4 m-2 mb-8 mr-6">
          Keyboard: {{ selectedKeyboard.path }}
        </div>
        <div class="btn btn-circle text-sm" @click="$emit('back')">
          reselect
        </div>
      </div>

      <ul class="steps max-w-md w-full mb-2">
        <li
          class="step"
          :class="{ 'step-primary': currentStep >= 0 }"
          @click="currentStep = 0"
        >
          Firmware
        </li>
        <li
          class="step"
          :class="{ 'step-primary': currentStep >= 1 }"
          @click="currentStep > 1 ? (currentStep = 1) : undefined"
        >
          Matrix
        </li>
        <li
          class="step"
          :class="{ 'step-primary': currentStep >= 2 }"
          @click="currentStep > 2 ? (currentStep = 2) : undefined"
        >
          Pins
        </li>
        <li
          class="step"
          :class="{ 'step-primary': currentStep >= 3 }"
          @click="currentStep > 3 ? (currentStep = 3) : undefined"
        >
          Layout
        </li>
      </ul>
    </div>
    <div class="overflow-y-auto flex-grow-1 px-8">
      <KmkInstaller v-if="currentStep === 0" @next="currentStep++" />
      <MatrixSetup v-if="currentStep === 1" @next="currentStep++" />
      <PinSetup v-if="currentStep === 2" @next="currentStep++" />
      <Tools v-if="currentStep === 3" @next="$emit('next')" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { selectedKeyboard } from "@/store";
import { ref } from "vue";
import KmkInstaller from "@/components/setup-wizard/KmkInstaller.vue";
import MatrixSetup from "@/components/setup-wizard/MatrixSetup.vue";
import PinSetup from "@/components/setup-wizard/PinSetup.vue";
import Tools from "@/components/Tools.vue";
const currentStep = ref(0);
const steps = ref(["kmk", "matrix", "pins", "layout"]);
</script>
