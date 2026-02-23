import {Ship} from "../src/gameModules.js"

test('ship lifecycle: create → add cells → hit → sink', () => {
  const ship = new Ship();

  // Initial state
  expect(ship.hits).toBe(0);
  expect(ship.sunk).toBe(false);
  expect(ship.cells).toEqual([]);

  // Add cells
  ship.addCell(3, 4);
  ship.addCell(3, 5);

  expect(ship.cells).toEqual([[3, 4], [3, 5]]);
  expect(ship.sunk).toBe(false);

  // Hit ship
  ship.hit();
  expect(ship.sunk).toBe(false);

  ship.hit();
  expect(ship.sunk).toBe(true);
});
