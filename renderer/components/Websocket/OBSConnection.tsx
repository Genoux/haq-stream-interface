import React from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from "@/components/ui/use-toast";
import { useOBS } from '@/contexts/OBSContext';

const OBSConnection = ({ selectedTeams }) => {
  const { connectToOBS, disconnectOBS, obs } = useOBS();
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
    <div>
      {obs ? (
        <Button onClick={disconnectOBS}>Disconnect from OBS</Button>
      ) : (
        <Button size='sm' onClick={initiateConnection} disabled={selectedTeams.length !== 2}>
          Connect to OBS
        </Button>
      )}
    </div>
  );
};

export default OBSConnection;
