import { useEffect, useState } from "react";
import "./App.css";

const API_URL = "/api/fe/wordle-words";
const GUESS_LENGTH = 5;
function App() {
  const [solution, setSolution] = useState("");
  const [guesses, setGuesses] = useState(Array(6).fill(null));

  useEffect(() => {
    const fetchWord = async () => {
      try {
        const response = await fetch(API_URL);
        const words = await response.json();
        const randomWord = words[Math.floor(Math.random() * words.length)];
        setSolution(randomWord);
      } catch (error) {
        console.error("Error fetching words:", error);
      }
    };

    fetchWord();
  }, []);

  return (
    <div className="App">
      {guesses.map(guess=>{
        return <Line guess = {guess ?? ''}/>
      })}
    </div>
  );
  }

export default App;

function Line({guess}) {
  const tiles = [];
  for (let i = 0; i<GUESS_LENGTH ; i++)
  {
    const char = guess[i]
    tiles.push(<div key = {i} className="tile">{char}</div>)
  }
  return <div className="line"> {tiles}</div>
}
