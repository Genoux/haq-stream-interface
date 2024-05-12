import React from 'react';
import Rooms from '@/components/Rooms/RoomList';
import { RoomsProvider } from '@/contexts/RoomsContext';
import TitleBar from '@/components/common/TitleBar';

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
