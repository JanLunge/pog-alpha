<template>
  <div>
    <p class="text-xl font-bold mb-4">Layout Options</p>
    <button class="btn btn-sm" @click="addLayoutOption">add Layout Option</button>
    <VariantOption v-for="(variant,index) in layoutVariants" :variant="variant" :index="index"/>
  </div>
</template>

<script lang="ts" setup>
import {selectedVariants, layoutVariants} from "@/store";
import VariantOption from "@/components/VariantOption.vue";
const addLayoutOption = () => {
 layoutVariants.value.push("")
}
</script>

<style lang="scss" scoped>

</style>