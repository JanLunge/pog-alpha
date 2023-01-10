import {ref} from "vue";

export const selectedKey = ref({
    key: undefined,
    args: false
})
export const selectedLayer = ref(0)
export const selectedkeyboard = ref({
    path: "",
    hasKmk: false,
    hasCode: false,
    hasBoot: false,
    hasLayout: false,
    codeContents: undefined,
    layoutContents: undefined
});

export const selectedVariants = ref({})
export const layoutVariants = ref(undefined)

export const keymap = ref<string[][]>([["", ""]]);
export const keyLayout = ref({ keys: [], info: {} });
