import { useEffect } from 'react';
import { useOBS } from '@/contexts/OBSContext';

// Helper function shared by both components
const generateImageUrl = (id, type) => {
  if (!id) {
    return `https://sdedknsmucuwsvgfxrxs.supabase.co/storage/v1/object/public/Assets/misc/${type}_empty.png`;
  }

  return `https://draft.tournoishaq.ca/images/champions/${type}/${id.toLowerCase().replace(/\s+/g, '').replace(/[\W_]+/g, '')}.webp`;
};

export const useObsHeroImageSetup = (heroes, color, config, onLoadingComplete) => {
  const { obs } = useOBS();
  useEffect(() => {
    if (!obs || heroes.length === 0) {
      return;
    }

    const operations = heroes.map((hero, index) => {
      const imageLink = generateImageUrl(hero.id, config.imageFolder);
      const inputName = `${color}-${config.itemPrefix}${index}`;

      return obs.call('SetInputSettings', {
        inputName,
        inputSettings: { file: imageLink },
      }).then(() => obs.call("GetSceneItemList", { sceneName: config.sceneName }))
        .then(data => {
          const item = data.sceneItems.find(item => item.sourceName === inputName);
          if (item) {
            return obs.call('SetSceneItemTransform', config.transformations(item, index, heroes, color));
          } else {
            throw new Error('Scene item not found');
          }
        });
    });

    Promise.all(operations).then(() => onLoadingComplete()).catch(error => {
      console.error('Error in processing OBS commands:', error);
      onLoadingComplete();
    });
  }, [obs, heroes, color, config, onLoadingComplete]);
};


export const updateObsTeamCard = (obs, textUpdates) => {
  // This function would call OBS to set text properties
  // This is a simple simulation of what the function might look like:
  return Promise.all(Object.entries(textUpdates).map(([source, text]) => {
    return obs.call('SetInputSettings', {
      inputName: source,
      inputSettings: { text: text }
    });
  }));
}

export const updateObsLayoutTitle = (obs, text) => {
  return obs.call('SetInputSettings', {
    inputName: 'Match',
    inputSettings: { text: text }
  })
}
