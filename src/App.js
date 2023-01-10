// CSS
import './App.css';

// REACT
import { useCallback, useEffect, useState } from 'react';

// DATA 
import { wordsList } from './data/words';

// COMPONENTS
import StartScreen from './components/StartScreen';
import Game from './components/Game';
import GameOver from './components/GameOver';

const stage = [
  {id: 1, name: 'start' },
  {id: 2, name: 'game' },
  {id: 3, name: 'end' }
]

const guessesQty = 3;

function App() {
  // states
  const [gameStage, setGameStage] = useState(stage[0].name)
  const [words] = useState(wordsList);
  

  const [pickedWord, setPickedWord] = useState('');
  const [pickedCategory, setPickedCategory] = useState('');
  const [letters, setLetters] = useState([]);


  const [guessedLetter, setGuessedLetter] = useState([]);
  const [wrongLetter, setWrongLetter] = useState([]);
  const [guesses, setGuesses] = useState(guessesQty);
  const [score, setScore] = useState(0);



  // Function para captrurar a category e word
  const pickdWordAndCategory = useCallback(() => {
     // pick a random category
     const categories = Object.keys(words);
     const category = categories[Math.floor(Math.random() * Object.keys(categories).length)];
 
     // pick a random word
     const word = words[category][Math.floor(Math.random() * words[category].length)];
 
     return {word, category}
  }, [words])


  // starts the secret word game
  const startGame = useCallback(() => {
       // clear all letter
       clearLetterState();

       // pick word and pick-category
       const {word, category} = pickdWordAndCategory();
   
       // create an array of letter
       let wordLetters = word.split("");
       wordLetters = wordLetters.map((letter) => letter.toLowerCase());
       
       // fill states
       setPickedWord(word);
       setPickedCategory(category);
       setLetters(wordLetters)
   
   
       setGameStage(stage[1].name);
  }, [pickdWordAndCategory])


  // proccess the leter input
  const verifyLetter = (letter) => {
    
    const normalizedLetter = letter.toLowerCase();

    // check if letter has already been utilized
    if(guessedLetter.includes(normalizedLetter) || wrongLetter.includes(normalizedLetter)){
      return ;
    }

    // pushed guessedLetter or remove a guess
    if(letters.includes(normalizedLetter)){
      setGuessedLetter((actualGuessedLetters) => [...actualGuessedLetters, normalizedLetter])
    } else{
      setWrongLetter((actualWrongLetters) => [...actualWrongLetters], normalizedLetter);
      setGuesses((actualGuess) => actualGuess - 1)
    }
  };

  const clearLetterState = () => {
    setGuessedLetter([]);
    setWrongLetter([]);
  }

  // check if guesses ended
  useEffect(() => {
    if(guesses <= 0){
      //reset all states
      clearLetterState() ;

      setGameStage(stage[2].name)
    }
  }, [guesses])

  // chech if win condition
  useEffect(() => {
    
    const uniqueLetter = [...new Set(letters)];

    // win condition
    if(guessedLetter.length === uniqueLetter.length){

      //add score
      setScore((actualScore) => actualScore += 100);

      // restar the game 
      startGame();
    }

  }, [guessedLetter, letters, startGame])

  // restart the game 
  const retry = () => {
    setScore(0);
    setGuesses(guessesQty);

    setGameStage(stage[0].name)
  }

  return (
    <div className="App">
      {gameStage === 'start' && <StartScreen startGame={startGame}/>}
      
      {gameStage === 'game' && 
        <Game 
          verifyLetter={verifyLetter} 
          letters={letters}
          pickedWord={pickedWord} 
          pickedCategory={pickedCategory} 
          guessedLetter={guessedLetter}
          wrongLetter={wrongLetter}
          guesses={guesses}
          score={score}
          />}

      {gameStage === 'end' && <GameOver retry={retry} score={score}/>}
    </div>
  );
}

export default App;
