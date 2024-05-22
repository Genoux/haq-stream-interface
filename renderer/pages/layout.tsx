'use client';

import React, { useState } from 'react';
import { cn } from "@/lib/utils";
import AsideNavigation from "@/components/common/AsideNavigation";
import { useOBS } from '@/contexts/OBSContext';
import { useLayout } from '@/contexts/DataContext';
import { TooltipProvider } from "@/components/ui/tooltip";

import '@/utils/strings'; // Import the global utility file here

type LayoutProps = {
  children: React.ReactNode;
};

export default function Layout({ children }: LayoutProps) {
  const { dataComponent } = useLayout();

  return (
    <div>
      <TooltipProvider delayDuration={0}>
        <div className="h-full flex items-stretch">
          <AsideNavigation />
          <main className="min-h-screen pl-[54px] w-full">{children}</main>
          <aside className="min-w-[440px] border-l hidden">{dataComponent}</aside>
        </div>
      </TooltipProvider>
    </div>
  );
}
