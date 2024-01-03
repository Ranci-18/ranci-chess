import Stockfish from "stockfish.wasm";

let sf;

onmessage = (event) => {
    const { type, fen, depth } = event.data;

    switch (type) {
        case 'init':
            initStockfish();
            break;
        case 'analyze':
            analyzePos(fen, depth);
            break;
        default:
            break;
    }
};

const initStockfish = async () => {
    try {
        sf = await Stockfish();
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

const analyzePos = async (fen, depth) => {
    const sf = await Stockfish();
    sf.postMessage(`position fen ${fen}`);
    sf.postMessage(`go depth ${depth}`);
    sf.onmessage = (event) => {
        console.log(event.data);
    }
};
