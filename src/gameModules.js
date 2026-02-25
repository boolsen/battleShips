class Ship {
    constructor() {
        this.length = 0;
        this.hits = 0;
        this.sunk = false;
        this.cells = [];
    }

    hit(){
        this.hits++;
        this.isSunk();
    }

    isSunk(){
        if (this.hits >= this.length){
            this.sunk = true;
        }
    }

    addCell(x,y) {
        this.cells.push([x,y]);
        this.length++;
    }
}

class GameBoard {
    constructor(size = 10) {
        this.grid = [];
        this.initializeGrid(size);
        this.maxShipSize = 4;
        this.maxShipCells = 15;
        this.gridSize = size;
        this.shipCellsPlaced = 0;
    }

    initializeGrid(size) {
        for (let i = 0; i < size; i++) {
            this.grid.push([]);
            for (let j = 0; j < size; j++) {
                this.grid[i].push(new Cell(j,i));
            }
        }
    }

    placeShipInCell(x,y) {
        if (this.shipCellsPlaced >= this.maxShipCells) {
            return {
                shipPlaced: false,
                maxShipCellsReached: this.shipCellsPlaced >= this.maxShipCells
            }
        }
        const placeShipCheck = this.canPlaceShip(x,y);
        if (!placeShipCheck.canPlaceShip) {
            console.log("Can't place ship");
            return {
                shipPlaced: false,
                maxShipCellsReached: this.shipCellsPlaced >= this.maxShipCells
            }
        }

        if (placeShipCheck.shipPlacedAroundCell) {
            if (!this.checkShipOrientation(x, y, placeShipCheck.shipPlacedAroundCell)) {
                console.log("Can't place ship, wrong orientation");
                return {
                    shipPlaced: false,
                    maxShipCellsReached: this.shipCellsPlaced >= this.maxShipCells
                }
            }
        }

        if (!placeShipCheck.shipPlacedAroundCell) {
            placeShipCheck.shipPlacedAroundCell = new Ship();
        }

        this.grid[x][y].placeShip(placeShipCheck.shipPlacedAroundCell,x,y);
        this.shipCellsPlaced++;

        return {
            shipPlaced: true,
            maxShipCellsReached: this.shipCellsPlaced >= this.maxShipCells
        }
    }

    checkShipOrientation(x, y, ship) {
        const uniqueXCoords = new Set(ship.cells.map(c => c[0]));
        const uniqueYCoords = new Set(ship.cells.map(c => c[1]));

        const shipX = uniqueXCoords.values().next().value;
        const shipY = uniqueYCoords.values().next().value;

        if (uniqueXCoords.size === 1 && x === shipX) return true;
        if (uniqueYCoords.size === 1 && y === shipY) return true;

        return false;
    }

    canPlaceShip(x,y) {
        const shipsPlacedAroundCell = [];

        if (x < 0 || y < 0 || x >= this.gridSize || y >= this.gridSize || this.shipCellsPlaced >= this.maxShipCells) {
            return {canPlaceShip: false};
        }

        for (let dx = -1; dx <= 1; dx++) {
            for (let dy = -1; dy <= 1; dy++) {

                // Skip the center cell itself
                if (dx === 0 && dy === 0) continue;

                const nx = x + dx;
                const ny = y + dy;

                if (nx >= 0 && nx < this.gridSize && ny >= 0 && ny < this.gridSize) {
                    if (this.grid[nx][ny].ship !== null) {
                        shipsPlacedAroundCell.push(this.grid[nx][ny].ship);
                    }
                }
            }
        }

        if (shipsPlacedAroundCell.length > 1) {
            return {
                canPlaceShip: false
            };
        } else if (shipsPlacedAroundCell.length === 0) {
            return {
                canPlaceShip: true
            };
        } else if (shipsPlacedAroundCell.length === 1 && shipsPlacedAroundCell[0].length >= this.maxShipSize) {
            return {
                canPlaceShip: false
            };
        } else {
            return {
                canPlaceShip: true, 
                shipPlacedAroundCell: shipsPlacedAroundCell[0]
            };
        }
    }
}

class Cell {
    constructor(x,y){
        this.ship = null;
        this.xCoord = x;
        this.yCoord = y;
        this.hit = false;
        this.element = null;
    }

    placeShip(ship, x, y) {
        this.ship = ship;
        ship.addCell(x,y);
        this.element.classList.add('occupied');
    }
}

export {Ship,GameBoard,Cell};