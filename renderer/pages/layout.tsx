'use client';

import React from 'react';
import { TooltipProvider } from "@/components/ui/tooltip";
import { OBSProvider } from '@/contexts/OBSContext';
import '@/utils/strings'; // Import the global utility file here

type LayoutProps = {
  children: React.ReactNode;
};

export default function Layout({ children }: LayoutProps) {
  return (
    <OBSProvider>
      <TooltipProvider delayDuration={0}>
        <div className="h-full flex items-stretch">
          <main className="min-h-screen w-full">{children}</main>
        </div>
      </TooltipProvider>
    </OBSProvider>
  );
}
