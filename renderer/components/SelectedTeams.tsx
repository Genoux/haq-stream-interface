import React, { useEffect, useState } from 'react';
import HeroesSelected from '@/components/HeroesSelected';
import HeroesBan from '@/components/HeroesBan';
import { useOBS } from '@/contexts/OBSContext';

const SelectedTeams = () => {
  const [teamData, setTeamData] = useState([]);
  const { teamsConnected } = useOBS();

  
  useEffect(() => {
    const sortTeams = (teamsConnected: any[]) => {
      return teamsConnected.sort((a: any, b: { color: string; }) => (b.color === 'blue' ? 1 : -1));
    };

    setTeamData(sortTeams([...teamsConnected]));
  }, [teamsConnected]);

  return (
    <div>
      <TeamDisplay teams={teamsConnected} />
    </div>
  );
};

const TeamDisplay = ({ teams }) => {
  return (
    <div>
      {teams.map((team) => (
        <div key={team.id} className='flex flex-col gap-2'>
            <h1>{team.name}</h1>
            <HeroesSelected heroes={team.heroes_selected} color={team.color} />
            <HeroesBan heroes={team.heroes_ban} color={team.color} />
        </div>
      ))}
    </div>
  );
};

export default SelectedTeams;
