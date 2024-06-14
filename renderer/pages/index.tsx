// pages/TeamsPage.tsx
import React from 'react';
import Teams from '@/components/Teams/TeamList';
import { TeamsProvider } from '@/contexts/TeamsContext';
import { MatchProvider, useMatch } from '@/contexts/MatchContext';
import Match from '@/components/Match';
import { AnimatePresence, motion } from 'framer-motion';
import { useOBS } from '@/contexts/OBSContext';
import ConnectionView from '@/components/Websocket/ConnectionView';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

// HERE check for obs connection and prompt a input to connect
const IndexPageContent = () => {
  const { match } = useMatch();
  const { obs } = useOBS();

  return (
    <div className=''>
      {!obs && (
        <ConnectionView />
      )}
      <div className='flex gap-1'>
        <section className='w-full'>
          {match && (
            <Match />
          )}
          <div className={`${match ? 'z-0 opacity-50' : 'z-0'}`}>
            <Teams />
          </div>
        </section>
        <section className='w-full hidden'>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$45,231.89</div>
              <p className="text-xs text-muted-foreground">+20.1% from last month</p>
            </CardContent>
          </Card>

        </section>
      </div>
    </div>
  );

};

const IndexPage = () => {
  return (
    <TeamsProvider>
      <MatchProvider>
        <IndexPageContent />
      </MatchProvider>
    </TeamsProvider>
  );
};

export default IndexPage;
