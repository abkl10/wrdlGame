import { useEffect, useState } from "react";
import "./App.css";

const API_URL = "/api/fe/wordle-words";
function App() {
  const [solution, setSolution] = useState("");

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
      <h1>Local</h1>
      <h2>{solution}</h2>
    </div>
  );
  }

export default App;
