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
  setActiveRoom: () => {},
  fetchRooms: () => {},
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
    // Subscribe to inserts, updates, and deletions in the rooms table
    const channel = supabase_adp
      .channel('aram_draft_pick:rooms')
      .on('postgres_changes', { event: 'INSERT', schema: 'aram_draft_pick', table: 'rooms' }, async (payload) => {
        console.log(".on - payload:", payload);
        try {
          const { data, error } = await supabase_adp
            .from('rooms')
            .select('*, red(*), blue(*)')
            .eq('id', payload.new.id)
            .single();
          if (error) throw error;
          setRooms((prevRooms) => [...prevRooms, data]);
        } catch (error) {
          console.error('Error fetching new room:', error.message);
        }
      })
      .on('postgres_changes', { event: 'UPDATE', schema: 'aram_draft_pick', table: 'rooms' }, async (payload) => {
        console.log(".on - payload:", payload);
        try {
          const { data, error } = await supabase_adp
            .from('rooms')
            .select('*, red(*), blue(*)')
            .eq('id', payload.new.id)
            .single();
          if (error) throw error;
          setRooms((prevRooms) => prevRooms.map((room) => (room.id === payload.new.id ? data : room)));
        } catch (error) {
          console.error('Error fetching updated room:', error.message);
        }
      })
      .on('postgres_changes', { event: 'DELETE', schema: 'aram_draft_pick', table: 'rooms' }, (payload) => {
        const deletedRoomId = payload.old.id;
        setRooms((prevRooms) => prevRooms.filter((room) => room.id !== deletedRoomId));
      })
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (!activeRoom) return;

    // Subscribe to updates for the active room
    const channel = supabase_adp
      .channel(`room-${activeRoom.id}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'aram_draft_pick',
          table: 'rooms',
          filter: `id=eq.${activeRoom.id}`,
        },
        async (payload: any) => {
          console.log("payload:", payload);
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
      .subscribe();

    return () => {
      channel.unsubscribe();
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
