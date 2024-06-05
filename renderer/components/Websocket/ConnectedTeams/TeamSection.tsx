// app/components/Websocket/TeamSection.tsx
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import HeroesSelected from '@/components/HeroesSelected';
import HeroesBan from '@/components/HeroesBan';

interface TeamSectionProps {
  team: any; // Define a proper type for 'team'
  room: any; // Define a proper type for 'room'
  domain: string;
  onLoadingComplete: () => void;
}

const TeamSection: React.FC<TeamSectionProps> = ({ team, room, domain, onLoadingComplete }) => {
  const openLinkExternally = (url: string) => {
    window.ipc.send('open-external-link', url);
  };

  return (
    <div key={team.color} className="flex items-center gap-4">
      <section className='flex flex-col w-full gap-2'>
        <div className='flex gap-1 justify-start items-center'>
          <span className={`w-2 h-2 rounded-full bg-${team.color}-600`}></span>
          <div>
            <Button className="px-1" onClick={() => openLinkExternally(`${domain}/room/${room.id}/${team.id}`)} variant="link">
              {team.name}
            </Button>
            <span className="text-white opacity-50 font-normal">({team.id})</span>
          </div>
        </div>
        <div className='flex flex-col gap-2'>
          <HeroesSelected heroes={team.heroes_selected} color={team.color} onLoadingComplete={onLoadingComplete} />
          <HeroesBan heroes={team.heroes_ban} color={team.color} onLoadingComplete={onLoadingComplete} />
        </div>
      </section>
    </div>
  );
};

export default TeamSection;
