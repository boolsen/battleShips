import {Ship,GameBoard,Cell} from "../src/gameModules.js"


test('GameBoard lifecycle', () => {
    const size = 5;
    const gameBoard = new GameBoard(size);

    // Initial state
    expect(gameBoard.grid.length).toBe(size);
    expect(gameBoard.grid[0].length).toBe(size);

    // Place ship outside of grid:
    gameBoard.placeShipInCell(size,0);

    // Place ship in corner
    gameBoard.placeShipInCell(0,0);
    const comparisonShip = {
        cells: [[0,0]],
        length: 1,
        hits: 0,
        sunk: false
    }
    expect(gameBoard.grid[0][0].ship).toEqual(comparisonShip);
    
    //Place illegal position, too close to other ship
    gameBoard.placeShipInCell(1,1);
    expect(gameBoard.grid[1][1].ship).toEqual(null);

    gameBoard.placeShipInCell(0,1);
    expect(gameBoard.grid[0][1].ship).toBe(gameBoard.grid[0][0].ship);
})
