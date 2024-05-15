import React from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from "@/components/ui/use-toast";
import { useOBS } from '@/contexts/OBSContext';
import Loading from '../Loading';

const OBSConnection = ({ selectedTeams }) => {
  const { connectToOBS, disconnectOBS, obs, loading } = useOBS();
  const { toast } = useToast();

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

  return (
    <>
      {obs ? (
        <Button size='sm' variant="outline" onClick={disconnectOBS}>Disconnect</Button>
      ) : (
        <Button size='sm' onClick={initiateConnection} disabled={loading || selectedTeams.length < 2 } variant={`${loading || selectedTeams.length < 2 ? 'outline' : 'default'}`}>
            {loading ? <Loading text='connecting'  />: "Connect to OBS"}
        </Button>
      )}
    </>
  );
};

export default OBSConnection;
