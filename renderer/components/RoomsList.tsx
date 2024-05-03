'use client'

import { supabase_adp } from '@/utils/supabase/client';
import { useEffect, useState } from 'react';
import Link from 'next/link';

interface Room {
  [key: string]: any;
}

const RoomList = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data, error } = await supabase_adp.from('rooms',).select('*')
        if (error) throw error;
        console.log('data:', data);
        setData(data);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (!data) return null
  if (error) return <p>{error.message}</p>
  if(loading) return <p>Loading...</p>
  return (
    <>
          {data && (
            <div className='flex flex-col gap-2'>
              {data.map((room: Room) => (
                <Link href={`/${room.id}`} key={room.id}>{room.id}</Link>
              ))}
            </div>
          )}

    </>
  );
};

export default RoomList;
