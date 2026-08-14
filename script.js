const { getGameboard } = (function createGameboard() {
  const gameBoard = [];

  const getGameboard = () => gameBoard;

  return { getGameboard };
})();

console.log(getGameboard());
