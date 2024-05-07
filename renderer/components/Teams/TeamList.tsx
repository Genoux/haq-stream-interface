import React from 'react';
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import TeamItem from './TeamItem';

const Teams= ({ teams, selectedTeams, onSelectedTeamsChange }) => {
  const handleValueChange = (newSelectedIds) => {
    const latestSelectedTeams = newSelectedIds.slice(-2).map(id => teams.find(team => team.id === id));
    onSelectedTeamsChange(latestSelectedTeams);
  };

  return (
    <ToggleGroup
      type="multiple"
      value={selectedTeams.map(team => team.id)}
      onValueChange={handleValueChange}
      className='flex flex-col'
    >
      {teams.map(team => (
        <ToggleGroupItem key={team.id} value={team.id} className='w-fit justify-start'>
          <TeamItem
            team={team}
            isSelected={selectedTeams.some(t => t.id === team.id)}
          />
        </ToggleGroupItem>
      ))}
    </ToggleGroup>
  );
};

export default Teams;
