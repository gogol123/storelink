import { contextBridge, ipcRenderer } from 'electron';

// --------- Expose some API to the Renderer process ---------
contextBridge.exposeInMainWorld('electronAPI', {
  bringWindowToFront: () => ipcRenderer.send('bring-window-to-front'),
  openExternalLink: (url: string) => ipcRenderer.send('open-external-link', url),
});
