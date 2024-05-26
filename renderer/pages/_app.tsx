import React from 'react';
import type { AppProps } from 'next/app';
import { ThemeProvider } from "@/components/theme-provider";
import '@/styles/globals.css';
import { Toaster } from "@/components/ui/toaster";
import { OBSProvider } from '@/contexts/OBSContext';
import Layout from '@/pages/layout';
import { GeistSans } from 'geist/font/sans';
import { LayoutProvider } from '@/contexts/DataContext';
import { ServerStatusProvider } from "@/contexts/ServerStatusContext";

function MyApp({ Component, pageProps }: AppProps) {
  const getLayout = (Component as any).getLayout || ((page: React.ReactNode) => (
    <Layout>
      <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
        <OBSProvider>
          <main className={GeistSans.className}>
            {page}
          </main>
          <Toaster />
        </OBSProvider>
      </ThemeProvider>
    </Layout>
  ));

  return (
    <LayoutProvider>
      <ServerStatusProvider>
        {getLayout(<Component {...pageProps} />)}
      </ServerStatusProvider>
    </LayoutProvider>
  );
}

export default MyApp;
