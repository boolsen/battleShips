import "./style.css";

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
    }
}

class GameBoard {
    constructor(size = 10) {
        this.grid = [];
        this.initializeGrid(size);
        this.maxShipSize = 4;
        this.gridSize = size;
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
        const placeShipCheck = this.canPlaceShip(x,y);
        if (!placeShipCheck.canPlaceShip || placeShipCheck.shipsPlacedAroundCell.length > 1) {
            console.log("Can't place ship");
            return;
        }

        if (placeShipCheck.shipsPlacedAroundCell.length == 1 && placeShipCheck.shipsPlacedAroundCell[0].length > 1) {
            if (this.checkShipPlacement(x, y, placeShipCheck.shipsPlacedAroundCell[0])) {
                console.log("Can't place ship, wrong orientation");
                return;
            }
        }

        this.grid[y][x].placeShip();
    }

    checkShipPlacement(x,y, ship) {
        let orientation = null;

        const uniqueXCoords = new Set(ship.cells.map(x => x[0]));
        if (uniqueXCoords.lenght = 1 && x == uniqueXCoords[0]) {
            return true;
        } 
        const uniqueYCoords = new Set(ship.cells.map(y => y[1]));
         if (uniqueYCoords.lenght = 1 && x == uniqueYCoords[0]) {
            return true;
        } 
        return false;        
    }

    canPlaceShip(x,y) {
        const shipsPlacedAroundCell = [];
        if (x < 0 || x >= this.gridSize || y < 0 || y >= this.gridSize || this.grid[x][y].ship) {
            return {canPlaceShip: false, shipsPlacedAroundCell: shipsPlacedAroundCell};
        }

        for (let i = -1; i < 2; i++) {
            if (x + i < this.gridSize - 1) {
                if (this.grid[x + i][y].ship !== null) {
                    shipsPlacedAroundCell.push([x + i, y]);
                }                
            }
            if (y + i < this.gridSize - 1) {
                if (this.grid[x][y + i].ship !== null) {
                    shipsPlacedAroundCell.push([x,y + i]);
                }                
            }
        }

        if (shipsPlacedAroundCell > 1) {
            return {canPlaceShip: false, shipsPlacedAroundCell: shipsPlacedAroundCell};
        } else {
            return {canPlaceShip: true, shipsPlacedAroundCell: shipsPlacedAroundCell};
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
        ship.cells.addCell(x,y);
        ship.length++;
    }
}