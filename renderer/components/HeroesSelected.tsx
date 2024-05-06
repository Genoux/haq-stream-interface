import React, { useEffect } from 'react';
import { useOBS } from '@/contexts/OBSContext';

interface Hero {
  id: string;
  name: string;
}

const generateImageUrl = (id: string) => {
  if (!id) {
    return 'https://sdedknsmucuwsvgfxrxs.supabase.co/storage/v1/object/public/Assets/misc/nochamp.png';
  }

  return `https://draft.tournoishaq.ca/images/champions/splash/${id
    .toLowerCase()
    .replace(/\s+/g, '')
    .replace(/[\W_]+/g, '')}.jpg`;
};

const getHeroImageStyle = (heroId: string) => ({
  backgroundImage: `url("${generateImageUrl(heroId)}")`,
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  height: '100%',
  width: '100%',
});

const HeroesSelected = ({ heroes, color }) => {
  const { obs } = useOBS();

  useEffect(() => {
    if (obs) {
      heroes.forEach((hero: Hero, index: number) => {
        const imageLink = generateImageUrl(hero.id);
        obs.call('SetInputSettings', {
          inputName: `${color}-h-${index}`,
          inputSettings: { file: imageLink },
        }).then(() => {
          return obs.call("GetSceneItemList", { sceneName: "Prematch" });
        }).then(data => {
          const item = data.sceneItems.find(item => item.sourceName === `${color}-h-${index}`);
          if (item) {
            console.log("heroes.forEach - item:", item);
            // Update transform properties
            obs.call('SetSceneItemTransform', {
              sceneName: 'Prematch',
              sceneItemId: item.sceneItemId,
              sceneItemTransform: {
                scaleX: 730 / item.sceneItemTransform.sourceWidth,
                scaleY: 413 / item.sceneItemTransform.sourceHeight,
                cropLeft: 480,
                cropRight: 480,
              },
            });
          } else {
            throw new Error('Scene item not found');
          }
        }).then(() => {
          console.log(`Transform properties updated for ${color}-h-${index}`);
        }).catch(error => {
          console.error(`Error in processing OBS commands for ${color}-h-${index}:`, error);
        });
      });
    }
  }, [heroes, obs, color]);

  return (
    <div className="flex gap-1">
      {heroes.map((hero: Hero, index: number) => (
        <div key={index} className='h-52 w-40'>
          <div style={hero.id ? getHeroImageStyle(hero.id) : undefined}>
            {!hero.id && <div className="bg-zinc-900 bg-opacity-50 h-[208px] w-full"></div>}
          </div>
        </div>
      ))}
    </div>
  );
};

export default HeroesSelected;
