import React from 'react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { supabase_adp } from '@/utils/supabase/client';
import LoadingCircle from '@/components/LoadingCircle';
import Image from 'next/image';
// Assuming your TeamComponent stays the same
interface TeamDataProps {
  team: {
    [key: string]: any;
  };
}

const TeamComponent: React.FC<TeamDataProps> = ({ team }) => {

  return (
    <div>
      <div>
        <h3>{team.color} ban</h3>
        <div className='flex gap-2'>
          {team.heroes_ban.map((ban: any, index: number) => (
            ban.name ?
              <p key={index}>{ban.id}</p>
              :
              <div key={index} className='bg-gray-700 bg-opacity-50 w-12 h-12 rounded'></div>
          ))}
        </div>
      </div>
      <div>
        <h3>{team.color} pick</h3>
        <div className='flex gap-2'>
          {team.heroes_selected.map((hero: any, index: number) => (
            hero.name ?
              <div className='w-full h-96 overflow-hidden'>
                <Image
                  className="h-full overflow-hidden object-cover"
                  width={500}
                  height={500}
                  quality={80}
                  src={
                    hero.id
                      ? `https://draft.tournoishaq.ca/images/champions/splash/${hero.id
                        .toLowerCase()
                        .replace(/\s+/g, '')
                        .replace(/[\W_]+/g, '')}.jpg`
                      : ''
                  }
                  alt={''}
                />
                <p key={index}>{hero.name}</p>
              </div>
              : <div key={index} className='bg-gray-700 bg-opacity-50 w-12 h-12 rounded'></div>
          ))}
        </div>
      </div>
    </div>
  );
};

const Page: React.FC = () => {
  const router = useRouter();
  const [id, setId] = useState<string | undefined>(router.query.id as string);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch the id from local storage if it's not in the URL
    if (!id) {
      const storedId = localStorage.getItem('lastTeamId');
      if (storedId) {
        setId(storedId);
      }
    }
  }, [id]);

  useEffect(() => {
    if (id) {
      localStorage.setItem('lastTeamId', id); // Store the current id to local storage
      const fetchData = async () => {
        try {
          const { data, error } = await supabase_adp.from('rooms').select('*, blue(*), red(*)').eq('id', id).single();
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
    }
  }, [id]); // Dependency on id ensures this runs when id changes

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center w-full h-screen">
        <LoadingCircle />
      </div>
    )
  }

  if (error) {
    if (error.code === "PGRST116") {
      router.push('/home');
    }
    return <div>Error loading data.</div>;
  }

  if (!data) {
    return <div>No data found for id: {id}</div>;
  }

  return (
    <div className='mt-6'>
      <Link href="/home">home</Link>
      <h1>{id}</h1>
      <p>This is a simple TSX page.</p>
      <div className='flex flex-col gap-2'>
        <TeamComponent team={data.blue} />
        <hr />
        <TeamComponent team={data.red} />
      </div>
    </div>
  );
};

export default Page;
