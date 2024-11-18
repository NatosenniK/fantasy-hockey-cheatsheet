import { PlayerInfoFull } from "@/app/lib/nhl-player.types";


interface FullStatsTableProps {
    player: PlayerInfoFull
}
export default async function FullStatsTable({player}: FullStatsTableProps) {

    if (!player || !player.careerTotals) {
        console.log('Catch: ', player.careerTotals)
        return <div>Loading...</div>;
    }

    console.log('player: ', player)
    return (
        <div className="mt-6 flow-root">
        <div className="inline-block min-w-full align-middle">
            <div className="rounded-lg bg-gray-50 p-3 dark:bg-slate-700">
            <table className="min-w-full border-collapse border border-gray-200 dark:border-slate-700">
            <thead>
                <tr className="bg-gray-100 dark:bg-slate-800">
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-slate-700">
                    GP
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-slate-700">
                    G
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-slate-700">
                    A
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-slate-700">
                    P
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-slate-700">
                    +/- 
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-slate-700">
                    PIM
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-slate-700">
                    Shots
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-slate-700">
                    PPG
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-slate-700">
                    PP Points
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-slate-700">
                    S%
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-slate-700">
                    SHG
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-slate-700">
                    SH Points
                </th>
                </tr>
            </thead>
            <tbody>
                <tr className="odd:bg-white even:bg-gray-50 dark:odd:bg-slate-700 dark:even:bg-slate-800">
                <td className="px-6 py-4 text-sm text-gray-900 dark:text-white border-b border-gray-200 dark:border-slate-700">
                    {player.careerTotals.regularSeason.gamesPlayed}
                </td>
                <td className="px-6 py-4 text-sm text-gray-900 dark:text-white border-b border-gray-200 dark:border-slate-700">
                    {player.careerTotals.regularSeason.goals}
                </td>
                <td className="px-6 py-4 text-sm text-gray-900 dark:text-white border-b border-gray-200 dark:border-slate-700">
                    {player.careerTotals.regularSeason.assists}
                </td>
                <td className="px-6 py-4 text-sm text-gray-900 dark:text-white border-b border-gray-200 dark:border-slate-700">
                    {player.careerTotals.regularSeason.points}
                </td>
                <td className="px-6 py-4 text-sm text-gray-900 dark:text-white border-b border-gray-200 dark:border-slate-700">
                    {player.careerTotals.regularSeason.plusMinus}
                </td>
                <td className="px-6 py-4 text-sm text-gray-900 dark:text-white border-b border-gray-200 dark:border-slate-700">
                    {player.careerTotals.regularSeason.pim}
                </td>
                <td className="px-6 py-4 text-sm text-gray-900 dark:text-white border-b border-gray-200 dark:border-slate-700">
                    {player.careerTotals.regularSeason.shots}
                </td>
                <td className="px-6 py-4 text-sm text-gray-900 dark:text-white border-b border-gray-200 dark:border-slate-700">
                    {player.careerTotals.regularSeason.powerPlayGoals}
                </td>
                <td className="px-6 py-4 text-sm text-gray-900 dark:text-white border-b border-gray-200 dark:border-slate-700">
                    {player.careerTotals.regularSeason.powerPlayPoints}
                </td>
                <td className="px-6 py-4 text-sm text-gray-900 dark:text-white border-b border-gray-200 dark:border-slate-700">
                    {player.careerTotals.regularSeason.shootingPctg}
                </td>
                <td className="px-6 py-4 text-sm text-gray-900 dark:text-white border-b border-gray-200 dark:border-slate-700">
                    {player.careerTotals.regularSeason.shorthandedGoals}
                </td>
                <td className="px-6 py-4 text-sm text-gray-900 dark:text-white border-b border-gray-200 dark:border-slate-700">
                    {player.careerTotals.regularSeason.shorthandedPoints}
                </td>
                </tr>
            </tbody>
            </table>

            </div>
        </div>
        </div>
    )
}
