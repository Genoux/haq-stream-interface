import { useEffect, useState } from 'react';
import { supabase } from '@/utils/supabase/client';
import HeroesSelected from '@/components/HeroesSelected'; // Make sure the path is correct


interface Team {
  [key: string]: any;
}

const OBSControl = ({ team, obs, isConnected, connect, disconnect }) => {
  const [teamData, setTeamData] = useState(null);


  useEffect(() => {
    setTeamData(team);
  }, [team]);
  // Helper function to subscribe to team updates
  const subscribeToTeam = (team: Team) => {
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
          setTeamData(payload.new);
        }
      )
      .subscribe();

    return () => {
      channel.unsubscribe();
      console.log(`Unsubscribed from ${team.color} updates.`);
    };
  };

  useEffect(() => {
    const unsubscribe = subscribeToTeam(team);

    // Clean up function to unsubscribe when the component unmounts or teams change
    return () => {
      unsubscribe();
    };
  }, [team]);  // Re-subscribe when team IDs change

  return (
    <div className='flex flex-col gap-2 justify-center items-center'>
      {isConnected ? (
        <div className='flex flex-col gap-2'>
          {team.color === 'blue' ? (
            <>
              <div>
                <p>Blue: {team.name}</p>
                <HeroesSelected heroes={team.heroes_selected} obs={obs} color={team.color} />
              </div>
              <div>
                <p>Red: {team.versus.name}</p>
                <HeroesSelected heroes={team.versus.heroes_selected} obs={obs} color={team.versus.color} />
              </div>
            </>
          ) : (
            <>
              <div>
                <p>Blue: {team.versus.name}</p>
                <HeroesSelected heroes={team.versus.heroes_selected} obs={obs} color={team.versus.color} />
              </div>
              <div>
                <p>Red: {team.name}</p>
                <HeroesSelected heroes={team.heroes_selected} obs={obs} color={team.color} />
              </div>
            </>
          )}
          <button onClick={disconnect}>Disconnect</button>
        </div>
      ) : (
        <div className='flex gap-4 w-full'>
          <p>{team.name}</p>
          <button onClick={connect}>Connect to OBS</button>
        </div>
      )}
    </div>
  );
};

export default OBSControl;
