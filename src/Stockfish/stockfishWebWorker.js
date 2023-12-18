import '../../public/stockfish.js';

let stockfish;

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

const initStockfish = () => {
    stockfish = new Worker('../../public/stockfish.js');
    stockfish.postMessage('uci');
    stockfish.postMessage('ucinewgame');
};

const analyzePos = (fen, depth) => {
    stockfish.postMessage(`position fen ${fen}`);
    stockfish.postMessage(`go depth ${depth}`);
    stockfish.onmessage = (event) => {
        console.log(event.data);
    }
};
