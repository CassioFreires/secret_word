import './GameOver.css'

const GameOver = ({retry, score}) => {
  return (
    <div>
      <h1>Fim de jogo!</h1>
      <p>A sua pontuação foi: {score}</p>
      <button onClick={retry}>Restart</button>
    </div>
  )
}

export default GameOver