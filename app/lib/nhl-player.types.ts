export interface PlayerStat {
    games: number
    goals: number
    assists: number
    points: number
    [key: string]: number // Add any other relevant stats
}

export interface MatchupStat {
    teamId: number
    date: number
    games: number
    goals: number
    assists: number
    points: number
    [key: string]: number // Add any other relevant stats
}

export interface Schedule {
    date: string
    games: Games
}

export interface Game {
    id: string
    awayTeam: { 
        abbrev: string
        commonName: { default: string }
        darkLogo: string
        logo: string
    }
    homeTeam: { 
        abbrev: string
        commonName: { default: string }
        darkLogo: string
        logo: string
    }
    gameDate: string
    easternUTCOffset: string
    startTimeUTC: string
}

export type Games = Game[]

export interface GameLog {
    gameId: string
    teamAbbrev: string
    gameDate: string
    goals: number
    assists: number
    commonName: {
        default: string
    }
    opponentCommonName: {
        default: string
    }
    points: number
    plusMinus: number
    powerPlayGoals: number
    powerPlayPoints: number
    gameWinningGoals: number
    otGoals: number
    shots: number
    shifts: number
    shorthandedGoals: number
    shorthandedPoints: number
    opponentAbbrev: string
    pim: number
    toi: string
}

export type GameLogs = GameLog[]

export interface SeasonTotals {
    goals: number
    assists: number
    points: number
    shots: number
    pim: number
    plusMinus: number
    gamesPlayed: number
    powerPlayPoints: number
    shorthandedGoals: number
    shorthandedPoints: number
    shorthandedAssists: number
}

export type PrevStats = {
    [teamAbbrev: string]: SeasonTotals;
};

export interface Split {
    opponent: {
        id: number
    }
    stat: {
        goals: number
        assists: number
        points: number
    }
}

export interface Accumulator {
    games: number
    goals: number
    assists: number
    points: number
}

// Types for the schedule game
export interface Schedule {
    id: number
    season: string
    gameType: string
    gameDate: string
    venue: {
        default: string
    }
    neutralSite: boolean
    startTimeUTC: string
    easternUTCOffset: string
    venueUTCOffset: string
    venueTimezone: string
    gameState: string
    gameScheduleState: string
    tvBroadcasts: {
        id: number
        market: string
        countryCode: string
        network: string
        sequenceNumber: number
    }[]
    awayTeam: TeamInfo
    homeTeam: TeamInfo
    periodDescriptor?: {
        number: number
        periodType: string
        maxRegulationPeriods: number
    }
    gameOutcome?: {
        lastPeriodType: string
    }
    winningGoalie?: PlayerSummary
    winningGoalScorer?: PlayerSummary
    threeMinRecap?: string
    threeMinRecapFr?: string
    condensedGame?: string
    condensedGameFr?: string
    gameCenterLink?: string
}

interface TeamInfo {
    id: number
    placeName: {
        default: string
    }
    placeNameWithPreposition: {
        default: string
        fr: string
    }
    abbrev: string
    logo: string
    darkLogo: string
    score?: number
    homeSplitSquad?: boolean
    awaySplitSquad?: boolean
    airlineLink?: string
    airlineDesc?: string
}

interface PlayerSummary {
    playerId: number
    firstInitial: {
        default: string
    }
    lastName: {
        default: string
    }
}

// Types for player stats
export interface PlayerStat {
    season: number
    regularSeason: number

}

// Types for matchup stats
export interface MatchupStat {
    teamId: number
    date: number
    games: number
    goals: number
    assists: number
    points: number
}

export interface PlayerInfoFull {
    headshot: string
    currentTeamAbbrev: string
    firstName: { default: string }
    lastName: { default: string }
    careerTotals: {
        regularSeason: {
            assists: number
            gamesPlayed: number
            goals: number
            points: number
            plusMinus: number
            pim: number
            shots: number
            powerPlayGoals: number
            powerPlayPoints:number
            shootingPctg: number
            shorthandedGoals:number
            shorthandedPoints:number
        }
        subSeason: {
            assists: number
            gamesPlayed: number
            goals: number
            points: number
            plusMinus: number
            pim: number
            shots: number
            powerPlayGoals: number
            powerPlayPoints:number
            shootingPctg: number
            shorthandedGoals:number
            shorthandedPoints:number
        }
        
    }
   
}

export interface PlayerSearch {
    playerId: number
    name: string
    positionCode: string
    teamId: string
    teamAbbrev: string
    lastTeamId: string
    lastTeamAbbrev: string
    lastSeasonId: string
    sweaterNumber: number
    active: string
    height: string
    heightInInches: number
    heightInCentimeters: number
    weightInPounds: number
    weightInKilograms: number
    birthCity: string
    birthStateProvince: string
    birthCountry: string
}

export type PlayerSearchResults = PlayerSearch[]