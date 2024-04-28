const OBSControl = ({ team, isSelected, toggleSelection }) => {
  return (
    <div className={`flex gap-4 w-full ${isSelected ? 'border' : 'border-none'}`}>
      <p>{team.name} - {team.color}</p>
      <button onClick={toggleSelection}>
        {isSelected ? 'Deselect' : 'Select'}
      </button>
    </div>
  );
};

export default OBSControl;
