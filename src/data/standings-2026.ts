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
  { position: 1, driver: "Kimi Antonelli", team: "Mercedes", points: 100 },
  { position: 2, driver: "George Russell", team: "Mercedes", points: 80 },
  { position: 3, driver: "Charles Leclerc", team: "Ferrari", points: 59 },
  { position: 4, driver: "Lando Norris", team: "McLaren", points: 51 },
  { position: 5, driver: "Lewis Hamilton", team: "Ferrari", points: 51 },
  { position: 6, driver: "Oscar Piastri", team: "McLaren", points: 43 },
  { position: 7, driver: "Max Verstappen", team: "Red Bull Racing", points: 26 },
  { position: 8, driver: "Oliver Bearman", team: "Haas", points: 17 },
  { position: 9, driver: "Pierre Gasly", team: "Alpine", points: 16 },
  { position: 10, driver: "Liam Lawson", team: "RB", points: 10 },
  { position: 11, driver: "Franco Colapinto", team: "Alpine", points: 7 },
  { position: 12, driver: "Arvid Lindblad", team: "RB", points: 4 },
  { position: 13, driver: "Isack Hadjar", team: "Red Bull Racing", points: 4 },
  { position: 14, driver: "Carlos Sainz Jr.", team: "Williams", points: 4 },
  { position: 15, driver: "Gabriel Bortoleto", team: "Audi", points: 2 },
  { position: 16, driver: "Esteban Ocon", team: "Haas", points: 1 },
  { position: 17, driver: "Alex Albon", team: "Williams", points: 1 },
  { position: 18, driver: "Nico Hülkenberg", team: "Audi", points: 0 },
  { position: 19, driver: "Valtteri Bottas", team: "Cadillac", points: 0 },
  { position: 20, driver: "Sergio Perez", team: "Cadillac", points: 0 },
  { position: 21, driver: "Fernando Alonso", team: "Aston Martin", points: 0 },
  { position: 22, driver: "Lance Stroll", team: "Aston Martin", points: 0 },
];

export const constructorsStandings2026: ConstructorStanding[] = [
  { position: 1, constructor: "Mercedes", points: 180 },
  { position: 2, constructor: "Ferrari", points: 110 },
  { position: 3, constructor: "McLaren", points: 94 },
  { position: 4, constructor: "Red Bull Racing", points: 30 },
  { position: 5, constructor: "Alpine", points: 23 },
  { position: 6, constructor: "Haas", points: 18 },
  { position: 7, constructor: "RB", points: 14 },
  { position: 8, constructor: "Williams", points: 5 },
  { position: 9, constructor: "Audi", points: 2 },
  { position: 10, constructor: "Cadillac", points: 0 },
  { position: 11, constructor: "Aston Martin", points: 0 },
];
