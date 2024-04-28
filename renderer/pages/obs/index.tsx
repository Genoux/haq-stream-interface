import OBSControl from '@/components/OBSControl';
import { useEffect, useState } from 'react';
import { supabase_ttm } from '@/utils/supabase/client';
import OBSWebSocket from 'obs-websocket-js';
import Link from 'next/link';

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
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const toggleTeamSelection = (teamId) => {
    const currentIndex = selectedTeams.indexOf(teamId);
    let newSelectedTeams = [...selectedTeams];

    if (currentIndex !== -1) {
        // Deselect the team if it's already selected
        newSelectedTeams.splice(currentIndex, 1);
    } else {
        // Select a new team
        if (newSelectedTeams.length >= 2) {
            // Remove the first team in the list to make room for the new selection
            newSelectedTeams.shift();
        }
        newSelectedTeams.push(teamId);
    }

    setSelectedTeams(newSelectedTeams);
};

  const connectOBS = async () => {
    if (obs) await obs.disconnect();
    const obsWebSocket = new OBSWebSocket();
    try {
      await obsWebSocket.connect('ws://localhost:4455', '123456');
      console.log('Connected to OBS for selected teams!');
      setObs(obsWebSocket);
    } catch (error) {
      console.error('Failed to connect to OBS:', error);
      setObs(null);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error loading data</p>;
  if (!data.length) return <p>No data found</p>;

  return (
    <div>
      <h1>OBS WebSocket Control</h1>
      <Link href={`/home`} className='border p-4' >Home</Link>
      <div className='flex flex-col gap-2'>
        {data.map(team => (
          <OBSControl
            key={team.id}
            team={team}
            isSelected={selectedTeams.includes(team.id)}
            toggleSelection={() => toggleTeamSelection(team.id)}
          />
        ))}
      </div>
      {selectedTeams.length === 2 && (
        <button onClick={connectOBS}>Connect to OBS</button>
      )}
    </div>
  );
};

export default HomePage;
