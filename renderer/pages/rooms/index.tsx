import React from 'react';
import Rooms from '@/components/Rooms/RoomList';
import { RoomsProvider } from '@/contexts/RoomsContext';
import TitleBar from '@/components/common/TitleBar';
import ConnectedTeam from '@/components/Websocket/ConnectedTeam';
import { useOBS } from '@/contexts/OBSContext';
import { AnimatePresence, motion } from 'framer-motion';

const RoomsPage = () => {
  const { obs, connectedTeams } = useOBS();

  return (
    <RoomsProvider>

      {obs && connectedTeams.length > 0 && (
        <ConnectedTeam />
      )}
      <div className={`flex flex-col relative ${obs ? '-z-10' : 'z-0'}`}>
        <TitleBar title='Rooms' />
        <div className='px-4'>
          <AnimatePresence mode='wait'>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2, delay: 0.2 }}
            >
              <Rooms />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

    </RoomsProvider>
  );
};

export default RoomsPage;
