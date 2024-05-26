import React, { useEffect, useState } from 'react';
import { useOBS } from '@/contexts/OBSContext';
import OBSConnection from '@/components/Websocket/ConnectionButton';
import Loading from '@/components/Loading';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useRooms } from '@/contexts/RoomsContext';
import { Badge } from '@/components/ui/badge';
import { EyeIcon } from 'lucide-react';
import HeroesSelected from '@/components/HeroesSelected';
import HeroesBan from '@/components/HeroesBan';
import { updateObsTeamTitle } from '@/hooks/useObsSceneSetup';
import SpinnerCircle from '@/components/common/SpinnerCircle';
import { Check } from 'lucide-react';

export default function ConnectedTeams() {
  const { connectedTeams, obs, loading, disconnectOBS } = useOBS();
  const { rooms } = useRooms();
  const roomID = connectedTeams.map(team => team.room)[0];
  const room = rooms.find(r => r.id === roomID);
  const [reloadTrigger, setReloadTrigger] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const domain = process.env.NEXT_PUBLIC_DRAFT || 'http://localhost:3000';

  const handleOpenDraftWindow = (roomID: string) => {
    if (window.ipc && window.ipc.send) {
      const roomParams = new URLSearchParams({ id: roomID }).toString();
      window.ipc.send('open-draft-window', roomParams);
    }
  };

  function openLinkExternally(url: string) {
    window.ipc.send('open-external-link', url);
  }

  useEffect(() => {
    if (!obs) return;
    const teamNameUpdates = connectedTeams.reduce((updates, team) => {
      updates[`${team.color}-team-name`] = team.name;
      return updates;
    }, {});

    // Process all updates at once
    updateObsTeamTitle(obs, teamNameUpdates)
      .then(() => {
        console.log("All team names updated successfully.");
      })
      .catch(error => {
        console.error('Error updating OBS text:', error);
      });

  }, [obs, connectedTeams]);
  const handleReloadHeroes = () => {
    setIsLoading(true);  // Start loading
    setReloadTrigger(prev => prev + 1);
  };

  const onLoadingComplete = () => {
    setIsLoading(false);
  };

  return (
    <AnimatePresence mode='wait'>
      <div
        className='ml-[26px] flex justify-center h-screen items-center absolute top-0 left-0 z-90 w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60'>
        <motion.div
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2, delay: 0.2 }}
        >
          {loading ? (
            <div
              className=" w-full flex items-center justify-center gap-2">
              <SpinnerCircle />
              <p className="text-sm text-zinc-500 font-medium">Loading...</p>
            </div>
          ) : (
            <div
              className="flex flex-col justify-between gap-6 items-start h-fit">
              <div className='flex gap-2 items-center w-full justify-between border-b pb-4'>
                <div className='flex gap-4'>
                  <div className='flex gap-2 items-center'>
                      <div className='border border-green-600 rounded-full bg-green-600 bg-opacity-30 p-0.5'>
                        <Check size={12} className='text-green-600' />
                      </div>
                    <h1 className='text-lg font-medium'>Room {roomID}</h1>
                  </div>
                  <Badge variant='secondary' className='rounded-full'>{room?.status.capitalize()}</Badge>
                </div>
                <div className='flex gap-1'>
                  <Button onClick={() => handleOpenDraftWindow(roomID)} variant="default" size={'sm'}><EyeIcon size={16} /></Button>
                  <Button onClick={handleReloadHeroes} variant="outline" size={'sm'} className='w-16'>
                    {isLoading ? (
                      <SpinnerCircle />
                    ) : (
                      'Resync'
                    )}
                  </Button>

                </div>
              </div>
              <div className='flex flex-col gap-6'>
                {connectedTeams.map((team) => (
                  <div key={team.color} className="flex items-center gap-4">
                    <section className='flex flex-col w-full gap-2'>
                      <div className='flex gap-1 justify-start items-center'>
                        <span className={`w-2 h-2 rounded-full bg-${team.color}-600`}></span>
                        <div><Button className="px-1" onClick={() => openLinkExternally(`${domain}/room/${room.id}/${team.id}`)} variant="link">{team.name}</Button><span className="text-white opacity-50 font-normal">({team.id})</span></div>
                      </div>
                      <div className='flex flex-col gap-2'>
                        <div>
                          <HeroesSelected heroes={team.heroes_selected} color={team.color} reloadTrigger={reloadTrigger} onLoadingComplete={onLoadingComplete} />
                        </div>
                        <div>
                          <HeroesBan heroes={team.heroes_ban} color={team.color} reloadTrigger={reloadTrigger} onLoadingComplete={onLoadingComplete} />
                        </div>
                      </div>
                    </section>
                  </div>
                ))}
              </div>
              <div className='flex gap-2 w-full justify-end border-t pt-4'>
                <Button className='bg-red-900 hover:bg-red-800 border-red-950' size="sm" variant="outline" onClick={disconnectOBS}>Disconnect</Button>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
