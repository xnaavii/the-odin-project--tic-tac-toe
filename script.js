function createGameboard() {
  const gameBoard = [];

  const getGameboard = () => gameBoard;

  return { getGameboard };
}

function createPlayer(name) {
  const playerName = name;

  const getName = () => playerName;

  return { getName };
}

const gameBoard = createGameboard();
const player = createPlayer('Ivan');
