import {  PlayerInfoFull, Games, Game, GameLog, SeasonTotals } from "./nhl-player.types";

class NHLPlayerAPIPrototype {
    private playerId = "8478402"; // Connor McDavid's hardcoded ID
    private teamId = 5; // Pittsburgh Penguins' team ID
    private season = '20232024'; // Current season
    private gameType = '2'; // Regular season
    private teamAbbrev = 'MIN'

    // Fetch Connor McDavid's season stats
    async fetchPlayerStats(): Promise<PlayerInfoFull> {
        const response = await fetch(`https://api-web.nhle.com/v1/player/${this.playerId}/landing`);
        if (!response.ok) throw new Error("Failed to fetch player stats");
        const data = await response.json();
        return data;
    }

    async fetchPlayerMatchupStats(): Promise<Games> {
        // Get today's date
        const today = new Date();
    
        // Calculate the start (Monday) and end (Sunday) of the current fantasy hockey week
        const monday = new Date(today);
        monday.setDate(today.getDate() - today.getDay() + 1); // Adjust to Monday
        const sunday = new Date(monday);
        sunday.setDate(monday.getDate() + 6); // Add 6 days for Sunday
    
        // Format dates as YYYY-MM-DD for the API or filtering
        const formatDate = (date: Date) =>
            date.toISOString().split('T')[0]; // Get the date in YYYY-MM-DD format
    
        const startDate = formatDate(monday);
        const endDate = formatDate(sunday);
    
        console.log(`Fetching games from ${startDate} to ${endDate}`);
    
        // Fetch EDM's games for the current month (API limitation)
        const scheduleResponse = await fetch(`https://api-web.nhle.com/v1/club-schedule/EDM/month/now`);
        if (!scheduleResponse.ok) throw new Error("Failed to fetch schedule");
        const scheduleData = await scheduleResponse.json();
    
        // Filter games to include only those within the current week's date range
        const games = scheduleData.games.filter((game: Game) => {
            const gameDate = new Date(game.gameDate);
            return gameDate >= monday && gameDate <= sunday;
        });
    
        return games;
    }

    async fetchCareerStatsVsTeams(playerId: number, gameType: number): Promise<{ [teamAbbrev: string]: SeasonTotals }> {
        // Define the list of seasons (you might fetch this dynamically from an API if available)
        const seasons = ["20152016", "20162017", "20172018", "20182019", "20192020", "20202021", "20212022", "20222023", "20232024"]; // Update as necessary
    
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
                    statsByTeam[opponentAbbrev] = { gamesPlayed: 0, goals: 0, assists: 0, points: 0, shots: 0, pim: 0, plusMinus: 0 };
                }
    
                // Update stats for this team
                statsByTeam[opponentAbbrev].gamesPlayed += 1;
                statsByTeam[opponentAbbrev].goals += game.goals || 0;
                statsByTeam[opponentAbbrev].assists += game.assists || 0;
                statsByTeam[opponentAbbrev].points += game.points || 0;
                statsByTeam[opponentAbbrev].shots += game.shots || 0;
                statsByTeam[opponentAbbrev].pim += game.pim || 0; // Penalty minutes
                statsByTeam[opponentAbbrev].plusMinus += game.plusMinus || 0;
            }
        }
    
        return statsByTeam;
    }
        
}


export const NHLPlayerAPI = new NHLPlayerAPIPrototype();
