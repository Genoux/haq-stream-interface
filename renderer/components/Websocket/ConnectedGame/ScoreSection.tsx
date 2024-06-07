import React, { useEffect } from 'react';
import { Checkbox } from "@/components/ui/checkbox";
import { useOBS } from '@/contexts/OBSContext';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { updateObsWinnerTitle } from '@/hooks/useObsSceneSetup';

type ScoreSectionProps = {
  team: any;
};

const ScoreSection = ({ team }: ScoreSectionProps) => {
  const { game, updateGame, obs } = useOBS();
  const [isWinner, setIsWinner] = React.useState(false);
  const domain = process.env.NEXT_PUBLIC_DRAFT || 'http://localhost:3000';

  if (!game) return null;

  const score = team.color === 'blue' ? game.blueScore : game.redScore;
  const opponentScore = team.color === 'blue' ? game.redScore : game.blueScore;

  const maxWins = game.gameType === 'bo3' ? 2 : 3;

  const handleCheckboxChange = (index: number) => {
    const newScore = [...score];
    const newOpponentScore = [...opponentScore];

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
      // Ensure the other team's score does not exceed the maximum wins
      if (newScore.filter(Boolean).length > maxWins) {
        for (let i = maxWins; i < newScore.length; i++) {
          newScore[i] = false;
        }
      }
      if (newScore.filter(Boolean).length === maxWins) {
        for (let i = maxWins - 1; i < newOpponentScore.length; i++) {
          newOpponentScore[i] = false;
        }
      }
    }

    updateGame({
      [`${team.color}Score`]: newScore,
      [`${team.color === 'blue' ? 'red' : 'blue'}Score`]: newOpponentScore
    });
  };

  const openLinkExternally = (url: string) => {
    window.ipc.send('open-external-link', url);
  };

  const calculateWins = () => {
    const teamWins = score.filter(Boolean).length;
    const opponentWins = opponentScore.filter(Boolean).length;
    return { teamWins, opponentWins };
  };

  const getWinner = () => {
    const { teamWins, opponentWins } = calculateWins();
    return teamWins === maxWins ? team.color : null;
  };

  useEffect(() => {
    const winner = getWinner();
    setIsWinner(winner === team.color);
    if (winner) {
      updateObsWinnerTitle(obs, `${winner} Win`);
    }
  }, [score, opponentScore]);

  return (
    <div className="flex w-full justify-between items-center gap-2">
      <div className='flex gap-2 items-center'>
        <div className='flex gap-1 justify-start items-center'>
          <span className={`w-2 h-2 rounded-full bg-${team.color}-600`}></span>
          <div>
            <Button
              className="px-1"
              onClick={() => openLinkExternally(`${domain}/room/${team.room}/${team.id}`)}
              variant="link"
            >
              {team.name}
            </Button>
            <span className="text-white opacity-50 font-normal">({team.id})</span>
          </div>
        </div>
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0, x: 5 }}
            animate={{ opacity: isWinner ? 1 : 0, x: isWinner ? 0 : 21 }}
            transition={{ duration: 0.2, delay: 0.2 }}
          >
            {isWinner && (
              <span className="duration-2000 text-green-500 animate-pulse text-xs bg-green-600 bg-opacity-15 px-1.5 py-0.5 rounded-full border border-green-600 border-opacity-20">
                Win
              </span>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
      <div className='flex gap-1'>
        {Array.from({ length: maxWins }, (_, index) => (
          <Checkbox
            className={`rounded-full ${score[index] ? 'w-8' : ' w-4'} h-3 hide-check-icon transition-all duration-200`}
            key={index}
            checked={score[index] || false}
            onCheckedChange={() => handleCheckboxChange(index)}
          />
        ))}
      </div>
    </div>
  );
};

export default ScoreSection;
