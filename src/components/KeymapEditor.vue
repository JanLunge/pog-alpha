<template>
  <div class="flex items-center">
    Layers
    <div class="tabs tabs-boxed ml-2 gap-4">
      <div
        class="tab"
        :class="{ 'tab-active': index === selectedLayer }"
        v-for="(_layer, index) in keymap"
        @click="selectedLayer = index"
      >
        {{ index }}
      </div>
      <div class="tab tab-border" @click="addLayer">add Layer</div>
      <div class="tab tab-border" @click="removeLayer">remove last Layer</div>
    </div>
  </div>
  <keyboard-layout :key-layout="keyLayout" :keymap="keymap"></keyboard-layout>
  <div v-if="[...selectedKeys].length !== 0" class="my-4">
    <p>Keycode Options for Selected Key(s)</p>
    <div class="flex gap-2">
      <select class="select select-bordered" v-model="keycodeModeForSelection">
        <!-- simple will just inline the keycode -->
        <option value="simple">simple</option>
        <!-- other options will create a separately linked keycode -->
        <option value="sequence">sequence</option>
        <option value="tapdance">tapdance</option>
        <option value="combo">combo</option>
        <option value="custom">custom</option>
      </select>
      <div>
        <div v-if="keycodeModeForSelection === 'simple'">
          select a key from the picker below to change it
        </div>
        <div v-if="keycodeModeForSelection !== 'simple'">
          <span>set custom keycode</span>
          <input type="text" class="input input-bordered" v-model="tmpKeycode"/>
        </div>
      </div>
    </div>
  </div>
  <KeyPicker @setKey="setKey"></KeyPicker>
</template>

<script lang="ts" setup>
import {
  keyLayout,
  keymap,
  selectedConfig,
  selectedKeys,
  selectedLayer,
} from "@/store";
import KeyboardLayout from "@/components/KeyboardLayout.vue";
import KeyPicker from "@/components/setup-wizard/KeyPicker.vue";
import { matrixPositionToIndex, selectNextKey } from "@/helpers/helpers";
import { ref } from "vue";

const tmpKeycode = ref("")
selectedKeys.value = new Set();

const keycodeModeForSelection = ref<
  "simple" | "combo" | "sequence" | "custom" | "tapdance"
>("simple");
const setKey = (keyCode: string) => {
  // only update key if just one is selected
  if (!selectedConfig.value) return;
  selectedKeys.value.forEach((index) => {
    if (!selectedConfig.value) return;
    const keyIndex = matrixPositionToIndex({
      pos: selectedConfig.value.layouts.keymap[index].matrix,
      matrixSize: keyLayout.value.info.matrix,
    });
    console.log("setting ", [...selectedKeys.value][0], "to", keyCode, "at");
    const currentKeyAction = keymap.value[selectedLayer.value][keyIndex];
    if (!keyCode.includes("(")) {
      // TODO: could set this as arg in a key
      // if (
      //   currentKeyAction &&
      //   currentKeyAction.includes("(") &&
      //   selectedKey.value.args
      // ) {
      //   // Validate for what args this function takes
      //   // only set this as arg
      //   // TODO: handle multiple args
      //   let action = currentKeyAction.split("(")[0].replace(")", "");
      //   keymap.value[selectedLayer.value][keyIndex] =
      //     action + "(" + keyCode + ")";
      //   return;
      // }
    }
    keymap.value[selectedLayer.value][keyIndex] = keyCode;
  });
  // if one key is selected select the next
  if ([...selectedKeys.value].length === 1) {
    selectNextKey();
  }
};
const addLayer = () => {
  if (!selectedConfig.value) return;
  if (!keymap.value[0]) {
    keymap.value.push(
      Array(
        selectedConfig.value.matrix.cols * selectedConfig.value.matrix.rows
      ).fill("KC.TRNS")
    );
  }
  const tmpKeymap = [...keymap.value[0]];
  tmpKeymap.fill("KC.TRNS");
  (keymap.value as any).push(tmpKeymap);
  // if needed also add an encoder layer
  if (!selectedConfig.value || !selectedConfig.value.encoders) return;
  const encoderCount = selectedConfig.value.encoders.length;
  if (encoderCount !== 0) {
    selectedConfig.value.encoderKeymap.push(
      Array(encoderCount).fill(["KC.TRNS", "KC.TRNS"])
    );
  }
};
const removeLayer = () => {
  if (selectedLayer.value === keymap.value.length - 1) {
    selectedLayer.value = keymap.value.length - 2;
  }
  if (keymap.value.length <= 1) return;
  keymap.value.pop();
  // if needed also add an encoder layer
  if (!selectedConfig.value) return;
  const encoderCount = selectedConfig.value.encoders.length;
  if (encoderCount !== 0) {
    selectedConfig.value.encoderKeymap.pop();
  }
};
</script>

<style lang="scss" scoped></style>
