"use client";

interface AuctionListProps {
  auctions: any[];
  ranks: { supplierId: string; rank: number }[];
}

export default function AuctionList({ auctions, ranks }: AuctionListProps) {
  return (
    <div className="space-y-4">
      {auctions.length === 0 && (
        <p className="text-gray-500">No auctions available.</p>
      )}
      {auctions.map((auction) => (
        <div
          key={auction.id}
          className="p-4 border rounded-lg bg-white shadow-sm hover:shadow-md transition"
        >
          <h3 className="text-lg font-semibold text-blue-700">
            {auction.title}
          </h3>
          <p className="text-sm text-gray-600">{auction.description}</p>
          <p className="text-sm mt-2">
            Start: {new Date(auction.startsAt).toLocaleString()}
          </p>
          <p className="text-sm">
            End: {new Date(auction.endsAt).toLocaleString()}
          </p>

          <div className="mt-3">
            <h4 className="font-medium text-sm mb-1">Live Ranks:</h4>
            <ul className="text-sm text-gray-700 space-y-1">
              {ranks.map((r) => (
                <li key={r.supplierId}>
                  Supplier ID: <b>{r.supplierId}</b> → Rank:{" "}
                  <span className="font-bold text-green-700">{r.rank}</span>
                </li>
              ))}
              {ranks.length === 0 && <li>No ranks yet</li>}
            </ul>
          </div>
        </div>
      ))}
    </div>
  );
}

