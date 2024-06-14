'use client';

import React from 'react';
import { TooltipProvider } from "@/components/ui/tooltip";
import { OBSProvider } from '@/contexts/OBSContext';
import '@/utils/strings'; // Import the global utility file here
import { motion } from 'framer-motion';
import  AsideNavigation  from '@/components/common/AsideNavigation';

type LayoutProps = {
  children: React.ReactNode;
};

export default function Layout({ children }: LayoutProps) {
  return (
    <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 0.1 }}> 
    <OBSProvider>
        <TooltipProvider delayDuration={0}>
          <main className="min-h-screen w-full h-full bg-muted/10 p-2">{children}</main>
      </TooltipProvider>
      </OBSProvider>
      </motion.div>
  );
}
