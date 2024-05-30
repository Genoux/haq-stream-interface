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
              <Image
                src={
                  hero.id ?
                    `https://draft.tournoishaq.ca/images/champions/splash/${hero.id
                      .toLowerCase()
                      .replace(/\s+/g, '')
                      .replace(/[\W_]+/g, '')}.webp`
                    : 'https://sdedknsmucuwsvgfxrxs.supabase.co/storage/v1/object/public/Assets/misc/nochamp.png'

                }
                alt={hero.name}
                layout='fill'
                objectFit='cover'
                className='w-full'
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default HeroesSelected;
