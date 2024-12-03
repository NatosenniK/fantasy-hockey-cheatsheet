export interface NHLTeam {
    gamesPlayed: number
    wins: number
    losses: number
    otLosses: number
    points: number
    pointPctg: number
    regulationWins: number
    regulationPlusOtWins: number
    teamName: {
        default: string
    }
    teamCommonName: {
        default: string
    }
    teamLogo: string
    goalAgainst: number
    goalFor: number
    goalDifferential: number
    homeLosses: number
    homeWins: number
    homeOtLosses: number
    roadLosses: number
    roadWins: number
    roadOtLosses: number
    shootoutWins: number
    shootoutLosses: number
    l10Wins: number
    l10Losses: number
    l10OtLosses: number
    streakCode: string
    streakCount: number
}
