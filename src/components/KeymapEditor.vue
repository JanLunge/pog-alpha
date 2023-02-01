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
  <KeyPicker @setKey="setKey"></KeyPicker>
</template>

<script lang="ts" setup>
import {
  keyLayout,
  keymap,
  selectedConfig,
  selectedKey,
  selectedLayer,
} from "@/store";
import KeyboardLayout from "@/components/KeyboardLayout.vue";
import KeyPicker from "@/components/setup-wizard/KeyPicker.vue";
import { matrixPositionToIndex } from "@/helpers/helpers";

const setKey = (keyCode: string) => {
  if (!selectedKey.value.key) return;
  const keyIndex = matrixPositionToIndex({
    pos: selectedKey.value.key,
    matrixSize: keyLayout.value.info.matrix,
  });
  console.log("setting ", selectedKey.value, "to", keyCode, "at", keyIndex);
  const currentKeyAction = keymap.value[selectedLayer.value][keyIndex];
  if (!keyCode.includes("(")) {
    // could set this as arg in a key
    if (
      currentKeyAction &&
      currentKeyAction.includes("(") &&
      selectedKey.value.args
    ) {
      // Validate for what args this function takes
      // only set this as arg
      // TODO: handle multiple args
      let action = currentKeyAction.split("(")[0].replace(")", "");
      keymap.value[selectedLayer.value][keyIndex] =
        action + "(" + keyCode + ")";
      return;
    }
  }
  keymap.value[selectedLayer.value][keyIndex] = keyCode;
};
const addLayer = () => {
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
