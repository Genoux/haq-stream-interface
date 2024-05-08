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

export default function Navigation() {
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
    <div
      data-collapsed={true}
      className="group flex flex-col gap-4 py-2 data-[collapsed=true]:py-2 border-t-red-600"
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
      </TooltipProvider>
  )
}
