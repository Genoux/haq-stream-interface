import React, { createContext, useContext, useState, useEffect } from 'react';
import { connectOBS, disconnectOBS } from '@/services/websocket/obsConnection';
import { supabase_adp } from '@/utils/supabase/client';
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
  room: string;
  heroes_selected: Hero[];
  heroes_ban: Hero[];
}

interface Game {
  title: string;
  gameType: string;
  teams: Team[];
  id: number;
  status: string;
  //created_at: string;
  //cycle: number;
  //heroes_pool: Hero[];
  //name: string;
  //ready: boolean;
}

interface OBSContextType {
  obs: any;
  connectToOBS: (game: any) => Promise<{ error: string | null }>;
  disconnectOBS: () => void;
  game: Game | null;
  loading: boolean;
  error: string | null;
  updateGameTitle: (title: string) => void;
  updateGameType: (gameType: string) => void;
}

const defaultContextValue: OBSContextType = {
  obs: null,
  connectToOBS: async () => ({ error: null }),
  disconnectOBS: () => {},
  game: null,
  loading: false,
  error: null,
  updateGameTitle: () => {},
  updateGameType: () => {},
};

const OBSContext = createContext<OBSContextType>(defaultContextValue);

export const OBSProvider = ({ children }) => {
  const [obs, setObs] = useState<any>(null);
  const [subscriptions, setSubscriptions] = useState<any[]>([]);
  const [game, setGame] = useState<Game | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const initializeGame = async (game: Game) => {
    try {
      setGame(game);
    } catch (error) {
      console.error('Error initializing game:', error);
    }
  };

  const updateTeamsState = (prevTeams: Team[], payload: RealtimePostgresUpdatePayload<{ [key: string]: any }>) =>
    prevTeams.map(team => team.id === payload.new.id ? { ...team, ...payload.new } : team);

  const subscribeToTeamUpdates = (teams: Team[]) => {
    const newSubscriptions = teams.map(team =>
      supabase_adp.channel(`team_updates_${team.id}`)
        .on('postgres_changes', { event: 'UPDATE', schema: 'aram_draft_pick', table: 'teams', filter: `id=eq.${team.id}` },
          payload => setGame(prevGame => {
            if (!prevGame) return prevGame;
            return {
              ...prevGame,
              teams: updateTeamsState(prevGame.teams, payload),
            };
          })
        )
        .subscribe()
    );
    setSubscriptions(newSubscriptions);
  };

  const unsubscribeFromTeamUpdates = () => {
    subscriptions.forEach(sub => sub.unsubscribe());
    setSubscriptions([]);
  };

  const connectToOBS = async (Room: any) => {
    try {
      setLoading(true);
      
      await disconnectOBSConnection();
      // Validate the Room object and ensure teams are defined
      if (!Room.blue || !Room.red) {
        throw new Error('Teams are not properly defined in the Room object');
      }
      
      // Transform the Room object to match the Game type
      const game: Game = {
        title: Room.title || 'Match 1',
        gameType: Room.gameType || 'bo3',
        teams: [Room.blue, Room.red],
        id: Room.id,
        status: Room.status
      };
      
      const obsInstance = await connectOBS('ws://localhost:4455', '123456');
      setObs(obsInstance);
      subscribeToTeamUpdates(game.teams);
      console.log("game.teams:", game.teams);

      await initializeGame(game);
      localStorage.setItem('game', JSON.stringify(game));
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
    disconnectOBS(obs);
    unsubscribeFromTeamUpdates();
    setObs(null);
    setGame(null);
    localStorage.removeItem('game');
  };

  const updateGameTitle = (title: string) => {
    setGame(prevGame => prevGame ? { ...prevGame, title } : prevGame);
    if (game) localStorage.setItem('game', JSON.stringify({ ...game, title }));
  };

  const updateGameType = (gameType: string) => {
    setGame(prevGame => prevGame ? { ...prevGame, gameType } : prevGame);
    if (game) localStorage.setItem('game', JSON.stringify({ ...game, gameType }));
  };

  useEffect(() => {
    const cachedGame = localStorage.getItem('game');
    console.log("useEffect - cachedGame:", cachedGame);
    if (cachedGame) {
      const game: Game = JSON.parse(cachedGame);
      connectToOBS(game);
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
        disconnectOBS(obs);
      }
      unsubscribeFromTeamUpdates();
    };
  }, []); // Only run on mount and unmount

  return (
    <OBSContext.Provider value={{ obs, connectToOBS, disconnectOBS: disconnectOBSConnection, game, loading, error, updateGameTitle, updateGameType }}>
      {children}
    </OBSContext.Provider>
  );
};

export const useOBS = () => useContext(OBSContext);
