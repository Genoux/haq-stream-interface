import React from 'react';
import Teams from '@/components/Teams/TeamList';
import TitleBar from '@/components/common/TitleBar';
import { TeamsProvider } from '@/contexts/TeamsContext';

const TeamsPage = () => {

  return (
    <TeamsProvider>
      <TitleBar title='Teams'></TitleBar>
      <div className='flex flex-col gap-4' >
        <Teams />
      </div>
      </TeamsProvider>
  );
};

export default TeamsPage;
