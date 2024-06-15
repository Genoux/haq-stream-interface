'use client';

import React, { useState } from 'react';
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import AsideNavigation from "@/components/common/AsideNavigation";
import '@/utils/strings'; // Import the global utility file here
import Head from 'next/head'
import { Toaster } from "@/components/ui/toaster";
type LayoutProps = {
  children: React.ReactNode;
};

export default function DraftLayout({ children }: LayoutProps) {
  return (
    <>
     <Head>
      <title>Draft Layout</title>
    </Head>
      <main>{children}</main>
      <Toaster />
    </>
  );
}
