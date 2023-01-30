<template>
  <div v-if="selectedConfig">

  <p class="font-bold pt-4">Keyboard Matrix</p>
  <p class="max-w-md p-4">
    define the size of your keyboard matrix here, set it as big as you need. For
    easier wiring set it to the max number of cols/rows on your keyboard
  </p>
  <label>Diode Direction</label>
  <select
    class="select select-bordered ml-2"
    v-model="selectedConfig.matrix.diodeDirection"
  >
    <option value="COL2ROW">COL2ROW</option>
    <option value="ROW2COL">ROW2COL</option>
  </select>
  <div class="grid grid-cols-2 gap-2 mb-8">
    <InputLabel
      placeholder="1"
      input-type="number"
      label="Matrix Width"
      v-model="selectedConfig.matrix.cols"
    ></InputLabel>
    <InputLabel
      placeholder="1"
      input-type="number"
      label="Matrix Height"
      v-model="selectedConfig.matrix.rows"
    ></InputLabel>
  </div>
  <div
    class="btn btn-primary btn-sm mb-4"
    @click="$emit('next')"
    :class="{ 'btn-disabled': matrixEmpty }"
  >
    Next
  </div>
  <div class="grid-visualizer">
    <div class="row" v-for="row in selectedConfig.matrix.rows">
      <div class="col" v-for="col in selectedConfig.matrix.cols"></div>
    </div>
  </div>
  </div>
</template>

<script lang="ts" setup>
import InputLabel from "@/components/ui/InputLabel.vue";
import { selectedConfig } from "@/store";
import { computed } from "vue";

if (selectedConfig.value) {
  if (!selectedConfig.value.matrix) {
    selectedConfig.value.matrix = {
      rows: 0,
      cols: 0,
      diodeDirection: "ROW2COL"
    };
  }
}
const matrixEmpty = computed(() => {
  if(!selectedConfig.value) return
  return !(
    selectedConfig.value.matrix.cols !== 0 &&
    selectedConfig.value.matrix.rows &&
    selectedConfig.value.matrix.diodeDirection !== undefined
  );
});
</script>

<style lang="scss" scoped>
.grid-visualizer {
  display: flex;
  flex-direction: column;
  gap: 4px;
  align-items: center;
  width: 100%;
}
.row {
  display: flex;
  gap: 4px;
}
.col {
  width: 40px;
  height: 40px;
  border: 1px solid white;
  opacity: 0.7;
  @apply rounded;
}
</style>
