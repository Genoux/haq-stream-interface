import { createContext, useContext, useEffect, useState } from 'react';
import { supabase_adp } from '@/utils/supabase/client';
import { Room } from '@/types/global';

type RoomsContextValue = {
  rooms: Room[];
  loading: boolean;
  error: Error | null;
  activeRoom: Room | null;
  setActiveRoom: (room: Room | null) => void;
};

const RoomsContext = createContext<RoomsContextValue>({
  rooms: [],
  loading: false,
  error: null,
  activeRoom: null,
  setActiveRoom: () => {},
});

export const RoomsProvider = ({ children }) => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  const [activeRoom, setActiveRoom] = useState<Room | null>(null);

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
      const { data, error } = await supabase_adp.from('rooms').select('*, red(*), blue(*)').eq('id', roomId);
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
        const { data, error } = await supabase_adp.from('rooms').select('*, red(*), blue(*)');
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
    <RoomsContext.Provider value={{ rooms, loading, error, activeRoom, setActiveRoom }}>
      {children}
    </RoomsContext.Provider>
  );
};

export const useRooms = () => useContext(RoomsContext);
