import TeamItem from '@/components/TeamItem';
import { useEffect, useState } from 'react';
import { supabase_ttm } from '@/utils/supabase/client';
import OBSWebSocket from 'obs-websocket-js';
import Link from 'next/link';
import SelectedTeams from '@/components/SelectedTeams';
import { connected, disconnect } from 'process';

const HomePage = () => {
  const [data, setData] = useState([]);
  const [selectedTeams, setSelectedTeams] = useState([]);
  const [obs, setObs] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data, error } = await supabase_ttm.from('teams').select('*, versus(*)');
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
  }, []);

  const toggleTeamSelection = (team) => {
    const currentIndex = selectedTeams.indexOf(team);
    let newSelectedTeams = [...selectedTeams];

    if (currentIndex !== -1) {
      newSelectedTeams.splice(currentIndex, 1);
    } else {
      if (newSelectedTeams.length >= 2) {
        newSelectedTeams.shift();
      }
      newSelectedTeams.push(team);
    }

    setSelectedTeams(newSelectedTeams);
  };

  const connectOBS = async () => {
    if (selectedTeams.length === 2 && selectedTeams[0].color === selectedTeams[1].color) {
      setError('Cannot connect: both teams have the same color.');
      return;
    }

    if (obs) await obs.disconnect();
    const obsWebSocket = new OBSWebSocket();
    try {
      await obsWebSocket.connect('ws://localhost:4455', '123456');
      console.log('Connected to OBS for selected teams!', selectedTeams);
      setObs(obsWebSocket);
    } catch (error) {
      console.error('Failed to connect to OBS:', error);
      setError('Failed to connect to OBS');
      setObs(null);
    }
  };

  const disconnectOBS = async () => {
    if (obs) await obs.disconnect();
    console.log('Disconnected from OBS');
    setSelectedTeams([]);
    setObs(null);
  };

  useEffect(() => {
    if (obs) {
      obs.on('ConnectionClosed', async (data) => {
        await obs.disconnect();
        setSelectedTeams([]);
        console.log('Connection closed:', data);
        setObs(null);
      });
    }
  }
  , [obs]);

  if (loading) return <p>Loading...</p>;

  if (!data.length) return <p>No data found</p>;

  return (
    <div>
      <h1>OBS WebSocket Control</h1>
      <p>Error: {error}</p>
      {obs ? (
        <>
          <Link href={`/obs`} className='border p-4'>Home</Link>
          <SelectedTeams teams={selectedTeams} obs={obs} isConnected={connected} />
          <button onClick={disconnectOBS}>Disconnect from OBS</button>
        </>
      ) : (
        <>
          <Link href={`/home`} className='border p-4'>Home</Link>
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
            <button onClick={connectOBS}>Connect to OBS</button>
          )}
        </>
      )}
    </div>
  );
};

export default HomePage;
