import React from 'react';
import Rooms from '@/components/Rooms/RoomList';
import OBSConnection from '@/components/Websocket/OBSConnection';
import { useOBS } from '@/contexts/OBSContext';
import { RoomsProvider } from '@/contexts/RoomsContext';
import ConnectedTeams from '@/components/Websocket/ConnectedTeams';
import TitleBar from '@/components/common/TitleBar';
import { motion, AnimatePresence } from 'framer-motion';

const RoomsPage = () => {
  return (
    <RoomsProvider>
      <div className='flex flex-col'>
        <TitleBar title='Rooms' />
        <div className='px-4 py-4'>
        <Rooms />
        </div>
      </div>
    </RoomsProvider>
  );
};

export default RoomsPage;
