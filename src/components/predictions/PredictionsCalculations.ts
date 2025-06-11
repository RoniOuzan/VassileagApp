import { Game } from "../games/Games";

export const computeAverageGA = (games: Game[]): Record<string, number> => {
    const stats: Record<string, { totalContribution: number; appearances: number }> = {};

    for (const game of games) {
        const allPlayers = [...game.team1.players, ...game.team2.players];

        for (const player of allPlayers) {
            if (!stats[player.name]) {
                stats[player.name] = { totalContribution: 0, appearances: 0 };
            }

            stats[player.name].totalContribution += player.goals + player.assists;
            stats[player.name].appearances += 1;
        }
    }

    const avgStats: Record<string, number> = {};
    for (const name in stats) {
        const { totalContribution, appearances } = stats[name];
        avgStats[name] = totalContribution / appearances;
    }

    return avgStats;
};