export interface PlayerStat {
	games: number
	goals: number
	assists: number
	points: number
	[key: string]: number
}

export interface MatchupStat {
	teamId: number
	date: number
	games: number
	goals: number
	assists: number
	points: number
	[key: string]: number
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
	homeRoadFlag: string
	gameTypeId: number
	decision: string
	shotsAgainst: number
	goalsAgainst: number
	savePctg: number
	shutouts: number
}

export type GameLogs = GameLog[]

export interface SkaterSeasonTotals {
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

export interface GoalieSeasonTotals {
	gamesPlayed: number
	wins: number
	losses: number
	otLosses: number
	shutOuts: number
	goalsAgainst: number
	saves: number
	savePctg: number
}

export type SeasonTotals = GoalieSeasonTotals | SkaterSeasonTotals

export interface NHLSeason {
	season: string
	leagueAbbrev: string
	gameTypeId: number
}

export type PrevStats = {
	[teamAbbrev: string]: SeasonTotals
}

export type FetchCareerStatsResult =
	| { position: 'Skater'; stats: { [teamAbbrev: string]: SkaterSeasonTotals } }
	| { position: 'Goalie'; stats: { [teamAbbrev: string]: GoalieSeasonTotals } }

export type PlayerType = Goalie | Skater

export type Goalie = {
	position: 'G'
}

export type Skater = {
	position: 'L' | 'R' | 'C' | 'D'
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

export type PlayerProfile = GoalieProfile | SkaterProfile

export interface PlayerInfoFull {
	headshot: string
	currentTeamAbbrev: string
	firstName: { default: string }
	lastName: { default: string }
	teamLogo: string
	sweaterNumber: number
	position: string
	last5Games: Last5Games
	fullTeamName: {
		default: string
	}
	playerId: number
}

export interface GoalieProfile extends PlayerInfoFull {
	careerTotals: {
		regularSeason: {
			assists: number
			gamesPlayed: number
			gamesStarted: number
			goals: number
			goalsAgainst: number
			goalsAgainstAvg: number
			losses: number
			otLosses: number
			pim: number
			savePctg: number
			shotsAgainst: number
			shutouts: number
			ties: number
			timeOnIce: number
			wins: number
		}
	}
	featuredStats: {
		regularSeason: {
			subSeason: {
				gamesPlayed: number
				goalsAgainstAvg: number
				losses: number
				otLosses: number
				savePctg: number
				shutouts: number
				wins: number
			}
		}
	}
}

export interface SkaterProfile extends PlayerInfoFull {
	featuredStats: {
		regularSeason: {
			subSeason: {
				assists: number
				gamesPlayed: number
				goals: number
				points: number
				plusMinus: number
				pim: number
				shots: number
				powerPlayGoals: number
				powerPlayPoints: number
				shootingPctg: number
				shorthandedGoals: number
				shorthandedPoints: number
			}
		}
	}
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
			powerPlayPoints: number
			shootingPctg: number
			shorthandedGoals: number
			shorthandedPoints: number
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
			powerPlayPoints: number
			shootingPctg: number
			shorthandedGoals: number
			shorthandedPoints: number
		}
	}
}

export interface prevGame {
	assists: number
	gameDate: string
	gameId: number
	gameTypeId: number
	goals: number
	homeRoadFlag: string
	opponentAbbrev: string
	pim: number
	plusMinus: number
	points: number
	powerPlayGoals: number
	shifts: number
	shorthandedGoals: number
	shots: number
	teamAbbrev: string
	toi: string
}

export type Last5Games = prevGame[]

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

export interface PlayerStatsVsUpcoming {
	opponent: string
	stats: SeasonTotals
}
