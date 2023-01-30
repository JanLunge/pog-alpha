import { ref } from "vue";

export const selectedKey = ref({
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
        currentKeymap: string[][]; // layer > key index > keycode
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

export const selectedVariants = ref({});
export const layoutVariants = ref(undefined);

export const keymap = ref<string[][]>([["", ""]]);
export const keyLayout = ref<{ info: { matrix: number[] }; keys: any[] }>({
  keys: [],
  info: { matrix: [] },
});
