import { useState, useEffect } from 'react';
import { Scoreboard } from './components/Scoreboard';
import { fetchTeamsFromSheet, TeamData } from './services/googleSheets';

export default function App() {
  const [teams, setTeams] = useState<TeamData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);

  const loadTeams = async () => {
    try {
      setError(null);
      const data = await fetchTeamsFromSheet();
      setTeams(data);
      setLastUpdate(new Date());
      setLoading(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load data');
      // Keep previous teams data if available, only stop loading
      setLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    loadTeams();
  }, []);

  // Auto-refresh every minute
  useEffect(() => {
    const interval = setInterval(() => {
      loadTeams();
    }, 60000); // 60 seconds

    return () => clearInterval(interval);
  }, []);

  // Only show loading screen on initial load when there's no cached data
  if (loading && teams.length === 0) {
    return (
      <div className="h-screen bg-gradient-to-br from-orange-100 via-orange-50 to-orange-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-orange-600 mx-auto mb-4"></div>
          <p className="text-xl text-gray-700">Loading scoreboard...</p>
        </div>
      </div>
    );
  }

  // Show full-screen error if there's an error and no cached data
  if (error && teams.length === 0) {
    return (
      <div className="h-screen bg-gradient-to-br from-orange-100 via-orange-50 to-orange-100 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Configuration Error</h2>
          <p className="text-gray-700 mb-4">{error}</p>
          <button
            onClick={loadTeams}
            className="bg-orange-600 text-white px-6 py-2 rounded hover:bg-orange-700 transition"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-gradient-to-br from-orange-100 via-orange-50 to-orange-100 overflow-hidden">
      <Scoreboard teams={teams} lastUpdate={lastUpdate} error={error} onRefresh={loadTeams} />
    </div>
  );
}
