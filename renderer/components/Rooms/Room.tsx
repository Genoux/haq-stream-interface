import React, { useState } from 'react';
import HeroesSelected from '@/components/HeroesSelected';
import HeroesBan from '@/components/HeroesBan';
import { Button } from '@/components/ui/button';
import { useRooms } from '@/contexts/RoomsContext';
import type { Room } from '@/types/global';

interface RoomProps {
  room: Room; // Define a proper type for 'room'
}

const Room: React.FC<RoomProps> = ({ room }) => {
  const { setActiveRoom } = useRooms();

  const handleOpenDraftWindow = (roomID) => {
    if (window.ipc && window.ipc.send) {
      const roomParams = new URLSearchParams({ id: roomID }).toString();
      window.ipc.send('open-draft-window', roomParams);
    }
  };

  return (
    <div className='p-4 flex flex-col gap-4'>
      <div className='hidden flex items-center gap-2 w-full justify-end'>
        <Button size='sm' className='h-8' variant='default' onClick={() => { setActiveRoom(null) }}>Change room</Button>
        <Button className='h-8' onClick={() => handleOpenDraftWindow(room.id)} variant="outline" size={'sm'}>View</Button>
      </div>
      <div className="flex items-center gap-4 w-full">
        <div className='flex w-full justify-between items-center'>
          <div className='flex flex-col gap-2'>
            <HeroesBan heroes={room.blue.heroes_ban} color={room.blue.color} />
            <HeroesSelected heroes={room.blue.heroes_selected} color={room.blue.color} />
          </div>
          <div className='flex flex-col gap-2 justify-center items-center'>
          <Button size='sm' className='h-8' variant='default' onClick={() => { setActiveRoom(null) }}>Change room</Button>
         </div>
          <div className='flex flex-col gap-2'>
            <HeroesBan heroes={room.red.heroes_ban} color={room.red.color} />
            <HeroesSelected heroes={room.red.heroes_selected} color={room.red.color} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Room;
