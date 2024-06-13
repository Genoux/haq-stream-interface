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
      <div className="flex w-full gap-2">
        {heroes.map((hero: { id: string; name: string; }, index: React.Key) => (
          <div key={index} className="flex-grow w-full h-16 grayscale">
            {'id' in hero && hero.id ? (
              <Tooltip delayDuration={100}>
                <TooltipTrigger>
                  <Image
                    src={`https://draft.tournoishaq.ca/images/champions/tiles/${hero.id.toLowerCase().replace(/\s+/g, '').replace(/[\W_]+/g, '')}.webp`}
                    alt={hero.name}
                    layout='fill'
                    objectFit='cover'
                  />
                </TooltipTrigger>
                <TooltipContent>
                  <p>{hero.id}</p>
                </TooltipContent>
              </Tooltip>
            ) : (
              <div className='bg-zinc-700 bg-opacity-20 w-full h-full rounded-sm'></div>
            )}

          </div>
        ))}
      </div>
    </TooltipProvider>
  );
};

export default HeroesBan;
