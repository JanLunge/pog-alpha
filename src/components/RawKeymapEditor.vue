<template>
  <p class="font-bold">Keymap</p>
  <div v-if="selectedConfig">
    <div v-for="(layer, layerindex) in keymap">
      layer {{ layerindex }}
      <div
        class="border rounded border-opacity-40 border-white p-2 grid gap-2 mb-4"
        :style="{
          gridTemplateColumns: `repeat(${selectedConfig.matrix.cols}, minmax(0, 1fr))`,
        }"
      >
        <input
          class="input input-sm input-bordered"
          v-for="(key, index) in layer"
          v-model="keymap[layerindex][index]"
          placeholder="KC.A"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { keymap, selectedConfig } from "@/store";
</script>

<style lang="scss" scoped></style>
