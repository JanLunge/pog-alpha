<template>
  <p class="font-bold">Key Info for key #{{ selectedKey.keyIndex }}</p>
  <div class="grid gap-2 grid-cols-2 text-right">
    <span>x</span>
    <input
      type="text"
      class="keyinfo-input"
      v-model="tmpKey.x"
      @change="updateKey"
    />
    <span>y</span>
    <input
      type="text"
      class="keyinfo-input"
      v-model="tmpKey.y"
      @change="updateKey"
    />
    <span>w</span>
    <input
      type="text"
      class="keyinfo-input"
      v-model="tmpKey.w"
      @change="updateKey"
    />
    <span>h</span>
    <input
      type="text"
      class="keyinfo-input"
      v-model="tmpKey.h"
      @change="updateKey"
    />
    <span :class="{ 'text-error': matrixValid }">matrix row / col</span>
    <div class="flex">
      <input
        type="text"
        class="keyinfo-input w-1/2"
        v-model="tmpKey.matrix[0]"
        @change="updateKey"
      />

      <input
        type="text"
        class="keyinfo-input w-1/2"
        v-model="tmpKey.matrix[1]"
        @change="updateKey"
      />
    </div>
    <span>variant</span>
    <input
      type="text"
      class="keyinfo-input"
      v-model="tmpKey.variant[0]"
      @change="updateKey"
    />
    <span>variant option</span>
    <input
      type="text"
      class="keyinfo-input"
      v-model="tmpKey.variant[1]"
      @change="updateKey"
    />
    <span>rotation</span>
    <div class="flex">
      <input
        type="number"
        step="15"
        class="keyinfo-input w-1/3"
        v-model="tmpKey.r"
        @change="updateKey"
      />deg
      <input
        type="number"
        step="1"
        class="keyinfo-input w-1/3"
        v-model="tmpKey.rx"
        @change="updateKey"
      />
      <input
        type="number"
        step="1"
        class="keyinfo-input w-1/3"
        v-model="tmpKey.ry"
        @change="updateKey"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { selectedKey } from "@/store";
import { computed, ref, watch } from "vue";
import { isNumber } from "@vueuse/core";

const props = defineProps(["layout"]);

const tmpKey = ref({
  x: 0,
  y: 0,
  w: 1,
  h: 1,
  w2: 0,
  h2: 0,
  d: false,
  matrix: [NaN, NaN],
  variant: [NaN, NaN],
  r: 0,
  rx: 0,
  ry: 0,
});

// watch(
//   () => selectedKey.value.keyIndex,
//   () => {
//     console.log("key changed");
//     tmpKey.value = {
//       matrix: [NaN, NaN],
//       variant: [NaN, NaN],
//       ...props.layout[selectedKey.value.keyIndex],
//     };
//   }
// );
watch(
  () => JSON.stringify(props.layout[selectedKey.value.keyIndex]),
  () => {
    console.log("key changed");
    tmpKey.value = {
      matrix: [NaN, NaN],
      variant: [NaN, NaN],
      ...props.layout[selectedKey.value.keyIndex],
    };
  }
);

const updateKey = () => {
  // validate all fields and remove things that are set to default
  props.layout[selectedKey.value.keyIndex].x = Number(tmpKey.value.x) || 0;
  props.layout[selectedKey.value.keyIndex].y = Number(tmpKey.value.y) || 0;
  props.layout[selectedKey.value.keyIndex].w = Number(tmpKey.value.w) || 1;
  props.layout[selectedKey.value.keyIndex].h = Number(tmpKey.value.h) || 1;
  props.layout[selectedKey.value.keyIndex].r = Number(tmpKey.value.r) || 0;
  props.layout[selectedKey.value.keyIndex].rx = Number(tmpKey.value.rx) || 0;
  props.layout[selectedKey.value.keyIndex].ry = Number(tmpKey.value.ry) || 0;

  if (
    tmpKey.value.matrix &&
    tmpKey.value.matrix.length == 2 &&
    !isNaN(tmpKey.value.matrix[0]) &&
    !isNaN(tmpKey.value.matrix[1])
  )
    props.layout[selectedKey.value.keyIndex].matrix = tmpKey.value.matrix.map(
      (a) => {
        if (a === "NaN") return NaN;
        return Number(a);
      }
    );
  if (
    tmpKey.value.variant &&
    tmpKey.value.variant.length == 2 &&
    !isNaN(tmpKey.value.variant[0]) &&
    !isNaN(tmpKey.value.variant[1])
  )
    props.layout[selectedKey.value.keyIndex].variant = tmpKey.value.variant.map(
      (a) => Number(a)
    );
};

const matrixValid = computed(() => {
  return !isNumber(tmpKey.value.matrix[0]) || !isNumber(tmpKey.value.matrix[1]);
});
</script>

<style lang="scss" scoped>
.keyinfo-input {
  @apply input input-sm input-bordered flex-shrink;
}
</style>
