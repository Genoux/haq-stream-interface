import React, { useEffect } from 'react';
import { useOBS } from '@/contexts/OBSContext';
interface Hero {
  id: string;
  name: string;
}

const generateImageUrl = (id: string) => {
  if (!id) {
    return
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
        }).catch((error: Error) => {
          console.error(`Failed to update OBS input settings for ${color}-h-${index}`, error);
        });
      });
    }
  }, [heroes, obs, color]);

  return (
    <div className="flex gap-1">
      {heroes.map((hero: Hero, index: number) => (
        <div className='h-52 w-40'>
          <div key={index} style={hero.id ? getHeroImageStyle(hero.id) : undefined}>
            {!hero.id && <div className="bg-zinc-900 bg-opacity-50 h-full w-full"></div>}
          </div>
        </div>
      ))}
    </div>
  );
};

export default HeroesSelected;
