interface IpcHandler {
  send(channel: string, value: unknown): void;
  on(channel: string, callback: (...args: unknown[]) => void): () => void;
}

interface ElectronAPI {
  closeWindow: () => void;
}

declare global {
  interface Window {
    ipc: IpcHandler;
    electron: ElectronAPI;
  }
}

export {};
