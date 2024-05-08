import { useEffect } from "react";


export default function TeamData({ team }) {
  console.log(team)


  return (
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
  );
}