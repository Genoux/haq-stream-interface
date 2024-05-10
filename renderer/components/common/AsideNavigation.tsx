'use client'

import Link from "next/link"
import { User2, Unplug, Rows3 } from "lucide-react"
import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { TooltipProvider } from "@/components/ui/tooltip"
import { useOBS } from '@/contexts/OBSContext';
import { useRouter } from 'next/router';
interface NavProps {
  isCollapsed: boolean
}

import ObsDotStatus from '@/components/ObsDotStatus';

export default function AsideNavigation() {
  const router = useRouter();

  const links = [
    {
      title: "Teams",
      label: '',
      icon: User2,
      variant: router.pathname === "/teams" ? "default" : "ghost",
      href: "/teams",
    },
    {
      title: "Rooms",
      label: '',
      icon: Rows3,
      variant: router.pathname === "/rooms" ? "default" : "ghost",
      href: "/rooms",
    },
  ] as any


  return (
    <TooltipProvider delayDuration={0}>
      <aside
        className="min-w-[52px] border-r border-border/40 fixed h-full bg-black z-10"
      >
        <div className="flex h-[52px] w-[52px] items-center justify-center border-b border-border/40">
          <svg width="20" height="28" viewBox="0 0 20 28" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M19.8207 12.8582C19.5173 11.6191 18.8093 10.5122 17.5853 9.96138C17.3151 9.84052 16.7723 9.75147 16.4151 9.70567C16.1949 9.67641 16.0041 9.53901 15.9081 9.34182L11.3859 0C11.3859 0 5.90998 19.1887 1.26367 9.35581C1.26367 9.35581 -2.02038 15.4268 1.99985 17.8033C2.26872 17.9623 2.89224 18.1913 3.71037 18.2536C5.68592 13.2615 9.95581 9.70185 14.9401 9.85833C14.6098 9.95502 14.2884 10.0772 13.9722 10.2107C10.6267 11.6229 8.14799 14.5222 7.3337 18.0781C6.54758 21.5079 7.49246 25.2062 9.60116 28C8.27474 23.5575 13.7942 10.3087 18.9591 18.26C18.9591 18.26 19.7529 16.2066 19.8335 15.853C20.0486 14.9115 20.0653 13.8416 19.8246 12.8569H19.822L19.8207 12.8582Z" fill="white" />
          </svg>
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
      </aside>

    </TooltipProvider>
  )
}
