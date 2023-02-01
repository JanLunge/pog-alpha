<template>
  <div class="flex items-center justify-center my-5 relative" id="keyboardlayout-wrapper" :style="{height: keyboardScale*(keyboardHeight*58)+'px'}">
    <div
      class="relative w-full h-64"
      id="keyboardlayout"
      :style="{
        width: keyboardWidth * 58 + 'px',
        height: keyboardHeight * 58 + 'px',
        transform: `scale( ${keyboardScale})`,
      }"
      style="transform-origin: center left;"
    >
      <key-cap
        v-for="key in keyLayout.keys"
        @selected="keyChanged"
        :key-data="key"
      >
      </key-cap>
    </div>
  </div>
</template>

<script lang="ts" setup>
import KeyCap from "@/components/KeyCap.vue";
import { computed, onMounted, ref } from "vue";
import { selectedKey } from "@/store";
const props = defineProps(["keyLayout", "keymap"]);

// find right edge
const keyboardWidth = computed(() => {
  let maxW = 0;
  props.keyLayout.keys.forEach((k: any) => {
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
  props.keyLayout.keys.forEach((k: KeyData) => {
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
const keyboardScale = ref(1);
const updateScale = () => {
  const wrapper = document.querySelector("#keyboardlayout-wrapper");
  if (wrapper) {
    const wrapperWidth = wrapper.clientWidth;
    keyboardScale.value = Math.min(wrapperWidth / (keyboardWidth.value * 58),1);
    console.log('transforming to ', keyboardScale.value)
  }
}
onMounted(() => {
  // adjust keyboard size to fit
  updateScale()
  window.addEventListener("resize", updateScale);
});
</script>

<style lang="scss" scoped></style>
