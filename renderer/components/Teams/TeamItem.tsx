interface TeamItemProps {
  team: {
    [key: string]: any;
  };
}

const TeamItem = ({ team }: TeamItemProps) => {

  return (
    <div
      className="bg-black flex justify-between items-center gap-2 rounded-lg text-left text-sm transition-all hover:bg-accent border p-3 cursor-pointer"
    >
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between w-full gap-1">
          <p className="font-semibold">{team.name}</p>
          <div className="ml-auto text-xs text-muted-foreground">{team.email}</div>
        </div>
        <div className="line-clamp-2 text-xs text-muted-foreground hidden"></div>
        
      </div>
    </div>
  );
};

export default TeamItem;
