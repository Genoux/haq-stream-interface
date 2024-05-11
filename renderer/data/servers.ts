// data/servers.ts
export type ServerInfo = {
  name: string;
  host: string;
  port: number;
  status: boolean | null;
  description?: string;
  type?: string;
};

const servers: ServerInfo[] = [
  {
    name: "Tournois HAQ - Website",
    host: "tournoishaq.ca",
    port: 80,
    status: null,
    description: "Live server for production",
    type: "Frontend"
  },
  {
    name: "Tournois HAQ Database",
    host: "sdedknsmucuwsvgfxrxs.supabase.co",
    port: 80,
    status: null,
    description: "Live server for production",
    type: "Backend"
  },
  {
    name: "Inscriptions HAQ",
    host: "inscription.tournoishaq.ca",
    port: 80,
    status: null,
    description: "Local server for development",
    type: "Frontend"
  },
  {
    name: "Aram Draft Pick",
    host: "draft.tournoishaq.ca",
    port: 80,
    status: null,
    description: "Local server for development",
    type: "Frontend"
  },
  {
    name: "ADP - Backend",
    host: "adpb.tournoishaq.ca",
    port: 80,
    status: null,
    description: "Local server for development",
    type: "Backend"
  },
  {
    name: "Bot - Backend",
    host: "bot.tournoishaq.ca",
    port: 80,
    status: null,
    description: "Local server for development",
    type: "Backend"
  },
  {
    name: "Prize HAQ",
    host: "prize.tournoishaq.ca",
    port: 80,
    status: null,
    description: "Local server for development",
    type: "Frontend"
  },
  {
    name: "OBS",
    host: "localhost",
    port: 4455,
    status: null,
    description: "Local server for development",
    type: "OBS"
  },
];

export default servers;
