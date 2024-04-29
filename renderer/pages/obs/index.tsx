import React, { use, useEffect, useState } from 'react';
import { supabase, supabase_ttm } from '@/utils/supabase/client';
import TeamItem from '@/components/TeamItem';
import OBSWebSocket from 'obs-websocket-js';
import Link from 'next/link';
import SelectedTeams from '@/components/SelectedTeams';
import { Button } from '@/components/ui/button';



const HomePage = () => {
  const [data, setData] = useState([]);
  const [selectedTeams, setSelectedTeams] = useState([]);
  const [obs, setObs] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (obs) {
      obs.on('ConnectionClosed', async () => {
        setObs(null);
        setError('Connection to OBS was closed.');
        setSelectedTeams([]);
      });
    }
  }, [obs]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data, error } = await supabase_ttm.from('teams').select('*');
        if (error) throw error;
        setData(data);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    subscribeToTeams();
  }, []);

  // Subscribe to all team updates
  const subscribeToTeams = () => {
    const channel = supabase.channel('*')
      .on('postgres_changes', {
        event: 'UPDATE',
        schema: 'live_tournament',
        table: 'teams',
      }, payload => {
        console.log("Team update received:", payload);
        updateTeamData(payload.new);
      })
      .subscribe(() => {
        console.log("Subscribed to team updates.");
      });

    return () => {
      channel.unsubscribe();
      console.log("Unsubscribed from all team updates.");
    };
  };

  const updateTeamData = (updatedTeam) => {
    setData(prevData => prevData.map(team =>
      team.id === updatedTeam.id ? { ...team, ...updatedTeam } : team
    ));
  };

  const toggleTeamSelection = (team) => {
    setSelectedTeams(prev => {
      const exists = prev.find(t => t.id === team.id);
      return exists ? prev.filter(t => t.id !== team.id) : prev.length >= 2 ? [...prev.slice(1), team] : [...prev, team];
    });
  };

  // Connection function to OBS
  const connectToOBS = () => {
    const uniqueColors = new Set(selectedTeams.map(team => team.color));
    if (uniqueColors.size < selectedTeams.length) {
      setError('Cannot connect two teams with the same color.');
      return;
    }

    const obsWebSocket = new OBSWebSocket();
    setLoading(true);
    obsWebSocket.connect('ws://localhost:4455', '123456')
      .then(() => {
        setObs(obsWebSocket);
        console.log('Connected to OBS!');
        setLoading(false);
      }).catch(error => {
        console.error('Failed to connect to OBS:', error);
        setError('Failed to connect to OBS');
      });
  };

  const disconnectOBS = () => {
    obs.disconnect();
    setObs(null);
  }


  if (loading) return <p>Loading...</p>;
  if (!data.length) return <p>No data found</p>;

  return (
    <div>
      <h1>OBS WebSocket Control</h1>
      {error && <p>{error}</p>}
      {obs ? (
        <>
          <Link href={`/obs`} className='border p-4'>Go to OBS</Link>
          <SelectedTeams teams={selectedTeams} obs={obs} />
          <Button onClick={disconnectOBS}>Disconnect from OBS</Button>
        </>
      ) : (
        <>
          <Link href={`/home`} className='border p-4'>Go to Home</Link>
          <div className='flex flex-col gap-2'>
            {data.map(team => (
              <TeamItem
                key={team.id}
                team={team}
                isSelected={selectedTeams.includes(team)}
                toggleSelection={() => toggleTeamSelection(team)}
              />
            ))}
          </div>
          {selectedTeams.length === 2 && (
            <button onClick={connectToOBS}>Connect to OBS</button>
          )}
        </>
      )}
    </div>
  );
};

export default HomePage;
