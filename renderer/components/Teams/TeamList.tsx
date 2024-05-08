'use client';

import React from 'react';
import TeamItem from './TeamItem';
import { Checkbox } from '@/components/ui/checkbox';

const Teams = ({ teams, selectedTeams, onSelectedTeamsChange }) => {
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
    <div className="flex flex-col gap-4">
      {teams.map((team) => (
    <button className="flex flex-col items-start gap- rounded-lg border p-3 text-left text-sm transition-all hover:bg-accent">

        <div key={team.id} className="flex items-start space-x-2 mb-2 ">
            <Checkbox
              className='rounded-full'
            id={`team-${team.id}`}
            checked={selectedTeams.some((t) => t.id === team.id)}
            onCheckedChange={() => handleCheckboxChange(team.id)}
          />
          <label
            htmlFor={`team-${team.id}`}
            className=""
          >
            <TeamItem
              team={team}
              isSelected={selectedTeams.some((t) => t.id === team.id)}
            />
          </label>
          </div>
          </ button>
      ))}
    </div>
  );
};

export default Teams;
