import React from 'react';
import Rooms from '@/components/Rooms/RoomList';
import { RoomsProvider } from '@/contexts/RoomsContext';
import TitleBar from '@/components/common/TitleBar';
import ConnectedTeam from '@/components/Websocket/ConnectedTeam';
import { useOBS } from '@/contexts/OBSContext';


const RoomsPage = () => {
  const { obs, connectedTeams } = useOBS();

  return (
    <RoomsProvider>
      <div className=''>
      
      {obs && connectedTeams.length > 0 && (
        
         <ConnectedTeam />
          )}
      <div className={`flex flex-col relative ${obs ? '-z-10' : 'z-0'}`}>
        <TitleBar title='Rooms' />
        <div className='px-4'>
        <Rooms />
        </div>
      </div>
      </div>
    </RoomsProvider>
  );
};

export default RoomsPage;
