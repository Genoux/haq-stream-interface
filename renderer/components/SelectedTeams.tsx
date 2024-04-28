
import React, { useEffect, useState } from 'react';
import { supabase } from '@/utils/supabase/client';
import HeroesSelected from '@/components/HeroesSelected';

interface SelectedTeamProps {
  team: {
    [key: string]: any;
  };
  obs: any;
  isConnected: boolean;
}

interface Team {
  [key: string]: any;
}

const SelectedTeams = ({ teams, obs, isConnected }) => {
  console.log("SelectedTeams - teams:", teams);
  // Extract the 'blue' and 'red' team objects from the teams array
  const teamBlue = teams.find((team: Team) => team.color === 'blue')
  const teamRed = teams.find((team: Team) => team.color === 'red')
  const [blue, setBlue] = useState(null);
  const [red, setRed] = useState(null);


  useEffect(() => {
    setBlue(teamBlue);
    setRed(teamRed);
  }, []);

  
  
  // Helper function to subscribe to team updates
  const subscribeToTeam = (team: Team) => {
    console.log("subscribeToTeam - team:", team);
    const teamId = team.id;
    const channelName = `team_updates_${teamId}`;

    const channel = supabase
      .channel(channelName)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'live_tournament',
          table: 'teams',
          filter: `id=eq.${teamId}`,
        },
        (payload) => {
          console.log(`Update received for ${team.color}:`, payload.new);
          if (team.color === 'blue') {
            setBlue(payload.new);
          }
          if (team.color === 'red') {
            setRed(payload.new);
          }
        }
      )
      .subscribe(() => {
        console.log(`Subscribed to ${team.color} updates.`);
      });

    return () => {
      channel.unsubscribe();
      console.log(`Unsubscribed from ${team.color} updates.`);
    };
  };

  useEffect(() => {
    const unsubscribeBlue = subscribeToTeam(teamBlue);
    const unsubscribeRed = subscribeToTeam(teamRed);

    // Clean up function to unsubscribe when the component unmounts or teams change
    return () => {
      unsubscribeBlue();
      unsubscribeRed();
    };
  }, []);  // Re-subscribe when team IDs change


  if(!blue || !red) return null;

  return (
    <div>
      <div >{blue.color}{blue.name}</div>  
      <HeroesSelected heroes={blue.heroes_selected} obs={obs} color={blue.color} />
      <div >{red.color}{red.name}</div>  
      <HeroesSelected heroes={red.heroes_selected} obs={obs} color={red.color} />
    </div>
  );
};

export default SelectedTeams;
