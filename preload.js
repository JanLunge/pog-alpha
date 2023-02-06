const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electronAPI', {
  openFile: () => ipcRenderer.invoke('dialog:openFile'),
  updateKMK: () => ipcRenderer.invoke('updateLocalKMKcopy'),
  saveKeymap: (data) => ipcRenderer.send('saveKeymap', data),
  onUpdateKmkProgress: (callback) => ipcRenderer.on('update-kmk-progress', callback)
})