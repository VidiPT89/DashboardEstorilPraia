// Manually curated dataset — cross-checked against the English and Portuguese
// Wikipedia articles for G.D. Estoril Praia. See the "About the Data" page.

export type ClubHistoryCategory = "title" | "promotion" | "relegation" | "milestone";

export interface ClubHistoryEntry {
  id: string;
  year: string;
  category: ClubHistoryCategory;
}

export const CLUB_HISTORY: ClubHistoryEntry[] = [
  { id: "founding", year: "1939", category: "milestone" },
  { id: "cupFinal1944", year: "1943/44", category: "milestone" },
  { id: "debut1945", year: "1944/45", category: "milestone" },
  { id: "relegation1953", year: "1952/53", category: "relegation" },
  { id: "return1976", year: "1975/76", category: "promotion" },
  { id: "title2004", year: "2003/04", category: "title" },
  { id: "relegation2005", year: "2004/05", category: "relegation" },
  { id: "title2012", year: "2011/12", category: "title" },
  { id: "european2013", year: "2012/13", category: "milestone" },
  { id: "bestFinish2014", year: "2013/14", category: "milestone" },
  { id: "relegation2018", year: "2017/18", category: "relegation" },
  { id: "title2021", year: "2020/21", category: "title" },
  { id: "cupRunnerUp2024", year: "2023/24", category: "milestone" },
];
