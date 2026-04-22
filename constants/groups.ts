export const GROUPS = {
  A: ["México", "Sudáfrica", "Corea del Sur", "UEFA Playoff D"],
  B: ["Canadá", "Qatar", "Suiza", "UEFA Playoff A"],
  C: ["Brasil", "Marruecos", "Haití", "Escocia"],
  D: ["Estados Unidos", "Paraguay", "Australia", "UEFA Playoff C"],
  E: ["Alemania", "Costa de Marfil", "Ecuador", "Curazao"],
  F: ["Países Bajos", "Japón", "Túnez", "UEFA Playoff B"],
  G: ["Bélgica", "Egipto", "Irán", "Nueva Zelanda"],
  H: ["España", "Uruguay", "Arabia Saudita", "Cabo Verde"],
  I: ["Francia", "Senegal", "Noruega", "FIFA Playoff 2"],
  J: ["Argentina", "Argelia", "Austria", "Jordania"],
  K: ["Portugal", "Colombia", "Uzbekistán", "FIFA Playoff 1"],
  L: ["Inglaterra", "Croacia", "Ghana", "Panamá"],
} as const;

export type GroupKey = keyof typeof GROUPS;

export const GROUP_KEYS: GroupKey[] = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L"];
