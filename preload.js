const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electronAPI', {
  openFile: () => ipcRenderer.invoke('dialog:openFile'),
  updateKMK: () => ipcRenderer.invoke('updateLocalKMKcopy'),
  saveKeymap: (data) => ipcRenderer.send('saveKeymap', data),
  onUpdateKmkProgress: (callback) => ipcRenderer.on('update-kmk-progress', callback)
})
// window.addEventListener("DOMContentLoaded", () => {
//   const replaceText = (selector, text) => {
//     const element = document.getElementById(selector);
//     if (element) element.innerText = text;
//   };
//   for (const type of ["chrome", "node", "electron"]) {
//     replaceText(`${type}-version`, process.versions[type]);
//   }
// });
