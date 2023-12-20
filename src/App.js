import './App.css';
import React, { useState, useEffect } from 'react';
import { Chessboard } from "react-chessboard";
import { Chess } from "chess.js";
import Stockfish from "stockfish.wasm";


function App() {
  const [game, setGame] = useState(new Chess());

  useEffect(() => {
    const initSf = async () => {
      try {
        const sf = await Stockfish();
        sf.addMessageListener((line) => {
          console.log(line);
        });
        sf.postMessage("uci");
        sf.postMessage("ucinewgame");
        sf.postMessage(`position fen ${game.fen()}`);
        sf.postMessage(`go depth 10`);
        sf.onmessage = (e) => {
          console.log(e.data);
        };
      } catch (error) {
        console.log(error);
      }
    };

    initSf();
  })


  const handleMove = (sourceSquare, targetSquare) => {
    const move = game.move({
      from: sourceSquare,
      to: targetSquare,
      promotion: 'q'
    });

    if (move) {
      setGame(new Chess(game.fen()));
    }
  };
  return (
    <div className="App">
      <Chessboard
        position={game.fen()}
        onPieceMove={({ sourceSquare, targetSquare }) =>
          handleMove(sourceSquare, targetSquare)
        }
        boardWidth={650}
        showBoardNotation={true}
      />
    </div>
  );
}

export default App;
