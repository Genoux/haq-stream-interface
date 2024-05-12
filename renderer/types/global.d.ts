// global.d.ts
interface ElectronAPI {
  openLink: (url: string) => void;
}

interface Window {
  electron: ElectronAPI;
}
