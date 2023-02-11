<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import {useRoute} from "vue-router";
const router = useRoute()

import {keyboardStore} from "@/store";
import {computed} from "vue";

const store = computed(()=>{
  return keyboardStore
})
</script>

<template>
    <div class="">
      <div class="titlebar"></div>
      <div class="content">
      <RouterView />
      </div>
    </div>

</template>

<style>
.titlebar {
  -webkit-user-select: none;
  -webkit-app-region: drag;
  height: 30px;
  /*background: red;*/
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
}
.content {
  overflow: hidden;
  height: 100vh;

}

</style>
