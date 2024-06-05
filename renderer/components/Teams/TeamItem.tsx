type TeamItemProps = {
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
        <div>
          <p>{team.name}</p>
          <p>{team.email}</p>
          <p>coaches</p>
          {team.coaches.map((coache) => (
            <p>{coache.discord}</p>
          ))}
          <p>players</p>
          {team.players.map((player) => (
            <p>{player.discord}</p>
          ))}
          <p>Substitutes</p>
          {team.substitutes.map((sub) => (
            <p>{sub.discord}</p>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TeamItem;
