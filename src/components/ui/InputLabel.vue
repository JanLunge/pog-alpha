<template>
  <div class="form-control">
    <label class="label">
      <span class="label-text">{{ label }}</span>
    </label>
    <input
      :type="inputType || 'text' "
      :placeholder="placeholder"
      v-model="localValue"
      class="input input-bordered"
      @input="changed"
    />
  </div>
</template>
<script setup lang="ts">
import {onMounted, ref, watch} from "vue";

const props = defineProps(["label", "placeholder", "modelValue", "inputType"]);
const emits = defineEmits(["update:modelValue"]);
const localValue = ref("");
onMounted(() => {
  localValue.value = props.modelValue;
});
watch(()=>props.modelValue, ()=>{
  localValue.value = props.modelValue;
})
const changed = () => {
  emits("update:modelValue", localValue.value);
};
</script>
