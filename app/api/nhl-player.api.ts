import {  PlayerInfoFull, Games, Game, GameLog, SeasonTotals, PlayerSearchResults } from "../lib/nhl-player.types"
import { DateService } from "../utils/date.util"

class NHLPlayerAPIPrototype {

    // Fetch Connor McDavid's season stats
    async fetchPlayerStats(playerId: number): Promise<PlayerInfoFull> {
        const response = await fetch(`https://api-web.nhle.com/v1/player/${playerId}/landing`)
        if (!response.ok) throw new Error("Failed to fetch player stats")
        const data = await response.json()
        return data
    }

    async searchForPlayer(query: string): Promise<PlayerSearchResults> {
        const response = await fetch (`https://search.d3.nhle.com/api/v1/search/player?culture=en-us&limit=20&q=${query}`)
        if (!response.ok) throw new Error("Failed to search")

        const searchObject = await response.json()

        // Extract NHL seasons dynamically from the `seasonTotals` array
        const filteredResults = searchObject
            .filter((filteredResult: any) => filteredResult.teamAbbrev !== null)
        return filteredResults
    }

    async fetchPlayerMatchupStats(abbrev: string): Promise<Games> {
    
        const { startDate, endDate } = DateService.getThisWeekRange();

        // console.log(`Fetching games from ${startDate} to ${endDate}`);
    
        // Fetch the team's games for the season
        const scheduleResponse = await fetch(`https://api-web.nhle.com/v1/club-schedule-season/${abbrev}/now`);
        if (!scheduleResponse.ok) throw new Error("Failed to fetch schedule");
        const scheduleData = await scheduleResponse.json();
    
        // Normalize a date based on easternUTCOffset if required
        const normalizeDateWithOffset = (game: Game) => {
            const gameDateUtc = new Date(game.startTimeUTC);
            return gameDateUtc;
        };
    
        // Filter games to include only those within the current week's date range
        const games = scheduleData.games.filter((game: Game) => {
            const gameDate = normalizeDateWithOffset(game); // Adjusted gameDate
            return gameDate >= startDate && gameDate <= endDate; // Compare with fantasy week range
        });
    
        // console.log("Filtered games: ", games);
    
        return games;
    }
    
    

    async fetchCareerStatsVsTeams(playerId: number, gameType: number): Promise<{ [teamAbbrev: string]: SeasonTotals }> {
        // Define the list of seasons (you might fetch this dynamically from an API if available)
        const leagueAbbrev = "NHL";
        const gameTypeId = 2
        const playerStatsUrl = `https://api-web.nhle.com/v1/player/${playerId}/landing`;

        // Fetch the player's full stats to determine NHL seasons dynamically
        const playerFullStatsResponse = await fetch(playerStatsUrl);
        if (!playerFullStatsResponse.ok) {
            throw new Error(`Failed to fetch player data for ID ${playerId}`);
        }

        const playerFullStats = await playerFullStatsResponse.json();

        // Extract NHL seasons dynamically from the `seasonTotals` array
        const seasons = playerFullStats.seasonTotals
            .filter((season: any) => season.leagueAbbrev === leagueAbbrev && season.gameTypeId === gameTypeId)
            .map((season: any) => season.season);

        // console.log(seasons)
    
        // Prepare an object to store stats against each team
        const statsByTeam: { [teamAbbrev: string]: SeasonTotals } = {}
    
        for (const season of seasons) {
            // Fetch the player's game logs for this season
            const response = await fetch(`https://api-web.nhle.com/v1/player/${playerId}/game-log/${season}/${gameType}`)
            if (!response.ok) throw new Error(`Failed to fetch player game log for season ${season}`)
            
            const data = await response.json()
            const gameLogs: GameLog[] = data.gameLog
    
            // Aggregate stats for each opponent
            for (const game of gameLogs) {
                const opponentAbbrev = game.opponentAbbrev
    
                if (!statsByTeam[opponentAbbrev]) {
                    statsByTeam[opponentAbbrev] = { gamesPlayed: 0, goals: 0, assists: 0, points: 0, shots: 0, pim: 0, plusMinus: 0, powerPlayPoints: 0, shorthandedGoals: 0, shorthandedPoints: 0, shorthandedAssists: 0 }
                }
    
                // Update stats for this team
                statsByTeam[opponentAbbrev].gamesPlayed += 1
                statsByTeam[opponentAbbrev].goals += game.goals || 0
                statsByTeam[opponentAbbrev].assists += game.assists || 0
                statsByTeam[opponentAbbrev].points += game.points || 0
                statsByTeam[opponentAbbrev].shots += game.shots || 0
                statsByTeam[opponentAbbrev].pim += game.pim || 0 // Penalty minutes
                statsByTeam[opponentAbbrev].plusMinus += game.plusMinus || 0
                statsByTeam[opponentAbbrev].powerPlayPoints += game.powerPlayPoints || 0
                statsByTeam[opponentAbbrev].shorthandedGoals += game.shorthandedGoals || 0
                statsByTeam[opponentAbbrev].shorthandedPoints += game.shorthandedPoints || 0
            }
        }
    
        return statsByTeam
    }
        
}


export const NHLPlayerAPI = new NHLPlayerAPIPrototype()
