<template>
  <div class="p-2 btn btn-sm mb-4" @click="showConverter">Import from KLE</div>
  <div v-if="converterVisible">
    <p>convert kle to pog</p>
    <p>
      you can import json files from the
      <a class="link" href="http://keyboard-layout-editor.com" target="_blank"
        >keyboard layout editor</a
      >
      set the top left label to the matrix position eg '0,1' for row:0 col:1
    </p>
    <p>
      you can use the bottom right label to define a layout variant specific
      key, eg. '0,2' this would be the first layout option using its third
      variant, keys you place with the variant option should be in the exact
      place they should show up in the end so you would stack them on top of
      another in kle
    </p>
    <p>
      use the editor below to modify your layout, supports arrow keys when
      selecting a key
    </p>
    <div class="grid grid-cols-2 gap-2">
      <textarea
        class="textarea textarea-bordered"
        v-model="kleInput"
      ></textarea>
      <textarea
        class="textarea textarea-bordered"
        v-model="pogOutput"
      ></textarea>
    </div>
    <div>
      <button class="btn btn-sm my-4 btn-primary" @click="convert">
        convert to pog.json
      </button>
    </div>
    <hr />
  </div>
  <div class="btn btn-sm btn-primary" @click="setupDone" v-if="initSetup">
    Next
  </div>
  <div>
    <div class="flex justify-between">
      <div class="flex gap-1">
        <button class="btn btn-sm" @click="addKey">add key</button>
        <button
          class="btn btn-sm"
          @click="removeKey"
          :disabled="isNaN(selectedKey.keyIndex)"
        >
          remove key
        </button>
      </div>
      <button class="btn btn-sm" @click="saveLayout">Save Layout changes</button>
    </div>

    <keyboard-layout
      :key-layout="{ keys: tmpLayout }"
      mode="layout"
    ></keyboard-layout>
    <div class="flex">
      <div class="w-1/2 border-r">
        <variant-switcher></variant-switcher>
      </div>
      <div v-if="!isNaN(selectedKey.keyIndex)" class="w-1/2 pl-2">
        <key-layout-info :layout="tmpLayout"></key-layout-info>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { KleToPog } from "@/helpers/helpers";
import { computed, onMounted, ref } from "vue";
import router from "@/router";
import {
  keymap,
  selectedKeyboard,
  selectedKey,
  keyLayout,
  selectedConfig,
} from "@/store";
import KeyboardLayout from "@/components/KeyboardLayout.vue";

import { onKeyStroke } from "@vueuse/core";
import KeyLayoutInfo from "@/components/KeyLayoutInfo.vue";
import VariantSwitcher from "@/components/VariantSwitcher.vue";
const kleInput = ref("");
const pogOutput = ref("");
const tmpLayout = ref<any[]>([]);
if (
  selectedConfig.value &&
  selectedConfig.value.layouts &&
  selectedConfig.value.layouts.keymap
) {
  tmpLayout.value = [...selectedConfig.value.layouts.keymap];
}
const emit = defineEmits(["next"]);
const converterVisible = ref(false);
const showConverter = () => {
  converterVisible.value = !converterVisible.value;
};
const convert = () => {
  const layout = KleToPog(kleInput.value);
  pogOutput.value = JSON.stringify(layout, null, 4);
  if (router.currentRoute.value.name !== "tools") {
    if (!selectedKeyboard.value || !selectedKeyboard.value.configContents)
      return;
    selectedKeyboard.value.configContents.layouts = {
      keymap: layout,
      labels: [],
    };
    // auto save
    tmpLayout.value = layout;
    // saveKeymap();
  }
};
const setupDone = () => {
  if (!selectedConfig.value) return;
  if (!selectedConfig.value.layouts)
    selectedConfig.value.layouts = { keymap: [], labels: [] };
  selectedConfig.value.layouts.keymap = tmpLayout.value;
  emit("next");
};

const saveKeymap = async () => {
  if (!selectedKeyboard.value || !selectedKeyboard.value.configContents) return;
  const data = {
    rowPins: selectedKeyboard.value.configContents.pins.rows,
    colPins: selectedKeyboard.value.configContents.pins.cols,
    keymap: keymap.value,
    diodeDirection: selectedKeyboard.value.configContents.matrix.diodeDirection,
    config: selectedKeyboard.value,
  };
  // save to pog.json
  selectedKeyboard.value.configContents.currentKeymap = keymap.value;
  const saveResponse = await (window as any).electronAPI.saveKeymap(
    JSON.stringify(data)
  );
  // const saveResponse = await (window as any).electronAPI.saveKeymap(data);
};

const addKey = () => {
  // add key to the last position (+ keywidth ) + 1
  // dasically just to not have them overlap
  if (tmpLayout.value.length === 0) {
    tmpLayout.value.push({
      x: 0,
      y: 0,
      matrix: [],
    });
  } else {
    let lastkey = {
      x: 0,
      y: 0,
      matrix: [],
    };
    tmpLayout.value.forEach((key) => {
      if (lastkey.y < key.y) lastkey = key;
      if (lastkey.y === key.y && lastkey.x < key.x) lastkey = key;
    });
    tmpLayout.value.push({
      x: lastkey.x + 1,
      y: lastkey.y,
      matrix: [],
    });
  }
};

const removeKey = () => {
  tmpLayout.value = tmpLayout.value.filter((key, index) => {
    return index !== selectedKey.value.keyIndex;
  });
};

const saveLayout = () => {
  if (!selectedConfig.value) return;
  selectedConfig.value.layouts.keymap = tmpLayout.value;
};
onMounted(() => {
  // move keys with arrows

  onKeyStroke("ArrowDown", (e) => {
    e.preventDefault();
    tmpLayout.value[selectedKey.value.keyIndex].y =
      tmpLayout.value[selectedKey.value.keyIndex].y + 0.25;
  });
  onKeyStroke("ArrowUp", (e) => {
    e.preventDefault();
    tmpLayout.value[selectedKey.value.keyIndex].y =
      tmpLayout.value[selectedKey.value.keyIndex].y - 0.25;
  });
  onKeyStroke("ArrowLeft", (e) => {
    e.preventDefault();
    tmpLayout.value[selectedKey.value.keyIndex].x =
      tmpLayout.value[selectedKey.value.keyIndex].x - 0.25;
  });
  onKeyStroke("ArrowRight", (e) => {
    e.preventDefault();
    tmpLayout.value[selectedKey.value.keyIndex].x =
      tmpLayout.value[selectedKey.value.keyIndex].x + 0.25;
  });
});
const initSetup = computed(() => {
  return router.currentRoute.value.path !== "/tools";
});
</script>

<style lang="scss" scoped></style>
