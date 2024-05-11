// pages/api/server-status.ts
import type { NextApiRequest, NextApiResponse } from "next";
import serversList, { ServerInfo } from "@/data/servers";
import net from "net";

const pingServerPort = (host: string, port: number): Promise<boolean> => {
  return new Promise((resolve) => {
    const socket = new net.Socket();
    socket.setTimeout(2000); // 2 seconds timeout

    socket.on("connect", () => {
      socket.destroy();
      resolve(true);
    });

    socket.on("timeout", () => {
      socket.destroy();
      resolve(false);
    });

    socket.on("error", () => {
      resolve(false);
    });

    socket.connect(port, host);
  });
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ServerInfo[]>
) {
  // Create a copy of the servers list to update statuses
  const updatedServersList = await Promise.all(
    serversList.map(async (server) => {
      const isOnline = await pingServerPort(server.host, server.port);
      return { ...server, status: isOnline };
    })
  );

  res.status(200).json(updatedServersList);
}
