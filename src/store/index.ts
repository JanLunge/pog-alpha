import { computed, ref } from "vue";
import VueStore from "@wlard/vue-class-store";
import { ulid } from "ulid";

export const selectedKey = ref<{
  key: number[] | undefined;
  args: boolean;
  keyIndex: number;
}>({
  key: undefined,
  args: false,
  keyIndex: NaN,
});

type KeyActions = {
  type: "chord" | "tap" | "short_hold" | "hold" | "sequence";
  keycodes: string[];
  actions: KeyActions[];
}[];

// list of key indexes that are selected
export const selectedKeys = ref<Set<number>>(new Set());

// currently selected keymap layer
export const selectedLayer = ref(0);

type EncoderLayer = EncoderActions[];
type EncoderActions = [string, string];
type KeyInfo = {
  x: number;
  y: number;
  matrix?: [number, number];
  w?: number;
  h?: number;
  h2?: number;
  w2?: number;
  r?: number;
  rx?: number;
  ry?: number;
  variant?: [number, number];
};

class Key {
  id = ulid();
  x = 0;
  y = 0;
  w = 1;
  w2 = undefined;
  h = 1;
  h2 = undefined;
  r = 0;
  rx = 0;
  ry = 0;
  matrix?: [number, number] = undefined;
  variants?: [number, number] = undefined;
  constructor({
    x,
    y,
    matrix,
    variants,
  }: {
    x: number;
    y: number;
    matrix?: [number, number];
    variants?: [number, number];
  }) {
    this.x = x;
    this.y = y;
    if (matrix && matrix.length === 2) {
      this.matrix = matrix;
    }
    if (variants && variants.length === 2) {
      this.variants = matrix;
    }
  }
  serialize() {
    const tmpKey: KeyInfo = {
      x: this.x,
      y: this.y,
    };
    if (this.w !== 1) {
      tmpKey.w = this.w;
    }
    if (this.h !== 1) {
      tmpKey.h = this.h;
    }
    if (Array.isArray(this.matrix) && this.matrix.length === 2) {
      tmpKey.matrix = this.matrix;
    }
    if (Array.isArray(this.variants) && this.variants.length === 2) {
      tmpKey.matrix = this.variants;
    }
    return tmpKey;
  }
}

class Keyboard {
  path: string = "";
  driveContents: string[] = [];

  // layout
  keys: Key[] = [];
  layouts: { name: string; variants: string[] }[] = [];

  controller?: string = undefined;

  diodeDirection?: "ROW2COL" | "COL2ROW" = undefined;
  wiringMethod?: "matrix" | "direct" = undefined;

  constructor({ path }: { path: string }) {
    this.path = path;
  }

  // Keys
  setKeys(keys: any[]) {
    this.keys = [];
    keys.forEach((key) => {
      const tmpKey = new Key(key);
      this.keys.push(tmpKey);
    });
  }
  getKeys() {
    return this.keys.map((key) => key.serialize());
  }
}

@VueStore
class KeyboardStore extends Keyboard {}

export const keyboardStore = new KeyboardStore({ path: "test" });
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
          wiringMethod: "matrix" | "direct";
          rows: number;
          cols: number;
        };
        pins: { rows?: string[]; cols?: string[]; direct?: string[] };
        encoders: { pad_a: string; pad_b: string }[];
        encoderKeymap: EncoderLayer[]; // layer > encoder index > encoder action index > keycode
        currentKeymap: (string | undefined)[][]; // layer > key index > keycode
        layouts: {
          labels: (string | string[])[]; // list of names of the toggleable label or array of names as options
          keymap: KeyInfo[];
        };
        selectedVariants: number[]; // indexes of the variants that are selected , eg. [0,1,0,5]
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
  return selectedConfig.value?.layouts.keymap.length;
});

//ref<(string | undefined)[][]>([["KC.TRNS", "KC.TRNS"]]);
export const keyLayout = ref<{
  info: { matrix: number[] };
  keys: any[];
}>({
  keys: [],
  info: { matrix: [0, 0] },
});
