// contexts/OBSContext.ts
import React, { createContext, useContext, useState, useEffect } from 'react';
import { connectOBS, disconnectOBS } from '@/services/websocket/obsService';

interface OBSContextType {
  obs: any;
  connectToOBS: () => Promise<{ error: string | null }>;
  disconnectOBS: () => void;
  loading: boolean;
  error: string | null;
}

const defaultContextValue: OBSContextType = {
  obs: null,
  connectToOBS: async () => ({ error: null }),
  disconnectOBS: () => { },
  loading: false,
  error: null,
};

const OBSContext = createContext<OBSContextType>(defaultContextValue);

export const OBSProvider = ({ children }) => {
  const [obs, setObs] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initializeOBS = async () => {
      const { error } = await connectToOBS();
      if (error) {
        console.error(error);
      }
    };
    initializeOBS();
    return () => {
      if (obs) {
        disconnectOBS(obs);
      }
    };
  }, []); // Only run on mount and unmount

  const connectToOBS = async () => {
    try {
      setLoading(true);
      const obsInstance = await connectOBS('ws://localhost:4455', '123456');
      setObs(obsInstance);
      console.log("Successfully connected to OBS WebSocket");
      return { error: null };
    } catch (error) {
      console.error('Failed to connect to OBS:', error.message || error);
      const errorMessage = "Failed to connect to OBS. Please check your network and OBS settings.";
      setError(errorMessage);
      return { error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const disconnectOBSConnection = () => {
    if (obs) {
      disconnectOBS(obs);
      setObs(null);
    }
  };

  return (
    <OBSContext.Provider value={{ obs, connectToOBS, disconnectOBS: disconnectOBSConnection, loading, error }}>
      {children}
    </OBSContext.Provider>
  );
};

export const useOBS = () => useContext(OBSContext);
