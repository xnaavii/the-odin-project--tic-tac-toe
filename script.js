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
  const printBoard = () => console.log(board);

  return { getBoard, printBoard };
}

function Cell() {
  let value = '';

  const markSpace = (player) => {
    value = player;
  };

  const getValue = () => value;

  return { markSpace, getValue };
}

const board = GameBoard();
board.printBoard();
