import React from 'react';
import Rooms from '@/components/Rooms/RoomList';
import { RoomsProvider } from '@/contexts/RoomsContext';
import TitleBar from '@/components/common/TitleBar';
import ConnectedGame from '@/components/Websocket/ConnectedGame';
import { useOBS } from '@/contexts/OBSContext';
import { AnimatePresence, motion } from 'framer-motion';

const RoomsPage = () => {
  const { obs, game } = useOBS();

  return (
    <RoomsProvider>

      {obs && game && (
        <div>
          <ConnectedGame />
        </div>
      )}
      <div className={`flex flex-col relative ${obs ? '-z-10' : 'z-0'}`}>
        <TitleBar title='Rooms' />
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

    </RoomsProvider>
  );
};

export default RoomsPage;
