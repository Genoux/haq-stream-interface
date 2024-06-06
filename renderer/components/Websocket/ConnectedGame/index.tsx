import React, { useEffect, useState } from 'react';
import { useOBS } from '@/contexts/OBSContext';
import { motion, AnimatePresence } from 'framer-motion';
import ConnectedTeamsHeader from './HeaderSection';
import TeamSection from './DraftSection';
import SpinnerCircle from '@/components/common/SpinnerCircle';
import { useRooms } from '@/contexts/RoomsContext';
import { updateObsTeamCard, updateObsLayoutTitle, updateObsGameType } from '@/hooks/useObsSceneSetup';
import { Button } from '@/components/ui/button';

export default function ConnectedTeams() {
  const { game, obs, loading, disconnectOBS, updateGameTitle, updateGameType } = useOBS();
  const { rooms } = useRooms();
  const roomID = game.id;
  const room = rooms.find(r => r.id === (roomID as unknown as string));
  const [reloadTrigger, setReloadTrigger] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const domain = process.env.NEXT_PUBLIC_DRAFT || 'http://localhost:3000';
  
  const [inputValue, setInputValue] = useState(game.title || 'Match 1');
  const [gameType, setGameType] = useState(game.gameType || 'bo3');

  const teamNameUpdates = game.teams.reduce((updates, team) => {
    updates[`${team.color}-team-name`] = team.name;
    return updates;
  }, {});

  const handleOpenDraftWindow = (roomID: string) => {
    if (window.ipc && window.ipc.send) {
      const roomParams = new URLSearchParams({ id: roomID }).toString();
      window.ipc.send('open-draft-window', roomParams);
    }
  };

  useEffect(() => {
    if (!obs) return;

    updateObsTeamCard(obs, teamNameUpdates)
    updateObsLayoutTitle(obs, inputValue);
    updateObsGameType(obs, gameType);

  }, [obs, game, inputValue, gameType]);

  const handleReloadHeroes = () => {
    setIsLoading(true);
    setReloadTrigger(prev => prev + 1);
  };

  const onLoadingComplete = () => {
    setIsLoading(false);
  };

  const OnInputChange = (event: any) => {
    setInputValue(event.target.value);
    updateObsLayoutTitle(obs, event.target.value);
    const teamId = game.id; // Assuming single team for simplicity
    if (teamId) {
      updateGameTitle(event.target.value);
    }
  };

  const handleGameTypeChange = (value: string) => {
    setGameType(value);
    updateObsGameType(obs, value);
    const teamId = game.id; // Assuming single team for simplicity
    if (teamId) {
      updateGameType(value);
    }
  };

  return (
    <AnimatePresence mode='wait'>
      <div className='ml-[26px] flex justify-center h-screen items-center absolute top-0 left-0 z-90 w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60'>
        <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2, delay: 0.2 }}>
          {loading ? (
            <div className="w-full flex items-center justify-center gap-2">
              <SpinnerCircle />
              <p className="text-sm text-zinc-500 font-medium">Loading...</p>
            </div>
          ) : (
            <div className="flex flex-col justify-between gap-6 items-start h-fit">
              <ConnectedTeamsHeader
                room={room}
                inputValue={inputValue}
                OnInputChange={OnInputChange}
                handleOpenDraftWindow={handleOpenDraftWindow}
                handleReloadHeroes={handleReloadHeroes}
                isLoading={isLoading}
                disconnectOBS={disconnectOBS}
                handleGameTypeChange={handleGameTypeChange}
                gameType={gameType}
              />
              <div className='flex flex-col gap-6'>
                {game.teams.map((team) => (
                  <TeamSection key={team.id} team={team} room={room} domain={domain} onLoadingComplete={onLoadingComplete} />
                ))}
              </div>
              <div className='flex flex-col border-t w-full items-end pt-4'>
                <Button className='bg-red-900 hover:bg-red-800 border-red-950' size="sm" variant="outline" onClick={disconnectOBS}>
                  Disconnect
                </Button>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
