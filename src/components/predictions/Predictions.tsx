import { Tooltip } from "antd";
import { useMemo, useState } from "react";
import { Bar, BarChart, Cell, Pie, PieChart, PolarAngleAxis, PolarGrid, PolarRadiusAxis, Radar, RadarChart, Tooltip as RechartsTooltip, ResponsiveContainer, XAxis, YAxis } from "recharts";
import { Player, Position, positionOptions } from "../players/Players";
import "./Predictions.scss";
import TeamCreator from "./TeamCreator";
import { computeAverageGA } from "./PredictionsCalculations";
import { useLeague } from "../../context/LeagueContext";

const POSITION_WEIGHTS: Record<string, number> = {
  GK: 1.2,
  CB: 0.9,
  LB: 1.1,
  RB: 1.1,
  CDM: 1,
  CM: 1.1,
  CAM: 1.05,
  LM: 0.9,
  RM: 0.9,
  LW: 1.1,
  RW: 1.1,
  ST: 1,
  DEFAULT: 1.0,
};

const evaluateTeamStrength = (team: Player[], oppTeam: Player[], avgPlayersGA: Record<string, number>): number => {
    if (team.length === 0 || oppTeam.length === 0) return 0;

    let totalWeightedRating = 0;
    let totalWeight = 0;

    for (const player of team) {
        const rating = player.ratings.overall;
        const weight = POSITION_WEIGHTS[player.position] ?? POSITION_WEIGHTS.DEFAULT;

        let avgGA = avgPlayersGA[player.name] * 4;

        if (!avgGA) {
            avgGA = 0;
        }
        

        const effectiveOverall = rating + avgGA;
        totalWeightedRating += effectiveOverall * weight;
        totalWeight += weight;
    }

    const averageWeightedRating = totalWeightedRating / totalWeight;

    // Optional: consider scaling against opponent team length as in your original code
    const opponentFactor = team.length / oppTeam.length;

    return averageWeightedRating * opponentFactor;
};

const predictScore = (strengthA: number, strengthB: number) => {
    const base = (strengthA / (strengthA + strengthB)) * 5;
    return Math.round(base + (Math.random() - 0.5));
};

const pickMOTM = (teamA: Player[], teamB: Player[]) => {
    const combined = [...teamA, ...teamB];
    if (combined.length === 0) return null; // ✅ Return null if no players
    return combined.reduce((best, p) =>
        p.ratings.overall > best.ratings.overall ? p : best
    );
};


const rateTeamComposition = (team: Player[]): number => {
    const posCount: Record<Position, number> = Object.fromEntries(
        positionOptions.map(pos => [pos, team.filter(pl => pl.position === pos).length])
    ) as Record<Position, number>;

    // Balanced if has GK and defenders and midfielders and forwards; scale 0–100
    let score = 10;
    if (posCount["GK"]) score += 15;
    score += Math.min(posCount.CB + posCount.LB + posCount.RB, 2) * 10;
    score += Math.min(posCount.CM + posCount.CDM + posCount.CAM + posCount.LM + posCount.RM, 2) * 10;
    score += Math.min(posCount.ST + posCount.LW + posCount.RW, 2) * 10;
    score *= 1 + (Object.values(posCount).filter(count => count > 0).length / 3.0); // add when the positions are unique
    return Math.min(100, score);
};

const Predictions: React.FC = () => {
    const { league } = useLeague();

    if (!league) {
        return <div></div>;
    }

    const [team1, setTeam1] = useState<Player[]>([]);
    const [team2, setTeam2] = useState<Player[]>([]);

    const avgGA = computeAverageGA(league.games);

    const isPlayerNotListed = (p: Player) =>
        !team1.some(t => t.name === p.name) && !team2.some(t => t.name === p.name);

    const {
        strength1, strength2, score1, score2, winRates, motm, comp1, comp2
    } = useMemo(() => {
        if (team1.length === 0 || team2.length === 0) {
            return {
                strength1: 0, strength2: 0,
                score1: 0, score2: 0,
                winRates: [], motm: null,
                comp1: 0, comp2: 0,
            };
        }
        
        const strength1 = evaluateTeamStrength(team1, team2, avgGA);
        const strength2 = evaluateTeamStrength(team2, team1, avgGA);
        const score1 = predictScore(strength1, strength2);
        const score2 = predictScore(strength2, strength1);
        const winRate1 = Math.round((strength1 / (strength1 + strength2)) * 100);
        const winRate2 = 100 - winRate1;
        const motm = pickMOTM(team1, team2);
        const comp1 = Math.round(rateTeamComposition(team1) * 100) / 100;
        const comp2 = Math.round(rateTeamComposition(team2) * 100) / 100;

        return {
            strength1, strength2, score1, score2,
            winRates: [{ name: "Team 1", value: winRate1 }, { name: "Team 2", value: winRate2 }],
            motm, comp1, comp2
        };
    }, [team1, team2]);

    return (
        <div className="predictions">
            <div style={{ fontSize: 48, margin: 8 }}><strong>🔮Match Predictions</strong></div>

            <div className="teams-creation">
                <TeamCreator team={team1} setTeam={setTeam1} teamNumber={1} isPlayerNotListed={isPlayerNotListed} />
                <TeamCreator team={team2} setTeam={setTeam2} teamNumber={2} isPlayerNotListed={isPlayerNotListed} />
            </div>

            <div className="results">
                <div style={{ fontSize: 40 }}><strong>Predictions</strong></div>
                
                {team1.length > 0 && team2.length > 0 ? (
                    <div className="results-content">
                        <div className="score-line">
                            <div className="team-score">
                                <div className="score">{score1}</div>
                                <div className="label">Team 1</div>
                            </div>
                            <div className="vs">vs</div>
                            <div className="team-score">
                                <div className="score">{score2}</div>
                                <div className="label">Team 2</div>
                            </div>
                        </div>

                        <div className="charts-row">
                            <div className="chart-box">
                                <ResponsiveContainer width="100%" height={250}>
                                    <PieChart>
                                        <Pie
                                            data={winRates}
                                            dataKey="value"
                                            cx="50%"
                                            cy="50%"
                                            outerRadius={70}
                                            innerRadius={40}
                                            labelLine={false}
                                            label={({ name, percent }) =>
                                                `${name}: ${(percent * 100).toFixed(0)}%`
                                            }
                                        >
                                            <Cell fill="#F5D409" />
                                            <Cell fill="#444" />
                                        </Pie>
                                    </PieChart>
                                </ResponsiveContainer>
                                <div className="chart-label">Win Rate</div>
                            </div>

                            <div className="chart-box">
                                <ResponsiveContainer width="100%" height={250}>
                                    <BarChart data={[
                                        { name: "Team 1", strength: strength1 },
                                        { name: "Team 2", strength: strength2 },
                                    ]}>
                                        <XAxis dataKey="name" stroke="#F5D409" />
                                        <YAxis stroke="#F5D409" />
                                        <Tooltip />
                                        <Bar dataKey="strength" fill="#F5D409" barSize={40} />
                                    </BarChart>
                                </ResponsiveContainer>
                                <div className="chart-label">Team Strength</div>
                            </div>

                            <div className="chart-box">
                                <div className="composition">
                                    <div>
                                        <strong>Composition 1:</strong> {comp1}
                                    </div>
                                    <div>
                                        <strong>Composition 2:</strong> {comp2}
                                    </div>
                                </div>
                                <div className="chart-label">Team Composition</div>
                            </div>
                        </div>

                        <div className="motm-section">
                            {motm && (
                                <>
                                    <div style={{ display: "flex", flexDirection: "column", marginBottom: 8 }}>
                                        <div style={{ fontSize: 24 }}>⭐ Man of the Match:</div>
                                        <strong style={{ fontSize: 36 }}>{motm.name}</strong>
                                    </div>

                                    <RadarChart outerRadius={150} width={600} height={350} 
                                            data={Object.entries(motm.ratings).map(([key, val]) => ({ stat: key, value: val }))}>
                                        <PolarGrid />
                                        <PolarAngleAxis dataKey="stat" stroke="#F5D409" />
                                        <PolarRadiusAxis stroke="#ccc" />
                                        <Radar name={motm.name} dataKey="value" stroke="#F5D409" fill="#F5D409" fillOpacity={0.5} />
                                        <RechartsTooltip />
                                    </RadarChart>
                                </>
                            )}
                        </div>
                    </div>
                ) : (
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", fontSize: 20 }}>
                        Select players for both teams to see prediction...
                    </div>
                )}
            </div>
        </div>
    );
};

export default Predictions;
