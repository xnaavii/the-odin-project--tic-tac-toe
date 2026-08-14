const game = (function createGame() {
  const POSSIBLE_COMBINATIONS = [
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 9],
    [1, 4, 7],
    [2, 5, 8],
    [3, 6, 9],
    [1, 5, 9],
    [3, 5, 7],
  ];

  (function createGameboard() {
    const gameBoard = [];

    const getGameboard = () => gameBoard;

    return { getGameboard };
  })();

  function createPlayer(name, symbol) {
    const player = {
      name,
      symbol,
    };

    const getInfo = () => player;

    return { getInfo };
  }

  const getPossibleCombinations = () => POSSIBLE_COMBINATIONS;

  return { getPossibleCombinations, createPlayer };
})();
