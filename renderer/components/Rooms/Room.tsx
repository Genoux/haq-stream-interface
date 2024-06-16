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
  const domain = process.env.NEXT_PUBLIC_DRAFT || 'http://localhost:3000';

  function openLinkExternally(url: string) {
    if (typeof window !== 'undefined' && window.ipc && window.ipc.send) {
      window.ipc.send('open-external-link', url);
    } else {
      console.error('IPC is not available.');
    }
  }

  return (
    <div className='p-4 gap-6 flex flex-col w-full justify-between'>
      <div className='border-b pb-2 flex w-full justify-between items-center'>
        <div className='flex'>
          <Button size={'sm'} onClick={() => openLinkExternally(`${domain}/room/${room.id}/spectator`)} variant="ghost">Room: {room.id}</Button>
          <Button size={'sm'} onClick={() => openLinkExternally(`${domain}/room/${room.id}/${room.blue.id}`)} variant="ghost">{room.blue.name}<span className='text-xs text-muted-foreground pl-1'>({room.blue.id})</span></Button>
          <Button size={'sm'} onClick={() => openLinkExternally(`${domain}/room/${room.id}/${room.red.id}`)} variant="ghost">{room.red.name}<span className='text-xs text-muted-foreground pl-1'>({room.red.id})</span></Button>
       </div>
        <div className='flex gap-2'>
          <Button size='sm' className='h-8 w-full' variant='default' onClick={() => { setActiveRoom(null) }}>Change room</Button>
        </div>
      </div>
      <div className='flex w-full justify-between gap-12'>

        <div className='flex flex-col w-full gap-2'>
          <HeroesBan heroes={room.blue.heroes_ban} color={room.blue.color} />
          <HeroesSelected heroes={room.blue.heroes_selected} color={room.blue.color} />
        </div>

        <div className='flex flex-col w-full gap-2'>
          <div className='ml-auto'><HeroesBan heroes={room.red.heroes_ban} color={room.red.color} /></div>
          <HeroesSelected heroes={room.red.heroes_selected} color={room.red.color} />
        </div>
      </div>
    </div>

  );
};

export default Room;
