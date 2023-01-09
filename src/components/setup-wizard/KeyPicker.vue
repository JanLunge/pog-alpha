<template>
  <div class="tabs tabs-boxed mb-4">
    <a class="tab tab-active">Basic</a>
    <a class="tab">Layers</a>
    <a class="tab">KMK</a>
    <a class="tab">Backlight</a>
    <a class="tab">App/Media/Mouse</a>
  </div>
  <div class="flex key-chooser">
    <div class="row">
      <div class="key" @click="setKey('KC.ESC')">ESC</div>
      <div class="blocker-full"></div>
      <div class="key" @click="setKey('KC.F1')">F1</div>
      <div class="key" @click="setKey('KC.F2')">F2</div>
      <div class="key" @click="setKey('KC.F3')">F3</div>
      <div class="key" @click="setKey('KC.F4')">F4</div>
      <div class="blocker-half"></div>
      <div class="key" @click="setKey('KC.F5')">F5</div>
      <div class="key" @click="setKey('KC.F6')">F6</div>
      <div class="key" @click="setKey('KC.F7')">F7</div>
      <div class="key" @click="setKey('KC.F8')">F8</div>
      <div class="blocker-half"></div>
      <div class="key" @click="setKey('KC.F9')">F9</div>
      <div class="key" @click="setKey('KC.F10')">F10</div>
      <div class="key" @click="setKey('KC.F11')">F11</div>
      <div class="key" @click="setKey('KC.F12')">F12</div>
    </div>
    <div class="row">
      <div class="key" @click="setKey('KC.GRV')"><span>~</span><span>`</span></div>
      <div class="key" @click="setKey('KC.N1')"><span>!</span><span>1</span></div>
      <div class="key" @click="setKey('KC.N2')"><span>@</span><span>2</span></div>
      <div class="key" @click="setKey('KC.N3')"><span>#</span><span>3</span></div>
      <div class="key" @click="setKey('KC.N4')"><span>$</span><span>4</span></div>
      <div class="key" @click="setKey('KC.N5')"><span>%</span><span>5</span></div>
      <div class="key" @click="setKey('KC.N6')"><span>^</span><span>6</span></div>
      <div class="key" @click="setKey('KC.N7')"><span>&</span><span>7</span></div>
      <div class="key" @click="setKey('KC.N8')"><span>*</span><span>8</span></div>
      <div class="key" @click="setKey('KC.N9')"><span>(</span><span>9</span></div>
      <div class="key" @click="setKey('KC.N0')"><span>)</span><span>0</span></div>
      <div class="key" @click="setKey('KC.MINS')"><span>_</span><span>-</span></div>
      <div class="key" @click="setKey('KC.EQL')"><span>+</span><span>=</span></div>
      <div class="key key-2u" @click="setKey('KC.BSPC')">Bksp</div>
    </div>
    <div class="row">
      <div class="key key-1-5u" @click="setKey('KC.TAB')">Tab</div>
      <div class="key" @click="setKey('KC.Q')">Q</div>
      <div class="key" @click="setKey('KC.W')">W</div>
      <div class="key" @click="setKey('KC.E')">E</div>
      <div class="key" @click="setKey('KC.R')">R</div>
      <div class="key" @click="setKey('KC.T')">T</div>
      <div class="key" @click="setKey('KC.Y')">Y</div>
      <div class="key" @click="setKey('KC.U')">U</div>
      <div class="key" @click="setKey('KC.I')">I</div>
      <div class="key" @click="setKey('KC.O')">O</div>
      <div class="key" @click="setKey('KC.P')">P</div>
      <div class="key" @click="setKey('KC.LBRC')"><span>{</span><span>[</span></div>
      <div class="key" @click="setKey('KC.RBRC')"><span>}</span><span>]</span></div>
      <div class="key key-1-5u" @click="setKey('KC.BSLS')"><span>|</span><span>\</span></div>
    </div>
    <div class="row">
      <div class="key key-1-75u" @click="setKey('KC.CAPS')">Caps Lock</div>
      <div class="key" @click="setKey('KC.A')">A</div>
      <div class="key" @click="setKey('KC.S')">S</div>
      <div class="key" @click="setKey('KC.D')">D</div>
      <div class="key" @click="setKey('KC.F')">F</div>
      <div class="key" @click="setKey('KC.G')">G</div>
      <div class="key" @click="setKey('KC.H')">H</div>
      <div class="key" @click="setKey('KC.J')">J</div>
      <div class="key" @click="setKey('KC.K')">K</div>
      <div class="key" @click="setKey('KC.L')">L</div>
      <div class="key" @click="setKey('KC.SCLN')"><span>:</span><span>;</span></div>
      <div class="key" @click="setKey('KC.QUOT')"><span>"</span><span>'</span></div>
      <div class="key key-2-25u" @click="setKey('KC.ENT')">Enter</div>
    </div>
    <div class="row">
      <div class="key key-2-5u" @click="setKey('KC.LSFT')">LShift</div>
      <div class="key" @click="setKey('KC.Z')">Z</div>
      <div class="key" @click="setKey('KC.X')">X</div>
      <div class="key" @click="setKey('KC.C')">C</div>
      <div class="key" @click="setKey('KC.V')">V</div>
      <div class="key" @click="setKey('KC.B')">B</div>
      <div class="key" @click="setKey('KC.N')">N</div>
      <div class="key" @click="setKey('KC.M')">M</div>
      <div class="key" @click="setKey('KC.COMM')"><span>&lt;</span><span>,</span></div>
      <div class="key" @click="setKey('KC.DOT')"><span>&gt;</span><span>,</span></div>
      <div class="key" @click="setKey('KC.SLSH')"><span>?</span><span>/</span></div>
      <div class="key key-2-5u" @click="setKey('KC.RSFT')">RShift</div>
    </div>
    <div class="row">

      <div class="key key-1-25u" @click="setKey('KC.LCTL')">LCtrl</div>
      <div class="key key-1-25u" @click="setKey('KC.LGUI')">LGui</div>
      <div class="key key-1-25u" @click="setKey('KC.LALT')">LAlt</div>

      <div class="key key-6u" @click="setKey('KC.SPC')">Space</div>

      <div class="key key-1-25u" @click="setKey('KC.RALT')">RAlt</div>
      <div class="key key-1-25u" @click="setKey('KC.RGUI')">RGui</div>
      <div class="key key-1-25u" @click="setKey('KC.APP')">Menu</div>
      <div class="key key-1-25u" @click="setKey('KC.RCTL')">RCTL</div>
    </div>
    <div class="bonus">
      <div class="key" @click="setKey('KC.NO')">Empty</div>
      <div class="key" @click="setKey('KC.TRNS')">▽</div>
      <div class="key" @click="setKey('KC.NO')">Num Lock</div>
      <div class="key" @click="setKey('KC.NO')">/</div>
      <div class="key" @click="setKey('KC.NO')">*</div>
      <div class="key" @click="setKey('KC.NO')">-</div>
      <div class="key" @click="setKey('KC.NO')">+</div>
      <div class="key" @click="setKey('KC.NO')">Num Enter</div>
      <div class="key" @click="setKey('KC.NO')">1</div>
      <div class="key" @click="setKey('KC.NO')">2</div>
      <div class="key" @click="setKey('KC.NO')">3</div>
      <div class="key" @click="setKey('KC.NO')">4</div>
      <div class="key" @click="setKey('KC.NO')">5</div>
      <div class="key" @click="setKey('KC.NO')">6</div>
      <div class="key" @click="setKey('KC.NO')">7</div>
      <div class="key" @click="setKey('KC.NO')">8</div>
      <div class="key" @click="setKey('KC.NO')">9</div>
      <div class="key" @click="setKey('KC.NO')">0</div>
      <div class="key" @click="setKey('KC.NO')">.</div>
      <div class="key" @click="setKey('KC.NO')">=</div>
      <div class="key" @click="setKey('KC.NO')">,</div>
      <div class="key" @click="setKey('KC.NO')">Print Screen</div>
      <div class="key" @click="setKey('KC.NO')">Scroll Lock</div>
      <div class="key" @click="setKey('KC.NO')">Pause</div>
      <div class="key" @click="setKey('KC.NO')">Insert</div>
      <div class="key" @click="setKey('KC.NO')">Home</div>
      <div class="key" @click="setKey('KC.NO')">Page Up</div>
      <div class="key" @click="setKey('KC.NO')">Del</div>
      <div class="key" @click="setKey('KC.NO')">End</div>
      <div class="key" @click="setKey('KC.NO')">Page Down</div>
      <div class="key" @click="setKey('KC.RIGHT')">Right</div>
      <div class="key" @click="setKey('KC.LEFT')">Left</div>
      <div class="key" @click="setKey('KC.DOWN')">Down</div>
      <div class="key" @click="setKey('KC.UP')">Up</div>
      <div class="key" @click="setKey('KC.NO')">~</div>
      <div class="key" @click="setKey('KC.NO')">!</div>
      <div class="key" @click="setKey('KC.NO')">@</div>
      <div class="key" @click="setKey('KC.NO')">#</div>
      <div class="key" @click="setKey('KC.NO')">$</div>
      <div class="key" @click="setKey('KC.NO')">%</div>
      <div class="key" @click="setKey('KC.NO')">^</div>
      <div class="key" @click="setKey('KC.NO')">&</div>
      <div class="key" @click="setKey('KC.NO')">*</div>
      <div class="key" @click="setKey('KC.NO')">(</div>
      <div class="key" @click="setKey('KC.NO')">)</div>
      <div class="key" @click="setKey('KC.NO')">_</div>
      <div class="key" @click="setKey('KC.NO')">+</div>
      <div class="key" @click="setKey('KC.NO')">{</div>
      <div class="key" @click="setKey('KC.NO')">}</div>
      <div class="key" @click="setKey('KC.NO')">&lt;</div>
      <div class="key" @click="setKey('KC.NO')">&gt;</div>
      <div class="key" @click="setKey('KC.NO')">:</div>
      <div class="key" @click="setKey('KC.NO')">|</div>
      <div class="key" @click="setKey('KC.NO')">?</div>
      <div class="key" @click="setKey('KC.NO')">"</div>
    </div>
  </div>
</template>

<script lang="ts" setup>
const emit = defineEmits(['setKey'])
const setKey = (key) => {
  emit('setKey', key)
}
</script>

<style lang="scss" scoped>
.key-chooser {
  gap: 4px;
  @apply flex flex-col;
  .row {
    @apply flex justify-center w-full;
    gap: 4px;
  }
  .bonus{
    margin-top: 20px;
    gap: 4px;
    @apply flex;
    flex-wrap: wrap;
  }
  .blocker-half {
    width: 25px;
    height: 54px;
    @apply shrink-0;
  }
  .blocker-full {
    height: 54px;
    width: 54px;
    @apply shrink-0;
  }
  .key {
    width: 54px;
    height: 54px;
    background: #444444;
    @apply rounded flex items-center justify-center shrink-0 flex-col text-center;
    font-size: 12px;
    border: 1px solid #555;
    cursor: pointer;
    &:hover {
      background: #555;
    }
    &-2u{
      width: calc(54px * 2 + 4px);
    }
    &-1-25u{
      width: calc(54px * 1.25 + 2px);
    }
    &-1-5u{
      width: calc(54px * 1.5 + 2px);
    }
    &-1-75u{
      width: calc(54px * 1.75 + 2px);
    }
    &-2-25u{
      width: calc(54px * 2.25 + 6px);
    }
    &-2-5u{
      width: calc(54px * 2.5 + 6px);
    }
    &-6u{
      width: calc(54px * 6.25 + 14px);
    }
  }
}
</style>