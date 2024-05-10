import React, { useEffect, useState } from 'react';
import { supabase_ttm } from '@/utils/supabase/client';
import Loading from '@/components/Loading';
import Teams from '@/components/Teams/TeamList';
import OBSConnection from '@/components/Websocket/OBSConnection';
import { useOBS } from '@/contexts/OBSContext';
import { TeamsProvider } from '@/contexts/TeamsContext';
import ConnectedTeams from '@/components/Websocket/ConnectedTeams';

const TeamsPage = () => {
  //const [teams, setTeams] = useState([]);
  const [selectedTeams, setSelectedTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const { obs } = useOBS();


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
  //if (loading) return <Loading />;

  return (
    <TeamsProvider>
      <section className='flex flex-col'>
        {obs ? (
          <ConnectedTeams />
        ) : (
          <>
              <div className={`border-b border-border/40 w-full h-[52px] flex items-center px-4 justify-between bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-10`}>
                <h1 className='text-xl font-bold'>Teams</h1>
              <OBSConnection selectedTeams={selectedTeams} />
            </div>
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
