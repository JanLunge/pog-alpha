import { computed, ref } from "vue";

export const selectedKey = ref<{
  key: number[] | undefined;
  args: boolean;
  keyIndex: number;
}>({
  key: undefined,
  args: false,
  keyIndex: NaN,
});

// list of key indexes that are selected
export const selectedKeys = ref<Set<number>>(new Set())

// currently selected keymap layer
export const selectedLayer = ref(0);

export const selectedKeyboard = ref<{
  path: string;
  hasKmk: boolean;
  hasCode: boolean;
  hasBoot: boolean;
  hasConfig: boolean;
  codeContents: undefined | string;
  configContents:
    | undefined
    | {
        controller: string;
        matrix: {
          diodeDirection: "ROW2COL" | "COL2ROW";
          rows: number;
          cols: number;
        };
        encoders: any[];
        encoderKeymap: string[][][]; // layer > encoder index > encoder action index > keycode
        currentKeymap: (string | undefined)[][]; // layer > key index > keycode
        pins: { rows: string[]; cols: string[] };
        layouts: { labels: string[]; keymap: any[] };
        selectedVariants: number[];
      };
}>({
  path: "",
  hasKmk: false,
  hasCode: false,
  hasBoot: false,
  hasConfig: false,
  codeContents: undefined,
  configContents: undefined,
});

export const selectedConfig = computed({
  get() {
    return selectedKeyboard.value.configContents;
  },
  set(value) {
    selectedKeyboard.value.configContents = value;
  },
});

// [0,2,3] index of array is the selected layout and the value its option
export const selectedVariants = ref<number[]>([]);
export const layoutVariants = ref<(string | string[])[]>([]);

export const keymap = computed({
  get() {
    if (!selectedConfig.value) return undefined;
    return selectedConfig.value.currentKeymap;
  },
  set(newVal: any) {
    if (!selectedConfig.value) return undefined;
    selectedConfig.value.currentKeymap = newVal;
  },
});
export const keycount = computed(() => {
  if (!selectedConfig.value) return 0;
  return selectedConfig.value?.layouts.keymap.length ;
});

//ref<(string | undefined)[][]>([["KC.TRNS", "KC.TRNS"]]);
export const keyLayout = ref<{
  info: { matrix: number[] };
  keys: any[];
}>({
  keys: [],
  info: { matrix: [0, 0] },
});
