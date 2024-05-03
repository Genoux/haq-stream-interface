import React, { use, useEffect, useState } from 'react';
import { supabase } from '@/utils/supabase/client';
import HeroesSelected from '@/components/HeroesSelected';
import HeroesBan from '@/components/HeroesBan';
import { useOBS } from '@/contexts/OBSContext';

const SelectedTeams = () => {
  const [teamData, setTeamData] = useState([]);
  const { teamsConnected } = useOBS();

  
  useEffect(() => {
    console.log("useEffect - teamsConnected:", teamsConnected);

    // Function to sort teams to ensure blue is always first
    const sortTeams = (teamsConnected: any[]) => {
      return teamsConnected.sort((a: any, b: { color: string; }) => (b.color === 'blue' ? 1 : -1));
    };

    // Initialize team data with sorted teams
    setTeamData(sortTeams([...teamsConnected]));
  }, [teamsConnected]);


  return (
    <div>
      <TeamDisplay teams={teamsConnected} />
    </div>
  );
};

const TeamDisplay = ({ teams }) => {
  console.log("TeamDisplay - teams:", teams);
  return (
    <div>
      {teams.map((team) => (
        <div key={team.id}>
          <div>{team.color} {team.name}</div>
          <div className='flex flex-col justify-start w-fit'>
            <h2>Selected</h2>
            <HeroesSelected heroes={team.heroes_selected} color={team.color} />
          </div>
          <div className='flex flex-col justify-start w-fit'>
            <h2>Ban</h2>
            <HeroesBan heroes={team.heroes_ban} color={team.color} />
          </div>
        </div>
      ))}
    </div>
  );
};

export default SelectedTeams;
