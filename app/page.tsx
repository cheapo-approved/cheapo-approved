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

type FavoriteStore = {
  id: string;
  store_id: string;
  label: string;
  sort_order: number | null;
};

export default function Home() {
  const [deals, setDeals] = useState<Deal[]>([]);
  const [favoriteStores, setFavoriteStores] = useState<FavoriteStore[]>([]);
  const [search, setSearch] = useState("");
  const [selectedStoreId, setSelectedStoreId] = useState("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedStore = localStorage.getItem("selectedStoreId");
    if (savedStore) {
      setSelectedStoreId(savedStore);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("selectedStoreId", selectedStoreId);
  }, [selectedStoreId]);

  useEffect(() => {
    async function loadFavoriteStores() {
      const { data, error } = await supabase
        .from("favorite_stores")
        .select("*")
        .order("sort_order", { ascending: true });

      if (error) {
        console.error("Error loading favorite stores:", error);
        setFavoriteStores([]);
      } else {
        setFavoriteStores((data as FavoriteStore[]) || []);
      }
    }

    loadFavoriteStores();
  }, []);

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

      if (selectedStoreId !== "all") {
        query = query.eq("store_id", selectedStoreId);
      }

      const { data, error } = await query;

      if (error) {
        console.error("Error loading deals:", error);
        setDeals([]);
      } else {
        setDeals((data as Deal[]) || []);
      }

      setLoading(false);
    }

    loadDeals();
  }, [search, selectedStoreId]);

  return (
    <main style={{ padding: "24px", maxWidth: "720px", margin: "0 auto" }}>
      <h1>Cheapo Approved</h1>
      <p>Save Mike $4 today.</p>

      <section style={{ marginTop: "24px", marginBottom: "24px" }}>
        <h2>Where are you shopping?</h2>

        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
          <button
            onClick={() => setSelectedStoreId("all")}
            style={{
              padding: "10px 14px",
              borderRadius: "999px",
              border:
                selectedStoreId === "all" ? "2px solid black" : "1px solid #ccc",
              background: selectedStoreId === "all" ? "#eee" : "white",
              cursor: "pointer",
            }}
          >
            All Stores
          </button>

{(favoriteStores.length > 0
  ? favoriteStores
  : [
      { id: "walmart", store_id: "walmart", label: "Walmart", sort_order: 1 },
      { id: "total-wine", store_id: "total wine", label: "Total Wine", sort_order: 2 },
      { id: "abc", store_id: "abc", label: "ABC", sort_order: 3 },
    ]
).map((store) => (
            <button
              key={store.id}
              onClick={() => setSelectedStoreId(store.store_id)}
              style={{
                padding: "10px 14px",
                borderRadius: "999px",
                border:
                  selectedStoreId === store.store_id
                    ? "2px solid black"
                    : "1px solid #ccc",
                background:
                  selectedStoreId === store.store_id ? "#eee" : "white",
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