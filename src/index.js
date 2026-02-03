import "./style.css";

class Ship {
    constructor(length) {
        this.length = length;
        this.hits = 0;
        this.sunk = false;
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

        this.grid[y][x].placeShip();
    }

    neighBourCellIsShip(x,y) {
        let shipCount = 0;
        for (let i = -1; i < 2; i += 2) {
            if (x + i < this.gridSize - 1) {
                if (this.grid[x + i][y].ship !== null) {
                    shipCount++;
                }                
            }
            if (y + i < this.gridSize - 1) {
                if (this.grid[x][y + i].ship !== null) {
                    shipCount++;
                }                
            }
        }
    }
}

class Cell {
    constructor(x,y){
        this.ship = null;
        this.xCoord = x;
        this.yCoord = y;
        this.hit = false;
    }

    placeShip(ship) {
        this.ship = ship;
    }
}