<template>
  <div class="flex">
    <ul class="menu bg-base-100 w-56 flex-shrink-0 pt-8 border-r border-opacity-40 border-white">
      <p class="p-4 text-xl font-bold text-center">pog</p>
      <li><router-link to="/keymap">Keymap</router-link></li>
      <li><router-link to="/layout-options">Layout Options</router-link></li>
      <hr class="border-white border-opacity-40">
      <li><router-link to="/firmware">Firmware</router-link></li>
      <li><router-link to="/matrix">Matrix</router-link></li>
      <li><router-link to="/pins">Pins</router-link></li>
      <li><router-link to="/layout">Layout</router-link></li>
      <li><router-link to="/raw-keymap">Raw Keymap</router-link></li>
      <li><router-link to="/encoder">Encoder</router-link></li>
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
import {keymap, keyLayout} from "@/store";


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
    diodeDirection: selectedkeyboard.value.layoutContents.matrix.diodeDirection,
    config: selectedkeyboard.value
  };
  // save to pog.json
  selectedkeyboard.value.layoutContents.currentKeymap = keymap.value
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
            (p) => {
              // if raw value
              if(p.type === 'Literal'){
                return String(p.value)
              }
            return `${p.object.name}.${p.property.name}`}
          );
          if(b.callee.type === "MemberExpression"){
            return `${b.callee.object.name}.${b.callee.property.name}(${props.join(",")})`;
          }else {
            return `${b.callee.name}(${props.join(",")})`;
          }
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


</script>

<style lang="scss" scoped>
.router-link-active{
  @apply bg-primary text-black;
}
</style>
