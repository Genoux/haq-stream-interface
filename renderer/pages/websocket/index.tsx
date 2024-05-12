import React, { useEffect, useState } from 'react';
import { supabase_ttm } from '@/utils/supabase/client';
import Loading from '@/components/Loading';
import Teams from '@/components/Teams/TeamList';
import OBSConnection from '@/components/Websocket/OBSConnection';
import { useOBS } from '@/contexts/OBSContext';
import { TeamsProvider } from '@/contexts/TeamsContext';
import ConnectedTeams from '@/components/Websocket/ConnectedTeams';
import TitleBar from '@/components/common/TitleBar';
import { motion, AnimatePresence } from 'framer-motion';

//TODO: Refactor Teams because we need to show team list with teams info but without the websocket features

const TeamsPage = () => {
  const [selectedTeams, setSelectedTeams] = useState([]);
  const { obs, loading } = useOBS();
  const [isScrolled, setIsScrolled] = useState(false);
  const handleScroll = () => {
    const position = window.scrollY;
    setIsScrolled(position > 0); // Set true if scrolled down, false if at the top
  };
  useEffect(() => {
    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [])

  return (
    <TeamsProvider>
      <section className='flex flex-col'>
        {obs ? (
          <ConnectedTeams />
        ) : (
          <>
            <TitleBar title='Teams' > <OBSConnection selectedTeams={selectedTeams} /> </TitleBar>
            {loading &&
              <AnimatePresence>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className='absolute top-0 left-0 w-full h-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60'>
                  <Loading text='Connecting...' />
                </motion.div>
              </AnimatePresence>
            }
            <div className='flex flex-col gap-4' >
              <Teams selectedTeams={selectedTeams} onSelectedTeamsChange={setSelectedTeams} />
            </div>
          </>
        )}
      </section>
    </TeamsProvider>
  );
};

export default TeamsPage;
