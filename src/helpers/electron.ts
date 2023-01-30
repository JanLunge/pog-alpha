export const openFolderModal = async () => {
  return await (window as any).electronAPI.openFile();
};
