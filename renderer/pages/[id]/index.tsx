import React from 'react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import supabase from '@/utils/supabase/client';
import { TemplateContext } from 'next/dist/shared/lib/app-router-context.shared-runtime';

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
            ban.name ? <p key={index}>{ban.name}</p> : <div key={index} className='bg-gray-700 bg-opacity-50 w-12 h-12 rounded'></div>
          ))}
        </div>
      </div>
      <div>
        <h3>{team.color} pick</h3>
        <div className='flex gap-2'>
          {team.heroes_selected.map((hero: any, index: number) => (
            hero.name ? <p key={index}>{hero.name}</p> : <div key={index} className='bg-gray-700 bg-opacity-50 w-12 h-12 rounded'></div>
          ))}
        </div>
      </div>
    </div>
  );
};

const Page: React.FC = () => {
  const router = useRouter();
  const { id } = router.query; // Access route parameter

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data, error } = await supabase.from('rooms').select('*, blue(*), red(*)').eq('id', id).single();
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

  if (!data) return <p>non</p>;
  
  if(data.status !== 'done') return <p>draft is not done</p>;

  return (
    <div>
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
