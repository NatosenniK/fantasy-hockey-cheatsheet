import { SeasonTotals } from "@/app/lib/nhl-player.types";


interface CondensedStatsTableProps {
    stats: SeasonTotals
}
export default async function CondensedStatsTable({stats}: CondensedStatsTableProps) {
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
            </tr>
          </thead>
          <tbody>
            <tr className="odd:bg-white even:bg-gray-50 dark:odd:bg-slate-700 dark:even:bg-slate-800">
              <td className="px-6 py-4 text-sm text-gray-900 dark:text-white border-b border-gray-200 dark:border-slate-700">
                {stats.gamesPlayed}
              </td>
              <td className="px-6 py-4 text-sm text-gray-900 dark:text-white border-b border-gray-200 dark:border-slate-700">
                {stats.goals}
              </td>
              <td className="px-6 py-4 text-sm text-gray-900 dark:text-white border-b border-gray-200 dark:border-slate-700">
                {stats.assists}
              </td>
              <td className="px-6 py-4 text-sm text-gray-900 dark:text-white border-b border-gray-200 dark:border-slate-700">
                {stats.points}
              </td>
              <td className="px-6 py-4 text-sm text-gray-900 dark:text-white border-b border-gray-200 dark:border-slate-700">
                {stats.plusMinus}
              </td>
              <td className="px-6 py-4 text-sm text-gray-900 dark:text-white border-b border-gray-200 dark:border-slate-700">
                {stats.pim}
              </td>
              <td className="px-6 py-4 text-sm text-gray-900 dark:text-white border-b border-gray-200 dark:border-slate-700">
                {stats.shots}
              </td>
            </tr>
          </tbody>
        </table>

        </div>
      </div>
    </div>
  );
}
