import { useEffect, useState } from "react";
import "./App.css";

const API_URL = "/api/fe/wordle-words";
const GUESS_LENGTH = 5;

function App() {
  const [solution, setSolution] = useState("");
  const [guesses, setGuesses] = useState(Array(6).fill(null));
  const [currentGuess, setCurrentGuess] = useState('');
  const [isGameOver, setIsGameOver] = useState(false);
  const [gameEnded, setGameEnded] = useState(false);
  const [usedKeys, setUsedKeys] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [emoji, setEmoji] = useState("");
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    localStorage.setItem("theme", !isDarkMode ? "dark" : "light");
  };

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
      setIsDarkMode(true);
    }
  }, []);

  const playSound = (sound) => {
    const audio = new Audio(`/sounds/${sound}.mp3`);
    audio.play();
  };


  useEffect(() => {
    const fetchWord = async () => {
      try {
        const response = await fetch(API_URL);
        const words = await response.json();
        const randomWord = words[Math.floor(Math.random() * words.length)];
        setSolution(randomWord.toLowerCase());
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching words:", error);
        setIsLoading(false);
      }
    };

    fetchWord();
  }, []);

  useEffect(() => {
    const handleType = (event) => {
      if (isGameOver || isLoading) {
        return;
      }

      if (event.key === 'Enter') {
        if (currentGuess.length !== 5) {
          return;
        }
        const newGuesses = [...guesses];
        newGuesses[guesses.findIndex(val => val == null)] = currentGuess;
        setGuesses(newGuesses);
        setCurrentGuess('');

        const isCorrect = solution === currentGuess;
        if (isCorrect) {
          setIsGameOver(true);
          setEmoji("🎉");
          playSound("win");
        }

        if (newGuesses.every(guess => guess != null)) {
          setGameEnded(true);
          setEmoji("😢");
          playSound("lose");
        }

        const newUsedKeys = { ...usedKeys };
        currentGuess.split('').forEach((letter) => {
          if (solution.includes(letter)) {
            newUsedKeys[letter] = 'close';
          }
          if (solution.indexOf(letter) === currentGuess.indexOf(letter)) {
            newUsedKeys[letter] = 'correct';
          }
          if (!solution.includes(letter)) {
            newUsedKeys[letter] = 'incorrect';
          }
        });
        setUsedKeys(newUsedKeys);
      }

      if (event.key === 'Backspace') {
        setCurrentGuess(currentGuess.slice(0, -1));
        return;
      }

      if (currentGuess.length >= 5) {
        return;
      }

      const isLetter = event.key.match(/^[a-z]{1}$/) != null;
      if (isLetter) {
        setCurrentGuess(oldGuess => oldGuess + event.key);
      }
    };

    window.addEventListener('keydown', handleType);
    return () => window.removeEventListener('keydown', handleType);
  }, [currentGuess, isGameOver, solution, guesses, gameEnded, usedKeys, isLoading]);

  const handleRestart = () => {
    window.location.reload();
  };

  return (
    <div className={`app ${isDarkMode ? "dark" : "light"}`}>
      <button className="theme-toggle" onClick={toggleTheme}>
        {isDarkMode ? "🌞 Light Mode" : "🌙 Dark Mode"}
      </button>
      <div className="board">
        <div className="header">
          <h1>Wordle</h1>
          <p>Guess the hidden word in 6 tries</p>
        </div>
        {isLoading ? (
          <div className="loading">Loading...</div>
        ) : (
          <>
            {guesses.map((guess, i) => {
              const isCurrentGuess = i === guesses.findIndex(val => val == null);
              return (
                <Line
                  key={i}
                  guess={isCurrentGuess ? currentGuess : guess ?? ''}
                  isFinal={!isCurrentGuess && guess != null}
                  solution={solution}
                />
              );
            })}
  
            {gameEnded && !isGameOver && (
              <div className="game-over">
                <p>Game Over! The correct word was: <b className="red">{solution}</b></p>
                {emoji && <div className="emoji-reaction">{emoji}</div>}
                <button className="restart-button" onClick={handleRestart}>Restart</button>
              </div>
            )}
  
            {isGameOver && (
              <div className="congratulations">
                <p><b>Congratulations!</b> You guessed the word correctly!</p>
                {emoji && <div className="emoji-reaction">{emoji}</div>}
                <button className="restart-button" onClick={handleRestart}>Restart</button>
              </div>
            )}
  
            <div className="keyboard">
              {['qwertyuiop', 'asdfghjkl', 'zxcvbnm'].map((row, i) => (
                <div key={i} className="keyboard-row">
                  {row.split('').map((key) => (
                    <button
                      key={key}
                      className={`keyboard-key ${usedKeys[key] || ''}`}
                    >
                      {key}
                    </button>
                  ))}
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
  
export default App;

function Line({ guess, isFinal, solution }) {
  const tiles = [];
  for (let i = 0; i < GUESS_LENGTH; i++) {
    const char = guess[i];
    let className = 'tile';
    if (isFinal) {
      className += ' flip'; 
      if (char === solution[i]) {
        className += ' correct';
      } else if (solution.includes(char)) {
        className += ' close';
      } else {
        className += ' incorrect';
      }
    }
    tiles.push(<div key={i} className={className}>{char}</div>);
  }
  return <div className="line">{tiles}</div>;
}