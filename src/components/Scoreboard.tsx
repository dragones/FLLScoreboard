import { useMemo, useRef, useEffect } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import seasonLogo from '../assets/season-logo.webp';

interface Team {
  id: number;
  teamNumber: number;
  name: string;
  match1: number | null;
  match2: number | null;
  match3: number | null;
  p: number | null;
}

interface ScoreboardProps {
  teams: Team[];
  lastUpdate?: Date | null;
  error?: string | null;
  onRefresh?: () => void;
}

export function Scoreboard({ teams, lastUpdate, error, onRefresh }: ScoreboardProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  // QR Code configuration from environment variables
  const qrCodeUrl1 = import.meta.env.VITE_QR_CODE_URL_1;
  const qrCodeLabel1 = import.meta.env.VITE_QR_CODE_LABEL_1;
  const showQRCode1 = !!qrCodeUrl1; // Show if URL exists, regardless of label

  const qrCodeUrl2 = import.meta.env.VITE_QR_CODE_URL_2;
  const qrCodeLabel2 = import.meta.env.VITE_QR_CODE_LABEL_2;
  const showQRCode2 = !!qrCodeUrl2; // Show if URL exists, regardless of label

  const getHighestScore = (team: Team) => {
    const scores = [team.match1, team.match2, team.match3].filter((s): s is number => s !== null);
    return scores.length > 0 ? Math.max(...scores) : null;
  };

  // Get sorted match scores (descending) for a team
  const getSortedScores = (team: Team): number[] => {
    return [team.match1, team.match2, team.match3]
      .filter((s): s is number => s !== null)
      .sort((a, b) => b - a);
  };

  // Sort teams by highest match score, then 2nd highest, then 3rd highest
  // Only use practice score if team has no match scores
  const sortedTeams = useMemo(() => {
    return [...teams].sort((a, b) => {
      const scoresA = getSortedScores(a);
      const scoresB = getSortedScores(b);

      // If neither has match scores, sort by practice score
      if (scoresA.length === 0 && scoresB.length === 0) {
        return (b.p ?? -1) - (a.p ?? -1);
      }
      // Team with match scores ranks above team with only practice score
      if (scoresA.length === 0) return 1;
      if (scoresB.length === 0) return -1;

      // Compare scores in order: 1st highest, 2nd highest, 3rd highest
      for (let i = 0; i < Math.max(scoresA.length, scoresB.length); i++) {
        const scoreA = scoresA[i] ?? -1;
        const scoreB = scoresB[i] ?? -1;
        if (scoreB !== scoreA) return scoreB - scoreA;
      }
      return 0;
    });
  }, [teams]);

  // Check if two teams have the same ranking score (highest match score only)
  const hasSameScore = (teamA: Team, teamB: Team): boolean => {
    const highestA = getHighestScore(teamA);
    const highestB = getHighestScore(teamB);

    // Both have no match scores - compare practice scores
    if (highestA === null && highestB === null) {
      return (teamA.p ?? -1) === (teamB.p ?? -1);
    }

    // Compare highest match scores
    return highestA === highestB;
  };

  // Pre-compute ranks with ties (competition ranking: 1, 1, 3, 4, 4, 6)
  const teamRanks = useMemo(() => {
    const ranks: number[] = [];
    for (let i = 0; i < sortedTeams.length; i++) {
      if (i === 0) {
        ranks.push(1);
      } else if (hasSameScore(sortedTeams[i], sortedTeams[i - 1])) {
        ranks.push(ranks[i - 1]); // Same rank as previous team
      } else {
        ranks.push(i + 1); // Rank based on position (count of teams before + 1)
      }
    }
    return ranks;
  }, [sortedTeams]);

  // Duplicate the teams array for infinite scrolling
  const infiniteTeams = useMemo(() => {
    return [...sortedTeams, ...sortedTeams];
  }, [sortedTeams]);

  // Auto-scroll functionality
  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (!scrollContainer) return;

    let animationFrameId: number;
    let lastTimestamp = 0;
    const scrollSpeed = 30; // pixels per second

    const scroll = (timestamp: number) => {
      if (!lastTimestamp) lastTimestamp = timestamp;
      const delta = timestamp - lastTimestamp;

      if (scrollContainer) {
        scrollContainer.scrollTop += (scrollSpeed * delta) / 1000;

        // Get the height of one set of teams
        const singleSetHeight = scrollContainer.scrollHeight / 2;

        // Reset scroll when we've scrolled through the first set
        if (scrollContainer.scrollTop >= singleSetHeight) {
          scrollContainer.scrollTop = 0;
        }
      }

      lastTimestamp = timestamp;
      animationFrameId = requestAnimationFrame(scroll);
    };

    animationFrameId = requestAnimationFrame(scroll);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="h-full flex flex-col px-4 py-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-600 to-orange-500 text-white py-6 px-8 rounded-t-lg shadow-lg flex-shrink-0 relative">
        {/* QR Code 1 (optional) - positioned on far left, hidden on mobile */}
        {showQRCode1 && (
          <div className="hidden lg:flex absolute left-8 top-1/2 -translate-y-1/2 flex-col items-center gap-1 bg-white p-2 rounded-lg">
            <QRCodeSVG value={qrCodeUrl1} size={128} />
            {qrCodeLabel1 && <p className="text-sm text-gray-700 font-semibold">{qrCodeLabel1}</p>}
          </div>
        )}

        {/* QR Code 2 (optional) - positioned on far right, hidden on mobile */}
        {showQRCode2 && (
          <div className="hidden lg:flex absolute right-8 top-1/2 -translate-y-1/2 flex-col items-center gap-1 bg-white p-2 rounded-lg">
            <QRCodeSVG value={qrCodeUrl2} size={128} />
            {qrCodeLabel2 && <p className="text-sm text-gray-700 font-semibold">{qrCodeLabel2}</p>}
          </div>
        )}

        {/* Season Logo - centered */}
        <div className="flex justify-center">
          <img
            src={seasonLogo}
            alt="Unearthed Season Logo"
            className="h-32 w-auto object-contain"
          />
        </div>
      </div>

      {/* Scoreboard Table */}
      <div className="bg-orange-50 shadow-lg overflow-hidden flex-1 flex flex-col">
        <div ref={scrollRef} className="flex-1 overflow-y-auto scrollbar-hide">
          <table className="w-full">
            <thead className="bg-orange-200 sticky top-0 z-10">
              <tr>
                <th className="px-2 py-3 text-center border-r-2 border-orange-300 w-16">Rank</th>
                <th className="px-2 py-3 text-center border-r-2 border-orange-300 w-20">#</th>
                <th className="px-4 py-3 text-left border-r-2 border-orange-300 w-1/2">Name</th>
                <th className="px-2 py-3 text-center border-r-2 border-orange-300 w-16">P</th>
                <th className="px-2 py-3 text-center border-r-2 border-orange-300 w-16">1</th>
                <th className="px-2 py-3 text-center border-r-2 border-orange-300 w-16">2</th>
                <th className="px-2 py-3 text-center w-16">3</th>
              </tr>
            </thead>
            <tbody>
              {infiniteTeams.map((team, index) => {
                const highestScore = getHighestScore(team);
                const displayRank = teamRanks[index % sortedTeams.length];
                return (
                  <tr
                    key={`${team.id}-${index}`}
                    className={`border-b-2 border-orange-200 hover:bg-orange-100 transition-colors ${
                      index % 2 === 0 ? 'bg-orange-50' : 'bg-white'
                    }`}
                  >
                    <td className="px-2 py-3 text-center border-r-2 border-orange-200">{displayRank}</td>
                    <td className="px-2 py-3 text-center border-r-2 border-orange-200">
                      {team.teamNumber}
                    </td>
                    <td className="px-4 py-3 border-r-2 border-orange-200">
                      {team.name}
                    </td>
                    <td className="px-2 py-3 text-center border-r-2 border-orange-200">
                      {team.p ?? ''}
                    </td>
                    <td
                      className={`px-2 py-3 text-center border-r-2 border-orange-200 ${
                        team.match1 !== null && team.match1 === highestScore ? 'bg-orange-300 font-semibold' : ''
                      }`}
                    >
                      {team.match1 ?? ''}
                    </td>
                    <td
                      className={`px-2 py-3 text-center border-r-2 border-orange-200 ${
                        team.match2 !== null && team.match2 === highestScore ? 'bg-orange-300 font-semibold' : ''
                      }`}
                    >
                      {team.match2 ?? ''}
                    </td>
                    <td
                      className={`px-2 py-3 text-center ${
                        team.match3 !== null && team.match3 === highestScore ? 'bg-orange-300 font-semibold' : ''
                      }`}
                    >
                      {team.match3 ?? ''}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Footer Stats */}
      <div className="mt-4 bg-white rounded-lg shadow p-4 text-center text-gray-600 flex-shrink-0">
        <p>
          Total Teams: {teams.length} | Sorted by Highest Individual Match Score |
          {error ? (
            <span className="ml-1 text-red-600 font-semibold">
              Error: {error}
            </span>
          ) : lastUpdate && (
            <span className="ml-1">
              Last Updated: {lastUpdate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              {onRefresh && import.meta.env.DEV && (
                <>
                  {' | '}
                  <button
                    onClick={onRefresh}
                    className="text-orange-600 hover:text-orange-700 underline font-semibold"
                  >
                    Refresh
                  </button>
                </>
              )}
            </span>
          )}
        </p>
      </div>
    </div>
  );
}
