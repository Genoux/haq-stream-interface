// contexts/MatchContext.tsx
import React, { createContext, useContext, useState, ReactNode } from 'react';

type Team = {
  id: string;
  name: string;
  email: string;
  coaches: { discord: string }[];
  players: { discord: string }[];
  substitutes: { discord: string }[];
};

type Match = {
  blue: Team;
  red: Team;
  gameType: 'bo3' | 'bo5';
  scores: {
    blue: boolean[];
    red: boolean[];
  };
};

type MatchContextValue = {
  match: Match | null;
  selectedTeams: Team[];
  matchTitle: string;
  setMatchTitle: (title: string) => void;
  gameType: 'bo3' | 'bo5';
  selectTeam: (team: Team) => void;
  setMatch: () => void;
  clearMatch: () => void;
  updateScores: (teamColor: 'blue' | 'red', index: number) => void;
  setGameType: (gameType: 'bo3' | 'bo5') => void;
};

const MatchContext = createContext<MatchContextValue | undefined>(undefined);

export const MatchProvider = ({ children }: { children: ReactNode }) => {
  const [selectedTeams, setSelectedTeams] = useState<Team[]>([]);
  const [match, setMatchState] = useState<Match | null>(null);
  const [gameType, setGameType] = useState<'bo3' | 'bo5'>('bo3');
  const [matchTitle, setMatchTitle] = useState('Match 1');

  const selectTeam = (team: Team) => {
    setSelectedTeams((prevSelectedTeams) => {
      if (prevSelectedTeams.find((t) => t.id === team.id)) {
        return prevSelectedTeams.filter((t) => t.id !== team.id);
      } else if (prevSelectedTeams.length < 2) {
        return [...prevSelectedTeams, team];
      } else {
        return [prevSelectedTeams[1], team];
      }
    });
  };

  const setMatch = () => {
    if (selectedTeams.length === 2) {
      setMatchState({
        blue: selectedTeams[0],
        red: selectedTeams[1],
        gameType,
        scores: {
          blue: Array(gameType === 'bo3' ? 2 : 3).fill(false),
          red: Array(gameType === 'bo3' ? 2 : 3).fill(false),
        },
      });
    }
  };

  const clearMatch = () => {
    setMatchState(null);
    //setSelectedTeams([]);
  };

  const updateScores = (teamColor: 'blue' | 'red', index: number) => {
    if (match && match.scores[teamColor] && index < match.scores[teamColor].length) {
      console.log("updateScores - teamColor:", teamColor);
      const newScores = { ...match.scores };
      const opponentColor = teamColor === 'blue' ? 'red' : 'blue';
      const maxWins = match.gameType === 'bo3' ? 2 : 3;

      if (newScores[teamColor][index]) {
        for (let i = index; i < newScores[teamColor].length; i++) {
          newScores[teamColor][i] = false;
        }
      } else {
        for (let i = 0; i <= index; i++) {
          newScores[teamColor][i] = true;
        }
        if (newScores[teamColor].filter(Boolean).length > maxWins) {
          for (let i = maxWins; i < newScores[teamColor].length; i++) {
            newScores[teamColor][i] = false;
          }
        }
        if (newScores[teamColor].filter(Boolean).length === maxWins) {
          for (let i = maxWins - 1; i < newScores[opponentColor].length; i++) {
            newScores[opponentColor][i] = false;
          }
        }
      }

      setMatchState({
        ...match,
        scores: newScores,
      });
    } else {
      console.log("updateScores - failed condition", match, match?.scores[teamColor], index, match?.scores[teamColor]?.length);
    }
  };

  return (
    <MatchContext.Provider value={{
      match,
      setMatch,
      matchTitle,
      setMatchTitle,
      selectedTeams,
      selectTeam,
      clearMatch,
      updateScores,
      gameType,
      setGameType
    }}>
      {children}
    </MatchContext.Provider>
  );
};

export const useMatch = () => {
  const context = useContext(MatchContext);
  if (context === undefined) {
    throw new Error('useMatch must be used within a MatchProvider');
  }
  return context;
};
