// Manually curated dataset — cross-checked against the official club site
// (estorilpraia.pt/historia) and the English/Portuguese Wikipedia articles
// for G.D. Estoril Praia. See the "About the Data" page.

export type ClubHistoryCategory = "title" | "promotion" | "relegation" | "milestone";

export interface ClubHistoryEntry {
  id: string;
  year: string;
  category: ClubHistoryCategory;
}

export const CLUB_HISTORY: ClubHistoryEntry[] = [
  { id: "founding", year: "1939", category: "milestone" },
  { id: "firstSport1940", year: "1940", category: "milestone" },
  { id: "inauguralParade1940", year: "1940", category: "milestone" },
  { id: "headquarters1941", year: "1941", category: "milestone" },
  { id: "cupFinal1944", year: "1943/44", category: "promotion" },
  { id: "debut1945", year: "1944/45", category: "milestone" },
  { id: "bestEarlyFinish1948", year: "1947/48", category: "milestone" },
  { id: "goldenScorer1949", year: "1948/49", category: "milestone" },
  { id: "recordWin1950", year: "1949/50", category: "milestone" },
  { id: "relegation1953", year: "1952/53", category: "relegation" },
  { id: "stadiumRenamed1972", year: "1972", category: "milestone" },
  { id: "return1976", year: "1975/76", category: "promotion" },
  { id: "relegation1980", year: "1979/80", category: "relegation" },
  { id: "promotion1981", year: "1980/81", category: "promotion" },
  { id: "relegation1984", year: "1983/84", category: "relegation" },
  { id: "promotion1991", year: "1990/91", category: "promotion" },
  { id: "relegation1994", year: "1993/94", category: "relegation" },
  { id: "pauleta1996", year: "1995/96", category: "milestone" },
  { id: "title2003", year: "2002/03", category: "title" },
  { id: "title2004", year: "2003/04", category: "title" },
  { id: "relegation2005", year: "2004/05", category: "relegation" },
  { id: "financialCrisis2006", year: "2005/06", category: "milestone" },
  { id: "trafficSports2010", year: "2010", category: "milestone" },
  { id: "title2012", year: "2011/12", category: "title" },
  { id: "european2013", year: "2012/13", category: "milestone" },
  { id: "bestFinish2014", year: "2013/14", category: "milestone" },
  { id: "anniversary2014", year: "2014", category: "milestone" },
  { id: "newHeadquarters2017", year: "2017", category: "milestone" },
  { id: "relegation2018", year: "2017/18", category: "relegation" },
  { id: "title2021", year: "2020/21", category: "title" },
  { id: "sub23Success", year: "2020–2025", category: "milestone" },
  { id: "cupRunnerUp2024", year: "2023/24", category: "milestone" },
];
