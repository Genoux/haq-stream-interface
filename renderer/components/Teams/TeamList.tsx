'use client';

import React from 'react';
import TeamItem from './TeamItem';
import { useTeams } from '@/contexts/TeamsContext';
import Scrollbar from '@/components/common/Scrollbar/Scrollbar';

const Teams = () => {
  const { teams, loading } = useTeams();
  console.log(teams);


  return (
    <div className='py-4 pl-3 w-full'>
      <Scrollbar>
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
      </Scrollbar>
    </div>
  );
};

export default Teams;
