import React from 'react';
import Image from 'next/image';
import { useObsHeroImageSetup } from '@/hooks/useObsSceneSetup';
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
        {heroes.map((hero, index) => (
          <div key={index} className="w-20 h-20 relative flex justify-center items-center bg-neutral-800 bg-opacity-20 rounded-md">
            {hero.id && hero.selected ? (
              <Tooltip delayDuration={0}>
                <TooltipTrigger>
                  <Image
                    src={`https://sunny-reprieve-production.up.railway.app/upload/w_300,h_300/https://ddragon.leagueoflegends.com/cdn/img/champion/tiles/${hero.id}_0.jpg`}
                    alt={hero.name}
                    objectFit='cover'
                    layout='fill'
                    className='grayscale rounded-sm'
                  />
                </TooltipTrigger>
                <TooltipContent>
                  <p>{hero.id}</p>
                </TooltipContent>
              </Tooltip>
            ) : hero.id === null && hero.selected ? (
                <svg className='opacity-20 w-6' width="32" height="33" viewBox="0 0 32 33" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" clipRule="evenodd" d="M31.3943 4.03759C32.2019 3.23022 32.2019 1.9212 31.3943 1.11383C30.5871 0.306458 29.278 0.306458 28.4708 1.11383L16 13.5846L3.52932 1.11383C2.72191 0.306458 1.4129 0.306458 0.605528 1.11383C-0.201843 1.9212 -0.201843 3.23022 0.605528 4.03759L13.0762 16.5083L0.605528 28.979C-0.201843 29.7866 -0.201843 31.0954 0.605528 31.9029C1.4129 32.7101 2.72191 32.7101 3.52932 31.9029L16 19.4321L28.4708 31.9029C29.278 32.7101 30.5871 32.7101 31.3943 31.9029C32.2019 31.0954 32.2019 29.7866 31.3943 28.979L18.9238 16.5083L31.3943 4.03759Z" fill="#fff"/>
                </svg>
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