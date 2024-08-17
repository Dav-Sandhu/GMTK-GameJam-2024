import { useEffect, useRef } from 'react'
import * as Phaser from 'phaser'
import Config from './Config'
import './App.scss'

function App() {

  const gameRef = useRef(null)

  useEffect(() => {
    new Phaser.Game(Config(gameRef))
  }, [])

  return (
    <div className="home">
      <h1>Scale the Wall (2024)</h1>
      <div id="game" ref={gameRef}></div>
    </div>
  )
}

export default App
