// components/ObsDotStatus.js
import React, { useEffect, useState } from 'react';
import { useOBS } from '@/contexts/OBSContext'; // If you choose to use the context directly

const ObsDotStatus = () => {
  const { obs, teamsConnected } = useOBS();  // Use context directly if more convenient
  const [status, setStatus] = useState(false);  // Initialize status to false
    const isActive = !!obs;  // Convert obs to boolean: true if connected, false if not
  useEffect(() => {
    console.log("ObsDotStatus - isActive:", isActive);

    if (teamsConnected.length > 0) {
      setStatus(true);
    } else {
      setStatus(false);
    }
  }, [teamsConnected]);
    return (
        <>
            {status ? (
                <div className="bg-green-500 h-2 w-2 rounded-full animate-pulse"></div>
            ) : (
                <div className="bg-red-500 h-2 w-2 rounded-full"></div>
            )}
        </>
    );
};

export default ObsDotStatus;
