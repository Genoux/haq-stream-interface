'use client';

import React from 'react';
import { useTeams } from '@/contexts/TeamsContext';
import Scrollbar from '@/components/common/Scrollbar/Scrollbar';
import { Checkbox } from '@/components/ui/checkbox';

interface SelectionItemProps {
  team: {
    [key: string]: any;
  };
  isSelected: boolean;
  onSelectionChange: () => void; // Callback function for changing selection
}

const SelectionItem = ({ team, isSelected, onSelectionChange }: SelectionItemProps) => {

  const GetChampionSelectedCount = () => {
    return team.heroes_selected.filter((hero) => hero.selected).length;
  }

  return (
    <div
      className="bg-black flex justify-between items-center gap-2 rounded-lg text-left text-sm transition-all hover:bg-accent border p-3 cursor-pointer"
      onClick={onSelectionChange}
    >
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between w-full gap-1">
          <p className="font-semibold">{team.name}</p>
          <div className="ml-auto text-xs text-muted-foreground">({GetChampionSelectedCount()})</div>
        </div>
        <div className="line-clamp-2 text-xs text-muted-foreground hidden"></div>
        <div className="flex items-center gap-2">
          <div className={`bg-${team.color}-600 w-full h-1 rounded-full`}>
          </div>
        </div>
      </div>
      <Checkbox
        className='rounded-full'
        id={`team-${team.id}`}
        checked={isSelected}
        onCheckedChange={onSelectionChange}
      />
    </div>
  );
};

const SelectionList = ({ selectedTeams, onSelectedTeamsChange }) => {
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
              <SelectionItem
                key={team.id}
                team={team}
                isSelected={selectedTeams.some(t => t.id === team.id)}
                onSelectionChange={() => handleCheckboxChange(team.id, 'blue')}
              />
            ))}
          </div>
          <div className='grid grid-cols-3 gap-2 border border-zinc-600 border-opacity-10 bg-zinc-600 bg-opacity-5 p-4 rounded-md'>
            {redTeams.map((team) => (
              <SelectionItem
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

export default SelectionList;
