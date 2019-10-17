import React from 'react';
import ReactDOM from 'react-dom';
//import './index.css';
import axios from 'axios';
require('dotenv').config()

class Configurator extends React.Component {

    constructor(props) {
        super(props);
        this.state =
            {
                startDate: new Date(),
                endDate: new Date(),
                status: "none yet",
            };
    }

    async getResult() {

        //send to server
        let json_req = {
            "latitude": 37.386051,
            "longitude": -122.083855,
            "start_date": "2019-03-01",
            "end_date": "2019-03-03"
        };
        const response = await axios.post(process.env.REACT_APP_BACKEND_API, json_req, {headers: {'Content-Type': 'application/json'}});

        this.setState({
            status: JSON.stringify(response.data)
        });
    }


    render()
    {
        return (
            <div>
                <h1>Test</h1>
                <div className="comp">
                    <button
                        onClick={() => this.getResult()}
                        className="button"
                    >
                        SUBMIT
                    </button>
                    <div>{"state: " + this.state.status}</div>
                </div>
            </div>
        );
    }
}

ReactDOM.render(
    <Configurator />,
    document.getElementById('root')
);

// function Square(props) {
//   return (
//     <button
//       className="square"
//       onClick={props.onClick}
//     >
//       {props.value}
//     </button>
//   );
// }
//
// class Board extends React.Component {
//   renderSquare(i) {
//     return (
//       <Square
//         value={this.props.squares[i]}
//         onClick={() => this.props.onClick(i)}
//       />
//     );
//   }
//
//   render() {
//     return (
//       <div>
//         <div className="board-row">
//           {this.renderSquare(0)}
//           {this.renderSquare(1)}
//           {this.renderSquare(2)}
//         </div>
//         <div className="board-row">
//           {this.renderSquare(3)}
//           {this.renderSquare(4)}
//           {this.renderSquare(5)}
//         </div>
//         <div className="board-row">
//           {this.renderSquare(6)}
//           {this.renderSquare(7)}
//           {this.renderSquare(8)}
//         </div>
//       </div>
//     );
//   }
// }
//
// class Game extends React.Component {
//   constructor(props) {
//     super(props);
//     this.state = {
//       history: [{
//         squares: Array(9).fill(null),
//       }],
//       col:0,
//       row:0,
//       stepNumber: 0,
//       xIsNext: true,
//     };
//   }
//
//   render() {
//     const history = this.state.history.slice();
//     const current = history[this.state.stepNumber];
//     const winnerArray = this.calculateWinner(current.squares);
//
//     let winner;
//     let winnerCords;
//     if (winnerArray !== null) {
//       winner = winnerArray[0];
//       winnerCords = winnerArray[1];
//     }
//     else {
//       winner = null;
//       winnerCords = null;
//     }
//
//     const col = this.state.col;
//     const row = this.state.row;
//     let coordinatesText;
//
//     if (col === 0 && row === 0) {
//       coordinatesText = 'column:  ' + ', row:  ';
//     }
//     else {
//       coordinatesText = 'column: ' + col + ', row: ' + row;
//     }
//
//     //const coordinates = this.state.coordinates.slice();
//     //const currentCoordinates = coordinates[this.state.stepNumber];
//
//     const moves = history.map((step, move) => {
//       const desc = move ?
//         'Go to move #' + move: //+ ' (col: ' + col + ', row: ' + row + ')':
//         'Go to game start';
//       return (
//         <li key={move}>
//           <button onClick={() => this.jumpTo(move)}>{desc}</button>
//         </li>
//       );
//     })
//
//     let status
//     if (winner) {
//       status = 'Winner: ' + winner;
//     }
//     else {
//       status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
//     }
//
//     return (
//       <div className="game">
//         <div className="game-board">
//           <Board
//             squares={current.squares}
//             onClick={(i) => this.handleClick(i)}
//           />
//         </div>
//         <div className="game-info">
//           <div>{status}</div>
//           <div>{coordinatesText}</div>
//           <ol>{moves}</ol>
//         </div>
//       </div>
//     );
//   }
//
//   handleClick(i) {
//     const history = this.state.history.slice(0, this.state.stepNumber + 1);
//     const current = history[history.length - 1];
//     const squares = current.squares.slice();
//     const row =  Math.floor(i/3) + 1;
//     const col = i % 3 + 1;
//
//     if (this.calculateWinner(squares) || squares[i]) {
//       return;
//     }
//     squares[i] = this.state.xIsNext ? 'X' : 'O';
//
//     this.setState({
//       history: history.concat([{
//         squares: squares,
//
//       }]),
//       col:col,
//       row:row,
//       stepNumber: history.length,
//       xIsNext: !this.state.xIsNext,
//     });
//   }
//
//   jumpTo(step) {
//     this.setState({
//       stepNumber: step,
//       xIsNext: (step % 2) === 0,
//     });
//   }
//
//   calculateWinner(squares) {
//     const lines = [
//       [0, 1, 2],
//       [3, 4, 5],
//       [6, 7, 8],
//       [0, 3, 6],
//       [1, 4, 7],
//       [2, 5, 8],
//       [0, 4, 8],
//       [2, 4, 6],
//     ];
//     for (let i = 0; i < lines.length; i++) {
//       const [a, b, c] = lines[i];
//       if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
//         return [squares[a], [a, b, c]];
//       }
//     }
//     return null;
//   }
// }
//
// // ========================================
//
// ReactDOM.render(
//   <Game />,
//   document.getElementById('root')
// );