'use client'

import React, { useEffect } from 'react';
import Link from 'next/link';
import { useState } from 'react';
import { cn } from "@/lib/utils"
import { Button } from '@/components/ui/button';
import { ArrowLeftIcon } from '@radix-ui/react-icons';
import { useOBS } from '@/contexts/OBSContext';
import { TooltipProvider } from "@/components/ui/tooltip";
import { useRouter } from 'next/router';

import {
  File,
  Unplug,
} from "lucide-react"
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable"
import { Separator } from "@/components/ui/separator"
import Navigation from "@/components/common/navigation"
type LayoutProps = {
  children: React.ReactNode;
  defaultLayout?: number[] | undefined
  defaultCollapsed?: boolean
  navCollapsedSize: number
}

export default function Layout({
  children,
  defaultLayout = [160, 440, 655],
  navCollapsedSize,
}: LayoutProps) {
  const [isCollapsed, setIsCollapsed] = useState(false)

  return (
    <div>
      <TooltipProvider delayDuration={0}>
        <ResizablePanelGroup
          direction="horizontal"
          className="h-full items-stretch"
        >
          <ResizablePanel
            defaultSize={defaultLayout[0]}
            collapsedSize={navCollapsedSize}
            collapsible={true}
            minSize={15}
            maxSize={20}
            onCollapse={() => {
              setIsCollapsed(true)
            }}
            onExpand={() => {
              setIsCollapsed(false)
            }}
            className={cn(
              isCollapsed &&
              "min-w-[50px] transition-all duration-300 ease-in-out"
            )}
          >
            <div
              className={cn(
                "flex h-[52px] items-center justify-start ",
                isCollapsed ? "h-[52px] justify-center" : "px-4"
              )}
            >
              <svg width="20" height="28" viewBox="0 0 20 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M19.8207 12.8582C19.5173 11.6191 18.8093 10.5122 17.5853 9.96138C17.3151 9.84052 16.7723 9.75147 16.4151 9.70567C16.1949 9.67641 16.0041 9.53901 15.9081 9.34182L11.3859 0C11.3859 0 5.90998 19.1887 1.26367 9.35581C1.26367 9.35581 -2.02038 15.4268 1.99985 17.8033C2.26872 17.9623 2.89224 18.1913 3.71037 18.2536C5.68592 13.2615 9.95581 9.70185 14.9401 9.85833C14.6098 9.95502 14.2884 10.0772 13.9722 10.2107C10.6267 11.6229 8.14799 14.5222 7.3337 18.0781C6.54758 21.5079 7.49246 25.2062 9.60116 28C8.27474 23.5575 13.7942 10.3087 18.9591 18.26C18.9591 18.26 19.7529 16.2066 19.8335 15.853C20.0486 14.9115 20.0653 13.8416 19.8246 12.8569H19.822L19.8207 12.8582Z" fill="white" />
              </svg>
            </div>
            <Separator />
            <Navigation
              isCollapsed={isCollapsed}
            />
          </ResizablePanel>
          <ResizableHandle withHandle />
          <ResizablePanel defaultSize={defaultLayout[1]} minSize={30}>
          <main className='min-h-screen p-4'> {children} </main>
          </ResizablePanel>
          <ResizableHandle withHandle />
          <ResizablePanel minSize={30}>
            data
          </ResizablePanel>
        </ResizablePanelGroup>
      </TooltipProvider>
    </div>
  );
};
