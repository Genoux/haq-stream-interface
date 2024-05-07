import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import RoomList from '@/components/RoomsList';

export default function Rooms() {
  return (
    <React.Fragment>
      <Head>
        <title>Home - Nextron (with-tailwindcss)</title>
      </Head>

      <body className="grid grid-col-1 text-2xl w-full text-center">
        <h1 className="text-3xl font-bold">Rooms Page</h1>
        <RoomList />
      </body>

    </React.Fragment>
  );
}
