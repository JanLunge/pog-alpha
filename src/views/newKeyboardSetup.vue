<template>
  <div class="text-center flex flex-col items-center" v-if="selectedkeyboard">
    <h1 class="text-5xl font-bold mb-2">Initial Keyboard Setup</h1>
    <div class="flex">
      <div class="badge badge-primary badge-outline p-4 m-2 mb-8 mr-6">
        Keyboard: {{ selectedkeyboard.path }}
      </div>
      <div class="btn btn-circle text-sm" @click="$emit('back')">reselect</div>
    </div>

    <ul class="steps max-w-md w-full">
      <li class="step" :class="{'step-primary': currentStep >= 0}" @click="currentStep=0">Firmware</li>
      <li class="step" :class="{'step-primary': currentStep >= 1}" @click="currentStep=1">Matrix</li>
      <li class="step" :class="{'step-primary': currentStep >= 2}" @click="currentStep=2">Pins</li>
      <li class="step" :class="{'step-primary': currentStep >= 3}" @click="currentStep=3">Layout</li>
    </ul>

    <KmkInstaller v-if="currentStep === 0" @next="currentStep++" />
    <MatrixSetup v-if="currentStep === 1" @next="currentStep++" />
    <PinSetup v-if="currentStep === 2" @next="currentStep++" />
    <div v-if="currentStep ===3" class="max-w-md text-left">
      <p class="text-center">WIP</p>
      <p>currently you need to create a layout file manually</p>
      <p>in the pog.json file you will find an entry named layouts. in there you have the keymap which is <a class="link link-primary"
          href="keyboard-layout-editor.com">KLE Syntax</a> and next to it the labels for choosing between layout variants. </p>
      <p>currently rotation is not yet supported and the only breaking change to a vial.json file is that variant keys need to be placed in the spot that they should show up when activated. which leads to keys being stacked in the current KLE editor.</p>
      <p>the keys only need a top left label with their matrix position and a bottom right label if you want to switch layout variants for that key</p>
      <div class="btn btn-primary btn-sm" @click="$emit('next')">Next</div>
    </div>
    <div class="mt-8 flex flex-col" v-if="currentStep === 'x'">
      <div class="keyboard-check">
        <span class="text-right">keyboard config</span>
        <span class="badge badge-success" v-if="selectedkeyboard.hasCode"
          >exists</span>
        <button class="btn btn-xs btn-error" v-else @click="$emit('next')">
          configure keyboard
        </button>
      </div>
      <div class="keyboard-check">
        <span class="text-right">Keyboard Layout</span>
        <span class="badge badge-success" v-if="selectedkeyboard.hasLayout"
          >exists</span
        >
        <button class="btn btn-xs btn-error" v-else>KLE missing</button>
      </div>
      <div class="keyboard-check">
        <span class="text-right">boot config</span>
        <span class="badge badge-success" v-if="selectedkeyboard.hasBoot"
          >exists</span
        >
        <button class="btn btn-xs btn-info" v-else>configure usb drive</button>
      </div>
      <div
        v-if="selectedkeyboard.hasKmk && selectedkeyboard.hasCode"
        class="mt-4"
      >
        <p class="p-2">Essentials are ready to go</p>
        <button class="btn btn-sm btn-primary" @click="$emit('next')">
          configure keyboard
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import {selectedkeyboard} from "@/store";
import {ref} from "vue";
import KmkInstaller from "@/components/setup-wizard/KmkInstaller.vue";
import MatrixSetup from "@/components/setup-wizard/MatrixSetup.vue";
import PinSetup from "@/components/setup-wizard/PinSetup.vue";
;

const currentStep = ref(0);
const steps = ref(["kmk", "matrix", "pins", "layout"]);

</script>

