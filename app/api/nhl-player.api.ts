import {  PlayerInfoFull, Games, Game, GameLog, SeasonTotals } from "../lib/nhl-player.types";

class NHLPlayerAPIPrototype {
    private playerId = "8477492"; // Player ID

    // Fetch Connor McDavid's season stats
    async fetchPlayerStats(): Promise<PlayerInfoFull> {
        const response = await fetch(`https://api-web.nhle.com/v1/player/${this.playerId}/landing`);
        if (!response.ok) throw new Error("Failed to fetch player stats");
        const data = await response.json();
        return data;
    }

    async fetchPlayerMatchupStats(abbrev: string): Promise<Games> {
            // Get today's date
        const today = new Date();

        // Calculate the start (Monday) and end (Sunday) of the current fantasy hockey week
        const monday = new Date(today);
        const dayOfWeek = today.getDay(); // 0 (Sunday) to 6 (Saturday)
        const daysSinceMonday = (dayOfWeek === 0 ? 6 : dayOfWeek - 1); // Handle Sunday (0) as 6 days from Monday
        monday.setDate(today.getDate() - daysSinceMonday);

        const sunday = new Date(monday);
        sunday.setDate(monday.getDate() + 6); // Add 6 days for Sunday

        // Format dates as YYYY-MM-DD for the API or filtering
        const formatDate = (date: Date) =>
            date.toISOString().split('T')[0]; // Get the date in YYYY-MM-DD format

        const startDate = formatDate(monday);
        const endDate = formatDate(sunday);
    
        console.log(`Fetching games from ${startDate} to ${endDate}`);
    
        // Fetch Teams's games for the season
        const scheduleResponse = await fetch(`https://api-web.nhle.com/v1/club-schedule-season/${abbrev}/now`);
        if (!scheduleResponse.ok) throw new Error("Failed to fetch schedule");
        const scheduleData = await scheduleResponse.json();

        // Filter games to include only those within the current week's date range
        const normalizeDate = (date: Date) => {
            const normalized = new Date(date);
            normalized.setUTCHours(0, 0, 0, 0); // Set to midnight UTC
            return normalized;
        };
        
        // Filter games to include only those within the current week's date range
        const games = scheduleData.games.filter((game: Game) => {
            const gameDate = normalizeDate(new Date(game.gameDate)); // Normalize gameDate
            const mondayStart = normalizeDate(monday); // Normalize monday
            const sundayEnd = normalizeDate(sunday); // Normalize sunday
            return gameDate >= mondayStart && gameDate <= sundayEnd;
        });
        
        console.log('games: ', games)
    
        return games;
    }

    async fetchCareerStatsVsTeams(playerId: number, gameType: number): Promise<{ [teamAbbrev: string]: SeasonTotals }> {
        // Define the list of seasons (you might fetch this dynamically from an API if available)
        const seasons = ["20192020", "20202021", "20212022", "20222023", "20232024"]; // Update as necessary
    
        // Prepare an object to store stats against each team
        const statsByTeam: { [teamAbbrev: string]: SeasonTotals } = {};
    
        for (const season of seasons) {
            // Fetch the player's game logs for this season
            const response = await fetch(`https://api-web.nhle.com/v1/player/${playerId}/game-log/${season}/${gameType}`);
            if (!response.ok) throw new Error(`Failed to fetch player game log for season ${season}`);
            
            const data = await response.json();
            const gameLogs: GameLog[] = data.gameLog;
    
            // Aggregate stats for each opponent
            for (const game of gameLogs) {
                const opponentAbbrev = game.opponentAbbrev;
    
                if (!statsByTeam[opponentAbbrev]) {
                    statsByTeam[opponentAbbrev] = { gamesPlayed: 0, goals: 0, assists: 0, points: 0, shots: 0, pim: 0, plusMinus: 0, powerPlayPoints: 0, shorthandedGoals: 0, shorthandedPoints: 0, shorthandedAssists: 0 };
                }
    
                // Update stats for this team
                statsByTeam[opponentAbbrev].gamesPlayed += 1;
                statsByTeam[opponentAbbrev].goals += game.goals || 0;
                statsByTeam[opponentAbbrev].assists += game.assists || 0;
                statsByTeam[opponentAbbrev].points += game.points || 0;
                statsByTeam[opponentAbbrev].shots += game.shots || 0;
                statsByTeam[opponentAbbrev].pim += game.pim || 0; // Penalty minutes
                statsByTeam[opponentAbbrev].plusMinus += game.plusMinus || 0;
                statsByTeam[opponentAbbrev].powerPlayPoints += game.powerPlayPoints || 0
                statsByTeam[opponentAbbrev].shorthandedGoals += game.shorthandedGoals || 0
                statsByTeam[opponentAbbrev].shorthandedPoints += game.shorthandedPoints || 0
            }
        }
    
        return statsByTeam;
    }
        
}


export const NHLPlayerAPI = new NHLPlayerAPIPrototype();
