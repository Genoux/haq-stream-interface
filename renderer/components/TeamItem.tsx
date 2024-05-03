const TeamItem = ({ team, isSelected }) => {
  return (
    <div className={`flex gap-4 w-full ${isSelected ? 'border' : 'border-none'}`}>
      <p>{team.name} - {team.color}</p>
    </div>
  );
};

export default TeamItem;
