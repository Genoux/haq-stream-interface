import { createContext, useContext, useEffect, useState } from 'react';
import { supabase_adp } from '@/utils/supabase/client';
import { Room } from '@/types/global';

type RoomsContextValue = {
  rooms: Room[];
  loading: boolean;
  error: Error | null;
  activeRoom: Room | null;
  setActiveRoom: (room: Room | null) => void;
  fetchRooms: () => void;
};

const RoomsContext = createContext<RoomsContextValue>({
  rooms: [],
  loading: false,
  error: null,
  activeRoom: null,
  setActiveRoom: () => { },
  fetchRooms: () => { },
});

export const RoomsProvider = ({ children }) => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  const [activeRoom, setActiveRoomState] = useState<Room | null>(null);

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

  useEffect(() => {
    fetchRooms();
  }, []);

  useEffect(() => {
    if (!activeRoom) return;

    // Subscribe to updates for the active room
    const channel = supabase_adp
      .channel('*')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'aram_draft_pick',
          table: 'rooms',
          filter: `id=eq.${activeRoom.id}`,
        },
        async (payload: any) => {
          if (payload.eventType === 'UPDATE' || payload.eventType === 'INSERT') {
            try {
              const { data, error } = await supabase_adp
                .from('rooms')
                .select('*, red(*), blue(*)')
                .eq('id', payload.new.id)
                .single();

              if (error) throw error;

              setActiveRoomState(data);
            } catch (error) {
              console.error('Error fetching updated room:', error.message);
            }
          } else if (payload.eventType === 'DELETE') {
            setActiveRoomState(null);
          }
        }
      )
      .subscribe(() => {
        console.log('Subscribed to active room updates.');
      });

    return () => {
      channel.unsubscribe();
      console.log('Unsubscribed from active room updates.');
    };
  }, [activeRoom]);

  const setActiveRoom = async (room: Room | null) => {
    if (room) {
      try {
        const { data, error } = await supabase_adp
          .from('rooms')
          .select('*, red(*), blue(*)')
          .eq('id', room.id)
          .single();

        if (error) throw error;

        setActiveRoomState(data);
      } catch (error) {
        console.error('Error fetching active room:', error.message);
      }
    } else {
      setActiveRoomState(null);
    }
  };

  return (
    <RoomsContext.Provider value={{ rooms, loading, error, activeRoom, setActiveRoom, fetchRooms }}>
      {children}
    </RoomsContext.Provider>
  );
};

export const useRooms = () => useContext(RoomsContext);
