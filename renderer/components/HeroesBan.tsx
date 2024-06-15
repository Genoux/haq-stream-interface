import React from 'react';
import Image from 'next/image';
import { useObsHeroImageSetup } from '@/hooks/useObsSceneSetup'; // Adjust the import path as needed
import { banConfiguration } from '@/lib/constants';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const HeroesBan = ({ heroes, color }) => {
  useObsHeroImageSetup(heroes, color, banConfiguration);

  return (
    <TooltipProvider>
      <div className="flex w-fit gap-2">
        {heroes.map((hero: { id: string; name: string; }, index: React.Key) => (
          <div key={index} className="w-20 h-20 relative flex justify-center items-center">
            <div className='absolute top-0 left-0 h-full w-full z-40 overflow-hidden bg-gradient-to-t from-black via-transparent'></div>
            {'id' in hero && hero.id ? (
              <Tooltip delayDuration={0}>
                <TooltipTrigger>
                  <Image
                    src={`https://draft.tournoishaq.ca/images/champions/tiles/${hero.id.toLowerCase().replace(/\s+/g, '').replace(/[\W_]+/g, '')}.webp`}
                    alt={hero.name}
                    objectFit='cover'
                    layout='fill'
                    className='grayscale rounded-sm '
                  />
                </TooltipTrigger>
                <TooltipContent>
                  <p>{hero.id}</p>
                </TooltipContent>
              </Tooltip>
            ) : (
              <div className='flex justify-center items-center overflow-hidden rounded-md relative w-20 h-20 bg-zinc-900 bg-opacity-50'></div>
            )}
          </div>
        ))}
      </div>
    </TooltipProvider>
  );
};

export default HeroesBan;
