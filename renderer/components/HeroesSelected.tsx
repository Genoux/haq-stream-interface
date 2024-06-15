import React from 'react';
import Image from 'next/image';
import { useObsHeroImageSetup } from '@/hooks/useObsSceneSetup';
import { selectConfiguration } from '@/lib/constants';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
interface Hero {
  [key: string]: any;
}

const HeroesSelected = ({ heroes, color }) => {
  useObsHeroImageSetup(heroes, color, selectConfiguration);

  return (
    <div className="flex gap-2">
      {heroes.map((hero: Hero, index: number) => (
        <div key={`${hero.id}-${index}`} className='flex justify-center items-center overflow-hidden rounded-md relative h-56 w-full'>
          {'id' in hero && hero.id ? (
            <TooltipProvider>
              <Tooltip delayDuration={0}>
                <TooltipTrigger>
                  <Image
                    src={`https://draft.tournoishaq.ca/images/champions/splash/${hero.id.toLowerCase().replace(/\s+/g, '').replace(/[\W_]+/g, '')}.webp`}
                    alt={hero.name}
                    objectFit='cover'
                    layout='fill'
                  />
                </TooltipTrigger>
                <TooltipContent>
                  <p>{hero.id}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ) : (
            <div className='flex justify-center items-center overflow-hidden rounded-md relative h-56 w-full bg-zinc-900 bg-opacity-50'></div>
          )}
        </div>
      ))}
    </div>

  );
};

export default HeroesSelected;
