// components/GlobalStatusDot.js
import { useContext } from "react";
import { ServerStatusContext } from "@/contexts/ServerStatusContext";
import { motion } from "framer-motion";

interface ServerStatusDotProps {
  serverStatus?: boolean; // Use `boolean` if the status is a simple true/false
}

const ServerStatusDot = ({ serverStatus }: ServerStatusDotProps) => {
  const { allServersHealthy } = useContext(ServerStatusContext);

  // Determine the status by checking if serverStatus is defined; if not, use allServersHealthy
  const isHealthy = serverStatus !== undefined ? serverStatus : allServersHealthy;

  return (
    <div className="flex justify-center items-center">
      <div className="relative h-4 w-4">
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: [0, 1.6], opacity: [0, 0.5, 0] }}
          transition={{
            duration: 2,
            repeat: Infinity,
            repeatType: "loop",
          }}
          className={`w-4 h-4 ${isHealthy ? "bg-green-500" : "bg-red-500"
            } rounded-full absolute inset-0 m-auto`}
        />
        <div className={`w-3 h-3 ${isHealthy ? "bg-green-500" : "bg-red-500"
          } rounded-full absolute inset-0 m-auto`} />
      </div>
    </div>
  );
};

export default ServerStatusDot;
