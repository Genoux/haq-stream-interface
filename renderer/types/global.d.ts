interface IpcHandler {
  send(channel: string, value: unknown): void;
  on(channel: string, callback: (...args: unknown[]) => void): () => void;
}

interface ElectronAPI { 
  openLink(url: any): unknown;
  closeWindow: () => void;
}

declare global {
  interface Window {
    ipc: IpcHandler;
    electron: ElectronAPI;
  }
}

export interface Hero {
  id: string;
  name: string;
  selected: boolean;
}

export interface Team {
  id: string;
  color: string;
  name: string;
  room: string;
  heroes_selected: Hero[];
  heroes_ban: Hero[];
}
export interface Room {
  id: string;
  blue: Team;
  red: Team;
  gameType: string;
  blueScore: boolean[];
  redScore: boolean[];
  created_at: string;
  status: string;
}

export {};
