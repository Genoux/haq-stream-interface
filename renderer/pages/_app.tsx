import React from 'react'
import type { AppProps } from 'next/app'
import { ThemeProvider } from "@/components/theme-provider"
import '../styles/globals.css'
//import { ThemeProvider } from '@shadcn/ui'; // Assuming Shade UI uses a ThemeProvider

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem> {/* Wrap your components in the ThemeProvider if one is provided */}
      <Component {...pageProps} />
    </ThemeProvider>
  );
}

export default MyApp;
