import React from "react";
import ReactDOM from "react-dom";
import "./index.css";

//This is an element creating table cell
function Square(props) {
  return (
    <button className="square" onClick={props.onClick}>
      {props.value}
    </button>
  );
}

// This is an element creating board.
//All values and handlers we will keep in the parent`s state to have one source for the game
//and for the additional options.
class Board extends React.Component {

  createSquares(rows, columns) {
    let rowsArr = [];
    for (let x = 0; x < rows; x++) {
      let squaresArr = [];
      for (let y = 0; y < columns; y++) {
        squaresArr.push(
          <Square
            key={`cell#${columns * x + y}`}
            value={this.props.squares[columns * x + y]}
            onClick={() => this.props.onClick(columns * x + y)}
          />
        );
      }
      rowsArr.push(<div key={`row#${x}`} className="board-row">{squaresArr}</div>);
    }
    return rowsArr;
  }

  render() {
    return this.createSquares(3, 3);
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [
        {
          squares: Array(9).fill(null) //this is the future values for the cells
        }
      ],
      stepNumber: 0, //this is for the step buttons and also history array get new records
      //according to the number of step
      xIsNext: true, //when true player 'X' moves when false 'O' player
      stepButtons: [
        {
          squareID: null,
          focus: ""
        }
      ]
    };
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[this.state.stepNumber];
    const squares = current.squares.slice();
    const stepButtons = this.state.stepButtons.slice(0, this.state.stepNumber + 1);

    //If a player clicks on a cell in which there is already a value - highlights the button containing that move
    if (squares[i]) {
      focusStepButton(stepButtons, i);
      this.setState({ stepButtons: stepButtons });
      return;
    } else {
      resetStepButtons(stepButtons);
      this.setState({ stepButtons: stepButtons });
    }

    //Blocks clickhandler if game has already ended
    if (calculateWinner(squares)) {
      return;
    }
    //Push new {squares: array} containing 'x' or 'o' in the certain cell to history array
    squares[i] = this.state.xIsNext ? "X" : "O";
    this.setState({
      history: history.concat([
        {
          squares: squares
        }
      ]),
      //Incerease step number and change player's turn
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
      stepButtons: stepButtons.concat([
        {
          squareID: i,
          focus: ""
        }
      ])
    });
  }

  //This is for buttons that change the moment of the game
  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: step % 2 === 0
    });
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);
    const stepButtons = this.state.stepButtons;

    const moves = history.map((step, move) => {
      const desc = move ? "Перейти к ходу #" + move : "К началу игры";
      return (
        <li key={move}>
          <button
            onClick={() => this.jumpTo(move)}
            className={stepButtons[move].focus}
          >
            {desc}
          </button>
        </li>
      );
    });

    let status;
    if (winner) {
      status = "Выиграл " + winner;
    } else {
      status = "Следующий ход: " + (this.state.xIsNext ? "X" : "O");
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board squares={current.squares} onClick={i => this.handleClick(i)} />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}

// This function checks if there are three values of "x" or "o" in a row or column.
// It takes last history array as an attribute and searches equal 'x' or 'o' values in certain cells.
// And if find - return it value.
const calculateWinner = squares => {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
};

const focusStepButton = (stepButtons, i) => {
  for (let x = stepButtons.length - 1; x >= 0; x--) {
    if (stepButtons[x].squareID === i) {
      stepButtons[x] = {
        squareID: i,
        focus: "focus"
      };
    } else {
      stepButtons[x] = {
        squareID: stepButtons[x].squareID,
        focus: ""
      };
    }
  }
};

const resetStepButtons = stepButtons => {
  for (let x = stepButtons.length - 1; x >= 0; x--) {
    stepButtons[x] = {
      squareID: stepButtons[x].squareID,
      focus: ""
    };
  }
};

// ========================================

ReactDOM.render(<Game />, document.getElementById("root"));
