import React, { useEffect, useState } from 'react';
import { supabase_ttm } from '@/utils/supabase/client';
import TeamItem from '@/components/TeamItem';
import SelectedTeams from '@/components/SelectedTeams';
import { Button } from '@/components/ui/button';
import { useToast } from "@/components/ui/use-toast"
import Loading from '@/components/Loading';
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { useOBS } from '@/contexts/OBSContext';

const WebsocketPage = () => {
  const [teams, setTeams] = useState([]);
  const [selectedTeams, setSelectedTeams] = useState([]);
  const { toast } = useToast()
  const { obs, connectToOBS, disconnectOBS, teamsConnected, loading, error: obsError } = useOBS();

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const { data, error } = await supabase_ttm.from('teams').select('id, name, color');
        if (error) throw error;
        setTeams(data);
      } catch (error) {
        console.error('Error fetching connected teams:', error);
      }
    };
    fetchTeams();
  }, []);

  const handleValueChange = (newSelectedIds) => {
    const latestSelectedTeams = newSelectedIds.slice(-2).map(id => teams.find(team => team.id === id));
    setSelectedTeams(latestSelectedTeams);
  };

  const initiateConnection = async () => {
    if (selectedTeams.length === 2) {
      if (selectedTeams[0].color === selectedTeams[1].color) {
        toast({
          variant: "destructive",
          title: "Cannot connect two teams with the same color.",
        });
        return;
      }
      const { error } = await connectToOBS(selectedTeams);
      if (error) {
        toast({
          variant: "destructive",
          title: error,
        });
      } else {
        toast({
          variant: "default",
          title: "Connected to OBS",
        });
      }
    } else {
      alert("Please select exactly two teams to connect.");
    }
  };
  

  if (loading) return <Loading />;

  if (!teams.length) {
    return (
      <>
        <p>No data found</p>
      </>
    );
  }

  return (
    <>
      {obs ? (
          <div>
          <Button onClick={disconnectOBS}>Disconnect from OBS</Button>
          <SelectedTeams />
          </div>
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
    </>
  );
};

export default WebsocketPage;
