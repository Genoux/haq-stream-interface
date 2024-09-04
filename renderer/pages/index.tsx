// pages/TeamsPage.tsx
import React from 'react';
import Teams from '@/components/Teams/TeamList';
import { TeamsProvider } from '@/contexts/TeamsContext';
import { MatchProvider, useMatch } from '@/contexts/MatchContext';
import Match from '@/components/Match';
import { AnimatePresence, motion } from 'framer-motion';
import { useOBS } from '@/contexts/OBSContext';
import ConnectionView from '@/components/Websocket/ConnectionView';
import RoomsRowItem from '@/components/Rooms/RoomsRowItem';
import RoomsTable from '@/components/Rooms/RoomsTable';
import { RoomsProvider } from '@/contexts/RoomsContext';

const IndexPageContent = () => {
  const { match } = useMatch();
  const { obs } = useOBS();

  const filterAllRooms = (rooms) => {
    return rooms;
  };

  return (
    <div className='px-3 pt-9'>
      {!obs && (
        <ConnectionView />
      )}
      <div className='flex gap-1'>
        <section className='w-full'>
          {match && (
            <Match />
          )}
          <div className={`${match ? 'z-0 opacity-50' : 'z-0'}`}>
            <Teams />
          </div>
        </section>

        <AnimatePresence mode='wait'>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2, delay: 0.2 }}
            className='border rounded-sm bg-background w-full hidden'
          >
            <RoomsProvider>
              <RoomsTable filterRooms={filterAllRooms}>
                {(filteredRooms) => filteredRooms.map(room => (
                  <RoomsRowItem key={room.id} room={room} />
                ))}
              </RoomsTable>
            </RoomsProvider>
          </motion.div>
        </AnimatePresence>


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
