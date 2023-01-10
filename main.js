const { app, BrowserWindow, ipcMain, dialog } = require("electron");
const path = require("path");
const fs = require("fs-extra");
const decompress = require("decompress");
const request = require('request');
const { shell } = require('electron')
let keyboardPath = '' // uses no slash at the end
let win
const appDir = app.getPath('appData') + '/pog/';
const { default: installExtension, VUEJS3_DEVTOOLS } = require('electron-devtools-installer');
function downloadFile(file_url , targetPath){
  if (!fs.existsSync(appDir)){
    fs.mkdirSync(appDir);
  }
  // Save variable to know progress
  let received_bytes = 0;
  let total_bytes = 0;
  win.webContents.send('update-kmk-progress', {state:'downloading', progress: 0})

  let out = fs.createWriteStream(targetPath);
  request.get(file_url)
  .on('response',  ( data ) => {
    // Change the total bytes value to get progress later.
    total_bytes = parseInt(data.headers['content-length']);
    // console.log('updated total', total_bytes, data.headers)
  })
  .on('data', (chunk) => {
    // Update the received bytes
    received_bytes += chunk.length;
    console.log(total_bytes, received_bytes)
    win.webContents.send('update-kmk-progress', { state:'downloading', progress: received_bytes/total_bytes })
  })
  .pipe(out)
  .on('finish', () => {
    console.log('kmk downloaded')
    win.webContents.send('update-kmk-progress', {state:'unpacking', progress: 0})
    decompress(`${appDir}kmk.zip`, `${appDir}/kmk`)
        .then((files) => {
          console.log('kmk decompressed',files.length);
          win.webContents.send('update-kmk-progress', {state:'copying', progress: 0})
        })
        .catch((error) => {
          console.log(error);
        });
    try {
      console.log('moving kmk into keyboard')
      fs.cp(`${appDir}kmk/kmk_firmware-master/kmk`, `${keyboardPath}/kmk`, { recursive: true }, (e)=>{
        console.log('Copying of KMK done',e)
        win.webContents.send('update-kmk-progress', {state:'done', progress: 0})
      })
    } catch (err) {
      console.error(err)
    }
  });
}

async function handleFileOpen() {
  const { canceled, filePaths } = await dialog.showOpenDialog({
    properties: ["openDirectory"],
  });
  if (canceled) {
    return;
  } else {
    const folderContents = await fs.promises.readdir(`${filePaths[0]}`);
    // check for kmk, code.py and boot.py
    keyboardPath = filePaths[0]
    let codeContents = undefined
    if(folderContents.includes('code.py')){
      codeContents = await fs.promises.readFile(`${keyboardPath}/code.py`, {encoding:'utf8', flag:'r'})
    }
    let layoutContents = undefined
    if(folderContents.includes('pog.json')){
      layoutContents = JSON.parse(await fs.promises.readFile(`${keyboardPath}/pog.json`, {encoding:'utf8', flag:'r'}))
    }
    return {
      path: filePaths[0],
      hasKmk: folderContents.includes("kmk"),
      hasCode: folderContents.includes("code.py"),
      hasBoot: folderContents.includes("boot.py"),
      hasLayout: folderContents.includes("pog.json"),
      codeContents,
      layoutContents
    };
  }
}

const handleKeymapSave = (jsondata) => {
  console.log('saving keymap', jsondata)
  const data = JSON.parse(jsondata)
  // const codeblockraw = fs.readFileSync(`${keyboardPath}/code.py`, {encoding:'utf8', flag:'r'})
  // console.log(codeblockraw)
  // const codeblock = codeblockraw.match(/# CodeBlock([\S\s]*)# \/CodeBlock/gm)[1]
  // console.log(codeblock)
  // create basic keymap file
  // grab old codeblocks
  let pythonImports = ''
  let kmkAddons = ''
  let codeblock = ''
  // testing encoder enable
  if(true){
    pythonImports += '\nfrom kmk.modules.layers import Layers\n' +
        'from kmk.modules.encoder import EncoderHandler\nfrom kmk.extensions.media_keys import MediaKeys\n'
    kmkAddons += '\nlayers = Layers()\n' +
        'encoder_handler = EncoderHandler()\n' +
        'keyboard.modules = [layers, encoder_handler]\nkeyboard.extensions.append(MediaKeys())\n'
    codeblock += '# Encoder\n' +
        'encoder_handler.pins = (\n' +
        '    (board.GP13, board.GP14, None,),\n' +
        ')\n' +
        'encoder_handler.map = [ \n' +
        '    (( KC.VOLD, KC.VOLU,),),\n' +
        ']\n'
  }
  let keymapString =
`print("Starting")

import board
import supervisor
import board
import digitalio
import storage
import usb_cdc
import usb_hid

from kmk.kmk_keyboard import KMKKeyboard
from kmk.keys import KC
from kmk.scanners import DiodeOrientation
${pythonImports}

keyboard = KMKKeyboard()
${kmkAddons}

# Cols
keyboard.col_pins = (${data.colPins.join(', ')})
# Rows
keyboard.row_pins = (${data.rowPins.join(', ')})
# Diode Direction
keyboard.diode_orientation = DiodeOrientation.${data.diodeDirection}

# Keymap
keyboard.keymap = [
    ${ data.keymap.map(layer=> '['+layer.join(', ')+']').join(', ') }
]

${codeblock}

if __name__ == '__main__':
    keyboard.go()
`
  fs.writeFile(keyboardPath+'/code.py', keymapString, () => {
    console.log("File written successfully\n");
  })
}

const updateLocalKMKcopy = () => {
  console.log(appDir)
  downloadFile('https://github.com/KMKfw/kmk_firmware/archive/refs/heads/master.zip', appDir+'kmk.zip')

}

function createWindow() {
   win = new BrowserWindow({
    width: 1100,
    height: 800,
    minWidth:700,
    minHeight: 200,
    titleBarStyle: "hidden",
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
  });
  win.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url)
    return { action: 'deny' };
  });

  // win.loadFile("dist/index.html");
  win.loadURL("http://127.0.0.1:5173/Users/janlunge/Code/pog/dist");
}
const scanForKeyboards = () => {

}
app.whenReady().then(() => {
  installExtension(VUEJS3_DEVTOOLS)
      .then((name) => console.log(`Added Extension:  ${name}`))
      .catch((err) => console.log('An error occurred: ', err));
  ipcMain.handle("dialog:openFile", handleFileOpen);
  ipcMain.handle("updateLocalKMKcopy", updateLocalKMKcopy);
  // ipcMain.handle("saveKeymap", handleKeymapSave);
  ipcMain.on('saveKeymap', (event, data) => {
    console.log('trying to save keymap')
    handleKeymapSave(data)
  })
  scanForKeyboards()
  createWindow();
  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      scanForKeyboards()
      createWindow();
    }
  });
});
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
