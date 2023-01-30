<template>
  <div v-if="selectedConfig">
    <p>Encoder setup is currently WIP (expect it to break)</p>
    <div
      v-for="(encoder, index) in selectedConfig.encoders"
      class="my-2 p-4 bg-base-300 grid gap-4"
    >
      <p>Encoder {{ index }}</p>
      <div class="flex items-center gap-4 mb-4">
        <label>Pad A</label>
        <input
          type="text"
          class="input input-bordered"
          v-model="encoder.pad_a"
          placeholder="board.GP14"
        />
      </div>
      <div class="flex items-center gap-4">
        <label>Pad B</label>
        <input
          type="text"
          class="input input-bordered"
          v-model="encoder.pad_b"
          placeholder="board.GP14"
        />
      </div>
      <div>
        Keymap
        <div
          v-for="(layer, lindex) in selectedConfig.encoderKeymap"
          class="flex gap-4 items-center mb-4"
        >
          <p class="w-24">layer {{ lindex }}</p>
          <input
            type="text"
            class="input input-bordered"
            v-model="selectedConfig.encoderKeymap[index][lindex][0]"
          />
          <input
            type="text"
            class="input input-bordered"
            v-model="selectedConfig.encoderKeymap[index][lindex][1]"
          />
        </div>
      </div>
    </div>
    <div class="btn btn-sm btn-primary mt-2" @click="addEncoder">
      add Encoder
    </div>
  </div>
</template>

<script lang="ts" setup>
import { selectedKeyboard, selectedConfig } from "@/store";
const addEncoder = () => {
  if (!selectedConfig.value) return;
  if (!selectedConfig.value.encoders) {
    selectedConfig.value.encoders = [];
  }
  if (!selectedConfig.value.encoderKeymap) {
    selectedConfig.value.encoderKeymap = [];
  }
  let encoder = { pad_a: "", pad_b: "" };
  // TODO: initialize encoder keymap according to layers and encoders
  selectedConfig.value.encoderKeymap.push([["KC.TRNS", "KC.TRNS"]]);
  selectedConfig.value.encoders.push(encoder);
};
</script>

<style lang="scss" scoped></style>
