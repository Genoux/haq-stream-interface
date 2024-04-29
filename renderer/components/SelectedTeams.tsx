import React, { useEffect, useState } from 'react';
import { supabase } from '@/utils/supabase/client';
import HeroesSelected from '@/components/HeroesSelected';
import HeroesBan from '@/components/HeroesBan';

const SelectedTeams = ({ teams, obs }) => {
  const [teamData, setTeamData] = useState([]);

  useEffect(() => {

    // Function to sort teams to ensure blue is always first
    const sortTeams = (teams) => {
      return teams.sort((a, b) => (b.color === 'blue' ? 1 : -1));
    };

    // Initialize team data with sorted teams
    setTeamData(sortTeams([...teams]));

    // Helper function to handle subscription for each team
    const subscribeToTeam = (team) => {
      if (!team) return () => {};

      const channel = supabase.channel(`team_updates_${team.id}`)
        .on('postgres_changes', {
          event: 'UPDATE',
          schema: 'live_tournament',
          table: 'teams',
          filter: `id=eq.${team.id}`,
        }, payload => {
          console.log(`Update received for ${team.color}:`, payload.new);
          setTeamData(prevTeams => sortTeams(
            prevTeams.map(t => t.id === payload.new.id ? {...payload.new, key: t.key} : t)
          ));
        })
        .subscribe();

      return () => {
        channel.unsubscribe();
        console.log(`Unsubscribed from ${team.color} updates.`);
      };
    };

    // Subscribe to updates for each team
    const unsubscribes = teams.map(team => subscribeToTeam(team));

    return () => {
      unsubscribes.forEach(unsubscribe => unsubscribe());
    };
  }, [teams]);

  if (teamData.length < 2) return null;  // Render nothing until both teams are loaded

  return (
    <div>
      <TeamDisplay teams={teamData} obs={obs} />
    </div>
  );
};

const TeamDisplay = ({ teams, obs }) => {
  return (
    <div>
      {teams.map((team) => (
        <div key={team.id}>
          <div>{team.color} {team.name}</div>
          <HeroesSelected heroes={team.heroes_selected} obs={obs} color={team.color} />
          <HeroesBan heroes={team.heroes_ban} obs={obs} color={team.color} />
        </div>
      ))}
    </div>
  );
};

export default SelectedTeams;
