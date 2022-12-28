<template>
  <div class="px-4">
    <h1 class="text-5xl font-bold text-center mb-8">Initial Keyboard Config</h1>
    <p class="font-bold">Keyboard Matrix Setup</p>
    <div class="grid grid-cols-2 gap-2 mb-8">
      <InputLabel
        placeholder="1"
        input-type="number"
        label="Matrix Width"
        v-model="keyboardWidth"
      ></InputLabel>
      <InputLabel
        placeholder="1"
        input-type="number"
        label="Matrix Height"
        v-model="keyboardHeight"
      ></InputLabel>
    </div>
    <p class="font-bold">Microcontroller Pins</p>
    <p>Row Pins ({{ rowPins.length }})</p>
    <div
      class="border rounded border-opacity-40 border-white p-2 grid grid-cols-1 gap-2 mb-4"
    >
      <input
        class="input input-sm input-bordered"
        type="text"
        v-for="(pin, index) in rowPins"
        v-model="rowPins[index]"
        placeholder="board.GP17"
      />
    </div>
    <p>Column Pins ({{ colPins.length }})</p>
    <div
      class="border rounded border-opacity-40 border-white p-2 grid grid-cols-1 gap-2 mb-4"
    >
      <input
        class="input input-sm input-bordered"
        type="text"
        v-for="(pin, index) in colPins"
        v-model="colPins[index]"
        placeholder="board.GP17"
      />
    </div>
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
      {{layoutContents}}
    </div>
    <textarea class="textarea textarea-bordered w-full mt-2"></textarea>
    <div class="py-4 flex justify-center">
      <div class="btn btn-sm btn-primary" @click="saveKeymap">
        Save Keymap config to Keyboard
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, onMounted, ref, watch } from "vue";
import InputLabel from "@/components/ui/InputLabel.vue";
import filbert from "filbert";
import sliceLines from "slice-lines";
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
    updateKeymapLength()
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
const keyLayout = ref('')

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
  keymap.value.forEach((layer,index) => {
    // count keys
    let keyDiffRel = keyboardWidth.value * keyboardHeight.value - layer.length
    let diffAdd = keyDiffRel > 0
    let keyDiff = Math.abs(keyDiffRel)
    console.log(keyDiff, diffAdd)
    // add/remove missing
    while (keyDiff > 0) {
      if (diffAdd) {
        keymap.value[index].push("");
      } else {
        keymap.value[index].pop();
      }
      keyDiff--;
    }
  })

};

const saveKeymap = async () => {
  const data = {
    rowPins: rowPins.value,
    colPins: colPins.value,
    keymap: keymap.value,
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
  const codeast = filbert.parse(pythonDoc, {
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
  const layout = JSON.parse(props.layoutContents)
  console.log(layout)

});
</script>

<style lang="scss" scoped></style>
