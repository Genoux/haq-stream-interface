// components/Teams/TeamItem.tsx
import React from 'react';
import { TableRow, TableCell } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";

type Team = {
  id: string;
  name: string;
  email: string;
  coaches: { discord: string }[];
  players: { discord: string }[];
  substitutes: { discord: string }[];
};

type TeamItemProps = {
  team: Team
  onSelect: (team: any) => void;
  isSelected: boolean;
};

const TeamItem = ({ team, onSelect, isSelected }: TeamItemProps) => {
  const onCheckedChange = (event) => {
    event.stopPropagation();
    onSelect(team);
  };

  const handleRowClick = () => {
    onSelect(team);
  };

  return (
    <TableRow
      key={team.id}
      className={`h-16 ${isSelected ? ' bg-zinc-900 bg-opacity-50 hover:bg-zinc-900 hover:bg-opacity-80' : 'bg-transparent'} `}
      onClick={handleRowClick}
    >
      <TableCell>
        <div className="flex items-center gap-2">
          <Checkbox
            checked={isSelected}
            onChange={onCheckedChange}
          />
          <p className="font-medium">{team.id}</p>
        </div>
      </TableCell>
      <TableCell>
        <p>{team.name}</p>
      </TableCell>
      <TableCell>
        <p>{team.email}</p>
      </TableCell>
      <TableCell className="w-[200px] pl-0 hidden">
        <p>coaches</p>
        {team.coaches.map((coache, index) => (
          <p key={index}>{coache.discord}</p>
        ))}
      </TableCell>
      <TableCell className="w-[200px] pl-0 hidden">
        <p>players</p>
        {team.players.map((player) => (
          <p key={player.discord}>{player.discord}</p>
        ))}
      </TableCell>
      <TableCell className="w-[200px] pl-0 hidden">
        <p>Substitutes</p>
        {team.substitutes.map((sub, index) => (
          <p key={index}>{sub.discord}</p>
        ))}
      </TableCell>
    </TableRow>
  );
};

export default TeamItem;
