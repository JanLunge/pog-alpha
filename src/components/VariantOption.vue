<template>
  <div
    v-if="Array.isArray(variant)"
    class="grid grid-cols-2 items-center gap-4 h-12"
  >
    <p class="text-right">
      {{ variant[0] }}
    </p>
    <select
      @change="selectMultiVariant"
      v-model="selectedOption"
      class="select select-bordered"
    >
      <option
        :value="oindex"
        v-for="(option, oindex) in variant.filter((a, i) => i !== 0)"
      >
        {{ option }}
      </option>
    </select>
  </div>
  <div v-else class="grid grid-cols-2 items-center gap-4 h-12">
    <p class="text-right">
      {{ variant }}
    </p>
    <div class="flex gap-4">
      <input type="checkbox" class="checkbox" v-model="selectedBool" @input="selectBool">
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import { selectedVariants } from "@/store";

const props = defineProps(["variant", "index"]);
const selectedOption = ref(0);
const selectedBool = ref(false)

selectedBool.value = selectedVariants.value[props.index] === 1 ? true:false
selectedOption.value = selectedVariants.value[props.index]
const selectMultiVariant = () => {
  selectVariant({ layout: props.index, variant: selectedOption.value });
};
const selectBool = (newVal) => {
  selectVariant({ layout: props.index, variant: !selectedBool.value ? 1 : 0 })
}
const selectVariant = ({ layout, variant }) => {
  selectedVariants.value[layout] = variant;
};
</script>

<style lang="scss" scoped></style>
