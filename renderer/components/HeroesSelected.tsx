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

const HeroesSelected = ({ heroes, color, onLoadingComplete }) => {
  useObsHeroImageSetup(heroes, color, selectConfiguration, onLoadingComplete);

  return (
    <TooltipProvider>
      <div className="flex w-full gap-1">
        {heroes.map((hero: Hero, index: number) => (
          <div key={index}>
            <div>
              <Tooltip delayDuration={100}>
                <TooltipTrigger>
                  <div key={hero.id} className='flex w-24 h-24 overflow-hidden relative rounded'>
                    {hero.id ? (
                      <Image
                        src={`https://draft.tournoishaq.ca/images/champions/tiles/${hero.id.toLowerCase().replace(/\s+/g, '').replace(/[\W_]+/g, '')}.webp`}
                        alt={hero.name}
                        layout='fill'
                        objectFit='cover'
                        className='w-full'
                      />
                    ) : (
                      <div className='bg-zinc-700 bg-opacity-20 w-24 h-24 rounded'></div>
                    )}
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{hero.id}</p>
                </TooltipContent>
              </Tooltip>
            </div>
          </div>
        ))}
      </div>
    </TooltipProvider>
  );
};

export default HeroesSelected;
