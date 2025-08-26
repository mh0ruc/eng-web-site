"use client";
import React, { useState } from "react";

const EngCard = ({
  word,
  example,
  exampleTr,
  turkish,
  synonyms,
  nearSynonyms,
  onDelete,
  onEdit,
}) => {
  const [showTurkish, setShowTurkish] = useState(false);

  return (
    <div
      className="relative justify-center w-full max-w-xs min-h-[14rem] bg-gradient-to-br from-blue-400 to-blue-600 text-white flex flex-col rounded-xl shadow-xl cursor-pointer group p-4 transition-transform transform hover:scale-105"
      onClick={() => setShowTurkish(!showTurkish)}
    >
      {/* Ön yüz: sadece kelime */}
      {!showTurkish && (
        <h2 className="text-2xl font-bold text-center break-words">{word}</h2>
      )}

      {/* Hover: sadece İngilizce detaylar */}
      {!showTurkish && (
        <div className="absolute inset-0 bg-black bg-opacity-70 text-sm flex flex-col items-start justify-start p-4 rounded-xl opacity-0 group-hover:opacity-100 transition overflow-y-auto break-words">
          {synonyms?.length > 0 && (
            <div className="mb-2">
              <p className="font-semibold">Eş Anlamlılar:</p>
              <ul className="list-disc list-inside text-xs">
                {synonyms.map((s, i) => (
                  <li key={i}>{s.word}</li>
                ))}
              </ul>
            </div>
          )}
          {nearSynonyms?.length > 0 && (
            <div className="mb-2">
              <p className="font-semibold">Yakın Anlamlılar:</p>
              <ul className="list-disc list-inside text-xs">
                {nearSynonyms.map((n, i) => (
                  <li key={i}>{n.word}</li>
                ))}
              </ul>
            </div>
          )}
          <p className="italic mt-2 text-xs break-words">"{example}"</p>
        </div>
      )}

      {/* Click: İngilizce : Türkçe detaylar */}
      {showTurkish && (
        <div className="absolute inset-0 bg-green-500 bg-opacity-90 text-white flex flex-col p-4 rounded-xl overflow-y-auto">
          <p className="font-bold break-words mt-4">
            Kelime: {word} : {turkish}
          </p>
          {synonyms?.length > 0 && (
            <div className="mt-2">
              <p className="font-semibold">Eş Anlamlılar:</p>
              <ul className="list-disc list-inside text-xs break-words">
                {synonyms.map((s, i) => (
                  <li key={i}>
                    {s.word} : {s.tr}
                  </li>
                ))}
              </ul>
            </div>
          )}
          {nearSynonyms?.length > 0 && (
            <div className="mt-2">
              <p className="font-semibold">Yakın Anlamlılar:</p>
              <ul className="list-disc list-inside text-xs break-words">
                {nearSynonyms.map((n, i) => (
                  <li key={i}>
                    {n.word} : {n.tr}
                  </li>
                ))}
              </ul>
            </div>
          )}
          <div className="mt-2">
            <p className="font-semibold">Cümle:</p>
            <p className="italic text-xs break-words">
              {example} : {exampleTr}
            </p>
          </div>
        </div>
      )}

      {/* Sil ve Düzenle butonları */}
      <div className="absolute top-2 right-2 flex gap-2">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700 transition"
        >
          Sil
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onEdit();
          }}
          className="bg-yellow-500 text-white px-3 py-1 rounded text-sm hover:bg-yellow-600 transition"
        >
          Düzenle
        </button>
      </div>
    </div>
  );
};

export default EngCard;
