"use client";

import { useEffect, useMemo, useState } from "react";
import { supabase } from "../lib/supabase";

type Deal = {
  product_name: string;
  brand: string | null;
  category: string | null;
  package: string | null;
  store_name: string | null;
  city: string | null;
  price_usd: number | null;
  date_seen: string | null;
  availability: string | null;
  confidence: string | null;
  upc: string | null;
};

export default function Home() {
  const [query, setQuery] = useState("");
  const [deals, setDeals] = useState<Deal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadDeals() {
      const { data, error } = await supabase
        .from("deal_view")
        .select("*")
        .order("price_usd", { ascending: true });

      if (error) {
        setError(error.message);
      } else {
        setDeals((data as Deal[]) || []);
      }

      setLoading(false);
    }

    loadDeals();
  }, []);

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim();
    if (!q) return deals;

    return deals.filter((item) =>
  `${item.product_name} ${item.brand} ${item.category} ${item.store_name} ${(item as any).upc || ""}`
    .toLowerCase()
    .includes(q)
);
  }, [query, deals]);

  return (
    <main style={{ padding: 24 }}>
      <h1>🍺 Cheapo Approved</h1>
      <p>Save Mike $4 today.</p>

      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search beer, wine, liquor..."
        style={{
          padding: 14,
          width: "100%",
          fontSize: 18,
          margin: "20px 0",
        }}
      />

      {loading && <p>Loading deals...</p>}
      {error && <p style={{ color: "red" }}>Error: {error}</p>}

      {!loading && !error && filtered.length === 0 && (
        <p>No deals found yet.</p>
      )}

      <div>
        {filtered.map((item, index) => (
          <div
            key={`${item.product_name}-${item.store_name}-${index}`}
            style={{
              border: "1px solid #ddd",
              borderRadius: 10,
              padding: 16,
              marginBottom: 14,
            }}
          >
            <h2>{item.product_name}</h2>
            <p>
              {index === 0 ? "🏆 " : ""}
              {item.store_name || "Unknown store"}
              {item.city ? ` — ${item.city}` : ""}
            </p>
            <h2>
              {item.price_usd !== null
                ? `$${Number(item.price_usd).toFixed(2)}`
                : "No price"}
            </h2>
            <p style={{ color: "#666" }}>
              {item.package || ""} {item.date_seen ? `• ${item.date_seen}` : ""}
            </p>
          </div>
        ))}
      </div>
    </main>
  );
}