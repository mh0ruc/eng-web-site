'use client'
import { useState } from "react";

export default function Home() {
  const [kelime, setkelime] = useState("")
   const [wordList, setwordList] = useState([""])
  const getRandomWord = () => wordList[Math.floor(Math.random() * wordList.length)];

  const [targetWord, setTargetWord] = useState(getRandomWord());
  const wordLength = targetWord.length;

  const [guesses, setGuesses] = useState([]);
  const [currentGuess, setCurrentGuess] = useState("");
  const [isGameOver, setIsGameOver] = useState(false);
  const [fixedLetters, setFixedLetters] = useState(Array(wordLength).fill(""));

  const handleInputChange = (value) => {
    if (value.length > wordLength) return;
    setCurrentGuess(value.toUpperCase());
  };

  const handleSubmit = () => {
    if (currentGuess.length !== wordLength || isGameOver) return;

    const guessArray = currentGuess.split("");
    if (currentGuess === targetWord) {
      setIsGameOver(true);
    }

    setGuesses([...guesses, guessArray]);

    const statusArray = getLetterStatus(guessArray);
    let newFixedLetters = [...fixedLetters];

    statusArray.forEach((status, i) => {
      if (status === "green") {
        newFixedLetters[i] = guessArray[i]; 
      }
    });

    setFixedLetters(newFixedLetters);
    setCurrentGuess("");
  };

  const getLetterStatus = (guess) => {
    let statusArray = new Array(wordLength).fill("gray");
    let targetWordLetters = targetWord.split("");

    guess.forEach((letter, i) => {
      if (letter === targetWord[i]) {
        statusArray[i] = "green";
        targetWordLetters[i] = null;
      }
    });

    guess.forEach((letter, i) => {
      if (statusArray[i] === "green") return;

      let targetIndex = targetWordLetters.indexOf(letter);
      if (targetIndex !== -1) {
        statusArray[i] = "yellow";
        targetWordLetters[targetIndex] = null;
      }
    });

    return statusArray;
  };

  const handleNewGame = () => {
    const newWord = getRandomWord();
    setTargetWord(newWord);
    setGuesses([]);
    setCurrentGuess("");
    setFixedLetters(Array(newWord.length).fill(""));
    setIsGameOver(false);
  };
  const handlekelimegir =()=>{
    setwordList([...wordList, kelime])
    setkelime("")
  }
console.log(wordList);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <h1 className="text-2xl font-bold mb-4">Kelime Tahmin Oyunu</h1>
      <input
        type="text"
       
        className="w-60 h-12 text-center text-xl font-bold border-2 rounded-md mb-4"
    value={kelime}
        onChange={(e) => setkelime(e.target.value)}
      
      /> 
      <button
      className="border font-bold text-white px-4 py-2 bg-gray-400 hover:bg-green-500 rounded-md mb-2"
       onClick={handlekelimegir}>
        kelimeyi ekle
      </button>
      <button
      className="border px-4 py-2 bg-gray-400 hover:bg-red-500 rounded-md mb-2"
       onClick={()=>{setwordList[[]]}}>
        listeyi sil
      </button>
      <input
        type="text"
        maxLength={wordLength}
        className="w-60 h-12 text-center text-xl font-bold border-2 rounded-md mb-4"
        placeholder={`Tahmini ${wordLength} harf girin`}
        value={currentGuess}
        onChange={(e) => handleInputChange(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
      />
      
  
      

      {guesses.map((guess, rowIndex) => {
        const statusArray = getLetterStatus(guess);
        return (
          <div key={rowIndex} className="flex gap-2 mb-2">
            {guess.map((letter, i) => {
              let bgColor =
                statusArray[i] === "green"
                  ? "bg-green-500 text-white"
                  : statusArray[i] === "yellow"
                  ? "bg-yellow-500 text-white"
                  : "bg-gray-300";

              return (
                <input
                  key={i}
                  className={`w-16 h-16 text-center text-xl font-bold border-2 rounded-md ${bgColor}`}
                  value={letter}
                  readOnly
                />
              );
            })}
          </div>
        );
      })}

      {!isGameOver && (
        <div className="flex gap-2 mb-4">
          {Array.from({ length: wordLength }).map((_, i) => (
            <input
              key={i}
              type="text"
              maxLength={1}
              className={`w-16 h-16 text-center text-xl font-bold border-2 rounded-md ${
                fixedLetters[i] ? "bg-green-500 text-white" : ""
              }`}
              value={fixedLetters[i] || currentGuess[i] || ""}
              readOnly
            />
          ))}
        </div>
      )}

      {!isGameOver && (
        <button
          onClick={handleSubmit}
          className="px-6 py-2 bg-blue-500 text-white font-bold rounded-md"
        >
          Tahmini Gönder
        </button>
      )}

      {isGameOver && (
        <p className="mt-4 text-green-600 text-xl font-bold">
          🎉 Tebrikler! Kelimeyi buldun!
        </p>
      )}

      <button
        onClick={handleNewGame}
        className="mt-4 px-6 py-2 bg-red-500 text-white font-bold rounded-md"
      >
        Yeni Oyun Başlat
      </button>
    </div>
  );
}
