<template>
  <div class="flex items-center justify-center p-5">
    <div
      class="relative w-full h-64"
      :style="{
        width: keyboardWidth * 58 + 'px',
        height: keyboardHeight * 58 + 'px',
      }"
    >
      <key-cap
        v-for="key in keyLayout.keys"
        @selected="keyChanged"
        :key-layout="keyLayout.info"
        :key-data="key"
        :keymap="keymap"
      >
      </key-cap>
    </div>
  </div>
</template>

<script lang="ts" setup>
import KeyCap from "@/components/KeyCap.vue";
import { computed, ref } from "vue";
import { selectedKey } from "@/store";
const props = defineProps(["keyLayout", "keymap"]);

// find right edge
const keyboardWidth = computed(() => {
  let maxW = 0;
  props.keyLayout.keys.forEach((k:any) => {
    let width = k.w || 1;
    let rightEdge = k.x + width;
    if (rightEdge > maxW) {
      maxW = rightEdge;
    }
  });
  return maxW;
});

// find bottom edge
const keyboardHeight = computed(() => {
  let maxH = 0;
  props.keyLayout.keys.forEach((k:KeyData) => {
    let height = k.h || 1;
    let bottomEdge = k.y + height;
    if (bottomEdge > maxH) {
      maxH = bottomEdge;
    }
  });
  return maxH;
});

const keyChanged = ({ key, args }: { key: number[]; args: boolean }) => {
  selectedKey.value.key = key;
  selectedKey.value.args = args;
};
</script>

<style lang="scss" scoped></style>
