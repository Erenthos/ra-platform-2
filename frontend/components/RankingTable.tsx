"use client";

interface RankingTableProps {
  ranks: { supplierId: string; rank: number }[];
}

export default function RankingTable({ ranks }: RankingTableProps) {
  return (
    <div className="mt-4 bg-gray-50 border border-gray-200 rounded-lg p-3">
      <h4 className="font-semibold text-gray-700 mb-2">Live Rankings</h4>
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b text-gray-600">
            <th className="text-left py-1">Supplier ID</th>
            <th className="text-left py-1">Rank</th>
          </tr>
        </thead>
        <tbody>
          {ranks.map((r) => (
            <tr key={r.supplierId}>
              <td className="py-1">{r.supplierId}</td>
              <td className="py-1 font-semibold text-green-700">{r.rank}</td>
            </tr>
          ))}
          {ranks.length === 0 && (
            <tr>
              <td colSpan={2} className="text-gray-400 text-center py-2">
                No bids yet
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

