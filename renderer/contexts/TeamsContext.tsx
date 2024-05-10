import { createContext, use, useContext, useEffect, useState } from 'react';
import { supabase_ttm } from '@/utils/supabase/client';

type Team = {
  [key: string]: any;
};

type TeamsContextValue = {
  teams: Team[];
  loading: boolean;
  error: Error | null;
};

const TeamsContext = createContext<TeamsContextValue>({
  teams: [],
  loading: false,
  error: null,
});

export const TeamsProvider = ({ children }) => {
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const channel = supabase_ttm
      .channel('*')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'live_tournament',
          table: 'teams',
        },
        (payload: any) => {
          console.log('Team update received:', payload);
          if (payload.eventType === 'INSERT') {
            setTeams((prevTeams) => [...prevTeams, payload.new]);
          }
        }
      )
      .subscribe(() => {
        console.log('Subscribed to team updates.');
      });

    return () => {
      channel.unsubscribe();
      console.log('Unsubscribed from all team updates.');
    };
  }, []);

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase_ttm.from('teams').select('*');
        if (error) {
          throw new Error(error.message);
        }
        setTeams(data || []);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchTeams();
  }, []);

  return (
    <TeamsContext.Provider value={{ teams, loading, error }}>
      {children}
    </TeamsContext.Provider>
  );
};

export const useTeams = () => useContext(TeamsContext);
