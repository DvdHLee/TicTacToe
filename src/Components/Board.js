import { React, useState, useEffect } from "react";
import "./Board.css";

const Board = (props) => {
  //  Initialization  -------------------------------------------------------------------------------------------
  const [player1Turn, setPlayer1Turn] = useState(true);
  const [boardState, setBoardState] = useState([0, 0, 0, 0, 0, 0, 0, 0, 0]);
  const [endGame, setEndGame] = useState(false);
  const [moveNumber, setMoveNumber] = useState(0);
  const [player1, setPlayer1] = useState("player");
  const [player2, setPlayer2] = useState("player");
  var endGameJSX = [];

  //  Handle Bot Turn  ------------------------------------------------------------------------------------------
  useEffect(() => {
    if (player1Turn && !endGame) {
      var tempBoardState;
      var moved;
      var randommoveindex;
      var bestScore;
      var bestMove;

      //  Random Bot makes random moves
      if (player1 === "randombot") {
        tempBoardState = boardState;
        moved = false;
        randommoveindex = 0;
        while (!moved) {
          if (checkEndGame(tempBoardState) !== null) {
            break;
          }
          randommoveindex = Math.floor(Math.random() * 9);
          if (boardState[randommoveindex] === 0) {
            moved = true;
            tempBoardState[randommoveindex] = 1;
            setBoardState(tempBoardState);
            setPlayer1Turn(!player1Turn);
            setMoveNumber(moveNumber + 1);
          }
        }
      }

      //Minimax Bot plays perfect moves using minimax search algo
      else if (player1 === "minimaxbot") {
        bestScore = -Infinity;

        for (let i = 0; i < 9; i++) {
          tempBoardState = boardState;
          if (tempBoardState[i] === 0) {
            tempBoardState[i] = 1;
            let score = minimax(tempBoardState, 0, false);
            tempBoardState[i] = 0;
            if (score > bestScore) {
              bestScore = score;
              bestMove = i; 
            }
          } 
        }

        let board = boardState;
        board[bestMove] = 1;
        setBoardState(board);
        setPlayer1Turn(!player1Turn);
        setMoveNumber(moveNumber + 1);
      }
    } 
    
    else if (!player1Turn && !endGame) {
      //  Random Bot makes random moves
      if (player2 === "randombot") {
        tempBoardState = boardState;
        moved = false;
        randommoveindex = 0;
        while (!moved) {
          if (checkEndGame(tempBoardState) !== null) {
            break;
          }
          randommoveindex = Math.floor(Math.random() * 9);
          if (boardState[randommoveindex] === 0) {
            moved = true;
            tempBoardState[randommoveindex] = -1;
            setBoardState(tempBoardState);
            setPlayer1Turn(!player1Turn);
            setMoveNumber(moveNumber + 1);
          }
        }
      }

      //Minimax Bot plays perfect moves using minimax search algo
      else if (player2 === "minimaxbot") {
        bestScore = Infinity;
        for (let i = 0; i < 9; i++) {
          tempBoardState = boardState;
          if (tempBoardState[i] === 0) {
            tempBoardState[i] = -1;
            let score = minimax(tempBoardState, 0, true);
            tempBoardState[i] = 0;
            if (score < bestScore) {
              bestScore = score;
              bestMove = i;
            }
          }
        }

        let board = boardState;
        board[bestMove] = -1;
        setBoardState(board);
        setPlayer1Turn(!player1Turn);
        setMoveNumber(moveNumber + 1);
      }
    }

    //  Check for game end
    if (checkEndGame(boardState) !== null && !endGame) {
      setEndGame(true);
    }

    // eslint-disable-next-line
  }, [player1Turn, player1, player2, endGame, moveNumber, boardState]);

  //  Handle Player turn  ----------------------------------------------------------------------------------------------
  function clickedBox(i) {
    var tempBoardState = boardState;
    if (boardState[i] === 0 && !endGame) {
      if (player1Turn) {
        tempBoardState[i] = 1;
        setBoardState(tempBoardState);
        setPlayer1Turn(!player1Turn);
        setMoveNumber(moveNumber + 1);
      } else {
        tempBoardState[i] = -1;
        setBoardState(tempBoardState);
        setPlayer1Turn(!player1Turn);
        setMoveNumber(moveNumber + 1);
      }
    }

    //  Check for game end
    if (checkEndGame(boardState) !== null && !endGame) {
      setEndGame(true);
    }
  }

  //  Minimax Search Algorithm  -----------------------------------------------------------------------------------------
  function minimax(board, depth, maximizing) {
    if (checkEndGame(board) !== null) {
      return checkEndGame(board);
    }

    let bestScore; 

    if (maximizing) {
      bestScore = -Infinity;
      for (let i = 0; i < 9; i++) {
        if (board[i] === 0) {
          board[i] = 1;
          let score = minimax(board, depth + 1, false);
          board[i] = 0;
          bestScore = Math.max(score, bestScore);
        }
      }

      return bestScore;
    } else {
      bestScore = Infinity;
      for (let i = 0; i < 9; i++) {
        if (board[i] === 0) {
          board[i] = -1;
          let score = minimax(board, depth + 1, true);
          board[i] = 0;
          bestScore = Math.min(score, bestScore);
        }
      }

      return bestScore;
    }
  }

  //  Display -----------------------------------------------------------------------------------------------------------
  //  Builds board with JSX
  const boardjsx = [];
  for (let i = 0; i < 9; i++) {
    if (boardState[i] === 0) {
      boardjsx.push(<div className="square"></div>);
    } else if (boardState[i] > 0) {
      boardjsx.push(<img className="xo" src="./assets/x.png" alt="x"></img>);
    } else {
      boardjsx.push(<img className="xo" src="./assets/o.png" alt="x"></img>);
    }
  }

  //  Turn Indicator
  var xindicator = "turnindicatorx";
  var oindicator = "turnindicatoroff";

  if (!player1Turn) {
    xindicator = "turnindicatoroff";
    oindicator = "turnindicatoro";
  }

  //  Check if game over and display winner
  if (checkEndGame(boardState) === 1) {
    endGameJSX = [<p>X wins!</p>];
  } else if (checkEndGame(boardState) === -1) {
    endGameJSX = [<p>O wins!</p>];
  } else if (checkEndGame(boardState) === 0) {
    endGameJSX = [<p>Draw!</p>];
  }

  //  User Actions  --------------------------------------------------------------------------------------------------
  //  Start a new game
  const newGame = () => {
    setBoardState([0, 0, 0, 0, 0, 0, 0, 0, 0]);
    setEndGame(false);
    setPlayer1Turn(true);
    setMoveNumber(0);
  };

  //  Handle Player Change
  const changedPlayer1 = (e) => {
    setPlayer1(e.target.value);
  };

  const changedPlayer2 = (e) => {
    setPlayer2(e.target.value);
  };

  //  Functions ---------------------------------------------------------------------------------------------
  // Check for Game End
  function checkEndGame(boardstate) {
    var winner;
    if (Math.abs(boardstate[0] + boardstate[1] + boardstate[2]) === 3) {
      winner = boardstate[0];
    } else if (Math.abs(boardstate[3] + boardstate[4] + boardstate[5]) === 3) {
      winner = boardstate[3];
    } else if (Math.abs(boardstate[6] + boardstate[7] + boardstate[8]) === 3) {
      winner = boardstate[6];
    } else if (Math.abs(boardstate[0] + boardstate[3] + boardstate[6]) === 3) {
      winner = boardstate[0];
    } else if (Math.abs(boardstate[1] + boardstate[4] + boardstate[7]) === 3) {
      winner = boardstate[1];
    } else if (Math.abs(boardstate[2] + boardstate[5] + boardstate[8]) === 3) {
      winner = boardstate[2];
    } else if (Math.abs(boardstate[0] + boardstate[4] + boardstate[8]) === 3) {
      winner = boardstate[0];
    } else if (Math.abs(boardstate[2] + boardstate[4] + boardstate[6]) === 3) {
      winner = boardstate[2];
    } else {
      winner = 0;
      for (let i = 0; i < 9; i++) {
        if (boardstate[i] === 0) {
          winner = null;
          break;
        }
      }
    }

    return winner;
  }

  return (
    <div>
      <div className="whosTurn">
        <div className={xindicator}>
          <select className="playerindicator" onChange={changedPlayer1} key="xind">
            <option className="playeroption" value="player">
              Player
            </option>
            <option className="playeroption" value="randombot">
              Random Bot
            </option>
            <option className="playeroption" value="minimaxbot">
              Minimax Bot
            </option>
          </select>
        </div>
        <div className={oindicator}>
          <select className="playerindicator" onChange={changedPlayer2} key="oind">
            <option className="playeroption" value="player">
              Player
            </option>
            <option className="playeroption" value="randombot">
              Random Bot
            </option>
            <option className="playeroption" value="minimaxbot">
              Minimax Bot
            </option>
          </select>
        </div>
      </div>
      <div className="board">
        <div className="box box1" onClick={clickedBox.bind(this, 0)}>
          {boardjsx[0]}
        </div>
        <div className="box box2" onClick={clickedBox.bind(this, 1)}>
          {boardjsx[1]}
        </div>
        <div className="box box3" onClick={clickedBox.bind(this, 2)}>
          {boardjsx[2]}
        </div>
        <div className="box box4" onClick={clickedBox.bind(this, 3)}>
          {boardjsx[3]}
        </div>
        <div className="box box5" onClick={clickedBox.bind(this, 4)}>
          {boardjsx[4]}
        </div>
        <div className="box box6" onClick={clickedBox.bind(this, 5)}>
          {boardjsx[5]}
        </div>
        <div className="box box7" onClick={clickedBox.bind(this, 6)}>
          {boardjsx[6]}
        </div>
        <div className="box box8" onClick={clickedBox.bind(this, 7)}>
          {boardjsx[7]}
        </div>
        <div className="box box9" onClick={clickedBox.bind(this, 8)}>
          {boardjsx[8]}
        </div>
      </div>
      {endGameJSX}
      <button className="newGame" onClick={newGame}>
        New Game
      </button>
    </div>
  );
};

export default Board;
