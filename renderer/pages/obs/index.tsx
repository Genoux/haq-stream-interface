// pages/index.js
import OBSControl from '@/components/OBSControl';
import { useEffect, useState } from 'react';
import { supabase_ttm, supabase } from '@/utils/supabase/client';
import OBSWebSocket from 'obs-websocket-js';
import Link from 'next/link';

const HomePage = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentTeamId, setCurrentTeamId] = useState(null);
  const [obs, setObs] = useState(null);

  const fetchData = async () => {
    try {
      const { data, error } = await supabase_ttm.from('teams').select('*, versus(*)');
      if (error) throw error;
      console.log('Data fetched:', data);
      const filteredData = filterUniqueMatchups(data);
      console.log('Filtered Data:', filteredData);
      //setData(filteredData);
      setData(data);
    } catch (error) {
      console.error('Error fetching data:', error);
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const connectOBS = async (teamId) => {
    if (currentTeamId === teamId) {
      console.log("Already connected to this team's OBS.");
      return;
    }
    if (obs) {
      await obs.disconnect();
      console.log('Disconnected previous OBS connection.');


    }
    const obsWebSocket = new OBSWebSocket();
    try {
      await obsWebSocket.connect('ws://localhost:4455', '123456');
      console.log('Connected to OBS!');
      setObs(obsWebSocket);
      setCurrentTeamId(teamId);

    } catch (error) {
      console.error('Failed to connect to OBS:', error);
      setObs(null);
      setCurrentTeamId(null);
    }
  };

  const disconnectOBS = async () => {
    if (obs) {
      await obs.disconnect();
      console.log('Disconnected from OBS');
      setObs(null);
      setCurrentTeamId(null);
    }
  };

  if (obs) {
    obs.on('ConnectionClosed', async (data) => {
      await obs.disconnect();
      setCurrentTeamId(null);
      console.log('Connection closed:', data);
      setObs(null);
    });
  }

  const subscribeToTeam = () => {

    const channel = supabase
      .channel('channelName')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'live_tournament',
          table: 'teams',
        },
        (payload) => {
          console.log("subscribeToTeam - payload:", payload);
          // Here you can handle the state update or call any function based on the new payload
          // setData(payload.new as any);
          fetchData()
        }
      )
      .subscribe();
    return () => {
      channel.unsubscribe();
    };
  };


  subscribeToTeam()

  const filterUniqueMatchups = (teams) => {
    let matchups = [];
    let uniqueMatchups = {};

    teams.forEach(team => {
      const opponent = team.versus;
      if (opponent) {
        let matchupKey = `${Math.min(team.id, opponent.id)}-${Math.max(team.id, opponent.id)}`;
        if (!uniqueMatchups[matchupKey]) {
          const isTeamBlue = team.color === 'blue';
          const isOpponentBlue = opponent.color === 'blue';
          let team1 = isTeamBlue ? team : (isOpponentBlue ? opponent : (team.id < opponent.id ? team : opponent));
          let team2 = (team1 === team) ? opponent : team;

          uniqueMatchups[matchupKey] = {
            id: matchupKey,
            blue: team1,
            red: team2,
            updated_at: team.updated_at > opponent.updated_at ? team.updated_at : opponent.updated_at // Taking the most recent update
          };
        }
      }
    });

    // Convert object to array and sort by 'updated_at'
    matchups = Object.values(uniqueMatchups);
    matchups.sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()); // Sort descending

    return matchups;
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error loading data</p>;
  if (!data.length) return <p>No data found</p>;

  return (
    <div>
      <h1>OBS WebSocket Control</h1>
      <Link href={`/home`} className='border p-4' >home</Link>
      <div className='flex flex-col gap-2'>
        {data.map(team => (
            <OBSControl
              key={team.id}
              team={team}
              obs={obs}
              isConnected={currentTeamId === team.id}
              connect={() => connectOBS(team.id)}
              disconnect={disconnectOBS}
            />
        ))}
      </div>

    </div>
  );
};

export default HomePage;
