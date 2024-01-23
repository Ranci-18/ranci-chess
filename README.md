# Ranci Chess App Documentation (BETA)
Welcome to the documentation for the Ranci Chess App, a web application developed using React. This application allows users to play chess online, authenticate using Firebase, and utilizes various libraries such as chess.js, React Chessboard, and Stockfish.js to provide a seamless gaming experience.

## Table of Contents
* Features
* Technologies Used
* Setup and Installation
* Usage
* Firebase Configuration
* Chess Logic
* Contributing
* License

### Features
* User authentication using Firebase.
* Real-time chess gameplay.
* Move validation using chess.js.
* Interactive chessboard UI using React Chessboard.
* AI opponent moves and logic powered by Stockfish.js.
* Technologies Used
* React: Front-end library for building user interfaces.
* Firebase: For authentication and real-time database.
* chess.js: For chess move validation and logic.
* React Chessboard: To display the chessboard UI.
* Stockfish.js: For generating AI opponent moves.
* Setup and Installation

### To run this application locally, follow these steps:
Pull the docker image of the app:
* make sure you have docker installed on your machine.
run the following commands:
* pull the image
```
docker pull ranci18/ranci-projects:latest
```

* then run the app
```
docker run -p 8080:3000 -d ranci18/ranci-projects:latest
```
* you can then access it via a loppback link or a network link given

or

Clone the repository:

```
git clone https://github.com/Ranci-18/ranci-chess.git
```
Navigate to the project directory:

```
cd ranci-chess
```

Install dependencies:
```
npm install
```

start the server
```
npm run start
```

### Usage
Register/Login.
Start a new chess game or join an existing one.
Make your moves on the interactive chessboard.
The AI opponent powered by Stockfish.js will generate its moves.

### Chess Logic
The chess logic and move validation are handled by the chess.js library. The interactive chessboard UI is rendered using the React Chessboard library. The AI opponent's moves are generated using the Stockfish.js engine, which computes the best move based on the current board position.

### Contributing
If you wish to contribute to this project, please fork the repository and submit a pull request. Ensure your code follows the coding standards and includes relevant tests.

### Author
For any further questions or clarifications, please contact the author:
* Francis Wanyoike Ng'ang'a
* wanyoike39@gmail.com
* +254 715 353 197







