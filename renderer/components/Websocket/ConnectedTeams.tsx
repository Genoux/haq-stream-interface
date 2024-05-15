import React, { useEffect, useState } from 'react';
import HeroesSelected from '@/components/HeroesSelected';
import HeroesBan from '@/components/HeroesBan';
import { useOBS } from '@/contexts/OBSContext';
import TitleBar from '@/components/common/TitleBar';
import OBSConnection from '@/components/Websocket/ConnectionButton';
import { AnimatePresence, motion } from 'framer-motion';
import Loading from '@/components/Loading';
export default function connectedTeams() {
  const [teamData, setTeamData] = useState([]);
  const { connectedTeams, obs } = useOBS();


  useEffect(() => {
    if (obs) {
      connectedTeams.forEach((team: any, index: number) => {
        obs.call('SetInputSettings', {
          inputName: `${team.color}-team-name`,
          inputSettings: { text: team.name },
        }).catch((error: Error) => {
          console.error(`Failed to update OBS input settings for ${team.color}-team-name`, error);
        });
      });
    }
  }, [obs, connectedTeams]);

  useEffect(() => {
    const sortTeams = (connectedTeams: any[]) => {
      return connectedTeams.sort((a: any, b: { color: string; }) => (b.color === 'blue' ? 1 : -1));
    };

    setTeamData(sortTeams([...connectedTeams]));
  }, [connectedTeams]);

  return (
    <TeamDisplay teams={connectedTeams} />
  );
};

const TeamDisplay = ({ teams }) => {
  const { loading } = useOBS();
  return (
    <div >
      <TitleBar title='Teams' > <OBSConnection selectedTeams={connectedTeams} /> </TitleBar>
      {loading ?
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0}}
            className='absolute top-0 left-0 w-full h-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60'>
            <Loading text='Connecting...' />
          </motion.div>
        </AnimatePresence>
        :
        <div className='p-4 flex flex-col gap-4 relative -z-10'>
        {teams.map((team) => (
          <div key={team.id} className='flex flex-col gap-2'>
            {team.color}
            <div className='p-4 flex flex-col border rounded-md'>
              <div className='w-full flex justify-between items-center'>
                <h1 className='text-xl font-bold'>{team.name.capitalize()}</h1>
                {/* <HeroesBan heroes={team.heroes_ban} color={team.color} /> */}
              </div>
              <div>
                <HeroesSelected heroes={team.heroes_selected} color={team.color} />
              </div>
            </div>
          </div>
        ))}
      </div>

      }
     
    </div>
  );
};
