import { createContext, useContext, useEffect, useState } from 'react';
import { supabase_adp, supabase_ttm } from '@/utils/supabase/client';

type Room = {
  id: string; // Ensure this matches your team ID field type
  [key: string]: any;
};

type RoomsContextValue = {
  rooms: Room[];
  loading: boolean;
  error: Error | null;
};

const RoomsContext = createContext<RoomsContextValue>({
  rooms: [],
  loading: false,
  error: null,
});

export const RoomsProvider = ({ children }) => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    // Subscribe to room updates
    const channel = supabase_adp
      .channel('*')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'aram_draft_pick',
          table: 'rooms',
        },
        (payload: any) => {
          console.log('Room update received:', payload);
          if (payload.eventType === 'INSERT') {
            fetchSingleRoom(payload.new.id);
          } else if (payload.eventType === 'UPDATE') {
            setRooms((prevRooms) =>
              prevRooms.map((room) =>
                room.id === payload.new.id
                  ? { ...room, ...Object.fromEntries(Object.entries(payload.new).filter(([key, _]) => key !== 'red' && key !== 'blue')) }
                  : room
              )
            );
          } else if (payload.eventType === 'DELETE') {
            setRooms((prevRooms) =>
              prevRooms.filter((room) => room.id !== payload.old.id)
            );
          }
        }
      )
      .subscribe(() => {
        console.log('Subscribed to room updates.');
      });

    return () => {
      channel.unsubscribe();
      console.log('Unsubscribed from all room updates.');
    };
  }, []);


  const fetchSingleRoom = async (roomId: any) => {
    try {
      const { data, error } = await supabase_adp.from('rooms').select('*, red(name), blue(name)').eq('id', roomId);
      if (error) throw error;
      setRooms((prevRooms) => [...prevRooms, data[0]]);
    } catch (error) {
      console.error('Error fetching room:', error.message);
    }
  };


  useEffect(() => {
    const fetchRooms = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase_adp.from('rooms').select('*, red(name), blue(name)');
        if (error) {
          throw new Error(error.message);
        }
        setRooms(data || []);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchRooms();
  }, []);

  return (
    <RoomsContext.Provider value={{ rooms, loading, error }}>
      {children}
    </RoomsContext.Provider>
  );
};

export const useRooms = () => useContext(RoomsContext);
