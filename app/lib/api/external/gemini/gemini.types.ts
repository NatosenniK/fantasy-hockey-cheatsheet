export type GeminiResponse = string

export type TradeAnalysis = {
	preferredSide: string // Represents the side preferred ("outgoing" or "incoming")
	tradeAnalysis: string
}

export type PreferredSide = 'outgoing' | 'incoming'
