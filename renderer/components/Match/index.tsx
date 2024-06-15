import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence, cubicBezier } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useMatch } from '@/contexts/MatchContext';
import ScoreSection from './ScoreSection';
import { RoomsProvider, useRooms } from '@/contexts/RoomsContext';
import RoomsTable from '@/components/Rooms/RoomsTable';
import RoomsRowItem from '@/components/Rooms/RoomsRowItem';
import Room from '@/components/Rooms/Room';
import { Room as RoomType } from '@/types/global';
import { updateObsMatchType, updateObsTeamCard } from '@/hooks/useObsSceneSetup';
import { useOBS } from '@/contexts/OBSContext';
import { useToast } from '@/components/ui/use-toast';
import SpinnerCircle from '../common/SpinnerCircle';

const MatchContent = () => {
  const { match, clearMatch, matchTitle } = useMatch();
  const { rooms, activeRoom, setActiveRoom } = useRooms();
  const [buttonVisible, setButtonVisible] = useState(false);
  const [Resyncing, setResyncing] = useState(false);
  const buttonTimeoutRef = useRef(null);
  const { obs } = useOBS();
  const { toast } = useToast();

  const updateOBS = async () => {
    setResyncing(true);
    if (obs) {
      try {
        const { error: matchTypeError } = await updateObsMatchType(obs, match.gameType);
        if (matchTypeError) {
          toast({
            title: "Failed to update match type",
            description: "Please check if OBS is running and if the match type is correct.",
            variant: 'destructive',
          });
          return;
        }

        const { error: teamCardError } = await updateObsTeamCard(obs, match);
        if (teamCardError) {
          toast({
            title: "Failed to update team card",
            description: "Please check if OBS is running and if the team card data is correct.",
            variant: 'destructive',
          });
          return;
        }
      } catch (error) {
        console.error('Error updating OBS:', error);
        toast({
          title: "Error updating OBS",
          description: "An unexpected error occurred.",
          variant: 'destructive',
        });
      } finally {
        setResyncing(false);
      }
    }
  };

  useEffect(() => {
    updateOBS();
  }, [match, obs, toast]);

  const handleSetRoom = (room: RoomType) => {
    setActiveRoom(room);
  };

  const handleMouseEnter = () => {
    setButtonVisible(true);
    if (buttonTimeoutRef.current) {
      clearTimeout(buttonTimeoutRef.current);
    }
  };

  const handleMouseLeave = () => {
    setButtonVisible(false);
  };

  const filterRoomsByMatch = (rooms: RoomType[], match: { blue: { name: string }, red: { name: string } }): RoomType[] => {
    const { blue, red } = match;
    if (!blue || !red) {
      return [];
    }
    return rooms
      .filter(room => {
        const teams = [room.blue.name, room.red.name];
        return teams.includes(blue.name) && teams.includes(red.name);
      })
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  };

  return (
    <AnimatePresence mode='wait'>
      <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }}
        className='absolute h-screen top-0 left-0 z-10 w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60'
      >
        <section className='bg-black bg-opacity-20 w-full flex flex-col gap-2 p-4 top-0 left-0 relative'>
          <div className='grid grid-cols-3 items-center gap-2 w-full'>
            <ScoreSection team={match.blue} />
            <div className='flex flex-col items-center justify-center gap-2'>
              <Badge className='uppercase'>{match.gameType}</Badge>
              <div className="text-2xl font-bold uppercase">{matchTitle}</div>
            </div>
            <ScoreSection team={match.red} />
          </div>
          <AnimatePresence>
            <div className='border rounded-md' style={{ height: `calc(100vh - 102px)` }}>
              {!activeRoom ? (
                <RoomsTable filterRooms={(rooms) => filterRoomsByMatch(rooms, match)}>
                  {(filteredRooms) => filteredRooms.map(room => (
                    <RoomsRowItem key={room.id} room={room} onSetRoom={() => handleSetRoom(room)} />
                  ))}
                </RoomsTable>
              ) : (
                <motion.div initial={{ opacity: 0, y: 2 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2, delay: 0.2 }}>
                  <Room room={activeRoom} />
                </motion.div>
              )}
            </div>
          </AnimatePresence>
        </section>

        <motion.div
          className="absolute bottom-0 left-0 w-full h-[100px] flex justify-center items-end"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <AnimatePresence>
            {buttonVisible && (
              <motion.div
                initial={{ opacity: 0, y: 0 }}
                animate={{ opacity: 1, y: -24 }}
                exit={{ opacity: 0, y: 8 }}
                transition={{ duration: 0.2, ease: cubicBezier(0.42, 0, 0.58, 1) }}
                className='flex'
              >
                <Button className='w-fit flex justify-end m-1 text-white bg-red-800 border border-red-900 hover:bg-red-900' size="sm" variant="default" onClick={() => clearMatch()}>
                  Close
                </Button>
                <Button className='flex justify-center m-1 w-16 items-center' size="sm" variant="outline" onClick={() => updateOBS()}>
                  {Resyncing ? <SpinnerCircle /> :  <p>Resync</p>}
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default function Match() {
  return (
    <RoomsProvider>
      <MatchContent />
    </RoomsProvider>
  );
}
