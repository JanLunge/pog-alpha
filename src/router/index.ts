import {createRouter, createWebHashHistory, createWebHistory} from 'vue-router'
import HomeView from '../views/HomeView.vue'
import KeymapEditor from "@/components/KeymapEditor.vue";
import VariantSwitcher from "@/components/VariantSwitcher.vue";
import KmkInstaller from "@/components/setup-wizard/KmkInstaller.vue";
import MatrixSetup from "@/components/setup-wizard/MatrixSetup.vue";
import PinSetup from "@/components/setup-wizard/PinSetup.vue";
import RawKeymapEditor from "@/components/RawKeymapEditor.vue";
import LayoutEditor from "@/components/LayoutEditor.vue";
import EncoderSetup from "@/components/EncoderSetup.vue";

const router = createRouter({
  // history: createWebHistory(import.meta.env.BASE_URL),
  history: createWebHashHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
      children:[
        {
          path: 'keymap',
          component: KeymapEditor
        },
        {
          path: 'layout-options',
          component: VariantSwitcher
        },
        {
          path: 'firmware',
          component: KmkInstaller
        },
        {
          path: 'matrix',
          component: MatrixSetup
        },
        {
          path: 'pins',
          component: PinSetup
        },
        {
          path: 'layout',
          component: LayoutEditor
        },
        {
          path: 'raw-keymap',
          component: RawKeymapEditor
        },
        {
          path: 'encoder',
          component: EncoderSetup
        }

      ]
    },
  ]
})

export default router
