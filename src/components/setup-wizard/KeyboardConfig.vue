<template>
  <div class="flex">
    <ul class="menu bg-base-100 w-56 flex-shrink-0 pt-8">
      <li><a>Keymap</a></li>
      <li><a>Layout Options</a></li>
      <hr class="border-white border-opacity-40">
      <li><a>Firmware</a></li>
      <li><a>Matrix</a></li>
      <li><a>Pins</a></li>
      <li><a>Layout</a></li>
      <li><a>Raw Keymap</a></li>
    </ul>
  <div class="px-4 pt-8 flex-1 overflow-x-auto h-screen">
    <h1 class="text-5xl font-bold text-center mb-8">Keyboard Config</h1>

    <p class="font-bold">Keymap</p>
    <div>
      <div v-for="(layer, layerindex) in keymap">
        layer {{ layerindex }}
        <div
          class="border rounded border-opacity-40 border-white p-2 grid gap-2 mb-4"
          :style="{
            gridTemplateColumns: `repeat(${colPins.length}, minmax(0, 1fr))`,
          }"
        >
          <input
            class="input input-sm input-bordered"
            v-for="(key, index) in layer"
            v-model="keymap[layerindex][index]"
            placeholder="KC.A"
          />
        </div>
      </div>
    </div>
    <p class="font-bold">Layout (WIP)</p>
    <p>
      define visual keymap with the layout editor at
      <a
        class="btn btn-xs btn-link"
        target="_blank"
        href="http://www.keyboard-layout-editor.com/"
        >Keyboard Layout Editor</a
      >
    </p>
    <div>
      {{
        layoutContents
          ? "has layout"
          : "layout file not found, place layout.json in the keyboard folder"
      }}
      <div class="flex items-center">

      Layers
      <div class="tabs tabs-boxed ml-2">
        <div class="tab" :class="{'tab-active': index === selectedLayer}" v-for="(layer,index) in keymap">0</div>
      </div>
      </div>
      <div>selected {{selectedKey}} {{selectedVariants}}</div>
     <VariantSwitcher></VariantSwitcher>
      <keyboard-layout
        :key-layout="keyLayout"
        :keymap="keymap"
      ></keyboard-layout>
      <KeyPicker @setKey="setKey"></KeyPicker>
    </div>
    <!--    <textarea class="textarea textarea-bordered w-full mt-2"></textarea>-->
    <div class="py-4 flex justify-center">
      <div class="btn btn-sm btn-primary" @click="saveKeymap">
        Save Keymap config to Keyboard
      </div>
    </div>
  </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, onMounted, ref, watch } from "vue";
import InputLabel from "@/components/ui/InputLabel.vue";
import filbert from 'filbert'
import sliceLines from "slice-lines";
import KeyboardLayout from "@/components/KeyboardLayout.vue";
import {selectedKey, selectedkeyboard, selectedLayer, selectedVariants} from "@/store";
import { matrixPositionToIndex } from "@/helpers/matrix";
import VariantSwitcher from "@/components/VariantSwitcher.vue";
const props = defineProps(["codeContents", "layoutContents"]);

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

const keymap = ref<string[][]>([["", ""]]);
const keyLayout = ref({ keys: [], info: {} });

const codepyTmp = ref("");

// watch(
//   () => keyboardHeight.value,
//   () => {
//     rowPins.value = Array(keyboardHeight.value).fill("");
//     updateKeymapLength();
//   }
// );
//
// watch(
//   () => keyboardWidth.value,
//   () => {
//     colPins.value = Array(keyboardWidth.value).fill("");
//     updateKeymapLength();
//   }
// );

const updateKeymapLength = () => {
  // keymap.value = [Array(rowPins.value.length * colPins.value.length).fill("")];
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
        keymap.value[index].push("KC.TRNS");
      } else {
        keymap.value[index].pop();
      }
      keyDiff--;
    }
  });
};

const saveKeymap = async () => {
  const data = {
    rowPins: rowPins.value,
    colPins: colPins.value,
    keymap: keymap.value,
    diodeDirection: selectedkeyboard.value.layoutContents.matrix.diodeDirection
  };
  const saveResponse = await (window as any).electronAPI.saveKeymap(
    JSON.stringify(data)
  );
  // const saveResponse = await (window as any).electronAPI.saveKeymap(data);
};

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
  const cleanedPythonDoc = pythonDoc.replaceAll(',)',')')
  const codeast = filbert.parse(cleanedPythonDoc, {
    range: true,
    locations: true,
  });
  const expressions = codeast.body;
  let result = { error: true };
  expressions.forEach((expr: any) => {
    const astExpr = expr.expression;
    // if (!expr || !expr.left) return;
    if (
      astExpr &&
      astExpr.type === "AssignmentExpression" &&
      // astExpr.left.object.name === objectName &&
      astExpr.left.property.name === propertyName
    ) {
      const tmp = sliceLines(
        props.codeContents,
        astExpr.loc.start.line - 1,
        -1
      );
      const expressionResult = tmp.slice(
        astExpr.loc.start.column,
        astExpr.loc.end.column
      );
      const before = sliceLines(
        props.codeContents,
        0,
        astExpr.loc.start.line - 1
      );
      const after = tmp.slice(astExpr.loc.end.column + 1);
      // console.log(before, marker, after);
      result = {
        markedPythonDoc: before + marker + after,
        data: astExpr,
        pythonVariable: expressionResult,
      };
    }
  });
  return result;
};
import {layoutVariants} from "@/store";
import KeyPicker from "@/components/setup-wizard/KeyPicker.vue";
onMounted(() => {
  // go through the code.py file for each datapoint to look up
  // pass the marked code file to the next

  // if(expression.left.property.name === 'col_pins'){
  //   console.log('found the col_pins', expression)
  // }
  // if(expression.left.property.name === 'row_pins'){
  //   console.log('found the row_pins', expression)
  // }

  // extract keymap
  const extractData1 = extractData({
    pythonDoc: props.codeContents,
    marker: "\n# pog marker  keymap\n",
    objectName: "keyboard",
    propertyName: "keymap",
  });
  // extract all layers
  if (!extractData1.data.right.arguments) {
    console.log("one keymap entry");
    keymap.value = [
      extractData1.data.right.object.name +
        "." +
        extractData1.data.right.property.name,
    ];
  } else {
    keymap.value = extractData1.data.right.arguments.map((a) => {
      console.log("keymap layer?", a);
      return a.arguments.map((b) => {
        if (b.type === "CallExpression") {
          let props = b.arguments.map(
            (p) => `${p.object.name}.${p.property.name}`
          );
          return `${b.callee.name}(${props.join(",")})`;
        }
        // callee.name is needed in case then its arguments are used with the normal notation
        return b.object.name + "." + b.property.name;
      });
    });
    console.log("more than one keymap entry", keymap.value);
  }

  // extract cols
  const extractData2 = extractData({
    pythonDoc: extractData1.markedPythonDoc,
    marker: "\n# pog marker col_pins\n",
    objectName: "keyboard",
    propertyName: "col_pins",
  });
  if (!extractData2.data.right.arguments) {
    // just one property
    console.log("one col Pin");
    colPins.value = [
      extractData2.data.right.object.name +
        "." +
        extractData2.data.right.property.name,
    ];
  } else {
    colPins.value = extractData2.data.right.arguments.map(
      (a) => a.object.name + "." + a.property.name
    );
    console.log("more than one col pin", colPins.value, extractData2.data);
  }
  // colPins.value = extractData2.data
  const extractData3 = extractData({
    pythonDoc: extractData2.markedPythonDoc,
    marker: "\n# pog marker col_pins\n",
    objectName: "keyboard",
    propertyName: "row_pins",
  });
  if (!extractData3.data.right.arguments) {
    // just one property
    console.log("one row pin", extractData3.data);
    rowPins.value = [
      extractData3.data.right.object.name +
        "." +
        extractData3.data.right.property.name,
    ];
  } else {
    rowPins.value = extractData3.data.right.arguments.map(
      (a) => a.object.name + "." + a.property.name
    );
    console.log("more than one row pin", colPins.value);
  }
  codepyTmp.value = extractData3.markedPythonDoc;

  // parse Layout file
  if(!props.layoutContents) return
  const layout = props.layoutContents;
  let keyboardInfo = ref({ info: {}, keys: [] });

  //iterate over rows
  let currentX = 0;
  let currentY = 0;
  let keydata = undefined; // data to carry over to the next key until it is overwritten
  let firstKeyInRow = true;
  layoutVariants.value = layout.layouts.labels
  selectedVariants.value = layoutVariants.value.map(a=> {return 0})
  layout.layouts.keymap.forEach((row) => {
    if (Array.isArray(row)) {
      // normal row
      row.forEach((keyOrData) => {
        let key = { labels: [] };
        if (typeof keyOrData === "string") {
          // this is a key
          let labels = keyOrData.split("\n");
          if (labels.length === 1) {
            // just the main label
            labels = ["", "", "", "", "", "", "", "", "", keyOrData];
            key.matrixPos = keyOrData
          }
          else if (labels.length === 4) {
            // shortened labels top left and bottom right
            // labels = [keyOrData];
            key.matrixPos = labels[0]
            key.variant = labels[3].split(',').map(a=>Number(a))
          }else{
            // all labels just keep split
            key.matrixPos = keyOrData[0]
            // key.variant = keyOrData[3]
          }
          key.labels = labels;
          // Position data
          if (keydata) {
            key = { ...key, ...keydata };
            if (keydata.y) currentY = keydata.y;
            if (keydata.x) currentX = keydata.x + currentX;
            if(firstKeyInRow){
              key.x = currentX;
              firstKeyInRow = false;
            }else {
              key.x = currentX;
            }
          }
          if (!key.y) key.y = currentY;
          if (!key.x) key.x = currentX;
          keydata = undefined;
          if(!key.w || key.w === 1) {
            currentX++;
          }else{
            currentX = currentX + key.w
          }
          keyboardInfo.value.keys.push(key);
        } else {
          // this is data for the next key
          keydata = keyOrData;
        }
        // add 1 to left distance // next key
      });
      // add 1 to top distance // next row
      currentX = 0;
      firstKeyInRow = true
      currentY++;
    } else {
      keyboardInfo.value.info = layout[0];
    }
  });
  keyLayout.value = keyboardInfo.value;
  keyLayout.value.info.matrix = [rowPins.value.length, colPins.value.length];
});

const setKey = (keyCode) => {
  const keyIndex = matrixPositionToIndex({
    pos: selectedKey.value.key,
    matrixSize: keyLayout.value.info.matrix,
  });
  console.log("setting ", selectedKey.value, "to", keyCode, "at", keyIndex);
  const currentKeyAction = keymap.value[selectedLayer.value][keyIndex];
  if (!keyCode.includes("(")) {
    // could set this as arg in a key
    if (currentKeyAction.includes("(") && selectedKey.value.args) {
      // only set this as arg
      let action = currentKeyAction.split("(")[0].replace(")", "");
      keymap.value[selectedLayer.value][keyIndex] =
        action + "(" + keyCode + ")";
      return;
    }
  }
  keymap.value[selectedLayer.value][keyIndex] = keyCode;
};


</script>

<style lang="scss" scoped>

</style>
