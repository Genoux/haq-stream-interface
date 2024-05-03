import React, { createContext, useContext, useState, useEffect } from 'react';
import OBSWebSocket from 'obs-websocket-js';
import { supabase_ttm } from '@/utils/supabase/client';

const OBSContext = createContext(null);

export const OBSProvider = ({ children }) => {
  const [obs, setObs] = useState(null);
  const [teams, setTeams] = useState([]);
  const [subscriptions, setSubscriptions] = useState([]);
  const [teamsConnected, setTeamsConnected] = useState([]);

  const fetchConnectedTeams = async (teams) => {
    const teamsMap = teams.reduce((acc, team) => ({ ...acc, [team.color]: team }), {});
    const { blue, red } = teamsMap;
    try {
      const { data: blueTeam, error } = await supabase_ttm.from('teams').select('*').eq("id", blue.id);
      console.log("fetchConnectedTeams - blueTeam:", blueTeam);
      const { data: redTeam, error: error2 } = await supabase_ttm.from('teams').select('*').eq("id", red.id);
      console.log("fetchConnectedTeams - redTeam:", redTeam);
      if (error) throw error;

      // merge teams
      const data = [
        { ...blue, ...blueTeam[0] },
        { ...red, ...redTeam[0] },
      ];
      //setTeams(data);
      setTeamsConnected(data);
    } catch (error) {
      console.error('Error fetching connected teams:', error);
    }
  };

  const updateTeamsState = (prevTeams, payload) => prevTeams.map(team =>
    team.id === payload.new.id ? { ...team, ...payload.new } : team
  );

  const subscribeToTeamUpdates = (teams) => {
    const newSubscriptions = teams.map(team => supabase_ttm.channel(`team_updates_${team.id}`)
      .on('postgres_changes', {
        event: 'UPDATE',
        schema: 'live_tournament',
        table: 'teams',
        filter: `id=eq.${team.id}`,
      }, payload => {
        setTeams(prev => updateTeamsState(prev, payload));
        setTeamsConnected(prev => updateTeamsState(prev, payload));
      })
      .subscribe());
    setSubscriptions(newSubscriptions);
  };

  const unsubscribeFromTeamUpdates = () => {
    subscriptions.forEach(sub => sub.unsubscribe());
    setSubscriptions([]);
  };

  const connectToOBS = async (selectedTeams: { blue: string, red: string}) => {
    console.log("connectToOBS - selectedTeams:", selectedTeams);
    const obsWebSocket = new OBSWebSocket();
    try {
      await obsWebSocket.connect('ws://localhost:4455', '123456');
      setObs(obsWebSocket);
     // setTeamsConnected(selectedTeams);
      subscribeToTeamUpdates(selectedTeams);
      await fetchConnectedTeams(selectedTeams); // Ensure connected teams are updated upon connection
    } catch (error) {
      console.error('Failed to connect to OBS:', error);
    }
  };

  const disconnectOBS = () => {
    if (obs) {
      obs.disconnect();
      unsubscribeFromTeamUpdates();
      setObs(null);
      //setTeams([]);
      setTeamsConnected([]);
    }
  };

  useEffect(() => {
    //fetchConnectedTeams();
    const handleConnectionClosed = async () => {
      console.log("Connection to OBS was closed.");
      //await fetchConnectedTeams(); // Fetch latest connected teams from the database
      disconnectOBS();
    };

    const obsConnection = obs?.on('ConnectionClosed', handleConnectionClosed);

    return () => {
      obs?.disconnect();
      unsubscribeFromTeamUpdates();
      obsConnection?.disconnect(); // Ensure to cleanup the event listener
    };
  }, [obs]);

  return (
    <OBSContext.Provider value={{ obs, connectToOBS, disconnectOBS, teams, teamsConnected }}>
      {children}
    </OBSContext.Provider>
  );
};

export const useOBS = () => useContext(OBSContext);
