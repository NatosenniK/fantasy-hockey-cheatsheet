'use server';

import { FetchPlayerStats } from "../utils/fetch-player-stats";

export async function findPlayer(playerId: number) {
    try {
        const { playerProfile, games, prevStats, expectedWeeklyPointTotal, weekProjections, last5Games } = await FetchPlayerStats(playerId);
        return { playerProfile, games, prevStats, expectedWeeklyPointTotal, weekProjections, last5Games };
    } catch (error) {
        console.error("Error fetching player stats:", error);
        throw new Error("Failed to fetch player stats.");
    }
}
