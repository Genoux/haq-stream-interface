import React, { useEffect } from 'react';
import Image from 'next/image';
import { useOBS } from '@/contexts/OBSContext';

interface Hero {
  id: string;
  name: string;
}

// Helper function to generate image URLs
const getImageUrl = (id, base, defaultImage) => {
  if (!id) return defaultImage;
  return `${base}${id.toLowerCase().replace(/\s+/g, '').replace(/[\W_]+/g, '')}.jpg`;
};

const HeroesBan = ({ heroes, color }) => {
  const { obs } = useOBS();

  useEffect(() => {
    if (obs) {
      heroes.forEach((hero: Hero, index: number) => {
        const imageLink = getImageUrl(
          hero.id, 
          'https://draft.tournoishaq.ca/images/champions/tiles/', 
          'https://sdedknsmucuwsvgfxrxs.supabase.co/storage/v1/object/public/Assets/misc/noban.png'
        );
        
        obs.call('SetInputSettings', {
          inputName: `${color}-h-ban-${index}`,
          inputSettings: { file: imageLink }
        }).catch(error => {
          console.error(`Failed to update OBS input settings for ${color}-h-ban-${index}`, error);
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
              hero.id, 
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
