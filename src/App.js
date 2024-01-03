import './App.css';
import React, { useState, useEffect } from 'react';
import { Chessboard } from "react-chessboard";
import { Chess } from "chess.js";


function App() {
  const [game, setGame] = useState(new Chess());
  const [isUserTurn, setIsUserTurn] = useState(true);

  useEffect(() => {
    if (!isUserTurn && !game.isGameOver()) {
      const intevalId = setInterval(() => {
        makeRandomMove();
      }, 3500);

      return () => {
        clearInterval(intevalId);
      };
    }
  }, [isUserTurn, game]);



  function makeRandomMove() {
    if (game.isGameOver()) return;

    const possibleMoves = game.moves();
    if (possibleMoves.length === 0) {
      alert('Game over');
      return;
    }
    const randomIdx = Math.floor(Math.random() * possibleMoves.length);
    game.move(possibleMoves[randomIdx]);
    setGame(new Chess(game.fen()));
    setIsUserTurn(true);
  }

  function onDrop(sourceSquare, targetSquare) {
    let move = game.move({
      from: sourceSquare,
      to: targetSquare
    })

    if (move) {
      setGame(new Chess(game.fen()));
      setIsUserTurn(false);
    }
  }

  return (
    <div className="App">
      <Chessboard
        position={game.fen()}
        boardWidth={650}
        showBoardNotation={true}
        onPieceDrop={onDrop}
        
      />
    </div>
  );
}

export default App;
