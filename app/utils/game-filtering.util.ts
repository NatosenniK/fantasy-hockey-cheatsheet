import { GameLogs, Games } from "../lib/nhl-player.types";
import { DateService } from "./date.util";

class GameFilteringPrototype {
    filterGamesForWeek(games: Games): Games {
        const { startDate, endDate } = DateService.getThisWeekRange();

        // Helper to normalize UTC time to Eastern Time
        const normalizeToEastern = (utcDateString: string) => {
            const utcDate = new Date(utcDateString);
            const easternOffsetHours = -5; // Adjust for Eastern Time (Standard Time)
            return new Date(utcDate.getTime() + easternOffsetHours * 60 * 60 * 1000);
        };
    
        return games.filter((game) => {
            const easternGameDate = normalizeToEastern(game.startTimeUTC);
            return easternGameDate >= startDate && easternGameDate <= endDate;
        });
    }

    excludeGamesFromThisWeek(gameLogs: GameLogs): GameLogs {
        const { startDate, endDate } = DateService.getThisWeekRange();
    
        // Helper to normalize UTC time to Eastern Time
        const normalizeToEastern = (utcDateString: string) => {
            const utcDate = new Date(utcDateString);
            const easternOffsetHours = -5; // Adjust for Eastern Time (Standard Time)
            return new Date(utcDate.getTime() + easternOffsetHours * 60 * 60 * 1000);
        };
    
        return gameLogs.filter((gameLog) => {
            const easternGameDate = normalizeToEastern(gameLog.gameDate); // Use gameDate here
            return easternGameDate < startDate || easternGameDate > endDate;
        });
    }    
    
}

export const GameFilteringService =  new GameFilteringPrototype