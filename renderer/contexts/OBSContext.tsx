// contexts/OBSContext.ts
import React, { createContext, useEffect, useContext, useState } from 'react';
import { connectOBS, disconnectOBS } from '@/services/websocket/obsService';

interface OBSContextType {
  obs: any;
  connectToOBS: (url: string) => Promise<{ error: string | null }>;
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

  const connectToOBS = async (url: string) => {
    console.log("connectToOBS - url:", url);
    try {
      setLoading(true);
      const obsInstance = await connectOBS(url, '12345');
      setObs(obsInstance);
      console.log("Successfully connected to OBS WebSocket");
      setError(null); // Reset error state on successful connection
      return { error: null };
    } catch (err) {
      const errorMessage = "Failed to connect to OBS. Please check your network and OBS settings.";
      console.error(errorMessage, err);
      setError(errorMessage);
      return { error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (obs) {
      obs.on('ConnectionClosed', (err) => {
        console.error('OBS WebSocket error:', err);
        setError(err.message);
        disconnectOBSConnection();
      });
    }
  }, [obs]);

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
