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
    description: "Hownling Abyss Quebec website",
    type: "Frontend"
  },
  {
    name: "Tournois HAQ Database",
    host: "sdedknsmucuwsvgfxrxs.supabase.co",
    port: 80,
    status: null,
    description: "Hownling Abyss Quebec database for ADP and Registering teams",
    type: "Backend"
  },
  {
    name: "Inscriptions HAQ",
    host: "inscription.tournoishaq.ca",
    port: 80,
    status: null,
    description: "Registration website for HAQ tournaments",
    type: "Frontend"
  },
  {
    name: "Aram Draft Pick",
    host: "draft.tournoishaq.ca",
    port: 80,
    status: null,
    description: "Aram Draft Pick website for HAQ tournaments",
    type: "Frontend"
  },
  {
    name: "ADP - Backend",
    host: "adpb.tournoishaq.ca",
    port: 80,
    status: null,
    description: "Backend server for ADP",
    type: "Backend"
  },
  {
    name: "Bot - Backend",
    host: "bot.tournoishaq.ca",
    port: 80,
    status: null,
    description: "Bot for Howling Abyss Quebec discord",
    type: "Backend"
  },
  {
    name: "Prize HAQ",
    host: "prize.tournoishaq.ca",
    port: 80,
    status: null,
    description: "Prize generator for live tournament stream",
    type: "Frontend"
  },
  {
    name: "OBS",
    host: "localhost",
    port: 4455,
    status: null,
    description: "Live stream websocket OBS",
    type: "OBS"
  },
  {
    name: "Rules",
    host: "reglements.tournoishaq.ca",
    port: 80,
    status: null,
    description: "Howling Abyss Quebec rules website",
    type: "Frontend"
  },
];

export default servers;
