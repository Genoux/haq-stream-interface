import React, { useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import RoomList from '@/components/RoomsList';

const TestComponent: React.FC = () => {
  return (
    <div>
      <h1>This is a Test Component</h1>
      <p>If you see this, it means the dynamic component loading is working!</p>
    </div>
  );
};

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
