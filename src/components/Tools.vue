<template>
  <p>convert kle to pog</p>
  <p>use the <a class="link" href="http://keyboard-layout-editor.com" target="_blank">keyboard layout editor</a> to create your keyboard layout, set the top left label to the matrix position eg '0,1' for row:0 col:1</p>
  <p>you can use the bottom right label to define a layout variant specific key, eg. '0,2' this would be the first layout option using its third variant, keys you place with the variant option should be in the exact place they should show up in the end so you would stack them on top of another in kle</p>
  <p>then download the file from kle and paste it in the left box then press convert and paste the result into the pog.json at the key 'layouts.keymap'</p>
  <p>if you defined variants you can name them in 'layouts.labels' in the format ["layout Option", Layout] </p>
  <div class="grid grid-cols-2 gap-2">
    <textarea class="textarea textarea-bordered" v-model="kleInput"></textarea>
    <textarea class="textarea textarea-bordered" v-model="pogOutput"></textarea>
  </div>
  <div>
    <button class="btn" @click="convert">convert</button>
  </div>
  <div
    class="btn btn-sm btn-primary"
    @click="$emit('next')"
    v-if="$route.name !== 'tools'"
>
  Next
</div>
</template>

<script lang="ts" setup>
import { KleToPog } from "@/helpers/helpers";
import { ref } from "vue";
import router from "@/router";
import {keymap, selectedKeyboard} from "@/store";
const kleInput = ref("");
const pogOutput = ref("");
const convert = () => {
  const layout = KleToPog(kleInput.value)
  pogOutput.value = JSON.stringify(layout, null, 4);
  if(router.currentRoute.value.name !== 'tools'){
    if (!selectedKeyboard.value || !selectedKeyboard.value.configContents) return;
    selectedKeyboard.value.configContents.layouts = {keymap: layout, labels: []}
    // auto save
    saveKeymap()
  }
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
</script>

<style lang="scss" scoped></style>
