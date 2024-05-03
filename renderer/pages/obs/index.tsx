import React, { useEffect, useState } from 'react';
import { supabase, supabase_ttm } from '@/utils/supabase/client';
import TeamItem from '@/components/TeamItem';
import OBSWebSocket from 'obs-websocket-js';
import Link from 'next/link';
import SelectedTeams from '@/components/SelectedTeams';
import { Button } from '@/components/ui/button';
import { useToast } from "@/components/ui/use-toast"
import Loading from '@/components/Loading';
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { useOBS } from '@/contexts/OBSContext';



const HomePage = () => {
  const [teams, setTeams] = useState([]);
  const [selectedTeams, setSelectedTeams] = useState([]);
  const [loading, setLoading] = useState(false);
  const [connectionError, setconnectionError] = useState("");
  const [error, setError] = useState("");
  const { toast } = useToast()
  const { obs, connectToOBS, disconnectOBS, teamsConnected } = useOBS();

  const fetchTeams = async () => {
    try {
      const { data, error } = await supabase_ttm.from('teams').select('id, name, color');
      if (error) throw error;
      setTeams(data);
    } catch (error) {
      console.error('Error fetching connected teams:', error);
    }
  };

  
  useEffect(() => {
    fetchTeams();
  }, []);

//   useEffect(() => {
//     if (obs) {
//         console.log("Connected to OBS");
//         setData(teamsConnected);
//     } else {
//         console.error("Disconnected from OBS");
//         setData([]);
//     }
// }, [obs, teamsConnected]);

  const handleValueChange = (newSelectedIds) => {
    const latestSelectedTeams = newSelectedIds.slice(-2).map(id => teams.find(team => team.id === id));
    setSelectedTeams(latestSelectedTeams);
  };

  const initiateConnection = () => {
    if (selectedTeams.length === 2) {
      if (selectedTeams[0].color === selectedTeams[1].color) {
        toast({
          variant: "destructive",
          title: "Cannot connect two teams with the same color.",
        })
        return;
      }
      console.log("initiateConnection - selectedTeams:", selectedTeams);
    connectToOBS(selectedTeams);
    } else {
      alert("Please select exactly two teams to connect.");
    }
  };

  if (loading) return <Loading />;
  if (connectionError) return (
    <>
      <Link href={`/home`} className='border p-4'>Go to OBS</Link>
      <p>{"Can't connect to OBS"}</p>
    </>
  );

  if (!teams.length) {
    return (
      <>
        <Link href={`/home`} className='border p-4'>Go to Home</Link>
        <p>No data found</p>
      </>
    );
  }

  return (
    <div>
      <h1>OBS WebSocket Control</h1>
      {obs ? <p>Connected to OBS</p> : <p>Not connected to OBS</p>}
      <Link href={'/home'}><Button>Home</Button></Link>
      {obs ? (
        <>
          <Button onClick={disconnectOBS}>Disconnect from OBS</Button>
          <SelectedTeams />
        </>
      ) : (
        <div className='flex flex-col gap-2'>
          <ToggleGroup
            type="multiple"
            value={selectedTeams.map(team => team.id)}
            onValueChange={handleValueChange}
            className='flex flex-col'
          >
            {teams.map(team => (
              <ToggleGroupItem key={team.id} value={team.id} className='w-fit justify-start'>
                <TeamItem
                  team={team}
                  isSelected={selectedTeams.some(t => t.id === team.id)}
                />
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
          {selectedTeams.length === 2 && (
            <Button onClick={initiateConnection}>Connect to OBS</Button>
          )}
        </div>
      )}
    </div>
  );
};

export default HomePage;
