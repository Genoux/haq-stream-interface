// context/ServerStatusContext.js
import { createContext, useState, useEffect } from "react";
import { ServerInfo } from "@/data/servers"; // Make sure this import path is correct

const ServerStatusContext = createContext({
  servers: [],
  allServersHealthy: true
});

const ServerStatusProvider = ({ children }) => {
  const [servers, setServers] = useState([]);
  const [allServersHealthy, setAllServersHealthy] = useState(true);

  const fetchServerStatuses = async () => {
    try {
      const response = await fetch("/api/server-status");
      return await response.json();
    } catch (error) {
      console.error("Error fetching server statuses:", error);
      return [];
    }
  };

  const updateServerStatuses = async () => {
    const updatedServers = await fetchServerStatuses();
    setServers(updatedServers);

    const allHealthy = updatedServers.every(server => server.status);
    setAllServersHealthy(allHealthy);
  };

  useEffect(() => {
    updateServerStatuses();
    const interval = setInterval(updateServerStatuses, 10000); // Set interval to 5 seconds or as required
    return () => clearInterval(interval);
  }, []);

  return (
    <ServerStatusContext.Provider value={{ servers, allServersHealthy }}>
      {children}
    </ServerStatusContext.Provider>
  );
};

export { ServerStatusContext, ServerStatusProvider };
