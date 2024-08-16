import { useEffect, useRef } from 'react'
import * as Phaser from 'phaser'
import Environment from './Environment'
import './App.scss'

function App() {

  const gameRef = useRef(null)

  useEffect(() => {
    
    new Phaser.Game({
      type: Phaser.AUTO,
      parent: gameRef.current || "",
      pixelArt: true,
      antialias: false,
      backgroundColor: '#ffffff',
      width: 800,
      height: 600,
      physics: {
        default: 'matter',
        matter: {
          gravity: { y: 0, x: 0 },
          //debug: true,
        },
      },
      scene: Environment,
    })
  }, [])

  return (
    <div className="home">
      <h1>GMTK Game Jam 2024</h1>
      <div id="game" ref={gameRef}></div>
    </div>
  )
}

export default App
