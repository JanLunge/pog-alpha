<template>
  <p class="font-bold py-8">Microcontroller Pins</p>
  <div class="btn btn-sm btn-primary" :class="{'btn-disabled': !pinsCompleted}" @click="$emit('next')">Next</div>
  <div class="flex gap-4">
    <div class="flex-grow-0">
      <p class="p-4">write each pin as board.GP01 as it is mapped like this in kmk</p>
      <div
        class="rounded bg-base-300 p-2 grid grid-cols-1 gap-2 mb-4 p-4"
      >
        <p>Row Pins <span class="ml-2 badge badge-primary font-bold">{{ selectedkeyboard.layoutContents.pins.rows.length }}</span></p>
        <div
          v-for="(pin, index) in selectedkeyboard.layoutContents.matrix.rows"
        >
          <span class="mr-2 badge">{{ index + 1 }}</span>
          <input
            class="input input-sm input-bordered"
            type="text"
            v-model="selectedkeyboard.layoutContents.pins.rows[index]"
            placeholder="board.GP17"
          />
        </div>
      </div>
      <div
        class="rounded bg-base-300 p-2 grid grid-cols-1 gap-2 mb-4 p-4"
      >
      <p>
        Column Pins <span class="ml-2 badge badge-primary font-bold">{{ selectedkeyboard.layoutContents.pins.cols.length }}</span>
      </p>
        <div
          v-for="(pin, index) in selectedkeyboard.layoutContents.pins.cols"
        >
          <span class="mr-2">{{ index + 1 }}</span>
          <input
            class="input input-sm input-bordered"
            type="text"
            v-model="selectedkeyboard.layoutContents.pins.cols[index]"
            placeholder="board.GP17"
          />
        </div>
      </div>
    </div>
    <div class="w-1/2 flex flex-col items-center">
      <select
        v-model="selectedkeyboard.layoutContents.controller"
        class="select select-bordered"
      >
        <option value="0xcb-helios">0xCB Helios</option>
        <option value="other">other</option>
      </select>
      <div v-if="selectedkeyboard.layoutContents.controller === '0xcb-helios'">
        <p class="p-4">
          The
          <a
            class="link link-primary"
            target="_blank"
            href="https://keeb.supply/products/0xcb-helios"
            >0xCB Helios</a
          >
          is a rp2040 chip<br />
          with Pro Micro compatible footprint
        </p>
          <img
            src="@/assets/0xcb-helios.png"
            alt=""
            width="400" height="300"
          />
      </div>
      <div v-if="selectedkeyboard.layoutContents.controller === 'other'">
        <ul class="p-4">
          <li><a class="link link-primary" target="_blank" href="https://datasheets.raspberrypi.com/pico/Pico-R3-A4-Pinout.pdf">Pi Pico</a></li>
        </ul>
        <p class="p-4">feel free to submit other microcontroller pinouts just make sure you have the permission to use the pinout image if it has not been created by you, in the mean time here are links to other pinouts
        </p>
        <p>currently this tool works with any RP2040 controller.</p>
        <p class="p-4">just look for a pinout and use any pin that is starting with GP</p>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import {computed, ref} from "vue";
import { selectedkeyboard } from "@/store";
if (!selectedkeyboard.value.layoutContents.pins) {
  selectedkeyboard.value.layoutContents.pins = {
    rows: [],
    cols: [],
  };
}
if (!selectedkeyboard.value.layoutContents.controller) {
  selectedkeyboard.value.layoutContents.controller = "0xcb-helios";
}
selectedkeyboard.value.layoutContents.pins.cols.length =
  selectedkeyboard.value.layoutContents.matrix.cols;
selectedkeyboard.value.layoutContents.pins.rows.length =
  selectedkeyboard.value.layoutContents.matrix.rows;

const pinsCompleted = computed(() => {
  if(selectedkeyboard.value.layoutContents.pins.cols.includes('')) return false
  if(selectedkeyboard.value.layoutContents.pins.rows.includes('')) return false
  return true
})
</script>

<style lang="scss" scoped>
.controller-labels {
  @apply grid absolute;
  width: 130px;
  padding-top: 15px;
  font-size: 14px;
  line-height: 21.4px;
  font-family: Monospaced "Lucida Console";
  z-index: 2;
  &-right {
    @apply text-left right-0;
    //width: 188px;
  }
  &-left {
    @apply text-right;
  }
  &-bottom {
    transform: rotateZ(-90deg);
    @apply text-right;
    top: 295px;
    left: 128px;
  }
  & > div {
    @apply px-3 rounded;
    &:hover {
      background: #666666;
    }
  }
}
</style>
