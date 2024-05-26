import React, { useEffect } from 'react';
import { useOBS } from '@/contexts/OBSContext';
import Image from 'next/image';
import { useObsHeroImageSetup } from '@/hooks/useObsSceneSetup';
import { selectConfiguration } from '@/lib/constants';
interface Hero {
  [key: string]: any;
}

const HeroesSelected = ({ heroes, color, reloadTrigger, onLoadingComplete }) => {
  const { obs } = useOBS();

  useObsHeroImageSetup(heroes, color, selectConfiguration, onLoadingComplete);


  // useEffect(() => {
  //   if (obs && heroes.length > 0) {
  //     const operations = heroes.map((hero, index) => {
  //       const imageLink = generateImageUrl(hero.id);

  //       return obs.call('SetInputSettings', {
  //         inputName: `${color}-h-${index}`,
  //         inputSettings: { file: imageLink },
  //       }).then(() => {
  //         return obs.call("GetSceneItemList", { sceneName: "Prematch" });
  //       }).then(data => {
  //         const item = data.sceneItems.find(item => item.sourceName === `${color}-h-${index}`);
  //         if (item) {
  //           // Calculate position and scale based on index and color
  //           const scaleX = 730 / item.sceneItemTransform.sourceWidth;
  //           const scaleY = 413 / item.sceneItemTransform.sourceHeight;
  //           const visibleWidth = (item.sceneItemTransform.sourceWidth * scaleX) - (960 * scaleX);

  //           let posX;
  //           if (color === 'blue') {
  //             posX = (index * visibleWidth) + 16;
  //           } else {
  //             const reverseIndex = heroes.length - 1 - index;
  //             posX = (1920 - ((reverseIndex + 1) * visibleWidth)) - 16;
  //           }

  //           return obs.call('SetSceneItemTransform', {
  //             sceneName: 'Prematch',
  //             sceneItemId: item.sceneItemId,
  //             sceneItemTransform: {
  //               alignment: 5,
  //               positionX: posX,
  //               positionY: 1080 - 413,
  //               scaleX: scaleX,
  //               scaleY: scaleY,
  //               cropLeft: 480,
  //               cropRight: 480,
  //             },
  //           });
  //         } else {
  //           throw new Error('Scene item not found');
  //         }
  //       });
  //     });

  //     Promise.all(operations).then(() => {
  //       onLoadingComplete();  // Notify parent that loading is complete
  //     }).catch(error => {
  //       console.error('Error in processing OBS commands:', error);
  //       onLoadingComplete();  // Ensure loading is stopped in case of error
  //     });
  //   } else {
  //     onLoadingComplete();  // Call immediately if no heroes or OBS is undefined
  //   }
  // }, [heroes, obs, color, reloadTrigger, onLoadingComplete]);

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
