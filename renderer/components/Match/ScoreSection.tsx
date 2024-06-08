import React, { useEffect, useState } from 'react';
import { Checkbox } from "@/components/ui/checkbox";
import { motion, AnimatePresence } from 'framer-motion';
import { useMatch } from '@/contexts/MatchContext';

const ScoreSection = () => {
  const { match, updateScores } = useMatch();
  const [isBlueWinner, setIsBlueWinner] = useState(false);
  const [isRedWinner, setIsRedWinner] = useState(false);
  const [matchTitle, setMatchTitle] = useState('Match 1');
  const { blue, red } = match;

  const maxWins = match.gameType === 'bo3' ? 2 : 3;

  const handleCheckboxChange = (teamColor: 'blue' | 'red', index: number) => {
    updateScores(teamColor, index);
  };

  const calculateWins = (score: boolean[]) => {
    return score.filter(Boolean).length;
  };

  const getWinner = () => {
    const blueWins = calculateWins(match.scores.blue);
    const redWins = calculateWins(match.scores.red);
    return {
      blue: blueWins === maxWins,
      red: redWins === maxWins,
    };
  };

  useEffect(() => {
    const winner = getWinner();
    setIsBlueWinner(winner.blue);
    setIsRedWinner(winner.red);
  }, [match.scores]);

  useEffect(() => {
    const blueWins = calculateWins(match.scores.blue);
    const redWins = calculateWins(match.scores.red);
    const totalMatches = blueWins + redWins;

    if (!getWinner().blue && !getWinner().red) {
      setMatchTitle(`Match ${totalMatches + 1}`);
    }
  }, [match.scores]);

  return (
    <>
      <div className="text-xl font-bold">{matchTitle}</div>
      <div className="flex w-full justify-between items-center gap-2">
        {[blue, red].map((team) => {
          const isTeamWinner = team.id === blue.id ? isBlueWinner : isRedWinner;
          const score = team.id === blue.id ? match.scores.blue : match.scores.red;

          return (
            <div key={team.id} className='flex flex-col w-full items-center gap-2'>
              <div className='flex gap-2 items-center'>
                <div className='flex gap-1 justify-start items-center'>
                  <div>
                    {team.name}
                    <span className="text-white opacity-50 font-normal">({team.id})</span>
                  </div>
                </div>
                <AnimatePresence>
                  <motion.div
                    initial={{ opacity: 0, x: 5 }}
                    animate={{ opacity: isTeamWinner ? 1 : 0, x: isTeamWinner ? 0 : 21 }}
                    transition={{ duration: 0.2, delay: 0.2 }}
                  >
                    {isTeamWinner && (
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
                    onCheckedChange={() => handleCheckboxChange(team.id === blue.id ? 'blue' : 'red', index)}
                  />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
};

export default ScoreSection;
