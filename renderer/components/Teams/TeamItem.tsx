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

  const GetChampionSelectedCount = () => {
    return team.heroes_selected.filter((hero) => hero.selected).length;
  }

  return (
    <div
      className="bg-black flex justify-between items-center gap-2 rounded-lg text-left text-sm transition-all hover:bg-accent border p-3 cursor-pointer"
      onClick={onSelectionChange}
    >
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between w-full gap-1">
          <p className="font-semibold">{team.name}</p>
          <div className="ml-auto text-xs text-muted-foreground">({GetChampionSelectedCount()})</div>
        </div>
        <div className="line-clamp-2 text-xs text-muted-foreground hidden"></div>
        <div className="flex items-center gap-2">
          <div className={`bg-${team.color}-600 w-full h-1 rounded-full`}>
          </div>
        </div>
      </div>
      <Checkbox
        className='rounded-full'
        id={`team-${team.id}`}
        checked={isSelected}
        onCheckedChange={onSelectionChange}
      />
    </div>
  );
};

export default TeamItem;
