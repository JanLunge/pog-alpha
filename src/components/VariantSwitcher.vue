<template>
  <div>
    <p class="text-xl font-bold mb-4">Layout Options</p>
    <VariantOption v-for="(variant,index) in layoutVariants" :variant="variant" :index="index"/>
  </div>
</template>

<script lang="ts" setup>
import {selectedVariants, layoutVariants} from "@/store";
import VariantOption from "@/components/VariantOption.vue";

</script>

<style lang="scss" scoped>

</style>