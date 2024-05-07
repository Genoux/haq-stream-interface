interface TeamItemProps {
  team: {
    id: number;
    name: string;
  };
  isSelected: boolean;
}


const TeamItem = ({ team, isSelected }: TeamItemProps) => {
  return (
    <div className={`flex gap-4 w-full ${isSelected ? 'border' : 'border-none'}`}>
      <p>{team.name}</p>
    </div>
  );
};

export default TeamItem;