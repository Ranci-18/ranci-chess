import './App.css';
import React, { useState, useEffect, useRef } from 'react';
import { Chessboard } from "react-chessboard";
import { Chess } from "chess.js";
import Modal from 'react-modal';

Modal.setAppElement('#root');

function App() {
  const [game, setGame] = useState(new Chess());
  const [isUserTurn, setIsUserTurn] = useState(true);
  const [isCheckmate, setIsCheckmate] = useState(false);
  const [isDraw, setIsDraw] = useState(false);
  const [isStalemate, setIsStalemate] = useState(false);
  const [boardOrientation, setBoardOrientation] = useState('white');
  const [loadPositionToPlay, setLoadPositionToPlay] = useState(false);
  
  let depthRef = useRef({ current: 0});
  let cpScoreRef = useRef({ current: 0});
  let stockfishDataObjRef = useRef({ depth: 0, cpScore: 0});

  useEffect(() => {
    if (!isUserTurn && !game.isGameOver()) {
      var stockfish = new Worker('stockfish.js');
      const fen = game.fen();
      let bMove;

      stockfish.addEventListener('message', function (e) {
        const bestMove = e.data.match(/bestmove\s+(\S+)/)?.[1];
        console.log('bestMove', bestMove);
        bMove = bestMove;
      });

      stockfish.postMessage('uci');
      stockfish.postMessage(`position fen ${fen}`);
      stockfish.postMessage('go depth 10');

      const intevalId = setInterval(() => {
        makeBestMove(bMove);
      }, 3500);

      return () => {
        clearInterval(intevalId);
      };
    }
  }, [isUserTurn, game]);



  function makeBestMove(moveString) {
    function convertMoveStringToSquares(string) {
      const fileMap = {
        'a': 'a',
        'b': 'b',
        'c': 'c',
        'd': 'd',
        'e': 'e',
        'f': 'f',
        'g': 'g',
        'h': 'h'
      };
      
      const rankMap = {
        '8': '8',
        '7': '7',
        '6': '6',
        '5': '5',
        '4': '4',
        '3': '3',
        '2': '2',
        '1': '1'
      };

      const sourceSquare = `${fileMap[string[0]]}${rankMap[string[1]]}`;
      const targetSquare = `${fileMap[string[2]]}${rankMap[string[3]]}`;

      return [sourceSquare, targetSquare];
    }

    const [sourceSquare, targetSquare] = convertMoveStringToSquares(moveString);
      
    const move = game.move({
      from: sourceSquare,
      to: targetSquare,
      promotion: "q"
    });
    
    if (move) {
      setGame(new Chess(game.fen()));
      setIsUserTurn(true);
    }
    
    if (game.isGameOver()) {
      if (game.isStalemate()) {
        setIsStalemate(true);
      } else if (game.isCheckmate()) {
        setIsCheckmate(true);
      } else if (game.isDraw()) {
        setIsDraw(true);
      }
          
      return;
    }

  }

  function onDrop(sourceSquare, targetSquare) {
    let move = game.move({
      from: sourceSquare,
      to: targetSquare,
      promotion: "q"
    })

    if (move) {
      setGame(new Chess(game.fen()));
      setIsUserTurn(false);
    }
    if (game.isGameOver()) {
      if (game.isStalemate()) {
        setIsStalemate(true);
      } else if (game.isCheckmate()) {
        setIsCheckmate(true);
      } else if (game.isDraw()) {
        setIsDraw(true);
      }
      
      return;
      }
  }

  useEffect(() => {
    if (!game.isGameOver()) {
      const fen = game.fen();
      
      function extractCPandDepthData(data) {
        const match = data.match(/info depth (\d+) .* score cp (-?\d+)/);

        if (match && match.length === 3) {
          depthRef.current = { current: parseInt(match[1], 10) };
          cpScoreRef.current = { current: parseInt(match[2], 10) };

          return {
            depth: depthRef.current.current,
            cpScore: cpScoreRef.current.current
          };
        }

        return null;
      }
 

      var stockfish = new Worker('stockfish.js');

      stockfish.addEventListener('message', function (e) {
        const bestMove = e.data.match(/bestmove\s+(\S+)/)?.[1];
        console.log('bestMove', bestMove);
        const data = extractCPandDepthData(e.data);
        if (data) {
          stockfishDataObjRef.current = data;
        }
      });

      stockfish.postMessage('uci');
      stockfish.postMessage(`position fen ${fen}`);
      stockfish.postMessage('go depth 10');
    }
  }, [game])

  
  return (
    <div className="App">
      <nav className='navBar'>
        <h1><b>Ranci</b>-<em>Chess</em></h1>
        <button
          onClick={() => {
            setLoadPositionToPlay(!loadPositionToPlay);
          }}
        >
          {loadPositionToPlay ? 'Back to Play' : 'Load Position to Play'}
        </button>
      </nav>
      <hr />
      {
        loadPositionToPlay ?
          <div className='loadPosition'>
            <p>Enter FEN string of the position you want to play</p>
            <input
              type='text'
              placeholder='Enter FEN string'
              onChange={(e) => {
                const fen = e.target.value || 'r1bq1rk1/pp1n1ppp/2p1pn2/3p4/2PP4/1P2PN2/P4PPP/RNBQ1RK1 w - - 4 11';
                const newGameInstance = new Chess(fen);
                setGame(newGameInstance);
                setIsUserTurn(true);
                setIsCheckmate(false);
                setIsDraw(false);
                setIsStalemate(false);
              }}
            />
              <Chessboard
                position={game.fen()}
                boardWidth={350}
                showBoardNotation={true}
                onPieceDrop={onDrop}
                arePiecesDraggable={isUserTurn}
                areArrowsAllowed={true}
                arePremovesAllowed={true}
                boardOrientation={boardOrientation}
              />

              <button
              onClick={() => {
                if (boardOrientation === 'white') {
                  setBoardOrientation('black');
                  setIsUserTurn(false);
                } else {
                  setBoardOrientation('white');
                  setIsUserTurn(true);
                }
              }}
            >
              play as {boardOrientation === 'white' ? 'black' : 'white'}
            </button>
          </div> :
          <div className='playGame'>
          <Chessboard
            position={game.fen()}
            boardWidth={350}
            showBoardNotation={true}
            onPieceDrop={onDrop}
            arePiecesDraggable={isUserTurn}
            areArrowsAllowed={true}
            arePremovesAllowed={true}
            boardOrientation={boardOrientation}
          />
  
          <div className='buttons'>
            <button
              onClick={() => {
                const newGameInstance = new Chess();
                setGame(newGameInstance);
                setIsUserTurn(true);
                setIsCheckmate(false);
                setIsDraw(false);
                setIsStalemate(false);
              }}
            >
              New Game
            </button>
  
            <button
              onClick={() => {
                if (boardOrientation === 'white') {
                  setBoardOrientation('black');
                  setIsUserTurn(false);
                } else {
                  setBoardOrientation('white');
                  setIsUserTurn(true);
                }
              }}
            >
              play as {boardOrientation === 'white' ? 'black' : 'white'}
            </button>
          </div>
        </div>
      }
      

      <div className='inGameplay'>
       <h2>Game Progress</h2>
        <p><b>Depth of analysis: </b>{stockfishDataObjRef.current.depth}</p>
        <p><b>CentiPawn Score: </b>{stockfishDataObjRef.current.cpScore}</p>
      </div>

      <Modal
        isOpen={isCheckmate}
        onRequestClose={() => setIsCheckmate(false)}
        style={{
          overlay: {
            backgroundColor: 'rgba(0, 0, 0, 0.75)',
            height: '50%',
          },
          content: {
            color: 'black'
          }
        }}
      >
        <h2>Checkmate!</h2>
        <p>Game Over!</p>
        <button
        onClick={() => {
          const newGameInstance = new Chess();
          setGame(newGameInstance);
          setIsUserTurn(true);
        }}
      >
        New Game
      </button>
      </Modal>

      <Modal
        isOpen={isDraw}
        onRequestClose={() => setIsDraw(false)}
        style={{
          overlay: {
            backgroundColor: 'rgba(0, 0, 0, 0.75)',
            height: '50%',
          },
          content: {
            color: 'black'
          }
        }}
      >
        <h2>Draw!</h2>
        <p>Game Over!</p>
        <button
        onClick={() => {
          const newGameInstance = new Chess();
          setGame(newGameInstance);
          setIsUserTurn(true);
        }}
      >
        New Game
      </button>
      </Modal>

      <Modal
        isOpen={isStalemate}
        onRequestClose={() => setIsStalemate(false)}
        style={{
          overlay: {
            backgroundColor: 'rgba(0, 0, 0, 0.75)',
            height: '50%',
          },
          content: {
            color: 'black'
          }
        }}
      >
        <h2>Stalemate!</h2>
        <p>Game Over!</p>
        <button
        onClick={() => {
          const newGameInstance = new Chess();
          setGame(newGameInstance);
          setIsUserTurn(true);
        }}
      >
        New Game
      </button>
      </Modal>
    </div>
  );
}

export default App;
