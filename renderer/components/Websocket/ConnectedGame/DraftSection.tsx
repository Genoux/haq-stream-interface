// app/components/Websocket/TeamSection.tsx
import React from 'react';
import HeroesSelected from '@/components/HeroesSelected';
import HeroesBan from '@/components/HeroesBan';

interface TeamSectionProps {
  team: any; // Define a proper type for 'team'
  onLoadingComplete: () => void;
}

const TeamSection: React.FC<TeamSectionProps> = ({ team, onLoadingComplete }) => {

  return (
    <div key={team.color} className="flex items-center gap-4">
      <section className='flex flex-col w-full gap-2'>
        <div className='flex flex-col gap-2'>
          <HeroesSelected heroes={team.heroes_selected} color={team.color} onLoadingComplete={onLoadingComplete} />
          <HeroesBan heroes={team.heroes_ban} color={team.color} onLoadingComplete={onLoadingComplete} />
        </div>
      </section>
    </div>
  );
};

export default TeamSection;
