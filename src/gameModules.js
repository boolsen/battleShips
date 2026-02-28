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
            this.sinkShip();
        }
    }

    sinkShip() {
        for (let cell of this.cells) {
            cell.element.classList.add('sunken');
        }
    }

    addCell(cell) {
        this.cells.push(cell);
        this.length++;
    }

    GetOrientation() {
        
        for (let cell of this.cells) {

        }
    }
}

class GameBoard {
    constructor(size = 10) {
        this.grid = [];
        this.initializeGrid(size);
        this.maxShipSize = 4;
        this.maxShipCells = 5;
        this.gridSize = size;
        this.shipCellsPlaced = 0;
        this.ships = [];
    }

    BombCell(row, column) {
        const cell = this.grid[row][column];
        cell.hit = true;
        if (cell.element.classList.contains('bombed')) {
            return {
                status: false,
                msg: 'Already bombed that cell'
            }
        }

        cell.element.classList.add('bombed');
        const ship = cell.ship;
        if (ship instanceof Ship) {
            return this.ShipHit(ship);
        }
    }

    ShipHit(ship) {
        if (ship.sunk) {
            return false;
        }

        return ship.hit();
    }

    initializeGrid(size) {
        for (let i = 0; i < size; i++) {
            this.grid.push([]);
            for (let j = 0; j < size; j++) {
                this.grid[i].push(new Cell(i,j));
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
            console.log(`Can't place ship, placeshipCheck, ${placeShipCheck.msg}`);
            return {
                shipPlaced: false,
                maxShipCellsReached: this.shipCellsPlaced >= this.maxShipCells
            }
        }

        if (!placeShipCheck.shipPlacedAroundCell) {
            placeShipCheck.shipPlacedAroundCell = this.getNewShip();
        }

        this.grid[x][y].placeShip(placeShipCheck.shipPlacedAroundCell,x,y);
        this.shipCellsPlaced++;

        return {
            shipPlaced: true,
            maxShipCellsReached: this.shipCellsPlaced >= this.maxShipCells
        }
    }

    getNewShip() {
        const ship =  new Ship();
        console.log(this.ships);
        this.ships.push(ship);
        return ship;
    }

    compareShipOrientation(x, y, ship) {
        const uniqueXCoords = new Set(ship.cells.map(c => c.xCoord));
        const uniqueYCoords = new Set(ship.cells.map(c => c.yCoord));

        const shipX = uniqueXCoords.values().next().value;
        const shipY = uniqueYCoords.values().next().value;

        if (uniqueXCoords.size === 1 && x === shipX) return true;
        if (uniqueYCoords.size === 1 && y === shipY) return true;

        return false;
    }

    findShipsAroundCell(x,y) {
        const shipsPlacedAroundCell = [];
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
        return shipsPlacedAroundCell;
    }

    canPlaceShip(x,y) {
        if (x < 0 || y < 0 || x >= this.gridSize || y >= this.gridSize || this.shipCellsPlaced >= this.maxShipCells) {
            return {canPlaceShip: false, msg: "outside grid"};
        }

        const shipsPlacedAroundCell = this.findShipsAroundCell(x,y);

        if (shipsPlacedAroundCell.length > 1) {
            return {
                canPlaceShip: false
                ,msg: "more than one ship"
            };
        } else if (shipsPlacedAroundCell.length === 0) {
            return {
                canPlaceShip: true
            };
        } else if (shipsPlacedAroundCell.length === 1 && shipsPlacedAroundCell[0].length >= this.maxShipSize) {
            console.log({maxSizeShip: shipsPlacedAroundCell[0]});
            return {
                canPlaceShip: false,
                msg: "maxSize reached for ship"
            };
        } else {
            if (!this.compareShipOrientation(x, y, shipsPlacedAroundCell[0])) {
                return {
                    canPlaceShip: false,
                    msg: "wrong orientation"
                };
            }
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
        ship.addCell(this);
        this.element.classList.add('occupied');
    }
}

export {Ship,GameBoard,Cell};