import React, { useEffect, useState } from 'react';
import { supabase_ttm } from '@/utils/supabase/client';
import Loading from '@/components/Loading';
import Teams from '@/components/Teams/TeamList';
import OBSConnection from '@/components/Websocket/OBSConnection';
import { useOBS } from '@/contexts/OBSContext';
import { TeamsProvider } from '@/contexts/TeamsContext';
import ConnectedTeams from '@/components/Websocket/ConnectedTeams';

const TeamsPage = () => {
  const [teams, setTeams] = useState([]);
  const [selectedTeams, setSelectedTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const { obs } = useOBS();

  useEffect(() => {
    const fetchTeams = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase_ttm.from('teams').select('*');
        if (error) throw error;
        setTeams(data);
      } catch (error) {
        console.error('Error fetching teams:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchTeams();
  }, []);

  if (loading) return <Loading />;
  if (!teams.length) return <p>No data found</p>;

  return (
    <TeamsProvider>
      <section className='flex flex-col gap-4'>


     
      <div className='w-full flex justify-end'>
        
      <OBSConnection selectedTeams={selectedTeams} />

</div>
      {obs ? (
           <ConnectedTeams />

      ) : (
          <div className='border rounded-lg p-4'>
        <Teams teams={teams} selectedTeams={selectedTeams} onSelectedTeamsChange={setSelectedTeams} />
            
        </div>
        )}
         </section>
    </TeamsProvider>
  );
};

export default TeamsPage;
