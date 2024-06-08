// components/Teams/TeamList.tsx
import React from 'react';
import TeamItem from './TeamItem';
import { useTeams } from '@/contexts/TeamsContext';
import { useMatch } from '@/contexts/MatchContext';
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Button } from "@/components/ui/button";
import EmptyBlock from '@/components/common/EmptyBlock';
import { ScrollArea } from "@/components/ui/scroll-area";
import { updateObsGameType } from '@/hooks/useObsSceneSetup';
import { useOBS } from '@/contexts/OBSContext';

type Team = {
  id: string;
  name: string;
  email: string;
  coaches: { discord: string }[];
  players: { discord: string }[];
  substitutes: { discord: string }[];
};

const Teams = () => {
  const { teams } = useTeams();
  const { obs } = useOBS();
  const { selectedTeams, selectTeam, setMatch, setGameType, gameType } = useMatch();

  const handleGameTypeChange = (value: 'bo3' | 'bo5') => {
    console.log("handleGameTypeChange - value:", value);
    updateObsGameType(obs,value);
    setGameType(value);
  };

  return (
    <div className={`flex flex-col px-3 py-4 bg-muted/10`} style={{ height: `calc(100vh - 52px)` }}>
      <Card className={`flex flex-col flex-grow ${teams.length === 0 ? '0' : 'pr-2'} rounded-sm`}>
        <CardHeader>
          <div className='flex w-full justify-between items-center'>
            <div>
              <CardTitle>Teams: {teams.length}</CardTitle>
              <CardDescription>Available teams for the match</CardDescription>
            </div>
            <div className='flex gap-2 items-center justify-between'>
              <Select onValueChange={handleGameTypeChange} defaultValue={gameType}>
                <SelectTrigger className="w-[120px] h-8">
                  <SelectValue placeholder="All" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="bo3">Best of 3</SelectItem>
                  <SelectItem value="bo5">Best of 5</SelectItem>
                </SelectContent>
              </Select>
                <Button onClick={setMatch} variant={selectedTeams.length !== 2 ? 'outline' : 'default'} className="h-8" disabled={selectedTeams.length !== 2}>Set Match</Button>
            </div>
          </div>
        </CardHeader>
        {teams.length === 0 ? (
          <div className='border-t p-4 flex justify-center items-center h-full'>
            <EmptyBlock title='No teams' message="There are no teams available." />
          </div>
        ) : (
          <ScrollArea className='flex-grow h-[100px] relative'>
            <CardContent className="flex-grow flex flex-col px-4 py-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead className='hidden'>Coaches</TableHead>
                    <TableHead className='hidden'>Players</TableHead>
                    <TableHead className='hidden'>Substitutes</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {teams.map((team: Team) => (
                    <TeamItem
                      key={team.id}
                      team={team}
                      onSelect={selectTeam}
                      isSelected={selectedTeams.includes(team)}
                    />
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </ScrollArea>
        )}
      </Card>
    </div>
  );
};

export default Teams;
