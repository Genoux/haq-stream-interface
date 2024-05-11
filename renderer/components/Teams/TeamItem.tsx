import { useEffect } from "react";
import { Checkbox } from '@/components/ui/checkbox';
import { useLayout } from '@/contexts/DataContext';
import TeamData from "@/components/Team/TeamData";

interface TeamItemProps {
  team: {
    [key: string]: any;
  };
  isSelected: boolean;
  onSelectionChange: () => void; // Callback function for changing selection
}

const TeamItem = ({ team, isSelected, onSelectionChange }: TeamItemProps) => {
  const { setDataComponent } = useLayout();

  useEffect(() => {
    if (isSelected) {
      setDataComponent(<TeamData team={team} />);
      return () => {
        setDataComponent(null);
      };
    }
  }, [setDataComponent, isSelected]);

  return (
    <div
      className="flex flex-col items-start gap-2 rounded-lg text-left text-sm transition-all hover:bg-accent border p-3 cursor-pointer"
      onClick={onSelectionChange}
    >
      <Checkbox
        className='rounded-full'
        id={`team-${team.id}`}
        checked={isSelected}
        onCheckedChange={onSelectionChange}
      />
      <div className="flex items-center justify-between w-full">

        <p className="font-semibold">{team.name}</p>
        <div className="ml-auto text-xs text-muted-foreground">7 months ago</div>
      </div>
      <div className="line-clamp-2 text-xs text-muted-foreground">
        Thank you for the project update. It looks great! I've gone through the report, and the progress is impressive.
        The team has done a fantastic job, and I appreciate the hard work everyone has put in.

        I have a few minor suggestions that I'll include in the attached document.

        Let's discuss these duri...
      </div>
      <div className="flex items-center gap-2">
        <div className={`bg-${team.color}-500 text-white inline-flex items-center rounded-md  px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparentshadow hover:bg-primary/80`}>
        </div>
      </div>
    </div>
  );
};

export default TeamItem;
