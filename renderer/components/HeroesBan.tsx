import React from 'react';
import Image from 'next/image';
import { useObsHeroImageSetup } from '@/hooks/useObsSceneSetup';  // Adjust the import path as needed
import { banConfiguration } from '@/lib/constants';

const HeroesBan = ({ heroes, color, onLoadingComplete }) => {
  useObsHeroImageSetup(heroes, color, banConfiguration, onLoadingComplete);

  return (
    <div className="flex w-full gap-2">
      {heroes.map((hero: { id: string; name: string; }, index: React.Key) => (
        <div key={index}>
          <div className='grayscale flex gap-2 w-12 h-12 overflow-hidden relative rounded-lg'>
            {hero.id ? (
              <Image
                src={`https://draft.tournoishaq.ca/images/champions/tiles/${hero.id.toLowerCase().replace(/\s+/g, '').replace(/[\W_]+/g, '')}.webp`}
                alt={hero.name}
                layout='fill'
                objectFit='cover'
                className='w-full'
              />
            ) : (
              <div className='bg-zinc-700 bg-opacity-20 w-12 h-12 rounded-sm'></div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default HeroesBan;
