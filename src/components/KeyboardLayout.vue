<template>
  <div
    class="flex items-center justify-center my-5 relative"
    id="keyboardlayout-wrapper"
    @click="deselectKey"
    :style="{ height: keyboardScale * (keyboardHeight * 58) + 'px' }"
  >
    <div
      class="relative w-full h-64"
      id="keyboardlayout"
      :style="{
        width: keyboardWidth * 58 + 'px',
        height: keyboardHeight * 58 + 'px',
        transform: `scale( ${keyboardScale})`,
      }"
      style="transform-origin: center left"
    >
      <div
        class="rotation-origin-helper"
        v-if="mode === 'layout' && !isNaN(selectedKey.keyIndex)"
        :style="{ left: rotationOriginX, top: rotationOriginY }"
      ></div>
      <key-cap
        v-for="(key, keyIndex) in keyLayout.keys"
        @selected="keyChanged"
        :key-data="key"
        :key-index="keyIndex"
        :mode="mode"
      >
      </key-cap>
    </div>
  </div>
  <div class="h-20"></div>
</template>

<script lang="ts" setup>
import KeyCap from "@/components/KeyCap.vue";
import { computed, onMounted, ref } from "vue";
import { selectedKey } from "@/store";
const props = defineProps(["keyLayout", "keymap", "mode"]);
// mode can be layout or keymap

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

const keyChanged = ({
  key,
  args,
  keyIndex,
}: {
  key: number[];
  args: boolean;
  keyIndex: number;
}) => {
  selectedKey.value.key = key;
  selectedKey.value.args = args;
  selectedKey.value.keyIndex = keyIndex;
};
const keyboardScale = ref(1);
const updateScale = () => {
  const wrapper = document.querySelector("#keyboardlayout-wrapper");
  if (wrapper) {
    const wrapperWidth = wrapper.clientWidth;
    keyboardScale.value = Math.min(
      wrapperWidth / (keyboardWidth.value * 58),
      1
    );
    console.log("transforming to ", keyboardScale.value);
  }
};
onMounted(() => {
  // adjust keyboard size to fit
  updateScale();
  window.addEventListener("resize", updateScale);
});

const rotationOriginX = computed(() => {
  if (!selectedKey.value) return 0;
  if (!props.keyLayout.keys[selectedKey.value.keyIndex]) return "0";
  let x = props.keyLayout.keys[selectedKey.value.keyIndex].rx * 58;
  return `${x}px`; // return "xpx ypx"
});
const rotationOriginY = computed(() => {
  if (!selectedKey.value) return 0;
  if (!props.keyLayout.keys[selectedKey.value.keyIndex]) return "0";
  let y = props.keyLayout.keys[selectedKey.value.keyIndex].ry * 58;
  return `${y}px`; // return "xpx ypx"
});

const deselectKey = (e: MouseEvent) => {
  console.log(e);
  if (e.target && e.target.id === "keyboardlayout-wrapper")
    selectedKey.value = { keyIndex: NaN, key: [], args: false };
};
</script>

<style lang="scss" scoped>
.rotation-origin-helper {
  width: 5px;
  height: 5px;
  background: red;
  position: absolute;
  z-index: 10;
  border-radius: 5px;
  transform: translate(-50%, -50%);
}
</style>
