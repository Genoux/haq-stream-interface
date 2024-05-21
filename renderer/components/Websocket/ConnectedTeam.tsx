import React, { useEffect } from 'react';
import { useOBS } from '@/contexts/OBSContext';
import OBSConnection from '@/components/Websocket/ConnectionButton';
import Loading from '@/components/Loading';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import Image from 'next/image';

export default function ConnectedTeam() {
  const { connectedTeams, obs, loading, disconnectOBS } = useOBS();

  useEffect(() => {
    if (obs) {
      connectedTeams.forEach((team: any) => {
        obs.call('SetInputSettings', {
          inputName: `${team.color}-team-name`,
          inputSettings: { text: team.name },
        }).catch((error: Error) => {
          console.error(`Failed to update OBS input settings for ${team.color}-team-name`, error);
        });
      });
    }
  }, [obs, connectedTeams]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className='ml-[52px] flex ali justify-center h-screen items-center  absolute top-0 left-0 z-90 w-full  bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60'>
      {loading ? (
        <Loading text="Connecting..." />
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2, delay: 0.1 }}

          className="flex flex-col gap-6 items-start">
            <div className='flex gap-2 items-center justify-center'>
            <svg className="animate-spin opacity-20 w-3 h-3" viewBox="0 0 193 193" xmlns="http://www.w3.org/2000/svg">
              <path d="M193 96.5C193 77.8549 187.599 59.609 177.449 43.9686C167.299 28.3282 152.835 15.963 135.807 8.36833C118.779 0.773633 99.9152 -1.72539 81.4968 1.17344C63.0784 4.07226 45.8942 12.2448 32.022 24.7028C18.1498 37.1609 8.18368 53.3709 3.32877 71.3729C-1.52613 89.3748 -1.06195 108.398 4.66521 126.142C10.3924 143.885 21.1372 159.59 35.6005 171.357C50.0638 183.123 67.6262 190.448 86.1641 192.445L88.2467 173.113C73.4441 171.518 59.4204 165.669 47.8713 156.273C36.3223 146.878 27.7424 134.337 23.1693 120.169C18.5961 106 18.2254 90.8105 22.1021 76.4358C25.9788 62.0611 33.9368 49.1173 45.0138 39.1695C56.0909 29.2216 69.8126 22.6958 84.5198 20.3811C99.2271 18.0663 114.29 20.0618 127.887 26.1262C141.484 32.1907 153.033 42.0643 161.138 54.5533C169.243 67.0423 173.556 81.6117 173.556 96.5H193Z" fill="white" />
            </svg>
            <h1 className='text-lg font-medium'>Active connection</h1>
          
          </div>
          <div className='flex flex-col gap-6'>
            {connectedTeams.map((team) => (
              <div key={team.color} className="flex items-center gap-4">
                <section className='flex flex-col w-full gap-2'>
                  <div className='flex gap-2 justify-start items-center'>
                    <span className={`w-2 h-2 rounded-full bg-${team.color}-600`}></span>
                    <p>{team.name}</p>
                  </div>
                  <div className='flex gap-2'>
                    {team.heroes_selected.map((hero) => (
                      <div className='flex gap-2 w-12 h-12 overflow-hidden relative rounded-lg'>
                        {!hero ? (

                          <Image
                            src={`https://draft.tournoishaq.ca/images/champions/splash/${hero.id
                              .toLowerCase()
                              .replace(/\s+/g, '')
                              .replace(/[\W_]+/g, '')}.jpg`}
                            alt={hero.name}
                            layout='fill'
                            objectFit='cover'
                            quality={60}
                          />
                        ) : (
                          <Image
                            src={`https://sdedknsmucuwsvgfxrxs.supabase.co/storage/v1/object/public/Assets/misc/nochamp.png`}
                            alt={'No champion'}
                            layout='fill'
                            objectFit='cover'
                            quality={60}
                          />
                        )}

                      </div>

                    ))}
                  </div>
                </section>
              </div>
            ))}
          </div>
          <Button className='mt-6' size="sm" variant="outline" onClick={disconnectOBS}>Disconnect</Button>
        </motion.div>
      )}
    </motion.div>
  );
}
