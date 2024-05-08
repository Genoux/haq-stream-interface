import React from 'react'
import type { AppProps } from 'next/app'
import { ThemeProvider } from "@/components/theme-provider"
import '@/styles/globals.css'
import { Toaster } from "@/components/ui/toaster"
import { OBSProvider } from '@/contexts/OBSContext';
import Layout from '@/pages/layout';
import { GeistSans } from 'geist/font/sans';
import { LayoutProvider } from '@/contexts/DataContext';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <LayoutProvider>

    <Layout navCollapsedSize={4}>
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
        <OBSProvider>
          <main className={GeistSans.className}>
            <Component {...pageProps} />
          </main>
          <Toaster />
        </OBSProvider>
      </ThemeProvider>
      </Layout>
      </LayoutProvider>

  );
}

export default MyApp;
