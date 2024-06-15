import { useEffect } from 'react';
import { useOBS } from '@/contexts/OBSContext';

// Helper function shared by both components
const generateImageUrl = (id, type) => {
  if (!id) {
    return `https://sdedknsmucuwsvgfxrxs.supabase.co/storage/v1/object/public/Assets/misc/${type}_empty.png`;
  }

  return `C:/Users/John/Dropbox/In.Progress/Howling Abyss Quebec/aram-draft-pick/champions_update/output/process/${type}/${id.toLowerCase().replace(/\s+/g, '').replace(/[\W_]+/g, '')}.webp`;
};

export const useObsHeroImageSetup = (heroes, color, config) => {
  const { obs } = useOBS();
  
  useEffect(() => {
    if (!obs || heroes.length === 0) {
      return;
    }

    const operations = heroes.map(async (hero, index) => {
      const imageLink = generateImageUrl(hero.id, config.imageFolder);
      const inputName = `${color}-${config.itemPrefix}${index}`;

      try {
        await obs.call('SetInputSettings', {
          inputName,
          inputSettings: { file: imageLink },
        });
        const data = await obs.call("GetSceneItemList", { sceneName: config.sceneName });
        const item = data.sceneItems.find(item => item.sourceName === inputName);
        if (item) {
          await obs.call('SetSceneItemTransform', config.transformations(item, index, heroes, color));
        } else {
          throw new Error('Scene item not found');
        }
      } catch (error) {
        console.error(`Error updating hero image for ${inputName}:`, error);
        return error;
      }
    });

    Promise.all(operations)
      .then(() => console.log('OBS commands processed successfully.'))
      .catch(error => {
        console.error('Error in processing OBS commands:', error);
        return error;
      });
  }, [obs, heroes, color, config]);
};

export const updateObsScene = async (obs, scene) => {
  try {
    await obs.call('SetCurrentProgramScene', {
      sceneName: 'PreMatch',
    });
  } catch (error) {
    console.error(`Failed to update team logos:`, error);
    return { error };
  }
};

export const updateObsTeamCard = async (obs, match) => {
  const { blue, red } = match;
  const teams = [blue, red];

  try {
    for (const team of teams) {
      const teamColor = team.id === blue.id ? 'blue' : 'red';
      const name = team.name.toLowerCase().replace(/\s+/g, '-');
      await obs.call('SetInputSettings', {
        inputName: `team-${teamColor}-logo`,
        inputSettings: { file: `https://sdedknsmucuwsvgfxrxs.supabase.co/storage/v1/object/public/Assets/stream/teams/${name}.png` },
      });
    }
    return { error: null };
  } catch (error) {
    console.error(`Failed to update team logos:`, error);
    return { error };
  }
};

export const updateObsLayoutTitle = async (obs, text) => {
  try {
    await obs.call('SetInputSettings', {
      inputName: 'match-title',
      inputSettings: { text: text }
    });
    console.log(`Successfully updated match title to: ${text}`);
    return { error: null };
  } catch (error) {
    console.error(`Failed to update match title:`, error);
    return { error };
  }
};

export const updateObsMatchType = async (obs, text) => {
  try {
    const textToUpdate = text === 'bo3' ? 'Best of 3' : 'Best of 1';
    await obs.call('SetInputSettings', {
      inputName: 'match-type',
      inputSettings: { text: textToUpdate },
    });
    console.log(`Successfully updated match type to: ${textToUpdate}`);
    return { error: null };
  } catch (error) {
    if (error.message.includes('No source was found by the name of')) {
      console.error(`Failed to update match type: The source 'match-type' was not found. Please check if the source name is correct and exists in OBS.`);
    } else {
      console.error(`Failed to update match type:`, error);
    }
    return { error };
  }
};

export const updateObsScores = async (obs, match) => {
  const matchScores = match.scores;
  const operations = Object.keys(matchScores).map(async (teamColor) => {
    const score = matchScores[teamColor].filter(Boolean).length;

    try {
      await obs.call('SetInputSettings', {
        inputName: `team-${teamColor}-score`,
        inputSettings: { file: `C:/Users/John/Dropbox/In.Progress/Howling Abyss Quebec/twitch/assets/scores/${match.gameType}-${score}.png` },
      });
      console.log(`Successfully updated score for team-${teamColor}-score`);
      return { error: null };
    } catch (error) {
      console.error(`Failed to update score for team-${teamColor}-score:`, error);
      return { error };
    }
  });

  try {
    await Promise.all(operations);
    return { error: null };
  } catch (error) {
    console.error('Error updating scores:', error);
    return { error };
  }
};
