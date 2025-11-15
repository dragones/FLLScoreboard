export interface TeamData {
  id: number;
  teamNumber: number;
  name: string;
  match1: number | null;
  match2: number | null;
  match3: number | null;
  p: number | null;
}

const SHEET_ID = import.meta.env.VITE_GOOGLE_SHEET_ID;

if (!SHEET_ID) {
  throw new Error('VITE_GOOGLE_SHEET_ID environment variable is not set');
}

// Use CSV export (more reliable without API key)
// Column order: Team Number, Name, P, Match1, Match2, Match3
const CSV_URL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/export?format=csv`;

export async function fetchTeamsFromSheet(): Promise<TeamData[]> {
  try {
    // Fetch as CSV (no API key needed)
    const response = await fetch(CSV_URL);

    if (!response.ok) {
      throw new Error(`Failed to fetch sheet: ${response.status}`);
    }

    const csvText = await response.text();
    const teams = parseCSV(csvText);

    return teams;
  } catch (error) {
    console.error('Error fetching teams from Google Sheet:', error);
    throw error;
  }
}

function parseCSV(csvText: string): TeamData[] {
  const lines = csvText.trim().split('\n');

  // Skip header row
  const dataLines = lines.slice(1);

  const teams: TeamData[] = dataLines
    .map((line, index) => {
      // Handle CSV with potential commas in quotes
      const values = parseCSVLine(line);

      if (values.length < 5) {
        console.warn(`Skipping invalid row ${index + 2}:`, line);
        return null;
      }

      // Correct column order: Team Number, Name, P, Match1, Match2, Match3
      const [teamNumber, name, p, match1, match2, match3] = values;

      const parseScore = (value: string): number | null => {
        const trimmed = value?.trim();
        if (!trimmed || trimmed === '') return null;
        const parsed = parseInt(trimmed);
        return isNaN(parsed) ? null : parsed;
      };

      return {
        id: index + 1,
        teamNumber: parseInt(teamNumber) || 0,
        name: name.trim(),
        match1: parseScore(match1),
        match2: parseScore(match2),
        match3: parseScore(match3),
        p: parseScore(p),
      };
    })
    .filter((team): team is TeamData => team !== null);

  return teams;
}

function parseCSVLine(line: string): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];

    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      result.push(current);
      current = '';
    } else {
      current += char;
    }
  }

  result.push(current);

  return result.map(s => s.replace(/^"|"$/g, '').trim());
}
