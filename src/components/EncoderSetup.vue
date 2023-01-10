<template>
  <div>
    <div
      v-for="(encoder, index) in selectedkeyboard.layoutContents.encoders"
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
        <div v-for="(layer, lindex) in keymap" class="flex gap-4 items-center mb-4">
          <p class="w-24">
            layer {{lindex}}
          </p>
          <input type="text" class="input input-bordered" v-model="selectedkeyboard.layoutContents.encoderKeymap[index][lindex][0]"/>
          <input type="text" class="input input-bordered" v-model="selectedkeyboard.layoutContents.encoderKeymap[index][lindex][1]"/>
        </div>
      </div>
    </div>
    <div class="btn btn-sm btn-primary mt-2" @click="addEncoder">
      add Encoder
    </div>
  </div>
</template>

<script lang="ts" setup>
import { selectedkeyboard, keymap } from "@/store";
const addEncoder = () => {
  if (!selectedkeyboard.value.layoutContents.encoders) {
    selectedkeyboard.value.layoutContents.encoders = [];
  }
  if (!selectedkeyboard.value.layoutContents.encoderKeymap) {
    selectedkeyboard.value.layoutContents.encoderKeymap = [];
  }
  let encoder = { pad_a: "", pad_b: "" };
  // TODO: initialize encoder keymap according to layers and encoders
  selectedkeyboard.value.layoutContents.encoderKeymap.push([])
  selectedkeyboard.value.layoutContents.encoders.push(encoder);
};
</script>

<style lang="scss" scoped></style>
