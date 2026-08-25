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

  const getBoard = () => board.map((row) => row.map((cell) => cell.getValue()));
  const clearBoard = () =>
    board.forEach((row) => row.forEach((cell) => cell.resetValue()));

  const markCell = (row, column, player) => {
    const cell = board[row][column];

    if (cell.getValue() !== '') return;

    cell.addMark(player);
  };

  const isWin = (row, column, playerMark) => {
    const isRowWin = board[row].every((c) => c.getValue() === playerMark);
    const isColumnWin = board.every((r) => r[column].getValue() === playerMark);
    const isDiagonalWin =
      row === column && board.every((r, i) => r[i].getValue() === playerMark);

    const isAntiDiagonalWin =
      row + column === board.length - 1 &&
      board.every((r, i) => r[board.length - 1 - i].getValue() === playerMark);

    return isRowWin || isColumnWin || isDiagonalWin || isAntiDiagonalWin;
  };

  const isBoardFull = () =>
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
    clearBoard,
    printBoard,
    markCell,
    isWin,
    isBoardFull,
    isCellMarked,
  };
}

function Cell() {
  let value = '';

  const addMark = (player) => {
    value = player;
  };

  const getValue = () => value;
  const resetValue = () => (value = '');

  return { addMark, getValue, resetValue };
}

function ScoreBoard() {
  const scoreBoard = [];

  const getScoreBoard = () => scoreBoard;

  const addPlayer = (playerId) => {
    const playerExists = scoreBoard.some((player) => player.id === playerId);
    if (playerExists) return;

    scoreBoard.push({ id: playerId, score: Score() });
  };

  const getPlayerScore = (playerId) => {
    const player = scoreBoard.find((player) => player.id === playerId);
    if (player) {
      return player.score.getScore();
    }
  };

  const addScoreToPlayer = (playerId, points = 1) => {
    const player = scoreBoard.find((player) => player.id === playerId);
    if (player) {
      player.score.addScore(points);
    }
  };

  const resetScore = () =>
    scoreBoard.forEach((player) => player.score.resetScore());

  return {
    getScoreBoard,
    addPlayer,
    getPlayerScore,
    addScoreToPlayer,
    resetScore,
  };
}

function Score() {
  let score = 0;

  const addScore = (points = 1) => {
    score += points;
  };

  const resetScore = () => {
    score = 0;
  };

  const getScore = () => score;

  return {
    addScore,
    resetScore,
    getScore,
  };
}

function GameController(
  playerOneName = 'Player One',
  playerTwoName = 'Player Two',
) {
  const players = [
    { id: 1, name: playerOneName, mark: 'X' },
    { id: 2, name: playerTwoName, mark: 'O' },
  ];

  const board = GameBoard();
  const scoreBoard = ScoreBoard();

  players.forEach((player) => {
    scoreBoard.addPlayer(player.id);
  });

  let activePlayer = players[0];
  let gameOver = false;
  let isDraw = false;

  const toggleGameOver = () => (gameOver = true);
  const switchPlayerTurn = () => {
    activePlayer = activePlayer === players[0] ? players[1] : players[0];
  };
  const changePlayerName = (playerId, name) => {
    const playerIndex = players.indexOf(
      players.find((player) => player.id === playerId),
    );
    players[playerIndex].name = name;
  };

  const getGameOver = () => gameOver;
  const getIsDraw = () => isDraw;
  const getActivePlayer = () => activePlayer;
  const getGameBoard = () => board.getBoard();
  const getScoreBoard = () => scoreBoard.getScoreBoard();
  const getPlayerScore = (playerId) => scoreBoard.getPlayerScore(playerId);
  const getPlayers = () => players;
  const isCellMarked = (row, col) => board.isCellMarked(row, col);

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
    const isFull = board.isBoardFull();

    if (isWin) {
      toggleGameOver();
      printGameOver();
      scoreBoard.addScoreToPlayer(currentPlayer.id);
      return;
    }

    if (isFull) {
      isDraw = true;
      toggleGameOver();
      printDraw();
      return;
    }

    switchPlayerTurn();
    printNewRound();
  };

  const resetGame = () => {
    activePlayer = players[0];
    gameOver = false;
    isDraw = false;
    board.clearBoard();
    scoreBoard.resetScore();
  };

  return {
    playRound,
    getGameBoard,
    getActivePlayer,
    getGameOver,
    getIsDraw,
    isCellMarked,
    changePlayerName,
    getPlayers,
    getScoreBoard,
    getPlayerScore,
    resetGame,
  };
}

(function DisplayController() {
  const game = GameController();

  const gameBoardEl = document.querySelector('#game-board');
  const playerOneScoreEl = document.querySelector('#player-one-score');
  const playerTwoScoreEl = document.querySelector('#player-two-score');
  const activePlayerNameEl = document.querySelector('#active-player--name');
  const activePlayerMarkEl = document.querySelector('#active-player--mark');
  const messageEl = document.querySelector('#message');
  const changeNameBtnEl = document.querySelector('#change-name--btn');
  const resetGameBtnEl = document.querySelector('#reset-game--btn');
  const cancelChangeNameBtnEl = document.querySelector(
    '#change-name--cancel-btn',
  );
  const changeNameDialogEl = document.querySelector('#change-name--dialog');
  const changeNameFormEl = document.querySelector('#change-name--form');

  const initializeBoard = () => {
    const currentBoard = game.getGameBoard();

    gameBoardEl.innerHTML = currentBoard
      .map((row, rowIndex) =>
        row
          .map(
            (cellValue, colIndex) =>
              `<div class="cell" data-row=${rowIndex} data-col=${colIndex}>${cellValue}</div>`,
          )
          .join(''),
      )
      .join('');

    gameBoardEl.addEventListener('click', markCellHandler);
  };

  const render = () => {
    const currentBoard = game.getGameBoard();
    const currentScoreBoard = game.getScoreBoard();
    const players = game.getPlayers();
    const activePlayer = game.getActivePlayer();
    updateMessage(activePlayer);
    updateActivePlayer(activePlayer);
    updateScoreBoard(currentScoreBoard);
    updateGameBoard(currentBoard);
    updateChangeNameForm(players);
  };

  const resetGame = () => {
    game.resetGame();
    render();
  };

  const updateScoreBoard = (currentScoreBoard) => {
    currentScoreBoard.forEach((player) => {
      const playerScore = game.getPlayerScore(player.id);
      if (player.id === 1) {
        updatePlayerOneScore(playerScore);
      }

      if (player.id === 2) {
        updatePlayerTwoScore(playerScore);
      }
    });
  };

  const updatePlayerOneScore = (points) => {
    playerOneScoreEl.dataset.score = points;
    playerOneScoreEl.textContent = points;
  };

  const updatePlayerTwoScore = (points) => {
    playerTwoScoreEl.dataset.score = points;
    playerTwoScoreEl.textContent = points;
  };

  const updateGameBoard = (currentBoard) => {
    currentBoard.forEach((row, rowIndex) => {
      row.forEach((cellValue, colIndex) => {
        const cellEl = gameBoardEl.querySelector(
          `[data-row="${rowIndex}"][data-col="${colIndex}"]`,
        );

        if (cellEl && cellEl.textContent !== cellValue) {
          cellEl.textContent = cellValue;

          if (cellValue === '') {
            delete cellEl.dataset.cellValue;
          } else {
            cellEl.dataset.cellValue = cellValue;
          }
        }
      });
    });
  };

  const markCellHandler = (e) => {
    if (game.getGameOver()) return;

    const row = Number(e.target.dataset.row);
    const col = Number(e.target.dataset.col);

    if (!game.isCellMarked(row, col)) {
      game.playRound(row, col);
      render();
    }
  };

  const updateMessage = (activePlayer) => {
    if (game.getGameOver() && game.getIsDraw()) {
      messageEl.textContent = 'Game over! Draw!';
    } else if (game.getGameOver()) {
      messageEl.textContent = `Game over! ${activePlayer.name} wins!`;
    } else {
      messageEl.textContent = 'Your Turn';
    }
  };

  const updateActivePlayer = (activePlayer) => {
    activePlayerNameEl.textContent = activePlayer.name;
    activePlayerNameEl.classList.toggle('player-one', activePlayer.id === 1);
    activePlayerNameEl.classList.toggle('player-two', activePlayer.id === 2);

    activePlayerMarkEl.textContent = activePlayer.mark;
    activePlayerMarkEl.classList.toggle('player-one', activePlayer.id === 1);
    activePlayerMarkEl.classList.toggle('player-two', activePlayer.id === 2);
  };

  const openChangeNameDialog = () => {
    changeNameDialogEl.showModal();
  };

  const closeChangeNameDialog = () => {
    changeNameDialogEl.close();
  };

  const updateChangeNameForm = (players) => {
    const playerOneNameInputEl = document.querySelector('#player-one--name');
    const playerTwoNameInputEl = document.querySelector('#player-two--name');

    playerOneNameInputEl.setAttribute('value', players[0].name);
    playerTwoNameInputEl.setAttribute('value', players[1].name);
  };

  const changeNameFormHandler = (e) => {
    e.preventDefault();
    const formData = new FormData(changeNameFormEl);

    const playerOneName = formData.get('player-one--name');
    const playerTwoName = formData.get('player-two--name');

    if (playerOneName !== '' && playerTwoName !== '') {
      game.changePlayerName(1, playerOneName);
      game.changePlayerName(2, playerTwoName);

      closeChangeNameDialog();
    }

    render();
  };

  changeNameBtnEl.addEventListener('click', openChangeNameDialog);
  cancelChangeNameBtnEl.addEventListener('click', closeChangeNameDialog);
  resetGameBtnEl.addEventListener('click', resetGame);
  changeNameFormEl.addEventListener('submit', changeNameFormHandler);

  initializeBoard();
  render();
})();
