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

  const printBoard = () => {
    const boardWithCellValues = board.map((row) =>
      row.map((cell) => cell.getValue()),
    );
    console.log(boardWithCellValues);
  };

  return { getBoard, printBoard, markCell };
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

  const playRound = (row, column) => {
    const currentBoard = board.getBoard();
    const selectedCell = currentBoard[row][column];

    if (selectedCell.getValue() !== '') {
      if (selectedCell.getValue() !== activePlayer.mark) {
        console.log(
          'This cell is already marked by the opponent, please select another cell.',
        );
      } else {
        console.log('You already marked this cell.');
      }
      return;
    }

    console.log(`Marking ${getActivePlayer().name}'s cell`);
    board.markCell(row, column, getActivePlayer().mark);

    const rowWin = currentBoard[row].every(
      (cell) => cell.getValue() === activePlayer.mark,
    );

    const columnWin = currentBoard
      .map((row) => row[column])
      .every((cell) => cell.getValue() === activePlayer.mark);

    const diagonalWin = currentBoard
      .map((row, i) => row[i])
      .every((cell) => cell.getValue() === activePlayer.mark);

    const antiDiagonalWin = currentBoard
      .toReversed()
      .map((row, i) => row[i])
      .every((cell) => cell.getValue() === activePlayer.mark);

    if (rowWin || columnWin || diagonalWin || antiDiagonalWin) {
      console.log(`Player: ${activePlayer.name} wins!`);
      board.printBoard();
      return;
    }

    switchPlayerTurn();
    printNewRound();
  };

  return { playRound };
}

const game = GameController();
game.playRound(0, 0);
game.playRound(1, 0);
game.playRound(1, 1);
game.playRound(2, 0);
game.playRound(2, 2);
