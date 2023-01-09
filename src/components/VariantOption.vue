<template>
    <div v-if='Array.isArray(variant)'>
      {{variant[0]}}
      <select @change="selectMultiVariant" v-model="selectedOption" class="select select-bordered">
        <option :value="oindex" v-for="(option,oindex) in variant.filter((a,i)=>i!==0)">{{option}}</option>
      </select>

    </div>
    <div v-else>
      {{variant}} <span  @click="selectVariant({layout:index,variant:0})">off</span> <span  @click="selectVariant({layout:index,variant:1})">on</span>

    </div>

</template>

<script lang="ts" setup>
import {ref} from "vue";
import {selectedVariants} from "@/store";

const props = defineProps(['variant', 'index'])
const selectedOption = ref(0)
const selectMultiVariant = ()=>{
  selectVariant({layout: props.index, variant: selectedOption.value})
}
const selectVariant = ({layout, variant})=>{
  selectedVariants.value[layout] = variant
}

</script>

<style lang="scss" scoped>

</style>