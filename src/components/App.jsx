import { useEffect, useRef, useState } from 'react'
import '../styles/App.css'
import Card from './memoryCards'

const MAXCARDS = 15;

function Header(){
  return (
    <header>
      <h1 className="title">Pokemon Memory Game</h1>
    </header>
  )
}

function Content({pokemonPool, incScore, resetScore}){
  const pokemons = pokemonPool.current;
  const [shuffle, setShuffle] = useState(false);
  const pokemonsSelected = useRef([]);
  
  const shuffleArr = ()=>{
    for(let i = 0; i < pokemons.length; i++){
      const randIdx = Math.floor(Math.random() * pokemons.length);
      if (i == randIdx){
        i--;
        continue;
      }
      const tmp = pokemons[i];
      pokemons[i] = pokemons[randIdx];
      pokemons[randIdx] = tmp;
    }
  }
  shuffleArr();
  const selectPokemon = (id) => {
    // if pokemon selected is already selected reset score
    if (pokemonsSelected.current.includes(id)){
      pokemonsSelected.current = [];
      resetScore();
      console.log("RESET SCORE");
    }
    else{
      incScore();
      pokemonsSelected.current.push(id);
    }
    setShuffle(!shuffle)
  }
  return (
    <main className="content">
      {pokemons.map(p => { return(
      <Card 
        id={p} 
        key={crypto.randomUUID()} //force a rerender for animation
        shuffle={shuffle}
        selectPokemon={selectPokemon}
        incScore={incScore}
      />
      )})}
    </main>
  )
}

function ScoreBoard({score}){
  const bestScore = useRef(0);

  if (bestScore.current < score) bestScore.current = score;

  return (
    <div className="scoreboard">
      <div>Score: {score}</div>
      <div>Best Score: {bestScore.current}</div>
    </div>
  )
}

function App() {
  const [doneCountFetch, setDoneCountFetch] = useState(false);
  const [score, setScore] = useState(0);
  const pokemonPool = useRef([]);

  useEffect(()=>{
    // fetch pokemon count for randomization (some ids dont have queries)
    fetch("https://pokeapi.co/api/v2/pokemon/")
      .then(resp => resp.json())
      .then(json => {
        const randIdArray = ()=>{
          let ids = [];
          for (let i = 1; i <= MAXCARDS; i++){
            // const idMax = Math.floor(Math.random() * json.count) + 1;
            ids.push(i);
          }
          return ids;
        }
        pokemonPool.current = randIdArray();
        setDoneCountFetch(true);
      });
  },[]);

  const incScore = ()=>{setScore(score + 1)};
  const resetScore = ()=>{setScore(0)};

  return (
    <>
      <div className="headerScore">
        <Header/>
        <ScoreBoard score={score}/>
      </div>
      {doneCountFetch && <Content 
        pokemonPool={pokemonPool} 
        incScore={incScore}
        resetScore={resetScore}
      />}
    </>
  )
}

export default App
