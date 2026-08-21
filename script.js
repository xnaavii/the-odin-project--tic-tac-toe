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
    const cell = board[row][column];

    if (cell.getValue() !== '') return;

    cell.addMark(player);
  };

  const isWin = (row, column, playerMark) => {
    const isRowWin = board[row].every((c) => c.getValue() === playerMark);
    const isColumnWin = board.every((r) => r[column].getValue() === playerMark);
    const isDiagonalWin =
      row === column
        ? board.every((r, i) => r[i].getValue() === playerMark)
        : false;

    const isAntiDiagonalWin =
      row + column === board.length - 1
        ? board.every(
            (r, i) => r[board.length - 1 - i].getValue() === playerMark,
          )
        : false;

    return isRowWin || isColumnWin || isDiagonalWin || isAntiDiagonalWin;
  };

  const isDraw = () =>
    board.every((row) => row.every((cell) => cell.getValue() !== ''));

  const isCellMarked = (row, column) => board[row][column].getValue() !== '';

  const printBoard = () => {
    const boardWithCellValues = board.map((row) =>
      row.map((cell) => cell.getValue()),
    );
    console.log(boardWithCellValues);
  };

  return {
    getBoard,
    printBoard,
    markCell,
    isWin,
    isDraw,
    isCellMarked,
  };
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
  let gameOver = false;

  const switchPlayerTurn = () => {
    activePlayer = activePlayer === players[0] ? players[1] : players[0];
  };

  const toggleGameOver = () => (gameOver = !gameOver);

  const getGameOver = () => gameOver;
  const getActivePlayer = () => activePlayer;

  const printNewRound = () => {
    board.printBoard();
    console.log(`${getActivePlayer().name}'s turn.`);
  };

  const printGameOver = () => {
    board.printBoard();
    console.log(`Game over! ${getActivePlayer().name} wins!.`);
  };

  const printDraw = () => {
    console.log("No one wins, it's a draw!");
  };

  const printAlreadyMarked = () => {
    console.log('This cell is already marked. Please select another cell.');
  };

  const playRound = (row, column) => {
    if (getGameOver()) {
      printGameOver();
      return;
    }

    if (board.isCellMarked(row, column)) {
      printAlreadyMarked();
      return;
    }

    const currentPlayer = getActivePlayer();
    console.log(`Marking ${currentPlayer.name}'s cell`);
    board.markCell(row, column, currentPlayer.mark);

    const isWin = board.isWin(row, column, currentPlayer.mark);
    const isDraw = board.isDraw();

    if (isWin) {
      toggleGameOver();
      printGameOver();
      return;
    }

    if (isDraw) {
      toggleGameOver();
      printDraw();
      return;
    }

    switchPlayerTurn();
    printNewRound();
  };

  return { playRound, board };
}

(function DisplayController() {
  const game = GameController();
  const board = game.board.getBoard();
  game.playRound(0, 0);
  game.playRound(1, 0);
  game.playRound(0, 1);
  game.playRound(1, 1);

  const renderBoard = () => {
    const container = document.querySelector('#board');
    container.innerHTML = board
      .map((row) =>
        row
          .map((cell) => `<div class="cell">${cell.getValue()}</div>`)
          .join(''),
      )
      .join('');
  };

  renderBoard();

  // TODO: Render active player
  // TODO: Render messages, such as game over or cell is marked
})();

// const game = GameController();

// // Row
// game.playRound(0, 0);
// game.playRound(1, 0);
// game.playRound(0, 1);
// game.playRound(1, 1);
// game.playRound(0, 2);
// game.playRound(0, 2);

// Diagonal P1
// game.playRound(2, 2);
// game.playRound(1, 0);
// game.playRound(1, 1);
// game.playRound(2, 0);
// game.playRound(0, 0);

// // Check for draw
// game.playRound(0, 0);
// game.playRound(0, 1);
// game.playRound(0, 2);
// game.playRound(1, 1);
// game.playRound(1, 0);
// game.playRound(1, 2);
// game.playRound(0, 2);
// game.playRound(2, 0);
// game.playRound(2, 1);
// game.playRound(2, 2);
