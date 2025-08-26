"use client";
import React, { useState } from "react";

export default function SearchBar({ onSearch }) {
  const [query, setQuery] = useState("");

  const handleChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    onSearch(value.toLowerCase()); // ✅ her yazışta çalışır
  };

  return (
    <div className="flex gap-2 w-full sm:w-1/2 my-4">
      <input
        type="text"
        placeholder="Kelime veya cümle ara..."
        value={query}
        onChange={handleChange}
        className="border p-2 rounded w-full"
      />
    </div>
  );
}
