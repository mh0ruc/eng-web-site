"use client";
import React, { useEffect, useState } from "react";

const page = () => {
  const [words, setWords] = useState([]);
  const [current, setCurrent] = useState({});
  const [options, setOptions] = useState([]);
  const [questionType, setQuestionType] = useState(""); // word, synonym, near, example
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState(""); // Doğru / Yanlış göstermek için
  const [asked, setAsked] = useState([]); // sorulan kelimeleri tutar
  const [totalQuestions, setTotalQuestions] = useState(0);

  // LocalStorage'dan kelimeleri al
  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("engWords")) || [];
    setWords(stored);

    // toplam soru = kelimeler * 4 tip (word, synonym, near, example)
    let count = 0;
    stored.forEach((w) => {
      if (w.word) count++;
      if (w.synonyms?.length > 0) count += w.synonyms.length;
      if (w.nearSynonyms?.length > 0) count += w.nearSynonyms.length;
      if (w.example) count++;
    });
    setTotalQuestions(count);
  }, []);

  // Yeni soru oluştur
  const nextQuestion = () => {
    setFeedback(""); // yeni soru geldiğinde feedback sıfırlanır
    if (asked.length >= totalQuestions) {
      setCurrent({});
      return; // quiz bitti
    }

    let w, type, displayText, correctAnswer;

    while (true) {
      w = words[Math.floor(Math.random() * words.length)];
      const types = ["word", "synonym", "near", "example"];
      type = types[Math.floor(Math.random() * types.length)];

      if (type === "word" && w.word && !asked.includes(`word-${w.word}`)) {
        displayText = w.word;
        correctAnswer = w.turkish;
        setAsked([...asked, `word-${w.word}`]);
        break;
      }
      if (type === "synonym" && w.synonyms?.length > 0) {
        const syn = w.synonyms[Math.floor(Math.random() * w.synonyms.length)];
        if (!asked.includes(`syn-${syn.word}`)) {
          displayText = syn.word;
          correctAnswer = syn.tr;
          setAsked([...asked, `syn-${syn.word}`]);
          break;
        }
      }
      if (type === "near" && w.nearSynonyms?.length > 0) {
        const near = w.nearSynonyms[Math.floor(Math.random() * w.nearSynonyms.length)];
        if (!asked.includes(`near-${near.word}`)) {
          displayText = near.word;
          correctAnswer = near.tr;
          setAsked([...asked, `near-${near.word}`]);
          break;
        }
      }
      if (type === "example" && w.example && !asked.includes(`ex-${w.example}`)) {
        displayText = w.example;
        correctAnswer = w.exampleTr;
        setAsked([...asked, `ex-${w.example}`]);
        break;
      }
    }

    // yanlış cevap üret
    let wrong = "";
    while (!wrong || wrong === correctAnswer) {
      const randomWord = words[Math.floor(Math.random() * words.length)];
      switch (type) {
        case "word":
          wrong = randomWord.turkish;
          break;
        case "synonym":
          if (randomWord.synonyms?.length > 0) {
            const r = randomWord.synonyms[Math.floor(Math.random() * randomWord.synonyms.length)];
            wrong = r.tr;
          }
          break;
        case "near":
          if (randomWord.nearSynonyms?.length > 0) {
            const r = randomWord.nearSynonyms[Math.floor(Math.random() * randomWord.nearSynonyms.length)];
            wrong = r.tr;
          }
          break;
        case "example":
          wrong = randomWord.exampleTr;
          break;
      }
    }

    const shuffledOptions =
      Math.random() > 0.5 ? [correctAnswer, wrong] : [wrong, correctAnswer];

    setCurrent({ displayText, correctAnswer });
    setOptions(shuffledOptions);
    setQuestionType(type);
  };

  useEffect(() => {
    if (words.length > 0) {
      nextQuestion();
    }
  }, [words]);

  const handleAnswer = (answer) => {
    if (answer === current.correctAnswer) {
      setScore(score + 1);
      setFeedback("Doğru ✅");
    } else {
      setFeedback(`Yanlış ❌ Doğru cevap: ${current.correctAnswer}`);
    }

    // Bir süre sonra sonraki soruya geç
    setTimeout(() => nextQuestion(), 1000);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-6">
      <h1 className="text-3xl font-bold mb-4">Quiz</h1>
      <p className="mb-2 font-semibold">
        Puan: {score} | Soru: {asked.length}/{totalQuestions}
      </p>

      {asked.length >= totalQuestions ? (
        <div className="bg-white p-6 rounded shadow-lg w-96 text-center">
          <h2 className="text-2xl font-bold mb-4">🎉 Quiz Bitti</h2>
          <p className="text-lg">Toplam Puan: {score} / {totalQuestions}</p>
        </div>
      ) : (
        current.displayText && (
          <div className="bg-white p-6 rounded shadow-lg w-96 flex flex-col gap-4 items-center">
            <p className="text-xl font-bold mb-4">
              {questionType === "example"
                ? "Bu cümlenin anlamı nedir?"
                : "Bu kelimenin anlamı nedir?"}
            </p>
            <p className="text-2xl mb-4">{current.displayText}</p>

            <div className="flex gap-4">
              {options.map((opt, i) => (
                <button
                  key={i}
                  onClick={() => handleAnswer(opt)}
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
                >
                  {opt}
                </button>
              ))}
            </div>

            {feedback && (
              <p
                className={`mt-4 font-semibold ${
                  feedback.includes("Doğru") ? "text-green-600" : "text-red-600"
                }`}
              >
                {feedback}
              </p>
            )}
          </div>
        )
      )}
    </div>
  );
};

export default page;
