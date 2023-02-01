import { computed, ref } from "vue";

export const selectedKey = ref<{ key: number[] | undefined; args: boolean }>({
  key: undefined,
  args: false,
});
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
  get(){
    if (!selectedConfig.value) return undefined
    return selectedConfig.value.currentKeymap
  },
  set(newVal:any){
    if (!selectedConfig.value) return undefined;
    selectedConfig.value.currentKeymap = newVal
  }
})
//ref<(string | undefined)[][]>([["KC.TRNS", "KC.TRNS"]]);
export const keyLayout = ref<{
  info: { matrix: number[] };
  keys: any[];
}>({
  keys: [],
  info: { matrix: [0, 0] },
});
