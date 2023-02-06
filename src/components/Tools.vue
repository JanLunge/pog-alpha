<template>
  <div class="p-2 btn btn-sm mb-4" @click="showConverter">Import from KLE</div>
  <div v-if="converterVisible">
    <div class="flex gap-2">
      <div class="text-left">
        <p>
          you can import json files from the
          <a
            class="link"
            href="http://keyboard-layout-editor.com"
            target="_blank"
            >keyboard layout editor</a
          >
        </p>
        <p>
          set the top left label to the matrix position eg '0,1' for row:0 col:1
        </p>
        <p>
          set the bottom right label for a layout variant<br />
          eg. '0,1' this would be the first layout option using its other
          variant
        </p>
      </div>
      <div class="flex items-center justify-center">
        <img src="@/assets/kle.png" class="rounded" style="width: 300px" />
      </div>
    </div>
    <div class="flex gap-2 mt-4">
      <textarea
        class="textarea textarea-bordered w-full"
        style="line-height: 1rem"
        v-model="kleInput"
        rows="8"
      ></textarea>
      <textarea
        class="textarea textarea-bordered"
        v-model="pogOutput"
        v-if="showRawPogLayout"
      ></textarea>
    </div>
    <div class="flex flex-col gap-2 mt-2">
      <span class="text-warning"
        >this will overwrite your existing layout if it exists</span
      >
      <button class="btn btn-sm my-4 btn-primary" @click="convert">
        convert to pog.json
      </button>
    </div>
    <hr />
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
      <button class="btn btn-sm" @click="saveLayout">
        Save Layout changes
      </button>
    </div>

    <keyboard-layout
      :key-layout="{ keys: tmpLayout }"
      mode="layout"
    ></keyboard-layout>
    <div class="flex">
      <div class="w-1/2 border-r">
        <variant-switcher></variant-switcher>
      </div>
      <div v-if="selectedKeys.length !== 0" class="w-1/2 pl-2">
        <key-layout-info :layout="tmpLayout"></key-layout-info>
      </div>
    </div>
    <div class="btn btn-primary" @click="setupDone" v-if="initSetup">
      Finish Setup
    </div>
  </div>
</template>

<script lang="ts" setup>
import {cleanupKeymap, KleToPog, selectNextKey, selectPrevKey} from "@/helpers/helpers";
import { computed, onMounted, ref } from "vue";
import router from "@/router";
import {
  keymap,
  selectedKeyboard,
  selectedKey,
  selectedKeys,
  keyLayout,
  selectedConfig,
  layoutVariants,
  keycount,
} from "@/store";
import KeyboardLayout from "@/components/KeyboardLayout.vue";
selectedKeys.value = new Set();
import { isNumber, onKeyStroke } from "@vueuse/core";
import KeyLayoutInfo from "@/components/KeyLayoutInfo.vue";
import VariantSwitcher from "@/components/VariantSwitcher.vue";
const kleInput = ref("");
const pogOutput = ref("");
const showRawPogLayout = ref(false);
const tmpLayout = ref<any[]>([]);
if (
  selectedConfig.value &&
  selectedConfig.value.layouts &&
  selectedConfig.value.layouts.keymap
) {
  tmpLayout.value = selectedConfig.value.layouts.keymap;
}
const emit = defineEmits(["next"]);
const converterVisible = ref(false);
const showConverter = () => {
  converterVisible.value = !converterVisible.value;
};
const convert = () => {
  const layout = KleToPog(kleInput.value);
  pogOutput.value = JSON.stringify(layout, null, 4);
  if (!selectedConfig.value) return;
  // extract variants
  console.log("checking for variants", layout);
  if (router.currentRoute.value.name !== "tools") {
    selectedConfig.value.layouts = {
      keymap: layout,
      labels: [],
    };
    layout.forEach((key) => {
      console.log(key);
      if (key.variant && isNumber(key.variant[0])) {
        if (!selectedConfig.value) return;
        // check if variant exists
        console.log("checking key for variant", key.variant);
        if (!selectedConfig.value.layouts.labels[key.variant[0]]) {
          // if not create it
          selectedConfig.value.layouts.labels[
            key.variant[0]
          ] = `Variant ${key.variant[0]}`;
        }
      }
    });

    // init selected variants
    if (!selectedConfig.value?.selectedVariants) {
      selectedConfig.value.selectedVariants =
        selectedConfig.value?.layouts.labels.map((a) => 0);
    }
    // create default keymap
    selectedConfig.value.currentKeymap = [[]];
    cleanupKeymap();
    saveKeymap();
  }
  tmpLayout.value = layout;
  if (layout.length > 0) {
    converterVisible.value = false;
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

    selectedKeys.value.forEach((keyIndex) => {
      tmpLayout.value[keyIndex].y = tmpLayout.value[keyIndex].y + 0.25;
    });
  });
  onKeyStroke("ArrowUp", (e) => {
    e.preventDefault();
    selectedKeys.value.forEach((keyIndex) => {
      tmpLayout.value[keyIndex].y = tmpLayout.value[keyIndex].y - 0.25;
    });
  });
  onKeyStroke("ArrowLeft", (e) => {
    e.preventDefault();
    if (e.altKey && [...selectedKeys.value].length === 1) {
      // alt select next key
      selectPrevKey()
      return;
    }
    selectedKeys.value.forEach((keyIndex) => {
      tmpLayout.value[keyIndex].x = tmpLayout.value[keyIndex].x - 0.25;
    });
  });
  onKeyStroke("ArrowRight", (e) => {
    e.preventDefault();
    if (e.altKey && [...selectedKeys.value].length === 1) {
      // alt select next key
      selectNextKey()
      return;
    }
    selectedKeys.value.forEach((keyIndex) => {
      tmpLayout.value[keyIndex].x = tmpLayout.value[keyIndex].x + 0.25;
    });
  });
});
const initSetup = computed(() => {
  return router.currentRoute.value.path !== "/tools";
});
</script>

<style lang="scss" scoped></style>
