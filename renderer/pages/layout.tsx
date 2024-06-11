'use client';

import React, { useEffect } from 'react';
import AsideNavigation from "@/components/common/AsideNavigation";
import { TooltipProvider } from "@/components/ui/tooltip";
import '@/utils/strings'; // Import the global utility file here

type LayoutProps = {
  children: React.ReactNode;
};

export default function Layout({ children }: LayoutProps) {
  return (
    <div>
      <TooltipProvider delayDuration={0}>
        <div className="h-full flex items-stretch">
          <AsideNavigation />
          <main className="min-h-screen pl-[54px] w-full">{children}</main>
        </div>
      </TooltipProvider>
    </div>
  );
}
