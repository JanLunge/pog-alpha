<template>
  <div
    class="keycap"
    v-if="visible"
    :style="{
      left: keyData.x * (baseKeyWidth + keyGap) + 'px',
      top: keyData.y * (baseKeyWidth + keyGap) + 'px',
      width: keyWidth + 'px',
    }"
  >
    <div
      class="keyborder-blocker"
      v-if="keyData.w2 || keyData.h2"
      :class="{ selected: mainSelected }"
      :style="{
        left: '1px',
        top: '1px',
        width: keyWidth - 2 + 'px',
        height: keyHeight - 2 + 'px',
      }"
      @click="bgClick"
    ></div>
    <div
      class="keyborder"
      :class="{ selected: mainSelected }"
      :style="{
        width: keyWidth + 'px',
        height: keyHeight + 'px',
      }"
      @click="bgClick"
    ></div>
    <div
      class="keyborder"
      v-if="keyData.w2 || keyData.h2"
      :class="{ selected: mainSelected }"
      :style="{
        left: keyData.x2 * baseKeyWidth - 1 + 'px',
        width: keyWidth2 + 'px',
        height: keyHeight2 + 'px',
      }"
      @click="bgClick"
    ></div>
    <div
      class="keytop"
      @click="bgClick"
      v-if="keyData.w2 || keyData.h2"
      :style="{
        height: keyTopHeight2 + 'px',
        width: keyTopWidth2 + 'px',
        left: keyData.x2 * baseKeyWidth + keyGap + 'px',
      }"
    ></div>
    <!--    <div-->
    <!--      class="keytop"-->
    <!--      @click="bgClick"-->
    <!--    ></div>-->
    <div
      class="keytop"
      @click="bgClick"
      :style="{
        height: keyTopHeight + 'px',
        width: keyTopWidth + 'px',
      }"
    ></div>
    <div class="keylabels">
      <!--      <div class="keylabel" :class="['keylabel-'+index]" v-for="(label,index) in keyData.labels">-->
      <!--        <div class="keylabel-inner">-->
      <!--          {{label}}-->
      <!--        </div>-->
      <!--      </div>-->
      <div class="keylabel keylabel-center" v-if="!hasArguments">
        {{ mainLabel }}
      </div>
      <div v-else class="keylabel">
        <div class="arg-top">{{ mainLabel }}</div>
        <div
          class="arg-bottom"
          :class="{ selected: argsSelected }"
          @click="argClick"
        >
          {{ argLabel }}
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref, watch } from "vue";

const props = defineProps(["keyData", "keyLayout"]);
const emit = defineEmits(["selected"]);
import { keymap } from "@/store";

const keyGap = 4;
import { selectedLayer, selectedVariants } from "@/store";
// hide normal labels and show the keymap thing
const action = computed(() => {
  let position = props.keyData.matrixPos; // 0,0 // row, col
  if (!position) return "";
  let indexes = position.split(",");
  if (!props.keyLayout) return "error";
  if (!props.keyLayout.matrix) return "err matrix";
  let matrixWidth = props.keyLayout.matrix[1];
  // console.log(props.keyLayout, matrixWidth);
  let keyIndex = Number(indexes[0]) * matrixWidth + Number(indexes[1]);
  if (indexes.length === 2) {
    // console.log("keyindex", keyIndex);
  }
  return keymap.value[selectedLayer.value][keyIndex] || "▽";
});

const visible = computed(() => {
  if (props.keyData.d) {
    return false;
  }
  let variant = props.keyData.variant;
  if (variant) {
    if (variant[0] === 3) {
      console.log(variant[0], selectedVariants.value[variant[0]].value);
    }
    return selectedVariants.value[variant[0]] == variant[1];
    // return variant[1] === 0
  }

  return true;
});

const baseKeyWidth = ref(54);
const keyWidthU = computed(() => {
  // if(props.keyData.w2) return props.keyData.w2
  return props.keyData.w || 1;
});
const keyHeightU = computed(() => {
  return props.keyData.h || 1;
});
const keyWidth2U = computed(() => {
  return props.keyData.w2 || 1;
});
const keyHeight2U = computed(() => {
  return props.keyData.h2 || 1;
});
const keyWidth = computed(() => {
  return keyWidthU.value * baseKeyWidth.value + (keyWidthU.value - 1) * keyGap;
});
const keyHeight = computed(() => {
  return (
    keyHeightU.value * baseKeyWidth.value + (keyHeightU.value - 1) * keyGap
  );
});
const keyWidth2 = computed(() => {
  return (
    keyWidth2U.value * baseKeyWidth.value + (keyWidth2U.value - 1) * keyGap
  );
});
const keyHeight2 = computed(() => {
  return (
    keyHeight2U.value * baseKeyWidth.value + (keyHeight2U.value - 1) * keyGap
  );
});
const hasArguments = computed(() => {
  return action.value.includes(")");
});
const keyTopWidth = computed(() => {
  return keyWidth.value - keyGap * 2 - 4; //+ ((keyWidthU.value-1)*keyGap))
});
const keyTopHeight = computed(() => {
  return (
    keyHeight.value -
    6 * keyHeightU.value -
    keyGap +
    (keyHeightU.value - 1) * keyGap
  );
});
const keyTopWidth2 = computed(() => {
  return (
    keyWidth2.value -
    6 * keyWidth2U.value -
    keyGap -
    2 +
    (keyWidth2U.value - 1) * keyGap
  );
});
const keyTopHeight2 = computed(() => {
  return (
    keyHeight2.value -
    6 * keyHeight2U.value -
    keyGap +
    (keyHeight2U.value - 1) * keyGap
  );
});
const mainLabel = computed(() => {
  if (!hasArguments.value && action.value.startsWith("KC.")) {
    return action.value.split(".")[1];
  } else if (hasArguments.value) {
    return action.value.split("(")[0];
  }
  return action.value;
});

const argLabel = computed(() => {
  if (hasArguments.value) {
    let argAction = action.value.split("(")[1].replace(")", "");
    if (argAction.startsWith("KC.")) {
      return argAction.split(".")[1];
    }
    return argAction;
  }
  return;
});

const mainSelected = ref(false);
const argsSelected = ref(false);
const bgClick = () => {
  mainSelected.value = true;
  argsSelected.value = false;
  emit("selected", { key: props.keyData.matrixPos, args: argsSelected.value });
};
const argClick = () => {
  argsSelected.value = true;
  mainSelected.value = false;
  emit("selected", { key: props.keyData.matrixPos, args: argsSelected.value });
};

import { selectedKey } from "@/store";
watch(
  () => selectedKey.value.key,
  (newValue) => {
    if (selectedKey.value.key !== props.keyData.matrixPos) {
      mainSelected.value = false;
      argsSelected.value = false;
    }
  }
);
</script>

<style lang="scss" scoped>
.keyborder {
  // outer cey outline and background
  background: #333;
  position: absolute;
  width: 54px;
  height: 54px;
  border: 1px solid transparent;
  cursor: pointer;
  @apply rounded;
  &.selected {
    border-color: white;
  }
}
.keyborder-blocker {
  background: #333;
  position: absolute;
  width: 52px;
  height: 52px;
  cursor: pointer;
  @apply rounded;
  z-index: 1;
}
.keytop {
  position: absolute;
  height: 42px;
  width: calc(100% - 12px);
  left: 6px;
  top: 4px;
  right: 6px;
  background: #444;
  cursor: pointer;
  @apply rounded;
  z-index: 2;
}
.keylabels {
  position: absolute;
  pointer-events: none;
  width: calc(100% - 12px);
  left: 6px;
  top: 4px;
  right: 6px;
  z-index: 3;
}
.keylabel {
  font-size: 12px;
  position: absolute;
  width: 100%;
  height: calc(48px - 5px);
  &-0 {
    left: 8px;
    top: 2px;
    @apply items-start justify-start flex text-center;
  }
  &-3 {
    right: 8px;
    bottom: 2px;
    @apply items-end justify-end flex text-center;
  }
  &-center {
    @apply items-center justify-center flex text-center;
  }
  .arg-top {
    @apply text-center;
    position: absolute;
    top: 0px;
    left: 6px;
    right: 6px;
    font-size: 10px;
  }
  .arg-bottom {
    @apply text-center rounded flex justify-center items-center;
    position: absolute;
    border: 1px solid #666;
    left: 6px;
    right: 6px;
    bottom: 2px;
    height: 28px;
    pointer-events: all;
    cursor: pointer;
    &.selected {
      border-color: white;
    }
  }
}
.keycap {
  position: absolute;
  //width: 54px;
  height: 54px;
}
//.keycap {
//  width: 50px;
//  height: 50px;
//  position: absolute;
//  background: #333;
//  @apply rounded;
//  &::after{
//    @apply absolute;
//    background: #red;
//    width: 100px;
//    height: 100px;
//    content: '';
//  }
//}
</style>
