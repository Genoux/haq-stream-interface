// pages/TeamsPage.tsx
import React from 'react';
import Teams from '@/components/Teams/TeamList';
import { TeamsProvider } from '@/contexts/TeamsContext';
import { MatchProvider, useMatch } from '@/contexts/MatchContext';
import Match from '@/components/Match';
import { AnimatePresence, motion } from 'framer-motion';
import { useOBS } from '@/contexts/OBSContext';
import ConnectionView from '@/components/Websocket/ConnectionView';

// HERE check for obs connection and prompt a input to connect
const IndexPageContent = () => {
  const { match } = useMatch();
  const { obs } = useOBS();



  return (
    <div>
  
      <div className='relative flex flex-col'>
     
        {match && obs ? (
          <Match />
        ) : (
          <ConnectionView />
            )}
        <div className={`${match || !obs ? '-z-10 opacity-50' : 'z-0'}`}>
          <AnimatePresence mode='wait'>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2, delay: 0.2 }}
            >
              <Teams />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

const IndexPage = () => {
  return (
    <TeamsProvider>
      <MatchProvider>
        <IndexPageContent />
      </MatchProvider>
    </TeamsProvider>
  );
};

export default IndexPage;
