import React from 'react';
import Image from 'next/image';
import { useObsHeroImageSetup } from '@/hooks/useObsSceneSetup';
import { selectConfiguration } from '@/lib/constants';
interface Hero {
  [key: string]: any;
}

const HeroesSelected = ({ heroes, color, onLoadingComplete }) => {
  useObsHeroImageSetup(heroes, color, selectConfiguration, onLoadingComplete);
  
  return (
    <div className="flex w-full gap-2">
      {heroes.map((hero: Hero, index: number) => (
        <div key={index} className=''>
          <div>
            <div key={hero.id} className='flex gap-2 w-24 h-24 overflow-hidden relative rounded-lg'>
            {hero.id ? (
              <Image
                src={`https://draft.tournoishaq.ca/images/champions/tiles/${hero.id.toLowerCase().replace(/\s+/g, '').replace(/[\W_]+/g, '')}.webp`}
                alt={hero.name}
                layout='fill'
                objectFit='cover'
                className='w-full'
              />
            ) : (
              <div className='bg-zinc-700 bg-opacity-20 w-24 h-24 rounded-sm'></div>
            )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default HeroesSelected;
