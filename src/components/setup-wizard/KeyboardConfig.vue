<template>
  <div class="flex">
    <ul
      class="menu bg-base-100 w-56 flex-shrink-0 border-r border-opacity-40 border-white"
    >
      <li class="p-4 text-xl font-bold flex items-center">
        <img src="@/assets/icon.png" alt="" class="w-24" />
      </li>
      <li class="text-xs pl-4 py-2">Selected Keyboard</li>
      <li class="p-4 pt-0 flex items-center">
        <span
          @click="reselectKeyboard"
          class="rounded text-center bg-primary text-xs text-black w-full cursor-pointer opacity-70 hover:opacity-100"
          >{{ keyboardName }}</span
        >
      </li>
      <li><router-link to="/keymap">Keymap</router-link></li>
      <li><router-link to="/layout-options">Layout Options</router-link></li>
      <hr class="border-white border-opacity-40" />
      <li><router-link to="/firmware">Firmware</router-link></li>
      <li><router-link to="/matrix">Matrix</router-link></li>
      <li><router-link to="/pins">Pins</router-link></li>
      <li><router-link to="/layout">Layout</router-link></li>
      <li><router-link to="/raw-keymap">Raw Keymap</router-link></li>
      <li><router-link to="/encoder">Encoder</router-link></li>
      <li><router-link to="/tools">Tools</router-link></li>
    </ul>
    <div class="px-4 pt-8 flex-1 overflow-x-auto h-screen">
      <h1 class="text-5xl font-bold text-center mb-8">Keyboard Config</h1>
      <router-view></router-view>
      <div class="py-4 flex justify-center">
        <div class="btn btn-sm btn-primary" @click="saveKeymap">
          Save python code to Keyboard
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, onMounted, ref, watch } from "vue";
import filbert from "filbert";
import sliceLines from "slice-lines";
import {
  selectedKeyboard,
  selectedVariants,
  layoutVariants,
  selectedConfig,
  keymap,
  keyLayout,
} from "@/store";

import { cleanupKeymap } from "@/helpers/helpers";
import { openFolderModal } from "@/helpers/electron";
const props = defineProps(["codeContents", "configContents"]);

const keyboardName = computed(() => {
  const path = selectedKeyboard.value.path;
  return path.split("/").pop();
});

const rowPins = ref<string[]>([""]);
const keyboardHeight = computed({
  get() {
    return rowPins.value.length;
  },
  set(newValue) {
    const pinDiffRel = newValue - rowPins.value.length;
    const diffAdd = pinDiffRel > 0;
    let pinDiff = Math.abs(pinDiffRel);

    while (pinDiff > 0) {
      if (diffAdd) {
        rowPins.value.push("");
      } else {
        rowPins.value.pop();
      }
      pinDiff--;
    }
    updateKeymapLength();
  },
});
const colPins = ref<string[]>([""]);
const keyboardWidth = computed({
  get() {
    return colPins.value.length;
  },
  set(newValue) {
    const pinDiffRel = newValue - colPins.value.length;
    const diffAdd = pinDiffRel > 0;
    let pinDiff = Math.abs(pinDiffRel);

    while (pinDiff > 0) {
      if (diffAdd) {
        colPins.value.push("");
      } else {
        colPins.value.pop();
      }
      pinDiff--;
    }
    updateKeymapLength();
  },
});

const updateKeymapLength = () => {
  // check each layer
  keymap.value.forEach((layer, index) => {
    // count keys
    let keyDiffRel = keyboardWidth.value * keyboardHeight.value - layer.length;
    let diffAdd = keyDiffRel > 0;
    let keyDiff = Math.abs(keyDiffRel);
    console.log(keyDiff, diffAdd);
    // add/remove missing
    while (keyDiff > 0) {
      if (diffAdd) {
        (keymap.value[index] as string[]).push("KC.TRNS");
      } else {
        keymap.value[index].pop();
      }
      keyDiff--;
    }
  });
};

// pass pog.json to backend to convert it ? or convert it here
const saveKeymap = async () => {
  if (!selectedConfig.value) return;
  const data = {
    rowPins: rowPins.value,
    colPins: colPins.value,
    keymap: keymap.value,
    diodeDirection: selectedConfig.value.matrix.diodeDirection,
    config: selectedKeyboard.value,
  };
  if (!selectedKeyboard.value || !selectedKeyboard.value.configContents) return;
  // save to pog.json
  selectedKeyboard.value.configContents.currentKeymap = keymap.value;
  const saveResponse = await (window as any).electronAPI.saveKeymap(
    JSON.stringify(data)
  );
  // const saveResponse = await (window as any).electronAPI.saveKeymap(data);
};

// extract data from the code.py to create a pog.json from existing keyboards?
const extractData = ({
  pythonDoc,
  objectName,
  propertyName,
  marker,
}: {
  pythonDoc: any;
  objectName: string;
  propertyName: string;
  marker: string;
}): { markedPythonDoc: string; data: any } | { error: boolean } => {
  return { error: true };
  // const cleanedPythonDoc = pythonDoc.replaceAll(",)", ")");
  // const codeast = filbert.parse(cleanedPythonDoc, {
  //   range: true,
  //   locations: true,
  // });
  // const expressions = codeast.body;
  // let result = { error: true };
  // expressions.forEach((expr: any) => {
  //   const astExpr = expr.expression;
  //   // if (!expr || !expr.left) return;
  //   if (
  //     astExpr &&
  //     astExpr.type === "AssignmentExpression" &&
  //     // astExpr.left.object.name === objectName &&
  //     astExpr.left.property.name === propertyName
  //   ) {
  //     const tmp = sliceLines(
  //       props.codeContents,
  //       astExpr.loc.start.line - 1,
  //       -1
  //     );
  //     const expressionResult = tmp.slice(
  //       astExpr.loc.start.column,
  //       astExpr.loc.end.column
  //     );
  //     const before = sliceLines(
  //       props.codeContents,
  //       0,
  //       astExpr.loc.start.line - 1
  //     );
  //     const after = tmp.slice(astExpr.loc.end.column + 1);
  //     // console.log(before, marker, after);
  //     result = {
  //       markedPythonDoc: before + marker + after,
  //       data: astExpr,
  //       pythonVariable: expressionResult,
  //     };
  //   }
  // });
  // return result;
};

const reselectKeyboard = async () => {
  const selection = await openFolderModal();
  if(!selection.path) return
  selectedKeyboard.value = selection
  console.log(selectedKeyboard.value.path);
  initSelectedKeyboard()
};

const initSelectedKeyboard = () => {
  // only read from the pog.json by default

  // legacy: set matrix size
  if (!selectedKeyboard.value || !selectedKeyboard.value.configContents || !selectedConfig.value) return;
  rowPins.value = selectedKeyboard.value.configContents.pins.rows;
  colPins.value = selectedKeyboard.value.configContents.pins.cols;
  if (!keyLayout.value.info) keyLayout.value.info = { matrix: [] };
  keyLayout.value.info.matrix = [rowPins.value.length, colPins.value.length];

  layoutVariants.value = selectedConfig.value.layouts.labels;
  if (!layoutVariants.value) layoutVariants.value = [];
  selectedVariants.value = layoutVariants.value.map((a: any) => {
    return 0;
  });
  keyLayout.value.keys = selectedConfig.value.layouts.keymap;
  keymap.value = selectedConfig.value.currentKeymap;
  cleanupKeymap();
};

onMounted(() => {
  initSelectedKeyboard();
  return;

  // // extract keymap
  // const extractData1 = extractData({
  //   pythonDoc: props.codeContents,
  //   marker: "\n# pog marker  keymap\n",
  //   objectName: "keyboard",
  //   propertyName: "keymap",
  // });
  // // extract all layers
  // if (!extractData1.data.right.arguments) {
  //   console.log("one keymap entry");
  //   keymap.value = [
  //     extractData1.data.right.object.name +
  //       "." +
  //       extractData1.data.right.property.name,
  //   ];
  // } else {
  //   keymap.value = extractData1.data.right.arguments.map((a) => {
  //     console.log("keymap layer?", a);
  //     return a.arguments.map((b) => {
  //       if (b.type === "CallExpression") {
  //         let props = b.arguments.map((p) => {
  //           // if raw value
  //           if (p.type === "Literal") {
  //             return String(p.value);
  //           }
  //           return `${p.object.name}.${p.property.name}`;
  //         });
  //         if (b.callee.type === "MemberExpression") {
  //           return `${b.callee.object.name}.${
  //             b.callee.property.name
  //           }(${props.join(",")})`;
  //         } else {
  //           return `${b.callee.name}(${props.join(",")})`;
  //         }
  //       }
  //       // callee.name is needed in case then its arguments are used with the normal notation
  //       return b.object.name + "." + b.property.name;
  //     });
  //   });
  //   console.log("more than one keymap entry", keymap.value);
  // }
  //
  // // extract cols
  // const extractData2 = extractData({
  //   pythonDoc: extractData1.markedPythonDoc,
  //   marker: "\n# pog marker col_pins\n",
  //   objectName: "keyboard",
  //   propertyName: "col_pins",
  // });
  // if (!extractData2.data.right.arguments) {
  //   // just one property
  //   console.log("one col Pin");
  //   colPins.value = [
  //     extractData2.data.right.object.name +
  //       "." +
  //       extractData2.data.right.property.name,
  //   ];
  // } else {
  //   colPins.value = extractData2.data.right.arguments.map(
  //     (a) => a.object.name + "." + a.property.name
  //   );
  //   console.log("more than one col pin", colPins.value, extractData2.data);
  // }
  // // colPins.value = extractData2.data
  // const extractData3 = extractData({
  //   pythonDoc: extractData2.markedPythonDoc,
  //   marker: "\n# pog marker col_pins\n",
  //   objectName: "keyboard",
  //   propertyName: "row_pins",
  // });
  // if (!extractData3.data.right.arguments) {
  //   // just one property
  //   console.log("one row pin", extractData3.data);
  //   rowPins.value = [
  //     extractData3.data.right.object.name +
  //       "." +
  //       extractData3.data.right.property.name,
  //   ];
  // } else {
  //   rowPins.value = extractData3.data.right.arguments.map(
  //     (a) => a.object.name + "." + a.property.name
  //   );
  //   console.log("more than one row pin", colPins.value);
  // }
  // codepyTmp.value = extractData3.markedPythonDoc;
});
</script>

<style lang="scss" scoped>
.router-link-active {
  @apply bg-primary text-black;
}
</style>
