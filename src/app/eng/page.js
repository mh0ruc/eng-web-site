"use client";
import React, { useState, useEffect } from "react";
import EngCard from "../components/engcard";
import Link from "next/link";

const Page = () => {
  const [word, setWord] = useState("");
  const [example, setExample] = useState("");
  const [exampleTr, setExampleTr] = useState("");
  const [turkish, setTurkish] = useState("");

  // Eş anlamlılar
  const [synWord, setSynWord] = useState("");
  const [synTurkish, setSynTurkish] = useState("");
  const [synonyms, setSynonyms] = useState([]);

  // Yakın anlamlılar
  const [nearWord, setNearWord] = useState("");
  const [nearTurkish, setNearTurkish] = useState("");
  const [nearSynonyms, setNearSynonyms] = useState([]);

  const [words, setWords] = useState([]);
  const [editIndex, setEditIndex] = useState(null); // Düzenleme indexi

  // LocalStorage'dan verileri çek
  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("engWords")) || [];
    setWords(stored);
  }, []);

  // Eş anlamlı ekleme
  const addSynonym = () => {
    if (synWord && synTurkish) {
      setSynonyms([...synonyms, { word: synWord, tr: synTurkish }]);
      setSynWord("");
      setSynTurkish("");
    }
  };

  // Yakın anlamlı ekleme
  const addNear = () => {
    if (nearWord && nearTurkish) {
      setNearSynonyms([...nearSynonyms, { word: nearWord, tr: nearTurkish }]);
      setNearWord("");
      setNearTurkish("");
    }
  };

  // Eş anlamlı sil
  const deleteSynonym = (index) => {
    const updated = synonyms.filter((_, i) => i !== index);
    setSynonyms(updated);
  };

  // Yakın anlamlı sil
  const deleteNear = (index) => {
    const updated = nearSynonyms.filter((_, i) => i !== index);
    setNearSynonyms(updated);
  };

  // Düzenleme
  const editEntry = (index) => {
    const w = words[index];
    setWord(w.word);
    setExample(w.example);
    setExampleTr(w.exampleTr);
    setTurkish(w.turkish);
    setSynonyms(w.synonyms);
    setNearSynonyms(w.nearSynonyms);
    setEditIndex(index);
  };

  // Form submit
  const handleSubmit = (e) => {
    e.preventDefault();

    const newEntry = {
      word,
      example,
      exampleTr,
      turkish,
      synonyms,
      nearSynonyms,
    };

    let updated;
    if (editIndex !== null) {
      // Düzenleme varsa
      updated = [...words];
      updated[editIndex] = newEntry;
      setEditIndex(null);
    } else {
      updated = [newEntry,...words];
    }

    setWords(updated);
    localStorage.setItem("engWords", JSON.stringify(updated));

    // Temizle
    setWord("");
    setExample("");
    setExampleTr("");
    setTurkish("");
    setSynonyms([]);
    setNearSynonyms([]);
  };

  // Silme
  const handleDelete = (index) => {
    const updated = words.filter((_, i) => i !== index);
    setWords(updated);
    localStorage.setItem("engWords", JSON.stringify(updated));
  };

  return (
    <div className="flex flex-col justify-start items-center min-h-screen bg-gray-100 p-6 gap-8">
      {/* FORM */}
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-xl shadow-lg w-max flex flex-col gap-4"
      >
        <h1 className="text-2xl font-bold text-center">
          {editIndex !== null ? "Kelime Düzenle" : "Yeni Kelime Ekle"}
        </h1>

        <input
          type="text"
          placeholder="Ana kelime"
          value={word}
          onChange={(e) => setWord(e.target.value)}
          className="border p-2 rounded"
          required
        />

        <input
          type="text"
          placeholder="Örnek cümle"
          value={example}
          onChange={(e) => setExample(e.target.value)}
          className="border p-2 rounded"
          required
        />

        <input
          type="text"
          placeholder="Örnek cümlenin Türkçesi"
          value={exampleTr}
          onChange={(e) => setExampleTr(e.target.value)}
          className="border p-2 rounded"
          required
        />

        <input
          type="text"
          placeholder="Kelimenin Türkçesi"
          value={turkish}
          onChange={(e) => setTurkish(e.target.value)}
          className="border p-2 rounded"
          required
        />

        {/* Eş Anlamlı Formu */}
        <div className="border p-3 rounded bg-gray-50">
          <h2 className="font-semibold mb-2">Eş Anlamlılar</h2>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Kelime"
              value={synWord}
              onChange={(e) => setSynWord(e.target.value)}
              className="border p-2 rounded flex-1"
            />
            <input
              type="text"
              placeholder="Türkçesi"
              value={synTurkish}
              onChange={(e) => setSynTurkish(e.target.value)}
              className="border p-2 rounded flex-1"
            />
            <button
              type="button"
              onClick={addSynonym}
              className="bg-blue-500 text-white px-3 rounded"
            >
              +
            </button>
          </div>
          <ul className="mt-2 text-sm text-gray-700 list-disc list-inside">
            {synonyms.map((s, i) => (
              <li key={i} className="flex justify-between items-center gap-2">
                {s.word} ; {s.tr}
                <div className="flex gap-1">
                  <button
                    type="button"
                    onClick={() => deleteSynonym(i)}
                    className="bg-red-500 text-white px-2 rounded text-xs"
                  >
                    Sil
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setSynWord(s.word);
                      setSynTurkish(s.tr);
                      deleteSynonym(i);
                    }}
                    className="bg-yellow-500 text-white px-2 rounded text-xs"
                  >
                    Düzenle
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Yakın Anlamlı Formu */}
        <div className="border p-3 rounded bg-gray-50">
          <h2 className="font-semibold mb-2">Yakın Anlamlılar</h2>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Kelime"
              value={nearWord}
              onChange={(e) => setNearWord(e.target.value)}
              className="border p-2 rounded flex-1"
            />
            <input
              type="text"
              placeholder="Türkçesi"
              value={nearTurkish}
              onChange={(e) => setNearTurkish(e.target.value)}
              className="border p-2 rounded flex-1"
            />
            <button
              type="button"
              onClick={addNear}
              className="bg-green-500 text-white px-3 rounded"
            >
              +
            </button>
          </div>
          <ul className="mt-2 text-sm text-gray-700 list-disc list-inside">
            {nearSynonyms.map((s, i) => (
              <li key={i} className="flex justify-between items-center gap-2">
                {s.word} ; {s.tr}
                <div className="flex gap-1">
                  <button
                    type="button"
                    onClick={() => deleteNear(i)}
                    className="bg-red-500 text-white px-2 rounded text-xs"
                  >
                    Sil
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setNearWord(s.word);
                      setNearTurkish(s.tr);
                      deleteNear(i);
                    }}
                    className="bg-yellow-500 text-white px-2 rounded text-xs"
                  >
                    Düzenle
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
        >
          {editIndex !== null ? "Güncelle" : "Kaydet"}
        </button>
      </form>
<div className="flex-col flex justify-center items-center   mt-4">
  <Link
    href="/quiz"
    className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 transition"
  >
    Quiz'e Git
  </Link>
 <div className="text-2xl font-bold">
  toplam kelime : {words.length}
 </div>
</div>
      {/* KARTLAR */}
      <div className="flex flex-wrap gap-6 justify-center">
        
        {words.length === 0 ? (
          <p className="text-gray-600">Henüz kelime eklenmedi.</p>
        ) : (
          words.map((w, i) => (
            <EngCard
              key={i}
              word={w.word}
              example={w.example}
              exampleTr={w.exampleTr}
              turkish={w.turkish}
              synonyms={w.synonyms}
              nearSynonyms={w.nearSynonyms}
              onDelete={() => handleDelete(i)}
              onEdit={() => editEntry(i)}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default Page;
