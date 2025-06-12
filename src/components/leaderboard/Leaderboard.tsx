import { useMemo } from "react";
import { useLeague } from "../../context/LeagueContext";
import "./Leaderboard.scss";

const Leaderboard: React.FC = () => {
    const { league } = useLeague();

    if (!league) return <div></div>;

    const { players, games } = league;

    const stats = useMemo(() => {
        const playerStats: Record<string, { overallRating: number; goals: number; assists: number; appearances: number; wins: number; }> = {};

        players.forEach(p => {
            playerStats[p.name] = {
                overallRating: p.ratings.overall,
                goals: 0,
                assists: 0,
                appearances: 0,
                wins: 0,
            }
        });

        games.forEach(game => {
            const team1Score = game.team1.players.reduce((sum, p) => sum + p.goals, 0);
            const team2Score = game.team2.players.reduce((sum, p) => sum + p.goals, 0);

            const winningTeam = team1Score > team2Score ? game.team1.players
                            : team2Score > team1Score ? game.team2.players
                            : null; // draw

            [...game.team1.players, ...game.team2.players].forEach(p => {
                const stat = playerStats[p.name];
                stat.goals += p.goals;
                stat.assists += p.assists;
                stat.appearances += 1;

                if (winningTeam && winningTeam.some(w => w.name === p.name)) {
                    stat.wins += 1;
                }
            });

        });

        const withAvgRating = Object.entries(playerStats).map(([name, s]) => ({
            name,
            goals: s.goals,
            assists: s.assists,
            overallRating: s.overallRating,
            appearances: s.appearances,
            wins: s.wins,
        }));

        return {
            topGoals: [...withAvgRating].sort((a, b) => b.goals - a.goals).slice(0, 5),
            topAssists: [...withAvgRating].sort((a, b) => b.assists - a.assists).slice(0, 5),
            topRatings: [...withAvgRating].sort((a, b) => b.overallRating - a.overallRating).slice(0, 5),
            topAppearances: [...withAvgRating].sort((a, b) => b.appearances - a.appearances).slice(0, 5),
            topWins: [...withAvgRating].sort((a, b) => b.wins - a.wins).slice(0, 5),
        };
    }, [games]);

    const renderList = (title: string, list: { name: string; value: number }[], unit: string) => (
        <div className="leaderboard__column">
            <div className="leaderboard__title">{title}</div>
            {list.map((p, index) => (
                <div key={index} className="leaderboard__player">
                    <span className="rank">{index + 1}.</span>
                    <span className="name">{p.name}</span>
                    <span className="value">{p.value} {unit}</span>
                </div>
            ))}
        </div>
    );

    return (
        <div className="leaderboard">
            <div className="leaderboard__header"><strong>🏆 Leaderboard</strong></div>
            <div className="leaderboard__content">
                {renderList("⚽Top Scorers", stats.topGoals.map(p => ({ name: p.name, value: p.goals })), "goals")}
                {renderList("🎯Top Assist Providers", stats.topAssists.map(p => ({ name: p.name, value: p.assists })), "assists")}
                {renderList("⭐Highest Rated", stats.topRatings.map(p => ({ name: p.name, value: parseFloat(p.overallRating.toFixed(2)) })), "avg rating")}
                {renderList("🧢Top Appearances", stats.topRatings.map(p => ({ name: p.name, value: p.appearances })), "games")}
                {renderList("🥇Top Winners", stats.topRatings.map(p => ({ name: p.name, value: p.wins })), "games")}
            </div>
        </div>
    );
};

export default Leaderboard;