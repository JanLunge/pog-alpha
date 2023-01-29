<template>
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
  <p>currently you need to create a layout file manually</p>
  <p>
    in the pog.json file you will find an entry named layouts. in there
    you have the keymap which is
    <a class="link link-primary" href="keyboard-layout-editor.com"
    >KLE Syntax</a
    >
    and next to it the labels for choosing between layout variants.
  </p>
  <p>
    currently rotation is not yet supported and the only breaking change
    to a vial.json file is that variant keys need to be placed in the spot
    that they should show up when activated. which leads to keys being
    stacked in the current KLE editor.
  </p>
  <p>
    the keys only need a top left label with their matrix position and a
    bottom right label if you want to switch layout variants for that key
  </p>
</template>

<script lang="ts" setup>

</script>

<style lang="scss" scoped>

</style>