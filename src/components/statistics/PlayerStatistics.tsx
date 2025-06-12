import { Player } from "../players/Players";
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
    PieChart, Pie, Cell, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis
} from "recharts";
import "./Statistics.scss";
import { useLeague } from "../../context/LeagueContext";
import { PlayedPlayer } from "../games/Games";
import React from "react";
import { TooltipProps } from "recharts";
import { ValueType, NameType } from "recharts/types/component/DefaultTooltipContent";

interface Props {
    player: Player;
}

const PlayerStatistics: React.FC<Props> = ({ player }) => {
    const { league } = useLeague();

    if (!league) return <div></div>;

    const games = league.games;

    const playerStats = games.flatMap((game) => {
        const allPlayers: PlayedPlayer[] = [...game.team1.players, ...game.team2.players];
        const found = allPlayers.find(p => p.name === player.name);

        if (found) {
            const team = [game.team1, game.team2].find(t => t.players.includes(found))!;
            const opponent = team === game.team1 ? game.team2 : game.team1;
            const win = team.goals > opponent.goals;

            return [{
                date: game.date,
                goals: found.goals,
                assists: found.assists,
                win,
                teamGoals: team.goals,
                opponentPlayers: opponent.players.map(p => p.name)
            }];
        }

        return [];
    });

    const goalsOverTime = playerStats.map(s => ({
        date: s.date,
        Goals: s.goals,
        Assists: s.assists
    }));

    const winCount = playerStats.filter(s => s.win).length;
    const lossCount = playerStats.filter(s => !s.win).length;
    const totalGames = winCount + lossCount;
    const winPercentage = totalGames === 0 ? 0 : Math.round((winCount / totalGames) * 100);

    const winData = [
        { name: "Wins", value: winCount },
        { name: "Losses", value: lossCount }
    ];

    let streak = 0;
    for (let i = playerStats.length - 1; i >= 0; i--) {
        if (playerStats[i].win) streak++;
        else break;
    }
    const currentWinStreak = streak;

    const winImpact = playerStats.filter(s => s.win).reduce((sum, s) => sum + s.goals + s.assists, 0);
    const lossImpact = playerStats.filter(s => !s.win).reduce((sum, s) => sum + s.goals + s.assists, 0);

    const avgWinContribution = winCount === 0 ? 0 : winImpact / winCount;
    const avgLossContribution = lossCount === 0 ? 0 : lossImpact / lossCount;

    const zeroContributionGames = playerStats.filter(s => s.goals === 0 && s.assists === 0).length;

    const CustomTooltip = ({ active, payload }: TooltipProps<ValueType, NameType>) => {
        if (active && payload && payload.length) {
            const data = payload[0];
            const percent = totalGames === 0 ? 0 : Math.round((data.value as number / totalGames) * 100);
            
            return (
                <div className="custom-tooltip">
                    <p><strong>{data.name}: {data.value}</strong></p>
                    <p><strong>Percentage: {percent}%</strong></p>
                </div>
            );
        }
        return null;
    };

    const DarkTooltip = ({ active, payload, label }: TooltipProps<ValueType, NameType>) => {
        if (active && payload && payload.length) {
            return (
                <div>
                    <p>{label}</p>
                    {payload.map((entry, index) => (
                        <p key={index}>{entry.name}: {entry.value}</p>
                    ))}
                </div>
            );
        }

        return null;
    };

    const totalGoals = playerStats.reduce((sum, s) => sum + s.goals, 0);
    const totalAssists = playerStats.reduce((sum, s) => sum + s.assists, 0);

    const topGame = [...playerStats].sort((a, b) => (b.goals + b.assists) - (a.goals + a.assists))[0];

    const contributionStats = playerStats.map(s => ({
        playerContribution: s.goals + s.assists,
        teamGoals: s.teamGoals
    }));

    const averageContribution = Math.round(
        contributionStats.reduce((sum, s) => sum + (s.playerContribution / (s.teamGoals || 1)), 0) / contributionStats.length * 100
    );

    const opponentPerformance: Record<string, { goals: number, assists: number, games: number }> = {};
    playerStats.forEach(stat => {
        stat.opponentPlayers.forEach(opponent => {
            if (!opponentPerformance[opponent]) opponentPerformance[opponent] = { goals: 0, assists: 0, games: 0 };
            opponentPerformance[opponent].goals += stat.goals;
            opponentPerformance[opponent].assists += stat.assists;
            opponentPerformance[opponent].games++;
        });
    });

    const opponentPerfList = Object.entries(opponentPerformance)
        .sort((a, b) => b[1].goals + b[1].assists - (a[1].goals + a[1].assists))
        .slice(0, 5);

    const avgGoals = totalGoals / playerStats.length;
    const variance = playerStats.reduce((acc, s) => acc + Math.pow(s.goals - avgGoals, 2), 0) / playerStats.length;
    const stdDev = Math.sqrt(variance);
    const consistencyScore = Math.max(0, 100 - Math.round(stdDev * 20));

    const radarData = [
        { stat: 'Goals', value: totalGoals },
        { stat: 'Assists', value: totalAssists },
        { stat: 'Win%', value: winPercentage },
        { stat: 'Contribution%', value: averageContribution },
    ];

    const COLORS = ['#F5D409', '#444'];

    return (
        <div className="player-stats">
            <h2>{player.name}'s Statistics</h2>

            <div className="single-chart">
                <div className="title">
                    Ratings
                </div>
                <div className="ratings">
                    <div><span>⚡Pace</span>{player.ratings.pace}</div>
                    <div><span>🎯Shooting</span>{player.ratings.shooting}</div>
                    <div><span>🤝Passing</span>{player.ratings.passing}</div>
                    <div><span>🕺Dribbling</span>{player.ratings.dribbling}</div>
                    <div><span>🛡️Defending</span>{player.ratings.defending}</div>
                    <div><span>💪Physicality</span>{player.ratings.physicality}</div>
                </div>
            </div>

            <div className="stats-totals">
                <div><span>⚽Total Goals</span>{totalGoals}G</div>
                <div><span>🎯Total Assists</span>{totalAssists}A</div>
                <div><span>📊Win Rate</span>{winPercentage}% ({winCount}W / {lossCount}L)</div>
                <div><span>📈Consistency</span>{consistencyScore.toFixed(1)}</div>
                <div><span>🤝Contribution Rate</span>{averageContribution.toFixed(1)}%</div>
                <div><span>🏆Top Performance</span>{topGame?.goals}G, {topGame?.assists}A on {topGame?.date}</div>
            </div>

            <div className="charts-row">
                <div className="single-chart" style={{ width: "100%" }}>
                    <div className="title">
                        Goals
                    </div>
                    <ResponsiveContainer width="100%" height={500}>
                        <LineChart data={goalsOverTime}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="date" />
                            <YAxis />
                            <Tooltip content={DarkTooltip} />
                            <Legend />
                            <Line type="monotone" dataKey="Goals" stroke="#F5D409" />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
                <div className="single-chart" style={{ width: "100%" }}>
                    <div className="title">
                        Assists
                    </div>
                    <ResponsiveContainer width="100%" height={500}>
                        <LineChart data={goalsOverTime}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="date" />
                            <YAxis />
                            <Tooltip content={DarkTooltip} />
                            <Legend />
                            <Line type="monotone" dataKey="Assists" stroke="#F5D409" />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>

            <div className="opponent-performance">
                <div className="title" style={{ marginBottom: 16 }}>
                    <strong>Performance Against Top Opponents</strong>
                </div>
                <table>
                    <thead>
                        <tr>
                            <th>Opponent</th>
                            <th>Goals</th>
                            <th>Assists</th>
                            <th>Games</th>
                            <th>Goals Per Game</th>
                        </tr>
                    </thead>
                    <tbody>
                        {opponentPerfList.map(([name, stats]) => (
                            <tr key={name}>
                                <td>{name}</td>
                                <td>{stats.goals}</td>
                                <td>{stats.assists}</td>
                                <td>{stats.games}</td>
                                <td>{((stats.goals + stats.assists) / stats.games).toFixed(2)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="charts-row">
                <div className="single-chart" style={{ width: "100%" }} >
                    <div className="title">
                        <strong>Win Rate:</strong> {winPercentage}% ({winCount} Wins / {totalGames} Games)
                    </div>
                    <ResponsiveContainer width="100%" height={500}>
                        <PieChart>
                            <Pie
                                data={winData}
                                dataKey="value"
                                nameKey="name"
                                cx="50%"
                                cy="50%"
                                outerRadius={100}
                                label
                            >
                                {winData.map((_entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip content={<CustomTooltip />} />
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                </div>

                <div className="wins_stats">
                    <div><span>🔥Current Win Streak:</span>{currentWinStreak} games</div>
                    <div><span>🤝Avg Contribution in Wins:</span>{avgWinContribution.toFixed(2)} G/A</div>
                    <div><span>🤝Avg Contribution in Losses:</span>{avgLossContribution.toFixed(2)} G/A</div>
                    <div><span>🚫Games Without Contribution:</span>{zeroContributionGames} games</div>
                </div>
            </div>

            <div className="single-chart">
                <div className="title">
                    <strong>Radar Overview</strong>
                </div>
                <ResponsiveContainer width="100%" height={400}>
                    <RadarChart data={radarData} cx="50%" cy="50%" outerRadius="80%">
                        <PolarGrid />
                        <PolarAngleAxis dataKey="stat" />
                        <PolarRadiusAxis />
                        <Radar name={player.name} dataKey="value" stroke="#F5D409" fill="#F5D409" fillOpacity={0.4} />
                        <Tooltip content={CustomTooltip}/>
                    </RadarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default PlayerStatistics;
