// pages/Match.tsx
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import { useMatch } from '@/contexts/MatchContext';
import ScoreSection from './ScoreSection';
import { RoomsProvider, useRooms } from '@/contexts/RoomsContext';
import RoomsTable from '@/components/Rooms/RoomsTable';
import RoomsRowItem from '@/components/Rooms/RoomsRowItem';
import Room from '@/components/Rooms/Room';
import { Room as RoomType } from '@/types/global';

const MatchContent = () => {
  const { match, clearMatch } = useMatch();
  const { rooms, activeRoom, setActiveRoom } = useRooms();

  const handleSetRoom = (room: RoomType) => {
    setActiveRoom(room);
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
        className='absolute top-0 left-0 z-90 w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60'
      >
        <Button className='absolute top-0 right-0 p-1 h-6 w-6' size="sm" variant="ghost" onClick={() => clearMatch()}>
          <X size={18} />
        </Button>
        <section className='bg-black bg-opacity-50 w-full  top-0 left-0 border border-red-600'>
          <h1>{match.gameType}</h1>
          <ScoreSection />
          {!activeRoom ? (
            <RoomsTable filterRooms={(rooms) => filterRoomsByMatch(rooms, match)}>
              {(filteredRooms) => filteredRooms.map(room => (
                <RoomsRowItem key={room.id} room={room} onSetRoom={() => handleSetRoom(room)} />
              ))}
            </RoomsTable>
          ) : (
            <Room room={activeRoom} />
          )}
        </section>
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
