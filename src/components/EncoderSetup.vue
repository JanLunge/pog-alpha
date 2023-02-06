<template>
  <div v-if="selectedConfig">
    <p>Encoder setup is currently WIP</p>
    <div
      v-for="(encoder, eindex) in selectedConfig.encoders"
      class="my-2 p-4 bg-base-300 grid gap-4"
    >
      <div class="flex gap-4 justify-between">
        <p>Encoder {{ eindex }}</p>
        <button class="btn btn-xs btn-error" @click="removeEncoder(eindex)">
          remove encoder
        </button>
      </div>
      <div class="flex items-center gap-4 mb-4">
        <label>Pad A</label>
        <input
          type="text"
          class="input input-bordered"
          v-model="encoder.pad_a"
          placeholder="14"
        />
      </div>
      <div class="flex items-center gap-4">
        <label>Pad B</label>
        <input
          type="text"
          class="input input-bordered"
          v-model="encoder.pad_b"
          placeholder="14"
        />
      </div>
      <div>
        Keymap
        <EncoderLayer
          v-for="(layer, lindex) in keymap"
          :lindex="lindex"
          :eindex="eindex"
        ></EncoderLayer>
      </div>
    </div>
    <div class="btn btn-sm btn-primary mt-2" @click="addEncoder">
      add Encoder
    </div>
  </div>
</template>

<script lang="ts" setup>
import { selectedKeyboard, selectedConfig, keymap } from "@/store";
import EncoderLayer from "@/components/EncoderLayer.vue";

const cleanEncoders = () => {
  if (!selectedConfig.value) return;
  if (!selectedConfig.value.encoders) return;
  if (
    selectedConfig.value.encoderKeymap.length !==
    selectedConfig.value.currentKeymap.length
  ) {
    // add or remove encoder layers to match the keymap layer count
    while (
      selectedConfig.value.encoderKeymap.length <=
      selectedConfig.value.currentKeymap.length
    ) {
      // add an empty layer
      selectedConfig.value.encoderKeymap.push([
        // selectedConfig.value.encoders.map((a) => ["KC.TRNS", "KC.TRNS"]),
      ]);
    }
    while (
      selectedConfig.value.encoderKeymap.length >
      selectedConfig.value.currentKeymap.length
    ) {
      // remove a layer
      selectedConfig.value.encoderKeymap.pop();
    }
  }
};
// cleanEncoders()
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
  // check the amount of layers
  // add one encoder to each layer (push)
  // cleanEncoders();

  selectedConfig.value.encoderKeymap.forEach((layer) => {
    layer.push(["KC.TRNS", "KC.TRNS"]);
  });
  selectedConfig.value.encoders.push(encoder);
};

const removeEncoder = (index: number) => {
  // remove the encoder

  // cleanEncoders();
  if (!selectedConfig.value) return;
  selectedConfig.value.encoders = selectedConfig.value.encoders.filter(
    (e, eindex) => {
      return eindex !== index;
    }
  );
  // remove that index from each keymap layer
  selectedConfig.value.encoderKeymap.forEach((layer, lindex) => {
    if (!selectedConfig.value) return;
    selectedConfig.value.encoderKeymap[lindex] = layer.filter(
      (l, eindex) => eindex !== index
    );
  });
};
</script>

<style lang="scss" scoped></style>
