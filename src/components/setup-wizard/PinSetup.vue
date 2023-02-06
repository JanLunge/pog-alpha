<template>
  <p class="font-bold pt-8 text-center text-3xl">Microcontroller Pins</p>
  <div class="flex items-center justify-center">
    <p class="p-4 max-w-md text-center">
      Define the mapping for columns and rows to the microcontroller pins
    </p>
  </div>
  <div
    class="btn btn-sm btn-primary"
    :class="{ 'btn-disabled': !pinsCompleted }"
    @click="$emit('next')"
    v-if="initialSetup"
  >
    Next
  </div>
  <div class="flex gap-4 mt-5 justify-center" v-if="selectedConfig">
    <div class="flex-grow-0">
      <div
        class="rounded bg-base-300 p-2 grid grid-cols-1 gap-2 mb-4 py-8"
        style="width: 350px"
      >
        <p class="pb-4 font-bold text-xl flex items-center justify-center">
          Row Pins
          <span class="ml-2 badge badge-primary font-bold">{{
            selectedConfig.pins.rows.length
          }}</span>
        </p>
        <div
          v-for="(pin, index) in selectedConfig.matrix.rows"
          class="grid grid-cols-6 items-center gap-2"
        >
          <p class="mr-2 text-right">{{ index + 1 }}</p>
          <input
            class="input input-sm input-bordered col-span-4"
            type="text"
            v-model="selectedConfig.pins.rows[index]"
            placeholder="17"
          />
        </div>
      </div>
      <div class="rounded bg-base-300 p-2 grid grid-cols-1 gap-2 mb-4 py-8">
        <p class="pb-4 font-bold text-xl flex items-center justify-center">
          Column Pins
          <span class="ml-2 badge badge-primary font-bold">{{
            selectedConfig.pins.cols.length
          }}</span>
        </p>
        <div
          v-for="(pin, index) in selectedConfig.pins.cols"
          class="grid grid-cols-6 items-center gap-2"
        >
          <span class="mr-2 text-right">{{ index + 1 }}</span>
          <input
            class="input input-sm input-bordered col-span-4"
            type="text"
            v-model="selectedConfig.pins.cols[index]"
            placeholder="17"
          />
        </div>
      </div>
    </div>
    <div
      class="w-1/2 flex flex-col items-center text-center"
      style="width: 400px"
    >
      <select
        v-model="selectedConfig.controller"
        class="select select-bordered"
      >
        <option value="0xcb-helios">0xCB Helios</option>
        <option value="other">other</option>
      </select>
      <div v-if="selectedConfig.controller === '0xcb-helios'">
        <p class="p-4">
          The
          <a
            class="link link-primary"
            target="_blank"
            href="https://keeb.supply/products/0xcb-helios"
            >0xCB Helios</a
          >
          is an Elite-C compatible MicroController that is based on the RP2040.
        </p>
        <img src="@/assets/0xcb-helios.png" alt="" width="400" height="300" />
      </div>
      <div v-if="selectedConfig.controller === 'other'">
        <ul class="p-4">
          <li>
            <a
              class="link link-primary"
              target="_blank"
              href="https://datasheets.raspberrypi.com/pico/Pico-R3-A4-Pinout.pdf"
              >Pi Pico</a
            >
          </li>
        </ul>
        <p class="p-4">
          feel free to submit other microcontroller pinouts just make sure you
          have the permission to use the pinout image if it has not been created
          by you, in the mean time here are links to other pinouts
        </p>
        <p>currently this tool works with any RP2040 controller.</p>
        <p class="p-4">
          just look for a pinout and use any pin that is starting with GP
        </p>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref } from "vue";
import { selectedConfig, selectedKeyboard } from "@/store";
import router from "@/router";
if (selectedConfig.value) {
  if (!selectedConfig.value.pins) {
    selectedConfig.value.pins = {
      rows: [],
      cols: [],
    };
  }
  if (!selectedConfig.value.controller) {
    selectedConfig.value.controller = "0xcb-helios";
  }
  selectedConfig.value.pins.cols.length = selectedConfig.value.matrix.cols;
  selectedConfig.value.pins.rows.length = selectedConfig.value.matrix.rows;
}
const pinsCompleted = computed(() => {
  if (!selectedConfig.value) return;
  if (selectedConfig.value.pins.cols.includes("")) return false;
  if (selectedConfig.value.pins.rows.includes("")) return false;
  return true;
});

const initialSetup = computed(()=>{
  return router.currentRoute.value.name !== 'pins'
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
