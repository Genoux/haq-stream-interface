import { useEffect } from "react";
import { useLayout } from '@/contexts/DataContext';
import TeamData from "@/components/Team/TeamData"

interface TeamItemProps {
  team: {
    [key: string]: any;
  };
  isSelected: boolean;
}

import Link from "next/link"
import { ArrowUpRight } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"



const TeamItem = ({ team, isSelected }: TeamItemProps) => {
  const { setDataComponent } = useLayout();
  useEffect(() => {
    if (isSelected) {

      // Set the component when the page is loaded
      setDataComponent(<TeamData team={team} />);
      // Clear the component when the page is unmounted
      return () => {
        setDataComponent(null);
      };
    }
  }, [setDataComponent, isSelected]);


  return (
<div className="flex flex-col items-start gap-2 rounded-lg  p-3 text-left text-sm transition-all hover:bg-accent">
  <div className="flex w-full flex-col gap-1">
    <div className="flex items-center">
      <div className="flex items-center gap-2">
        <div className="font-semibold">{team.name}</div>
      </div>
      <div className="ml-auto text-xs text-muted-foreground">7 months ago</div>
    </div>
  </div>
  <div className="line-clamp-2 text-xs text-muted-foreground">
    Thank you for the project update. It looks great! I've gone through the report, and the progress is impressive. The team has done a fantastic job, and I appreciate the hard work everyone has put in.

    I have a few minor suggestions that I'll include in the attached document.

    Let's discuss these duri...
  </div>
  <div className="flex items-center gap-2">
    <div className="inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-primary text-primary-foreground shadow hover:bg-primary/80">
      work
    </div>
    <div className="inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80">
      important
    </div>
  </div>
</div>

  );
};

export default TeamItem;