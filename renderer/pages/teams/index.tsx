// pages/TeamsPage.tsx
import React from 'react';
import Teams from '@/components/Teams/TeamList';
import { TeamsProvider } from '@/contexts/TeamsContext';
import { MatchProvider, useMatch } from '@/contexts/MatchContext';
import Match from '@/components/Match';
import { AnimatePresence, motion } from 'framer-motion';

const TeamsPageContent = () => {
  const { match } = useMatch();

  return (
    <div className='relative flex flex-col'>
      {match && (
        <Match />
      )}
      <div className={`${match ? '-z-10 opacity-50' : 'z-0'}`}>
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
  );
};

const TeamsPage = () => {
  return (
    <TeamsProvider>
      <MatchProvider>
        <TeamsPageContent />
      </MatchProvider>
    </TeamsProvider>
  );
};

export default TeamsPage;
