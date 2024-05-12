'use client';

import React from 'react';
import TeamItem from './TeamItem';
import { useTeams } from '@/contexts/TeamsContext';
import Scrollbar from '@/components/common/Scrollbar/Scrollbar';

const Teams = ({ selectedTeams, onSelectedTeamsChange }) => {
  const { teams } = useTeams();

  const blueTeams = teams.filter(team => team.color === 'blue');
  const redTeams = teams.filter(team => team.color === 'red');

  const handleCheckboxChange = (teamId: string, color: string) => {
    let newSelectedTeams = [...selectedTeams]; // Create a new array for immutability
    const teamIndex = selectedTeams.findIndex((t: any) => t.id === teamId);
    const selectedTeam = teams.find(team => team.id === teamId);

    if (teamIndex !== -1) {
      // If team is already selected, remove it
      newSelectedTeams.splice(teamIndex, 1);
    } else {
      // Check if there's already a team of the same color
      const colorIndex = newSelectedTeams.findIndex(t => t.color === color);
      if (colorIndex !== -1) {
        // Replace the existing team of the same color
        newSelectedTeams[colorIndex] = selectedTeam;
      } else {
        // Add the new team if no team of the same color has been selected
        newSelectedTeams.push(selectedTeam);
      }
    }

    // Update the state
    onSelectedTeamsChange(newSelectedTeams.filter((t, index, self) =>
      index === self.findIndex((ti) => ti.color === t.color) // Ensure no duplicate colors
    ));
  };

  return (
    <div className='py-4 pl-3 w-full'>
      <Scrollbar>
        <div className='flex flex-col gap-4'>
          <div className='grid grid-cols-3 gap-2 border border-zinc-600 border-opacity-10 bg-zinc-600 bg-opacity-5 p-4 rounded-md'>
            {blueTeams.map((team) => (
              <TeamItem
                key={team.id}
                team={team}
                isSelected={selectedTeams.some(t => t.id === team.id)}
                onSelectionChange={() => handleCheckboxChange(team.id, 'blue')}
              />
            ))}
          </div>
          <div className='grid grid-cols-3 gap-2 border border-zinc-600 border-opacity-10 bg-zinc-600 bg-opacity-5 p-4 rounded-md'>
            {redTeams.map((team) => (
              <TeamItem
                key={team.id}
                team={team}
                isSelected={selectedTeams.some(t => t.id === team.id)}
                onSelectionChange={() => handleCheckboxChange(team.id, 'red')}
              />
            ))}
          </div>
        </div>
      </Scrollbar>
    </div>
  );
};

export default Teams;
