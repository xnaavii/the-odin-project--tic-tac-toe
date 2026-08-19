function GameBoard() {
  const rows = 3;
  const columns = 3;
  const board = [];

  // Create a 2d array
  for (let i = 0; i < rows; i++) {
    board[i] = [];
    for (let j = 0; j < columns; j++) {
      board[i].push(Cell());
    }
  }

  const getBoard = () => board;

  const markCell = (row, column, player) => {
    const selectedCell = board[row][column];

    if (selectedCell.getValue() !== '') return;

    selectedCell.addMark(player);
  };

  const checkCells = (row, column, playerMark) => {
    const rows = board[row].every((c) => c.getValue() === playerMark);
    const columns = board.every((r) => r[column].getValue() === playerMark);
    const diagonal =
      row === column
        ? board.every((r, i) => r[i].getValue() === playerMark)
        : false;

    const antiDiagonal =
      row + column === board.length - 1
        ? board.every(
            (r, i) => r[board.length - 1 - i].getValue() === playerMark,
          )
        : false;

    return rows || columns || diagonal || antiDiagonal;
  };

  const printBoard = () => {
    const boardWithCellValues = board.map((row) =>
      row.map((cell) => cell.getValue()),
    );
    console.log(boardWithCellValues);
  };

  return { getBoard, printBoard, markCell, checkCells };
}

function Cell() {
  let value = '';

  const addMark = (player) => {
    value = player;
  };

  const getValue = () => value;

  return { addMark, getValue };
}

function GameController(
  playerOneName = 'Player One',
  playerTwoName = 'Player Two',
) {
  const board = GameBoard();

  const players = [
    { name: playerOneName, mark: 'X' },
    { name: playerTwoName, mark: 'O' },
  ];

  let activePlayer = players[0];

  const switchPlayerTurn = () => {
    activePlayer = activePlayer === players[0] ? players[1] : players[0];
  };
  const getActivePlayer = () => activePlayer;

  const printNewRound = () => {
    board.printBoard();
    console.log(`${getActivePlayer().name}'s turn.`);
  };

  const printGameOver = () => {
    board.printBoard();
    console.log(`Game over! ${getActivePlayer().name} wins!.`);
  };

  const playRound = (row, column) => {
    console.log(`Marking ${getActivePlayer().name}'s cell`);
    board.markCell(row, column, getActivePlayer().mark);

    if (board.checkCells(row, column, getActivePlayer().mark)) {
      printGameOver();
      return;
    }

    switchPlayerTurn();
    printNewRound();
  };

  return { playRound };
}

const game = GameController();

// // Row
// game.playRound(0, 0);
// game.playRound(1, 0);
// game.playRound(0, 1);
// game.playRound(1, 1);
// game.playRound(0, 2);
// game.playRound(1, 2);

game.playRound(2, 2);
game.playRound(1, 0);
game.playRound(1, 1);
game.playRound(2, 0);
game.playRound(0, 0);
