'use client'

import Link from "next/link"
import { User2, Plug, Server, DoorOpen, LayoutPanelTop  } from "lucide-react"
import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { TooltipProvider } from "@/components/ui/tooltip"
import ServerStatusDot from "@/components/common/ServerStatusDot";
import { useRouter } from 'next/router';
import { appVersion } from '@/utils/version';
import { useContext } from "react";
import { ServerStatusContext } from "@/contexts/ServerStatusContext";
import { Logo } from 'haq-assets';

export default function AsideNavigation() {
  const { allServersHealthy } = useContext(ServerStatusContext);
  const router = useRouter();

  const links = [
    {
      title: "Rooms",
      label: '',
      icon: DoorOpen,
      variant: router.pathname === "/rooms" ? "default" : "ghost",
      href: "/rooms",
    },
    {
      title: "Teams",
      label: '',
      icon: User2,
      variant: router.pathname === "/teams" ? "default" : "ghost",
      href: "/teams",
    },
    {
      title: "Servers",
      label: '',
      icon: Server,
      variant: router.pathname === "/servers" ? "default" : "ghost",
      href: "/servers",
    },
  ] as any


  return (
    <TooltipProvider delayDuration={0}>
      <aside
        className="min-w-[52px] border-r border-border/40 fixed h-full bg-black z-10 flex flex-col"
      >
        <div className="flex h-[52px] w-[52px] items-center justify-center border-b border-border/40">
          <Logo fill="white" size={32} />
        </div>
        <div
          data-collapsed={true}
          className="group flex flex-col gap-4 py-2 data-[collapsed=true]:py-2"
        >
          <nav className="grid gap-1 px-2 group-[[data-collapsed=true]]:justify-center group-[[data-collapsed=true]]:px-2">
            {links.map((link, index) =>
              <Tooltip key={index} delayDuration={0}>
                <TooltipTrigger asChild>
                  <Link
                    href={link.href}
                    className={cn(
                      buttonVariants({ variant: link.variant, size: "icon" }),
                      "h-9 w-9",
                      link.variant === "default" &&
                      "dark:bg-muted dark:text-white dark:hover:bg-muted dark:hover:text-white"
                    )}
                  >
                    <link.icon className="h-4 w-4" />
                    <span className="sr-only">{link.title}</span>
                  </Link>
                </TooltipTrigger>
                <TooltipContent side="right" className="flex items-center gap-4">
                  {link.title}
                  {link.label && (
                    <span className="ml-auto text-muted-foreground">
                      {link.label}
                    </span>
                  )}
                </TooltipContent>
              </Tooltip>
            )}
          </nav>
        </div>
        <section className="mt-auto flex flex-col">
          <Tooltip delayDuration={0}>
            <TooltipTrigger >
              <ServerStatusDot />
            </TooltipTrigger>
            <TooltipContent side="right" className="flex items-center gap-4">
              {allServersHealthy ? "All servers are healthy" : "Some servers are unhealthy"}
            </TooltipContent>
          </Tooltip>
          <div className="flex justify-center items-center w-full h-12">
            <span className="font-normal text-xs tracking-wider">{appVersion}</span>
          </div>
        </section>
      </aside>

    </TooltipProvider>
  )
}
