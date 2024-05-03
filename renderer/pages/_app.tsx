import React from 'react'
import type { AppProps } from 'next/app'
import { ThemeProvider } from "@/components/theme-provider"
import '../styles/globals.css'
import { Toaster } from "@/components/ui/toaster"
import { OBSProvider } from '@/contexts/OBSContext';
//import { ThemeProvider } from '@shadcn/ui'; // Assuming Shade UI uses a ThemeProvider

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
      <OBSProvider>
        <Component {...pageProps} />
        <Toaster />
      </OBSProvider>
    </ThemeProvider>
  );
}

export default MyApp;
