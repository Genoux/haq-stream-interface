import React, { use, useEffect } from 'react';

interface Hero {
  id: string;
  name: string;
}

const HeroesBan = ({ heroes, obs, color }) => {
  console.log("HeroesBan - heroes:", heroes);
  // useEffect(() => {

  //   if (obs) {
  //     heroes.forEach((hero: Hero, index: number) => {
  
  //         let imageLink = ''
  //         if (hero.id) {
  //           imageLink = `https://draft.tournoishaq.ca/images/champions/splash/${hero.id
  //             .toLowerCase()
  //             .replace(/\s+/g, '')
  //             .replace(/[\W_]+/g, '')}.jpg`
  //         } else {
  //           imageLink = `https://dummyimage.com/1280x720/00d5ff/0010f0.jpg`
  //         }
  //         console.log("heroes.forEach - imageLink:", imageLink);
  //         obs.call('SetInputSettings', {
  //           inputName: `${color}-h-${index}`, // Dynamic inputName based on the index
  //           inputSettings: {
  //             file: imageLink
  //           }
  //         }).catch(error => {
  //           console.error(`Failed to update OBS input settings for logo-dummy${index}`, error);
  //         });
 
  //     });
  //   }
  // }, [heroes, obs]); // Depend on heroes and obs to re-run the effect

  return (
    <div className="flex flex-wrap justify-center items-center">
      {heroes.map((hero: Hero, index: number) => {
        if (hero.id) {
          return (
            <div key={index} className="m-2 p-2 border rounded-lg shadow-lg">
              <div className="flex flex-col items-center">
                <img
                  src={`https://draft.tournoishaq.ca/images/champions/splash/${hero.id.toLowerCase().replace(/\s+/g, '').replace(/[\W_]+/g, '')}.jpg`}
                  alt={hero.name}
                  className="h-24 w-24 object-cover rounded-full"
                />
                <p className="mt-2 font-semibold">{hero.name}</p>
              </div>
            </div>
          );
        } else {
          // Render an empty box if hero.id is undefined
          return (
            <div key={index} className="m-2 p-2 border rounded-lg shadow-lg flex justify-center items-center h-24 w-24">
              <span className="text-gray-400">No Hero</span>
            </div>
          );
        }
      })}
    </div>
  );
};

export default HeroesBan;
