export type DriverStanding = {
  position: number;
  driver: string;
  team: string;
  points: number;
};

export type ConstructorStanding = {
  position: number;
  constructor: string;
  points: number;
};

export const driversStandings2026: DriverStanding[] = [
  { position: 1, driver: "Max Verstappen", team: "Red Bull Racing", points: 156 },
  { position: 2, driver: "Charles Leclerc", team: "Ferrari", points: 148 },
  { position: 3, driver: "Lando Norris", team: "McLaren", points: 143 },
  { position: 4, driver: "Lewis Hamilton", team: "Ferrari", points: 131 },
  { position: 5, driver: "Oscar Piastri", team: "McLaren", points: 126 },
  { position: 6, driver: "George Russell", team: "Mercedes", points: 108 },
  { position: 7, driver: "Carlos Sainz", team: "Williams", points: 92 },
  { position: 8, driver: "Fernando Alonso", team: "Aston Martin", points: 74 },
  { position: 9, driver: "Sergio Perez", team: "Red Bull Racing", points: 65 },
  { position: 10, driver: "Pierre Gasly", team: "Alpine", points: 42 },
];

export const constructorsStandings2026: ConstructorStanding[] = [
  { position: 1, constructor: "Ferrari", points: 279 },
  { position: 2, constructor: "McLaren", points: 269 },
  { position: 3, constructor: "Red Bull Racing", points: 221 },
  { position: 4, constructor: "Mercedes", points: 181 },
  { position: 5, constructor: "Williams", points: 121 },
  { position: 6, constructor: "Aston Martin", points: 95 },
  { position: 7, constructor: "Alpine", points: 67 },
  { position: 8, constructor: "RB", points: 39 },
  { position: 9, constructor: "Sauber", points: 28 },
  { position: 10, constructor: "Haas", points: 21 },
];
