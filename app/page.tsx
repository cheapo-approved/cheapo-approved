"use client";

import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

type Deal = {
  product_id: string;
  store_id: string;
  product_name: string;
  brand: string | null;
  category: string | null;
  package: string | null;
  price_usd: number | null;
  store_name: string | null;
  city: string | null;
  state: string | null;
};

const favoriteStores = [
  { id: "all", label: "All Stores" },
  { id: "walmart", label: "Walmart" },
  { id: "total wine", label: "Total Wine" },
  { id: "abc", label: "ABC" },
];

export default function Home() {
  const [deals, setDeals] = useState<Deal[]>([]);
  const [search, setSearch] = useState("");
  const [selectedStore, setSelectedStore] = useState("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedStore = localStorage.getItem("selectedStore");
    if (savedStore) {
      setSelectedStore(savedStore);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("selectedStore", selectedStore);
  }, [selectedStore]);

  useEffect(() => {
    async function loadDeals() {
      setLoading(true);

      let query = supabase
        .from("deal_view")
        .select("*")
        .order("price_usd", { ascending: true });

      if (search.trim()) {
        query = query.ilike("product_name", `%${search.trim()}%`);
      }

      if (selectedStore !== "all") {
        query = query.ilike("store_name", `%${selectedStore}%`);
      }

      const { data, error } = await query;

      if (error) {
        console.error("Error loading deals:", JSON.stringify(error, null, 2));
        setDeals([]);
      } else {
        setDeals((data as Deal[]) || []);
      }

      setLoading(false);
    }

    loadDeals();
  }, [search, selectedStore]);

  return (
    <main style={{ padding: "24px", maxWidth: "720px", margin: "0 auto" }}>
      <h1>Cheapo Approved</h1>
      <p>Save Mike $4 today.</p>

      <section style={{ marginTop: "24px", marginBottom: "24px" }}>
        <h2>Where are you shopping?</h2>

        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
          {favoriteStores.map((store) => (
            <button
              key={store.id}
              onClick={() => setSelectedStore(store.id)}
              style={{
                padding: "10px 14px",
                borderRadius: "999px",
                border:
                  selectedStore === store.id
                    ? "2px solid black"
                    : "1px solid #ccc",
                background: selectedStore === store.id ? "#eee" : "white",
                cursor: "pointer",
              }}
            >
              {store.label}
            </button>
          ))}
        </div>
      </section>

      <input
        type="text"
        placeholder="Search beer, liquor, wine..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{
          width: "100%",
          padding: "12px",
          fontSize: "16px",
          marginBottom: "20px",
        }}
      />

      {loading && <p>Loading deals...</p>}

      {!loading && deals.length === 0 && (
        <div
          style={{
            padding: "20px",
            border: "1px solid #ddd",
            borderRadius: "12px",
            background: "#fafafa",
          }}
        >
          <strong>No deals found.</strong>
          <p>Try another store or search term.</p>
        </div>
      )}

      <div style={{ display: "grid", gap: "12px" }}>
        {deals.map((deal) => (
          <div
            key={`${deal.product_id}-${deal.store_id}-${deal.price_usd}`}
            style={{
              border: "1px solid #ddd",
              borderRadius: "12px",
              padding: "16px",
            }}
          >
            <h3 style={{ margin: "0 0 4px" }}>{deal.product_name}</h3>

            <p style={{ margin: "0 0 8px" }}>
              {deal.brand} {deal.package ? `• ${deal.package}` : ""}
            </p>

            <strong style={{ fontSize: "20px" }}>
              {deal.price_usd !== null
                ? `$${deal.price_usd.toFixed(2)}`
                : "No price"}
            </strong>

            <p style={{ margin: "8px 0 0" }}>
              {deal.store_name}
              {deal.city ? ` • ${deal.city}` : ""}
              {deal.state ? `, ${deal.state}` : ""}
            </p>
          </div>
        ))}
      </div>
    </main>
  );
}