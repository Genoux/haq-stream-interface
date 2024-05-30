import React from 'react';
import TeamItem from './TeamItem';
import { useTeams } from '@/contexts/TeamsContext';

const Teams = () => {
  const { teams } = useTeams();

  return (
    <div className='py-4 pl-3 w-full'>
        <div className='flex flex-col gap-4'>
          <div className='grid grid-cols-3'>
            {teams.map((team) => (
              <TeamItem
                key={team.id}
                team={team}
              />
            ))}
          </div>
        </div>
    </div>
  );
};

export default Teams;
