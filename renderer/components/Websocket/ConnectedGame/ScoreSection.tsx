import React from 'react';
import { Checkbox } from "@/components/ui/checkbox";
import { useOBS } from '@/contexts/OBSContext';
import { Button } from '@/components/ui/button';

type ScoreSectionProps = {
  team: any;
};

const ScoreSection = ({ team }: ScoreSectionProps) => {
  const { game, updateGame } = useOBS();
  const domain = process.env.NEXT_PUBLIC_DRAFT || 'http://localhost:3000';

  const score = team.color === 'blue' ? game?.blueScore : game?.redScore;
  const opponentScore = team.color === 'blue' ? game?.redScore : game?.blueScore;

  if (!game || !score) return null;

  const handleCheckboxChange = (index: number) => {
    const newScore = [...score];
    if (newScore[index]) {
      // Uncheck the current and all subsequent checkboxes
      for (let i = index; i < newScore.length; i++) {
        newScore[i] = false;
      }
    } else {
      // Check the current and all previous checkboxes
      for (let i = 0; i <= index; i++) {
        newScore[i] = true;
      }
    }

    updateGame({ [`${team.color}Score`]: newScore });
  };

  const openLinkExternally = (url: string) => {
    window.ipc.send('open-external-link', url);
  };

  const getWinner = () => {
    const teamWins = score.filter(Boolean).length;
    const opponentWins = opponentScore.filter(Boolean).length;
    if (teamWins > opponentWins) return team.color;
    return null;
  };

  const isWinner = getWinner() === team.color;

  return (
    <div className="flex w-full justify-between items-center gap-2">
      <div className='flex gap-1 justify-start items-center'>
        <span className={`w-2 h-2 rounded-full bg-${team.color}-600`}></span>
        <div>
          <Button className="px-1" onClick={() => openLinkExternally(`${domain}/room/${team.room}/${team.id}`)} variant="link">
            {team.name}
          </Button>
          <span className="text-white opacity-50 font-normal">({team.id})</span>
        </div>
      </div>
      <div className='flex gap-2'>
        {Array.from({ length: game.gameType === 'bo3' ? 2 : 3 }, (_, index) => (
          <Checkbox
            className="rounded-full"
            key={index}
            checked={score[index] || false}
            onCheckedChange={() => handleCheckboxChange(index)}
          />
        ))}
      </div>
      {isWinner && <span className="text-green-500">Winner</span>}
    </div>
  );
};

export default ScoreSection;
