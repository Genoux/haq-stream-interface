import React, { createContext, useContext, useState, useEffect } from 'react';
import { connectOBS, disconnectOBS } from '@/services/websocket/obsConnection';
import { supabase_ttm } from '@/utils/supabase/client';
import { RealtimePostgresUpdatePayload } from '@supabase/supabase-js';

type Hero = {
  id: string;
  name: string;
  selected: boolean;
};

interface Team {
  id: string;
  color: string;
  name: string;
  heroes_selected: Hero[]
}

interface OBSContextType {
  obs: any;
  connectToOBS: (selectedTeams: Team[]) => Promise<{ error: string | null }>;
  disconnectOBS: () => void;
  connectedTeams: Team[];
  loading: boolean;
  error: string | null;
}

const defaultContextValue: OBSContextType = {
  obs: null,
  connectToOBS: async () => ({ error: null }),
  disconnectOBS: () => {},
  connectedTeams: [],
  loading: false,
  error: null,
};

const OBSContext = createContext<OBSContextType>(defaultContextValue);

export const OBSProvider = ({ children }) => {
  const [obs, setObs] = useState<any>(null);
  const [subscriptions, setSubscriptions] = useState<any[]>([]);
  const [connectedTeams, setConnectedTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchConnectedTeams = async (teams: Team[]) => {
    try {
      const teamsArray: { [key: string]: Team } = teams.reduce((acc, team) => {
        acc[team.color] = team;
        return acc;
      }, {});

      const { blue, red } = teamsArray;
      setConnectedTeams([blue, red]);
    } catch (error) {
      console.error('Error fetching connected teams:', error);
    }
  };

  const updateTeamsState = (prevTeams: Team[], payload: RealtimePostgresUpdatePayload<{ [key: string]: any }>) => 
    prevTeams.map(team => team.id === payload.new.id ? { ...team, ...payload.new } : team);

  const subscribeToTeamUpdates = (teams: Team[]) => {
    const newSubscriptions = teams.map(team => 
      supabase_ttm.channel(`team_updates_${team.id}`)
        .on('postgres_changes', { event: 'UPDATE', schema: 'live_tournament', table: 'teams', filter: `id=eq.${team.id}` },
          payload => setConnectedTeams(prev => updateTeamsState(prev, payload))
        )
        .subscribe()
    );
    setSubscriptions(newSubscriptions);
  };

  const unsubscribeFromTeamUpdates = () => {
    subscriptions.forEach(sub => sub.unsubscribe());
    setSubscriptions([]);
  };

  const connectToOBS = async (selectedTeams: Team[]) => {
    try {
      setLoading(true);
      const obsInstance = await connectOBS('ws://localhost:4455', '123456');
      setObs(obsInstance);
      subscribeToTeamUpdates(selectedTeams);
      await fetchConnectedTeams(selectedTeams);
      localStorage.setItem('connectedTeams', JSON.stringify(selectedTeams));
      return { error: null };
    } catch (error) {
      console.error('Failed to connect to OBS:', error);
      const errorMessage = "Failed to connect to OBS. Please check your network and OBS settings.";
      setError(errorMessage);
      return { error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const disconnectOBSConnection = () => {
    disconnectOBS(obs);
    unsubscribeFromTeamUpdates();
    setObs(null);
    setConnectedTeams([]);
    localStorage.removeItem('connectedTeams');
  };

  useEffect(() => {
    const cachedTeams = localStorage.getItem('connectedTeams');
    if (cachedTeams) {
      const teams: Team[] = JSON.parse(cachedTeams);
      connectToOBS(teams);
    }

    const handleConnectionClosed = () => {
      console.log("Connection to OBS was closed.");
      disconnectOBSConnection();
    };

    if (obs) {
      obs.on('ConnectionClosed', handleConnectionClosed);
    }

    return () => {
      if (obs) {
        obs.off('ConnectionClosed', handleConnectionClosed);
        obs.disconnect();
      }
      unsubscribeFromTeamUpdates();
    };
  }, []); // Only run on mount and unmount

  return (
    <OBSContext.Provider value={{ obs, connectToOBS, disconnectOBS: disconnectOBSConnection, connectedTeams, loading, error }}>
      {children}
    </OBSContext.Provider>
  );
};

export const useOBS = () => useContext(OBSContext);
