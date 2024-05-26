import React from 'react';
import Image from 'next/image';
import { useObsHeroImageSetup } from '@/hooks/useObsSceneSetup';  // Adjust the import path as needed
import { banConfiguration } from '@/lib/constants';

const HeroesBan = ({ heroes, color, reloadTrigger, onLoadingComplete }) => {
  useObsHeroImageSetup(heroes, color, banConfiguration, onLoadingComplete);

  return (
    <div className="flex w-full gap-2">
      {heroes.map((hero, index) => (
        <div key={index}>
          <div className='grayscale flex gap-2 w-12 h-12 overflow-hidden relative rounded-lg'>
            <Image
              src={hero.id ?
                `https://draft.tournoishaq.ca/images/champions/tiles/${hero.id.toLowerCase().replace(/\s+/g, '').replace(/[\W_]+/g, '')}.webp`
                :
                'https://sdedknsmucuwsvgfxrxs.supabase.co/storage/v1/object/public/Assets/misc/nochamp.png'
              }
              alt={hero.name}
              layout='fill'
              objectFit='cover'
              className='w-full'
            />
          </div>
        </div>
      ))}
    </div>
  );
};

export default HeroesBan;
