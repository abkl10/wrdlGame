import { useEffect, useState } from "react";
import "./App.css";

const API_URL = "/api/fe/wordle-words";
const GUESS_LENGTH = 5;
function App() {
  const [solution, setSolution] = useState("");
  const [guesses, setGuesses] = useState(Array(6).fill(null));
  const[currentGuess, setCurrentGuess] = useState('');
  const[isGameOver, setIsgameOver] = useState(false);
  const [gameEnded, setGameEnded] = useState(false);

  useEffect(()=> {
   const handleType = (event)=> {
    if(isGameOver){
      return;
    }
    


    if(event.key === 'Enter'){
       if(currentGuess.length !=5){
        return;
       }
       const newGuesses = [...guesses];
       newGuesses[guesses.findIndex(val => val == null)] = currentGuess;
       setGuesses(newGuesses);
       setCurrentGuess('');

       const isCorrect = solution === currentGuess;
       if(isCorrect){
        setIsgameOver(true);
       }

       if (newGuesses.every(guess => guess != null)) {
        setGameEnded(true); 
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

    const isLetter = event.key.match(/^[a-z]{1}$/) !=null;
    if( isLetter)
      {
        setCurrentGuess(oldGuess => oldGuess + event.key);

      }
   };  

  window.addEventListener('keydown', handleType);
  return () => window.removeEventListener('keydown',handleType);
  },[currentGuess, isGameOver, solution, guesses, gameEnded]);

  useEffect(() => {
    const fetchWord = async () => {
      try {
        const response = await fetch(API_URL);
        const words = await response.json();
        const randomWord = words[Math.floor(Math.random() * words.length)];
        setSolution(randomWord.toLowerCase());
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
        return( <Line 
        guess = {isCurrentGuess? currentGuess: guess ?? ''}
        isFinal={!isCurrentGuess && guess !=null}
        solution = {solution}
        />
      );
      })}

{gameEnded && !isGameOver && (
        <div className="game-over">
          <p>Game Over! The correct word was: {solution}</p>
        </div>
      )}
    </div>
  );
  }

export default App;

function Line({guess, isFinal, solution}) {
  const tiles = [];
  for (let i = 0; i<GUESS_LENGTH ; i++)
  {
    const char = guess[i]
    let className = 'tile';
    if(isFinal)
    {
        if(char === solution[i]){
          className+=' correct';
        }else if (solution.includes(char)){
          className+=' close';

        }else{
          className+=' incorrect';
        }
    }


    tiles.push(<div key = {i} className={className}>{char}</div>)
  }
  return <div className="line"> {tiles}</div>
}
