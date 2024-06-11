import { useEffect } from 'react';
import { useOBS } from '@/contexts/OBSContext';

// Helper function shared by both components
const generateImageUrl = (id, type) => {
  if (!id) {
    return `https://sdedknsmucuwsvgfxrxs.supabase.co/storage/v1/object/public/Assets/misc/${type}_empty.png`;
  }

  return `https://draft.tournoishaq.ca/images/champions/${type}/${id.toLowerCase().replace(/\s+/g, '').replace(/[\W_]+/g, '')}.webp`;
};

export const useObsHeroImageSetup = (heroes, color, config) => {
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

    Promise.all(operations).then(() => console.log('OBS commands processed successfully.')).catch(error => {
      console.error('Error in processing OBS commands:', error);
    });
  }, [obs, heroes, color, config]);
};



export const updateObsTeamCard = (obs, match) => {
  console.log("updateObsTeamCard - match:", match);
  const matchScores = match.scores;
  const { blue, red } = match;
  const teams = [blue, red];
  teams.forEach((team) => {
    const teamColor = team.id === blue.id ? 'blue' : 'red';
    const name = team.name.toLowerCase().replace(/\s+/g, '-');
    obs.call('SetInputSettings', {
      inputName: `team-${teamColor}-logo`,
      inputSettings: { file: `https://sdedknsmucuwsvgfxrxs.supabase.co/storage/v1/object/public/Assets/stream/teams/${name}.png` },
    }).catch((error: Error) => {
      console.error(`Failed to update team-${teamColor}-logo:`, error);
    });
  });
}

export const updateObsLayoutTitle = (obs, text) => {
  return obs.call('SetInputSettings', {
    inputName: 'Match',
    inputSettings: { text: text }
  })
}

export const updateObsMatchType = (obs, text) => {
  const textToUpdate = text === 'bo3' ? 'Best of 3' : 'Best of 5';
  return obs.call('SetInputSettings', {
    inputName: 'match-type',
    inputSettings: { text: textToUpdate },
  })
}

export const updateObsScores = (obs, match) => {
  const matchScores = match.scores;
  Object.keys(matchScores).forEach((teamColor) => {
    const score = matchScores[teamColor].filter(Boolean).length;

    obs.call('SetInputSettings', {
      inputName: `team-${teamColor}-score`,
      inputSettings: { file: `https://sdedknsmucuwsvgfxrxs.supabase.co/storage/v1/object/public/Assets/stream/scores/${match.gameType}-${score}.png` },
    }).catch((error: Error) => {
      console.error(`Failed to update score for team-${teamColor}-score:`, error);
    });
  });
}


// export const updateObsWinnerTitle = (obs, text) => {
//   console.log("updateObsWinnerTitle - text:", text);
//   return obs.call('SetInputSettings', {
//     inputName: 'Match Winner',
//     inputSettings: { text: text }
//   })
// }
