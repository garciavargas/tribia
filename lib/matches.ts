import { GROUPS, GroupKey } from "@/constants/groups";
import { Match } from "@/types/match";

// Generar partidos de un grupo (cada equipo juega contra todos)
function generateGroupMatches(group: GroupKey): Match[] {
  const teams = GROUPS[group];
  const matches: Match[] = [];
  let matchCounter = 1;

  for (let i = 0; i < teams.length; i++) {
    for (let j = i + 1; j < teams.length; j++) {
      matches.push({
        id: `${group}-${matchCounter}`,
        group,
        homeTeam: teams[i],
        awayTeam: teams[j],
        date: "2026-06-11", // Fecha placeholder
        status: "scheduled",
      });
      matchCounter++;
    }
  }

  return matches;
}

// Generar todos los partidos de fase de grupos
export function getAllGroupMatches(): Match[] {
  const allMatches: Match[] = [];
  
  (Object.keys(GROUPS) as GroupKey[]).forEach((group) => {
    allMatches.push(...generateGroupMatches(group));
  });

  return allMatches;
}

// Obtener partidos por grupo
export function getMatchesByGroup(group: GroupKey): Match[] {
  return generateGroupMatches(group);
}
