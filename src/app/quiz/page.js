"use client";
import React, { useEffect, useState } from "react";

const Page = () => {
  const [words, setWords] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [answered, setAnswered] = useState({});
  const [totalQuestions, setTotalQuestions] = useState(0);

  const [correctCount, setCorrectCount] = useState(0);
  const [wrongCount, setWrongCount] = useState(0);
  const [results, setResults] = useState([]);
  const [showResults, setShowResults] = useState(false);

  const [started, setStarted] = useState(false); // quiz başladı mı?

  // LocalStorage'dan kelimeleri al
  useEffect(() => {
    const storedWords = JSON.parse(localStorage.getItem("engWords")) || [];
    setWords(storedWords);

    // daha önce başlanmış quiz var mı?
    const saved = JSON.parse(localStorage.getItem("quizProgress"));
    if (saved && saved.questions) {
      setQuestions(saved.questions);
      setCorrectCount(saved.correctCount);
      setWrongCount(saved.wrongCount);
      setResults(saved.results);
      setAnswered(saved.answered);
      setCurrentIndex(saved.currentIndex);
      setTotalQuestions(saved.totalQuestions);
      setStarted(true);
    }
  }, []);

  // Quiz başlat (ilk defa)
  const startQuiz = (stored) => {
    let qList = [];

    stored.forEach((w) => {
      if (w.word) {
        qList.push({ type: "word", displayText: w.word, correctAnswer: w.turkish });
      }
      if (w.synonyms?.length > 0) {
        w.synonyms.forEach((syn) =>
          qList.push({ type: "synonym", displayText: syn.word, correctAnswer: syn.tr })
        );
      }
      if (w.nearSynonyms?.length > 0) {
        w.nearSynonyms.forEach((near) =>
          qList.push({ type: "near", displayText: near.word, correctAnswer: near.tr })
        );
      }
      if (w.example) {
        qList.push({ type: "example", displayText: w.example, correctAnswer: w.exampleTr });
      }
    });

    // shuffle
    qList = qList.sort(() => Math.random() - 0.5);

    // yanlış şık ekle
    qList = qList.map((q) => {
      let wrong = "";
      while (!wrong || wrong === q.correctAnswer) {
        const randomWord = stored[Math.floor(Math.random() * stored.length)];
        switch (q.type) {
          case "word":
            wrong = randomWord.turkish;
            break;
          case "synonym":
            if (randomWord.synonyms?.length > 0) {
              const r =
                randomWord.synonyms[Math.floor(Math.random() * randomWord.synonyms.length)];
              wrong = r.tr;
            }
            break;
          case "near":
            if (randomWord.nearSynonyms?.length > 0) {
              const r =
                randomWord.nearSynonyms[Math.floor(Math.random() * randomWord.nearSynonyms.length)];
              wrong = r.tr;
            }
            break;
          case "example":
            wrong = randomWord.exampleTr;
            break;
        }
      }
      const options =
        Math.random() > 0.5 ? [q.correctAnswer, wrong] : [wrong, q.correctAnswer];
      return { ...q, options };
    });

    setQuestions(qList);
    setTotalQuestions(qList.length);
    setCorrectCount(0);
    setWrongCount(0);
    setResults([]);
    setAnswered({});
    setCurrentIndex(0);
    setFeedback("");
    setShowResults(false);
    setStarted(true);

    // kaydet
    localStorage.setItem(
      "quizProgress",
      JSON.stringify({
        questions: qList,
        correctCount: 0,
        wrongCount: 0,
        results: [],
        answered: {},
        currentIndex: 0,
        totalQuestions: qList.length,
      })
    );
  };

  // cevaplama
  const handleAnswer = (answer) => {
    if (answered[currentIndex]) return;

    const currentQ = questions[currentIndex];
    let isCorrect = false;
    let newCorrect = correctCount;
    let newWrong = wrongCount;
    let newResults = [...results];

    if (answer === currentQ.correctAnswer) {
      newCorrect++;
      setFeedback("Doğru ✅");
      isCorrect = true;
    } else {
      newWrong++;
      setFeedback(`Yanlış ❌ Doğru: ${currentQ.correctAnswer}`);
    }

    newResults.push({
      question: currentQ.displayText,
      givenAnswer: answer,
      correctAnswer: currentQ.correctAnswer,
      isCorrect,
    });

    setCorrectCount(newCorrect);
    setWrongCount(newWrong);
    setResults(newResults);
    const newAnswered = { ...answered, [currentIndex]: true };
    setAnswered(newAnswered);

    // ilerlemeyi kaydet
    localStorage.setItem(
      "quizProgress",
      JSON.stringify({
        questions,
        correctCount: newCorrect,
        wrongCount: newWrong,
        results: newResults,
        answered: newAnswered,
        currentIndex,
        totalQuestions,
      })
    );
  };

  // quiz sıfırla
  const resetQuiz = () => {
    localStorage.removeItem("quizProgress");
    setQuestions([]);
    setStarted(false);
  };

  if (!started) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <h1 className="text-2xl font-bold mb-4">Quiz'e Başla</h1>
        <button
          onClick={() => startQuiz(words)}
          className="px-6 py-3 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          🚀 Teste Başla
        </button>
      </div>
    );
  }

  if (questions.length === 0) {
    return <p className="text-center mt-10">Yüklenecek kelime bulunamadı.</p>;
  }

  const currentQ = questions[currentIndex];

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-gray-100 p-6">
      <h1 className="text-3xl font-bold mb-4">Quiz</h1>
      <p className="mb-2 font-semibold">
        Doğru: {correctCount} | Yanlış: {wrongCount} | Soru: {currentIndex + 1}/
        {totalQuestions}
      </p>

      <div className="bg-white p-6 rounded shadow-lg w-96 flex flex-col gap-4 items-center">
        <p className="text-xl font-bold mb-4">
          {currentQ.type === "example"
            ? "Bu cümlenin anlamı nedir?"
            : "Bu kelimenin anlamı nedir?"}
        </p>
        <p className="text-2xl mb-4">{currentQ.displayText}</p>

        <div className="flex gap-4">
          {currentQ.options.map((opt, i) => (
            <button
              key={i}
              onClick={() => handleAnswer(opt)}
              disabled={answered[currentIndex]}
              className={`px-4 py-2 rounded transition ${
                answered[currentIndex]
                  ? opt === currentQ.correctAnswer
                    ? "bg-green-500 text-white"
                    : "bg-red-500 text-white"
                  : "bg-blue-500 text-white hover:bg-blue-600"
              }`}
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

        {/* Önceki / Sonraki */}
        <div className="flex gap-4 mt-6">
          <button
            onClick={() => {
              if (currentIndex > 0) {
                setCurrentIndex(currentIndex - 1);
                setFeedback("");
              }
            }}
            className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
          >
            ◀ Önceki
          </button>
          <button
            onClick={() => {
              if (currentIndex < totalQuestions - 1) {
                setCurrentIndex(currentIndex + 1);
                setFeedback("");
              }
            }}
            className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
          >
            Sonraki ▶
          </button>
        </div>

        {/* Kontroller */}
        <div className="flex gap-4 mt-6">
          <button
            onClick={resetQuiz}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            🔄 Baştan Başlat
          </button>
          <button
            onClick={() => setShowResults(true)}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            📊 Sonucu Göster
          </button>
          <button
            onClick={() => (window.location.href = "/")}
            className="bg-gray-700 text-white px-4 py-2 rounded hover:bg-gray-800"
          >
            ↩ listeye dön
          </button>
        </div>
      </div>

      {/* Sonuç listesi */}
      {showResults && (
        <div className="mt-8 bg-white p-6 rounded shadow-lg w-[600px]">
          <h2 className="text-2xl font-bold mb-4">Sonuçlar</h2>
          <ul className="space-y-2 max-h-80 overflow-y-auto">
            {results.map((r, idx) => (
              <li
                key={idx}
                className={`p-2 rounded ${
                  r.isCorrect ? "bg-green-100" : "bg-red-100"
                }`}
              >
                <strong>Soru:</strong> {r.question} <br />
                <strong>Senin Cevabın:</strong> {r.givenAnswer} <br />
                <strong>Doğru Cevap:</strong> {r.correctAnswer}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Page;
