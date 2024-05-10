'use client';

import React, { useEffect, useState } from 'react';
import TeamItem from './TeamItem';
import { useTeams } from '@/contexts/TeamsContext';
import Scrollbar from '@/components/common/Scrollbar/Scrollbar';

const Teams = ({ selectedTeams, onSelectedTeamsChange }) => {
  const { teams } = useTeams();
  const [scrollAreaHeight, setScrollAreaHeight] = useState('h-screen');

  useEffect(() => {
    const updateHeight = () => {
      const windowHeight = window.innerHeight;
      const heightClass = windowHeight - 200;
      setScrollAreaHeight(heightClass as any);
    };

    updateHeight();
    window.addEventListener('resize', updateHeight);

    return () => window.removeEventListener('resize', updateHeight);
  }, []);

  const handleCheckboxChange = (teamId) => {
    const isSelected = selectedTeams.some((t) => t.id === teamId);

    let newSelectedTeams;

    if (isSelected) {
      newSelectedTeams = selectedTeams.filter((t) => t.id !== teamId);
    } else {
      newSelectedTeams = [...selectedTeams, teams.find((team) => team.id === teamId)];
    }

    // Only keep up to two selections
    onSelectedTeamsChange(newSelectedTeams.slice(-2));
  };

  return (
    <div className='-mt-3' style={{ display: 'flex', flexDirection: 'column', height: '95vh' }}>
      <Scrollbar>
        <div className='grid grid-cols-2 gap-2 py-6 pl-2'>
          {teams.map((team) => (
            <TeamItem
              key={team.id}
              team={team}
              isSelected={selectedTeams.some((t) => t.id === team.id)}
              onSelectionChange={() => handleCheckboxChange(team.id)}
            />
          ))}
        </div>
      </Scrollbar>
    </div>
  );
};

export default Teams;
