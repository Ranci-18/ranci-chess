import './App.css';
import React, { useState, useEffect } from 'react';
import { Chessboard } from "react-chessboard";
import { Chess } from "chess.js";


function App() {
  const [game, setGame] = useState(new Chess());
  const [sfworker, setSfworker] = useState(null);

  // using the web worker to initialize stockfish
  useEffect(() => {
    const worker = new Worker('./Stockfish/stockfishWebWorker');

    worker.postMessage({ type: 'init' });

    setSfworker(worker);

    return () => {
      worker.terminate();
    };
  },[]);

  // using the web worker to analyze the position
  useEffect(() => {
    const depth = 8;
    if (sfworker) {
      sfworker.postMessage({ type: 'analyze', fen: game.fen(), depth });

      sfworker.onmessage = (event) => {
        const { type, data } = event.data;

        switch (type) {
          case 'info':
            console.log(data);
            break;
          case 'bestmove':
            console.log('Best Move:', data);
            break;
          default:
            break;
        }
      };
    }
    return () => {
      sfworker.terminate();
    };
  }, [game, sfworker])


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
        boardWidth={700}
        showBoardNotation={true}
      />
    </div>
  );
}

export default App;
