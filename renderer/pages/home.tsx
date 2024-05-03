import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import RoomList from '@/components/RoomsList';
import { Button } from '@/components/ui/button';

export default function HomePage() {
  return (
    <React.Fragment>
      <Head>
        <title>Home - Nextron (with-tailwindcss)</title>
      </Head>

      <body className="grid grid-col-1 text-2xl w-full text-center">
        <h1 className="text-3xl font-bold">Home Page</h1>
        <Link href={`/obs`} ><Button>OBS </Button></Link>
        <Link href={`/rooms`} ><Button>Rooms </Button></Link>
      </body>

    </React.Fragment>
  );
}
