import '../styles/App.css';
import { useState, useEffect } from 'react';
import { Chessboard } from 'react-chessboard';
import { Chess } from 'chess.js';

function App() {
  const [game, setGame] = useState(new Chess());
  const [winner, setWinner] = useState(null);
  const [gameOver, setGameOver] = useState(false);
  const [colorScheme, setColorScheme] = useState('default');

  function safeGameMutate(modify) {
    setGame((g) => {
      const update = { ...g };
      modify(update);
      return update;
    });
  }

  function makeRandomMove() {
    const possibleMove = game.moves();

    if (game.game_over() || game.in_draw() || possibleMove.length === 0) {
      setGameOver(true);
      const winner = game.turn() === 'w' ? 'Black' : 'White';
      setWinner(winner);
      return;
    }

    const randomIndex = Math.floor(Math.random() * possibleMove.length);
    safeGameMutate((game) => {
      game.move(possibleMove[randomIndex]);
    });
  }

  function onDrop(source, target) {
    if (gameOver) return false;

    let move = null;
    safeGameMutate((game) => {
      move = game.move({
        from: source,
        to: target,
        promotion: 'q',
      });
    });

    if (move === null) return false;

    setTimeout(makeRandomMove, 200);
    return true;
  }

  // Reset the game
  function restartGame() {
    setGame(new Chess());
    setGameOver(false);
    setWinner(null);
  }

  // Listen for Enter key press to restart the game
  useEffect(() => {
    function handleKeyPress(event) {
      if (event.key === 'Enter') {
        restartGame();
      }
    }
    window.addEventListener('keydown', handleKeyPress);
    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, []);

  const colorSchemes = {
    default: {
      light: '#d9c0a9',
      dark: '#8b4513'
    },
    protanopia: {
      light: '#f0e68c',
      dark: '#8b0000'
    },
    deuteranopia: {
      light: '#fafad2',
      dark: '#006400'
    },
    tritanopia: {
      light: '#add8e6',
      dark: '#00008b'
    }
  };

  return (
    <div className="app">
      <div>
        <h1>Aléxis Cordeiro</h1>
      </div>
      <div className="chessboard-container">
        <Chessboard
          position={game.fen()}
          onPieceDrop={onDrop}
          customLightSquareStyle={{ backgroundColor: colorSchemes[colorScheme].light }}
          customDarkSquareStyle={{ backgroundColor: colorSchemes[colorScheme].dark }}
        />
        {gameOver && (
          <div className="game-over">
            <p>Game Over</p>
            <p>Winner: {winner}</p>
            <p>Press Enter to restart</p>
          </div>
        )}
      </div>
      <br/>
      <br/>
      <div className="color-scheme-buttons">
        <button
          onClick={() => setColorScheme('default')}
          className={colorScheme === 'default' ? 'active' : ''}
        >
          Default
        </button>
        <button
          onClick={() => setColorScheme('protanopia')}
          className={colorScheme === 'protanopia' ? 'active' : ''}
        >
          Protanopia
        </button>
        <button
          onClick={() => setColorScheme('deuteranopia')}
          className={colorScheme === 'deuteranopia' ? 'active' : ''}
        >
          Deuteranopia
        </button>
        <button
          onClick={() => setColorScheme('tritanopia')}
          className={colorScheme === 'tritanopia' ? 'active' : ''}
        >
          Tritanopia
        </button>
      </div>
      <br/>
      <br/>
      <br/>
      <br/>
    </div>
  );
}

export default App;