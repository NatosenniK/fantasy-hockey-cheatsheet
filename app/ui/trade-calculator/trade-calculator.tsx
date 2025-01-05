'use client'

import { useState } from 'react'
import TradeSearch from '../search/trade-search'
import { PlayerProfile } from '@/app/lib/api/external/nhl/nhl-player.types'
import { GeminiAPI } from '@/app/lib/api/external/gemini/gemini-ai.api'
import TradeOverview from './trade-overview'

export default function TradeCalculator() {
	const [tradeSideAlpha, setTradeSideAlpha] = useState<PlayerProfile[]>([])
	const [tradeSideBeta, setTradeSideBeta] = useState<PlayerProfile[]>([])
	const [tradeOutlook, setTradeOutlook] = useState<string>('')
	const [isTradeAnalyzed, setIsTradeAnalyzed] = useState<boolean>(false)

	const handleTradeSideAlphaSelection = (player: PlayerProfile) => {
		setTradeSideAlpha([...tradeSideAlpha, player])
	}

	const handleTradeSideBetaSelection = (player: PlayerProfile) => {
		setTradeSideBeta([...tradeSideBeta, player])
	}

	const analyzeTrade = async () => {
		setIsTradeAnalyzed(false)
		if (tradeSideAlpha.length < 1 || tradeSideBeta.length < 1) {
			return
		}

		try {
			const summary = await GeminiAPI.compareTrade(tradeSideAlpha, tradeSideBeta)
			setTradeOutlook(summary)
			setIsTradeAnalyzed(true)
		} catch (error) {
			console.error('Error fetching fantasy comparison:', error)
		}
	}

	const clearTrade = () => {
		setTradeOutlook('')
		setTradeSideAlpha([])
		setTradeSideBeta([])
	}

	return (
		<>
			<div>
				<h1 className="text-2xl font-semibold mb-4 dark:text-white mb-6 flex justify-center">Trade Analzyer</h1>
			</div>
			<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
				<div>
					<h2 className="text-xl font-semibold mb-4 dark:text-white mb-6 flex justify-center">
						Outgoing Players
					</h2>
					<div>
						<TradeSearch
							placeholder="Enter a player name..."
							onPlayerSelection={(e) => {
								if (!e) {
									return
								}
								handleTradeSideAlphaSelection(e)
							}}
						/>
					</div>

					<div className="mt-3">
						<TradeSearch
							placeholder="Enter a player name..."
							onPlayerSelection={(e) => {
								if (!e) {
									return
								}
								handleTradeSideAlphaSelection(e)
							}}
						/>
					</div>
				</div>
				<div>
					<h2 className="text-xl font-semibold mb-4 dark:text-white mb-6 flex justify-center">
						Incoming Players
					</h2>
					<div>
						<TradeSearch
							placeholder="Enter a player name..."
							onPlayerSelection={(e) => {
								if (!e) {
									return
								}
								handleTradeSideBetaSelection(e)
							}}
						/>
					</div>

					<div className="mt-3">
						<TradeSearch
							placeholder="Enter a player name..."
							onPlayerSelection={(e) => {
								if (!e) {
									return
								}
								handleTradeSideBetaSelection(e)
							}}
						/>
					</div>
				</div>
			</div>
			<div className="mt-6 flex justify-center mb-6">
				{!isTradeAnalyzed ? (
					<button
						onClick={analyzeTrade}
						className="flex h-[48px] grow items-center justify-center gap-2 rounded-md bg-gray-50 p-3 text-sm font-medium hover:bg-sky-100 hover:text-blue-600 md:flex-none md:justify-start md:p-2 md:px-3 mb-3 md:mb-0 dark:bg-slate-600 dark:text-white dark:hover:bg-slate-500 dark:hover:text-white mr-2"
					>
						Analyze Trade
					</button>
				) : (
					<button
						onClick={clearTrade}
						className="flex h-[48px] grow items-center justify-center gap-2 rounded-md bg-gray-50 p-3 text-sm font-medium hover:bg-sky-100 hover:text-blue-600 md:flex-none md:justify-start md:p-2 md:px-3 mb-3 md:mb-0 dark:bg-slate-600 dark:text-white dark:hover:bg-slate-500 dark:hover:text-white mr-2"
					>
						Analyze New Trade
					</button>
				)}
			</div>
			{tradeOutlook !== '' && (
				<>
					<div className="rounded-lg bg-slate-700 p-3 flex flex-col justify-center flex-grow mt-6 items-center">
						<div className="text-white" dangerouslySetInnerHTML={{ __html: tradeOutlook }} />
					</div>
					<TradeOverview sideA={tradeSideAlpha} sideB={tradeSideBeta} />
				</>
			)}
		</>
	)
}
