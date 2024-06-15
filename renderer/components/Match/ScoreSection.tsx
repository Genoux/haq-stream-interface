import React, { useEffect, useState, ReactNode } from 'react';
import { Checkbox } from "@/components/ui/checkbox";
import { motion } from 'framer-motion';
import { useMatch } from '@/contexts/MatchContext';
import { updateObsScores, updateObsLayoutTitle } from '@/hooks/useObsSceneSetup';
import { useOBS } from '@/contexts/OBSContext';
import clsx from 'clsx';

type Team = {
  id: string;
  name: string;
  email: string;
  coaches: { discord: string }[];
  players: { discord: string }[];
  substitutes: { discord: string }[];
};

type ScoreSectionProps = {
  team: Team;
  className?: string;
};

const ScoreSection: React.FC<ScoreSectionProps> = ({ team, className }: { team: Team, className?: string }) => {
  const { match, updateScores, setMatchTitle } = useMatch();
  const { obs } = useOBS();
  const [isBlueWinner, setIsBlueWinner] = useState(false);
  const [isRedWinner, setIsRedWinner] = useState(false);
  //  const [matchTitle, setMatchTitle] = useState('Match 1');

  const { blue, red } = match;
  const isTeamWinner = team.id === blue.id ? isBlueWinner : isRedWinner;
  const score = team.id === blue.id ? match.scores.blue : match.scores.red;

  const maxWins = match.gameType === 'bo3' ? 2 : 1;

  useEffect(() => {
    if (obs) {
      updateObsScores(obs, match);
      //updateObsLayoutTitle(obs, 'Match 1');
    }
  }, [match]);

  const handleCheckboxChange = (teamColor: 'blue' | 'red', index: number) => {
    updateScores(teamColor, index);
    updateObsScores(obs, match);
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
      const matchTitle = `Match ${totalMatches + 1}`;
      setMatchTitle(matchTitle);
      updateObsLayoutTitle(obs, matchTitle);
    }
  }, [match.scores]);

  return (

    <div className={clsx('flex p-3 rounded items-center gap-2 border', className)}>
      <div className='flex gap-2 items-center w-full'>
        <div className='flex gap-1 justify-start items-center'>
          {team.name}
        </div>
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
};

export default ScoreSection;
