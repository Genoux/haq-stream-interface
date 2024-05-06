import React, { useEffect } from 'react';
import Image from 'next/image';
import { useOBS } from '@/contexts/OBSContext';

interface Hero {
  id: string;
  name: string;
  selected: boolean;
}

// Helper function to generate image URLs
const getImageUrl = (hero, base, defaultImage) => {
  if ('id' in hero && hero.selected) {
    if (hero.id) {
      return `${base}${hero.id.toLowerCase().replace(/\s+/g, '').replace(/[\W_]+/g, '')}.jpg`;
    } else {
      return defaultImage;
    }
  }
  return '/images/noban.svg';
};

const HeroesBan = ({ heroes, color }) => {
  const { obs } = useOBS();

  useEffect(() => {
    if (obs) {
      heroes.forEach((hero: Hero, index: number) => {
        const imageLink = getImageUrl(
          hero,
          'https://draft.tournoishaq.ca/images/champions/tiles/',
          'https://sdedknsmucuwsvgfxrxs.supabase.co/storage/v1/object/public/Assets/misc/noban.png'
        );

        // const scaleX = 300 / sourceWidth;
        // const scaleY = 300 / sourceHeight;
        obs.call('SetInputSettings', {
          inputName: `${color}-h-ban-${index}`,
          inputSettings: { file: imageLink },
        }).then(() => {
          return obs.call("GetSceneItemList", { sceneName: "Prematch" });
        }).then(data => {
          const item = data.sceneItems.find(item => {
            return item.sourceName === `${color}-h-ban-${index}`;
          });
          if (item) {
            console.log("heroes.forEach - item:", item);
            // Item found, update its transform properties
            obs.call('SetSceneItemTransform', {
              sceneName: 'Prematch',
              sceneItemId: item.sceneItemId,
              sceneItemTransform: {
                scaleX: 100 / item.sceneItemTransform.sourceWidth,
                scaleY: 100 / item.sceneItemTransform.sourceHeight,

              },
            });
          } else {
            throw new Error('Scene item not found');
          }
        }).then(() => {
          console.log(`Transform properties updated for ${color}-h-ban-${index}`);
        }).catch(error => {
          console.error("Error in processing OBS commands:", error);
        });
      });
    }
  }, [heroes, obs, color]);

  return (
    <div className="flex gap-1">
      {heroes.map((hero: Hero, index: number) => (
        <div key={index} className="items-center">
          <Image
            src={getImageUrl(
              hero,
              'https://draft.tournoishaq.ca/images/champions/tiles/',
              '/images/noban.svg'
            )}
            alt={hero.name || "No Hero"}
            className="h-20 w-20 object-cover"
            width={60}
            height={60}
          />
        </div>
      ))}
    </div>
  );
};

export default HeroesBan;
