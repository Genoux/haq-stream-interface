import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/utils/supabase/client';

type Team = {
  id: string;
  [key: string]: any;
};

type TeamsContextValue = {
  teams: Team[];
  loading: boolean;
  error: Error | null;
  fetchTeams: () => void;
};

const TeamsContext = createContext<TeamsContextValue>({
  teams: [],
  loading: false,
  error: null,
  fetchTeams: () => {},
});

export const TeamsProvider = ({ children }) => {
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null); 

      // Fetch initial list of teams
      const fetchTeams = async () => {
        try {
          setLoading(true);
          const { data, error } = await supabase.from('registrations').select('*');
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

  useEffect(() => {
    fetchTeams();
  }, []);

  return (
    <TeamsContext.Provider value={{ teams, loading, error, fetchTeams }}>
      {children}
    </TeamsContext.Provider>
  );
};

export const useTeams = () => useContext(TeamsContext);
