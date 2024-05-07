import React, { useEffect, useState } from 'react';
import HeroesSelected from '@/components/HeroesSelected';
import HeroesBan from '@/components/HeroesBan';
import { useOBS } from '@/contexts/OBSContext';

export default function connectedTeams() {
  const [teamData, setTeamData] = useState([]);
  const { connectedTeams, obs } = useOBS();

  useEffect(() => {
    if (obs) {
      connectedTeams.forEach((team: any, index: number) => {
        obs.call('SetInputSettings', {
          inputName: `${team.color}-team-name`,
          inputSettings: { text: team.name },
        }).catch((error: Error) => {
          console.error(`Failed to update OBS input settings for ${team.color}-team-name`, error);
        });
      });
    }
  }, [obs, connectedTeams]);
  
  useEffect(() => {
    const sortTeams = (connectedTeams: any[]) => {
      return connectedTeams.sort((a: any, b: { color: string; }) => (b.color === 'blue' ? 1 : -1));
    };

    setTeamData(sortTeams([...connectedTeams]));
  }, [connectedTeams]);

  return (
    <div>
      <TeamDisplay teams={connectedTeams} />
    </div>
  );
};

const TeamDisplay = ({ teams }) => {
  return (
    <div>
      {teams.map((team) => (
        <div key={team.id} className='flex flex-col gap-2'>
            <h1 className=''>{team.name}</h1>
            <HeroesSelected heroes={team.heroes_selected} color={team.color} />
            <HeroesBan heroes={team.heroes_ban} color={team.color} />
        </div>
      ))}
    </div>
  );
};
