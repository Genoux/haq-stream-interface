// components/ServerStatusClient.js
import { useContext } from "react";
import { ServerStatusContext } from "@/contexts/ServerStatusContext";
import ServerCard from "./ServerCard";
import Scrollbar from '@/components/common/Scrollbar/Scrollbar';

const ServerStatusList = () => {
  const { servers } = useContext(ServerStatusContext);

  return (
    <div className='-mt-4 flex flex-col h-[93vh]'>
      <Scrollbar>
        <div className="grid grid-cols-3 gap-2 pt-3 pb-8 pr-2">
          {servers.map(server => (
            <ServerCard key={server.name} server={server} />
          ))}
        </div>
      </Scrollbar>
    </div>
  );
};

export default ServerStatusList;
