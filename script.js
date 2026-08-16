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
    const selectedCell = board.getBoard()[row][column];
    if (selectedCell.getValue() !== '') {
      console.log(
        `This cell is already marked by the opponent, please select another cell.`,
      );
      return;
    }
    console.log(`Marking ${getActivePlayer().name}'s cell`);
    board.markCell(row, column, getActivePlayer().mark);

    switchPlayerTurn();
    printNewRound();
  };

  return { playRound };
}

const game = GameController();
game.playRound(0, 0);
game.playRound(0, 0);
game.playRound(0, 1);
game.playRound(0, 1);
