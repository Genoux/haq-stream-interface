import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import supabase from '@/utils/supabase/client';

interface Room {
  [key: string]: any;
}

export default function HomePage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data, error } = await supabase.from('rooms').select('*')
        if (error) throw error;
        console.log('data:', data);
        setData(data);
      } catch (error) {
        console.error(error);
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if(!data) return null


  return (
    <React.Fragment>
      <Head>
        <title>Home - Nextron (with-tailwindcss)</title>
      </Head>
      <div className="grid grid-col-1 text-2xl w-full text-center">
        <h1 className="text-3xl font-bold">Home Page</h1>
        {loading && <p>Loading...</p>}
        {error && <p>{error.message}</p>}
        {data && (
          <div className='flex flex-col gap-2'>
            {data.map((room: Room) => (
                <Link href={`/${room.id}`} key={room.id}>{room.id}</Link>
            ))}
          </div>
        )}
      </div>
    </React.Fragment>
  );
}
