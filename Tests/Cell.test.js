import {Ship,GameBoard,Cell} from "../src/gameModules.js"


test('Cell lifecycle', () => {
    const x = 1;
    const y = 1;
    const cell = new Cell(x,y);

    // Initial state
    expect(cell.ship).toEqual(null);
    expect(cell.xCoord).toEqual(x);
    expect(cell.yCoord).toEqual(y);
    expect(cell.hit).toEqual(false);

    const ship = new Ship();
    cell.placeShip(ship,x,y);

    expect(cell.ship).toBe(ship);
    expect(ship.cells).toEqual([[x,y]]);
})
