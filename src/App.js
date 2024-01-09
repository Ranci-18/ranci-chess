import './App.css';
import React, { useState, useEffect, useRef } from 'react';
import { Chessboard } from "react-chessboard";
import { Chess } from "chess.js";
import Modal from 'react-modal';
import Homepage from './components/Homepage';
import Signup from './components/Signup';
import Login from './components/Login';

Modal.setAppElement('#root');

function App() {
  const [boardWidth, setBoardWidth] = useState(200);
  const [game, setGame] = useState(new Chess());
  const [isUserTurn, setIsUserTurn] = useState(true);
  const [isCheckmate, setIsCheckmate] = useState(false);
  const [isDraw, setIsDraw] = useState(false);
  const [isStalemate, setIsStalemate] = useState(false);
  const [boardOrientation, setBoardOrientation] = useState('white');
  const [loadPositionToPlay, setLoadPositionToPlay] = useState(false);
  const [stockfishDepth, setStockfishDepth] = useState(1);
  const [isUserInHomepage, setIsUserInHomepage] = useState(true);
  const [isNewUser, setIsNewUser] = useState(false);
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);
  
  let depthRef = useRef({ current: 0});
  let cpScoreRef = useRef({ current: 0});
  let stockfishDataObjRef = useRef({ depth: 0, cpScore: 0});

  useEffect(() => {
    const root = document.documentElement;
    const computedStyle = getComputedStyle(root);
    const width = parseInt(computedStyle.getPropertyValue('--board-width').trim(), 10);
    
    setBoardWidth(width);
  }, [])

  useEffect(() => {
    if (!isUserTurn && !game.isGameOver()) {
      var stockfish = new Worker('stockfish.js');
      const fen = game.fen();
      let bMove;

      stockfish.addEventListener('message', function (e) {
        const bestMove = e.data.match(/bestmove\s+(\S+)/)?.[1];
        bMove = bestMove;
      });

      stockfish.postMessage('uci');
      stockfish.postMessage(`position fen ${fen}`);
      stockfish.postMessage(`go depth ${stockfishDepth}`);

      const intevalId = setInterval(() => {
        makeBestMove(bMove);
      }, 3500);

      return () => {
        clearInterval(intevalId);
        stockfish.terminate();
      };
    }
  }, [isUserTurn, game, stockfishDepth]);



  function makeBestMove(moveString) {
    let move;
    function convertMoveStringToSquares(string) {
      const sourceSquare = string[0] + string[1];
      const targetSquare = string[2] + string[3];

      return [sourceSquare, targetSquare];
    }

    const [sourceSquare, targetSquare] = convertMoveStringToSquares(moveString);
    
    move = game.move({ from: sourceSquare, to: targetSquare, promotion: 'q' });

    
    
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
    try {
      let move = game.move({
        from: sourceSquare,
        to: targetSquare,
        promotion: 'q'
      });

      if (move) {
        setGame(new Chess(game.fen()));
        setIsUserTurn(false);
      }
    } catch (error) {
      alert('Invalid move!');
      game.undo();
      setGame(new Chess(game.fen()));
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
        const data = extractCPandDepthData(e.data);
        if (data) {
          stockfishDataObjRef.current = data;
        }
      });

      stockfish.postMessage('uci');
      stockfish.postMessage(`position fen ${fen}`);
      stockfish.postMessage('go depth 10');
    }

    return () => {
      stockfish.terminate();
    }
  }, [game])

  function handleSignup(status) {
    setIsNewUser(status);
  }

  function handleLogin(status) {
    setIsUserLoggedIn(status);
  }
  
  return (
    <div className="App">
      <nav className='navBar'>
        <h1><u>Ranci</u>-<em>Chess</em></h1>
        <button onClick={() => setIsUserLoggedIn(false)}>
          Logout
        </button>
        <button
          onClick={() => {
            setIsUserInHomepage(!isUserInHomepage);
          }}
        >
          {isUserLoggedIn ? isUserInHomepage ? 'Play a Game' : 'Go to Homepage' : null}
        </button>
        {
          isUserInHomepage ||
          (<button
            onClick={() => {
              setLoadPositionToPlay(!loadPositionToPlay);
            }}
          >
          {loadPositionToPlay ? 'Back to Play' : 'Load Position to Play'}
          </button>)
        }
      </nav>
      <hr />
      {
        isUserLoggedIn ?
        (isUserInHomepage ?
          <Homepage /> :
          (
            loadPositionToPlay ?
              <div className='loadPosition'>
                <div className='loadPositionInput'>
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
                  <div className='gameplayLevels'>
                    <button onClick={() => setStockfishDepth(1)}>Beginner</button>
                    <button onClick={() => setStockfishDepth(2)}>Intermediate</button>
                    <button onClick={() => setStockfishDepth(5)}>Intermediate-Advanced</button>
                  </div>
                </div>
                
                  <Chessboard
                    position={game.fen()}
                    boardWidth={boardWidth}
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

                <div className='inGameplay'>
                  <h2>Game Progress</h2>
                  <p><b>Depth of analysis: </b>{stockfishDataObjRef.current.depth}</p>
                  <p><b>CentiPawn Score: </b>{stockfishDataObjRef.current.cpScore}</p>
                </div>
              </div> :
              <>
                <div className='playGame'>
                  <div className='gameplayLevels'>
                    <button onClick={() => setStockfishDepth(1)}>Beginner</button>
                    <button onClick={() => setStockfishDepth(2)}>Intermediate</button>
                    <button onClick={() => setStockfishDepth(5)}>Intermediate-Advanced</button>
                  </div>
                  <Chessboard
                    position={game.fen()}
                    boardWidth={boardWidth}
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
                      className='newGameButton'
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
                      className='whiteBlackButton'
                    >
                      play as {boardOrientation === 'white' ? 'black' : 'white'}
                    </button>
                  </div>

                  <div className='inGameplay'>
                    <h2>Game Progress</h2>
                    <p><b>Depth of analysis: </b>{stockfishDataObjRef.current.depth}</p>
                    <p><b>CentiPawn Score: </b>{stockfishDataObjRef.current.cpScore}</p>
                  </div>
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
            </>
          )
        ) :
        (
          isNewUser ?
            <Signup onSignup={handleSignup} /> : <Login onLogin={handleLogin} />
        )
      }
    </div>
  );
}

export default App;
