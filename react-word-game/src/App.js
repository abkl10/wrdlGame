import { useEffect, useState } from "react";
import "./App.css";

const API_URL = "/api/fe/wordle-words";
const GUESS_LENGTH = 5;
function App() {
  const [solution, setSolution] = useState("");
  const [guesses, setGuesses] = useState(Array(6).fill(null));
  const[currentGuess, setCurrentGuess] = useState('');
  const[isGameOver, setIsgameOver] = useState(false);

  useEffect(()=> {
   const handleType = (event)=> {
    if(isGameOver){
      return;
    }
    


    if(event.key === 'Enter'){
       if(currentGuess.length !=5){
        return;
       }
       const isCorrect = solution === currentGuess;
       if(isCorrect){
        setIsgameOver(true);
       }
    }

    if(event.key ==='Backspace')
    {
      setCurrentGuess(currentGuess.slice(0,-1));
      return;
    }

    if( currentGuess.length >=5)
    {
      return;
    }
    setCurrentGuess(oldGuess => oldGuess + event.key);
   };  

  window.addEventListener('keydown', handleType);
  return () => window.removeEventListener('keydown',handleType);
  },[currentGuess, isGameOver, solution]);

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
    <div className="board">
      {guesses.map((guess, i)=>{
        const isCurrentGuess = i === guesses.findIndex(val => val == null);
        return <Line guess = {isCurrentGuess? currentGuess: guess ?? ''}/>
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
