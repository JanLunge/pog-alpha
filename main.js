const { app, BrowserWindow, ipcMain, dialog } = require("electron");
const path = require("path");
const fs = require("fs-extra");
const decompress = require("decompress");
const request = require('request');
const { shell } = require('electron')
let keyboardPath = '' // uses no slash at the end
const appDir = app.getPath('appData') + '/pog/';
function downloadFile(file_url , targetPath){
  if (!fs.existsSync(appDir)){
    fs.mkdirSync(appDir);
  }
  // Save variable to know progress
  var received_bytes = 0;
  var total_bytes = 0;

  var req = request({
    method: 'GET',
    uri: file_url
  });

  var out = fs.createWriteStream(targetPath);
  req.pipe(out);

  req.on('response', function ( data ) {
    // Change the total bytes value to get progress later.
    total_bytes = parseInt(data.headers['content-length' ]);
  });

  // req.on('data', function(chunk) {
  //   // Update the received bytes
  //   received_bytes += chunk.length;
  //
  //   showProgress(received_bytes, total_bytes);
  // });

  req.on('end', function() {
    // alert("File succesfully downloaded");
    console.log('kmk downloaded')
    decompress(`${appDir}kmk.zip`, `${appDir}/kmk`)
        .then((files) => {
          console.log('kmk decompressed',files.length);
        })
        .catch((error) => {
          console.log(error);
        });
    try {
      console.log('moving kmk into keyboard')
      fs.moveSync(`${appDir}kmk/kmk_firmware-master/kmk`, `${keyboardPath}/kmk`, { overwrite: false })
      console.log('success!')
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
    const folderContents = fs.readdirSync(`${filePaths[0]}`);
    // check for kmk, code.py and boot.py
    keyboardPath = filePaths[0]
    let codeContents = undefined
    if(folderContents.includes('code.py')){
      codeContents = fs.readFileSync(`${keyboardPath}/code.py`, {encoding:'utf8', flag:'r'})
    }
    let layoutContents = undefined
    if(folderContents.includes('layout.json')){
      layoutContents = fs.readFileSync(`${keyboardPath}/layout.json`, {encoding:'utf8', flag:'r'})
    }
    return {
      path: filePaths[0],
      hasKmk: folderContents.includes("kmk"),
      hasCode: folderContents.includes("code.py"),
      hasBoot: folderContents.includes("boot.py"),
      hasLayout: folderContents.includes("layout.json"),
      codeContents,
      layoutContents
    };
  }
}

const handleKeymapSave = (jsondata) => {
  console.log('saving keymap', jsondata)
  const data = JSON.parse(jsondata)
  // create basic keymap file
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

keyboard = KMKKeyboard()

# Cols
keyboard.col_pins = (${data.colPins.join(', ')})
# Rows
keyboard.row_pins = (${data.rowPins.join(', ')})
keyboard.diode_orientation = DiodeOrientation.COL2ROW

# Keymap
keyboard.keymap = [
    ${ data.keymap.map(layer=> '['+layer.join(', ')+']').join(', ') }
]

if __name__ == '__main__':
    keyboard.go()
`
  fs.writeFileSync(keyboardPath+'/code.py', keymapString)
  console.log("File written successfully\n");
}

const updateLocalKMKcopy = () => {
  console.log(appDir)
  downloadFile('https://github.com/KMKfw/kmk_firmware/archive/refs/heads/master.zip', appDir+'kmk.zip')

}

function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    minWidth:500,
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
app.whenReady().then(() => {
  ipcMain.handle("dialog:openFile", handleFileOpen);
  ipcMain.handle("updateLocalKMKcopy", updateLocalKMKcopy);
  // ipcMain.handle("saveKeymap", handleKeymapSave);
  ipcMain.on('saveKeymap', (event, data) => {
    console.log('trying to save keymap')
    handleKeymapSave(data)
  })
  createWindow();
  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
