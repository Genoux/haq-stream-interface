import React from 'react';
import type { AppProps } from 'next/app';
import { ThemeProvider } from "@/components/theme-provider";
import '@/styles/globals.css';
import { Toaster } from "@/components/ui/toaster";
import Layout from '@/pages/layout';
import { GeistSans } from 'geist/font/sans';

function MyApp({ Component, pageProps }: AppProps) {
  return(
    <Layout>
      <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          <main className={GeistSans.className}>
          <Component {...pageProps} />
          </main>
          <Toaster />
      </ThemeProvider>
    </Layout>
  );
}

export default MyApp;
