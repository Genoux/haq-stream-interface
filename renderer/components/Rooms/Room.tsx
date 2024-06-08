import React, { useState } from 'react';
import HeroesSelected from '@/components/HeroesSelected';
import HeroesBan from '@/components/HeroesBan';
import { Button } from '@/components/ui/button';
import { useRooms } from '@/contexts/RoomsContext';
import type { Room, Team } from '@/types/global';

interface RoomProps {
  room: Room; // Define a proper type for 'room'
}

const Room: React.FC<RoomProps> = ({ room }) => {
  const { setActiveRoom } = useRooms();
  const teams = [room.blue, room.red];
  return (
    <div className="flex items-center gap-4">
      <Button onClick={() => {setActiveRoom(null)}}>X</Button>
      <div className='flex flex-col gap-1'>
        {teams.map((team: Team) => (
          <div key={team.id}>
            <HeroesSelected heroes={team.heroes_selected} color={team.color} />
            <HeroesBan heroes={team.heroes_ban} color={team.color} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Room;
