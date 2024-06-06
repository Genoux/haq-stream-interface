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
  blue: Team;
  red: Team;
  id: number;
  status: string;
  blueScore: boolean[];
  redScore: boolean[];
}

interface OBSContextType {
  obs: any;
  connectToOBS: (game: any) => Promise<{ error: string | null }>;
  disconnectOBS: () => void;
  game: Game | null;
  loading: boolean;
  error: string | null;
  updateGame: (updates: Partial<Game>) => void;
}

const defaultContextValue: OBSContextType = {
  obs: null,
  connectToOBS: async () => ({ error: null }),
  disconnectOBS: () => {},
  game: null,
  loading: false,
  error: null,
  updateGame: () => {},
};

const OBSContext = createContext<OBSContextType>(defaultContextValue);

export const OBSProvider = ({ children }) => {
  const [obs, setObs] = useState<any>(null);
  const [subscriptions, setSubscriptions] = useState<any[]>([]);
  const [game, setGame] = useState<Game | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const cachedGame = localStorage.getItem('game');
    if (cachedGame) {
      const game: Game = JSON.parse(cachedGame);
      setGame(game);
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

  const updateTeamState = (prevGame: Game, payload: RealtimePostgresUpdatePayload<{ [key: string]: any }>, teamColor: 'blue' | 'red') => {
    if (!prevGame) return prevGame;

    const updatedGame = {
      ...prevGame,
      [teamColor]: {
        ...prevGame[teamColor],
        ...payload.new,
      },
    };
    localStorage.setItem('game', JSON.stringify(updatedGame));
    return updatedGame;
  };

  const subscribeToTeamUpdates = (team: Team, teamColor: 'blue' | 'red') => {
    const subscription = supabase_adp.channel(`team_updates_${team.id}`)
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'aram_draft_pick', table: 'teams', filter: `id=eq.${team.id}` },
        payload => setGame(prevGame => updateTeamState(prevGame, payload, teamColor))
      )
      .subscribe();

    setSubscriptions(prevSubscriptions => [...prevSubscriptions, subscription]);
  };

  const unsubscribeFromTeamUpdates = () => {
    subscriptions.forEach(sub => sub.unsubscribe());
    setSubscriptions([]);
  };

  const connectToOBS = async (room: any) => {
    console.log("connectToOBS - room:", room);
    try {
      setLoading(true);


      const game: Game = {
        title: room.title || 'Match 1',
        gameType: room.gameType || 'bo3',
        blue: room.blue,
        red: room.red,
        id: room.id,
        status: room.status,
        blueScore: room.blueScore || Array(room.gameType === 'bo3' ? 2 : 3).fill(false),
        redScore: room.redScore || Array(room.gameType === 'bo3' ? 2 : 3).fill(false),
      };

      const cachedGame = localStorage.getItem('game');

      const obsInstance = await connectOBS('ws://localhost:4455', '123456');
      setObs(obsInstance);
      subscribeToTeamUpdates(game.blue, 'blue');
      subscribeToTeamUpdates(game.red, 'red');

      setGame(game);
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

  const updateGame = (updates: Partial<Game>) => {
    setGame(prevGame => {
      const updatedGame = prevGame ? { ...prevGame, ...updates } : null;
      if (updatedGame) {
        localStorage.setItem('game', JSON.stringify(updatedGame));
      }
      return updatedGame;
    });
  };

  return (
    <OBSContext.Provider value={{ obs, connectToOBS, disconnectOBS: disconnectOBSConnection, game, loading, error, updateGame }}>
      {children}
    </OBSContext.Provider>
  );
};

export const useOBS = () => useContext(OBSContext);
