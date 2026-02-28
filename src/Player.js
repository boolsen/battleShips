import {GameBoard, Ship} from "./gameModules.js";
export class Player {
    constructor(containerClass, cellClass, boardSize) {
        this.gameBoard = new GameBoard(boardSize),
        this.container = document.querySelector(`.${containerClass}`);
        this.cellClass = cellClass;
        this.type = "player";
    }
}

export class Computer extends Player {
    constructor(containerClass, cellClass, boardSize, maxShipCells) {
        super(containerClass, cellClass, boardSize); //Calls parent constructor
        this.type = "computer";
    }

    InitializeComputerBoard() {
        const ships = this.getComputerShipComposition();
        console.log(ships);
        for(length in ships) {
            for(let i = 0; i < ships[length]; i++) {
                this.placeShip(length);
            }
        }
    }

    getComputerShipComposition() {
        const maxShipLength = this.gameBoard.maxShipSize;
        const maxNumberShipCells = this.gameBoard.maxShipCells;
        let shipCells = 0;
        const ships = {};

        while (shipCells < maxNumberShipCells) {
            const tempShipLength = Math.floor(Math.random() * maxShipLength) + 1;

            if (tempShipLength + shipCells > maxNumberShipCells) {
                continue;
            }  

            if (typeof ships[tempShipLength]  == "number" && ships[tempShipLength] > 0) {
                ships[tempShipLength]++;
            } else {
                ships[tempShipLength] = 1;
            }

            shipCells += tempShipLength;
        }
        return ships;
    }

    placeShip(shipSize) {
        while (true) {
            const row = Math.floor(Math.random() * this.gameBoard.gridSize);
            const column = Math.floor(Math.random() * this.gameBoard.gridSize);

            if (!this.gameBoard.canPlaceShip(row, column).canPlaceShip) {
                continue;
            }

            const availablePlacementDirections = this.checkPlacementDirections(shipSize, row, column)
            
            if (Object.keys(availablePlacementDirections).length === 0) {
                continue;
            }

            const chosenDirection = this.pickPlacementDirection(availablePlacementDirections,shipSize);
            this.addShipToCells(chosenDirection);
            console.log("ship placed:", {
                chosenDirection
            });
            break;
        }
    }

    addShipToCells(chosenDirection) {
        const newShip = this.gameBoard.getNewShip();
        const cells = chosenDirection.cells;
        for (let i = 0; i < cells.length; i++) {
            const result = this.gameBoard.placeShipInCell(
                cells[i][0],
                cells[i][1]
            );
        }
    }

    pickPlacementDirection(availablePlacementDirections,shipSize) {
        const directions = Object.keys(availablePlacementDirections);
        const randomDirection = directions[Math.floor(Math.random() * directions.length)];
        return availablePlacementDirections[randomDirection];
    }

    checkPlacementDirections(shipSize, row, column) {
        const boardSize = this.gameBoard.gridSize;
        const availablePlacementDirections = {
            right: {
                vector: [1,0],
                cells: []
            },
            left: {
                vector: [-1,0],
                cells: []
            },
            down: {
                vector: [0,1],
                cells: []
            },
            up: {
                vector: [0,-1],
                cells: []
            }
        }
        const grid = this.gameBoard.grid;

        for (let i = 1; i <= shipSize; i++) {
            for (let direction in {...availablePlacementDirections}) {
                const newRow = row + (i * availablePlacementDirections[direction].vector[0]);
                const newColumn = column + (i * availablePlacementDirections[direction].vector[1]);

                if (
                    newColumn < 0 || newRow < 0 || newColumn >= this.gameBoard.gridSize || newRow >= this.gameBoard.gridSize) {
                    delete availablePlacementDirections[direction];
                    continue;
                }

                const placementCheck = this.canPlaceNewShipCell(newRow,newColumn);
                if(!this.canPlaceNewShipCell(newRow,newColumn)) {
                    delete availablePlacementDirections[direction];
                } else {
                    availablePlacementDirections[direction].cells.push([newRow,newColumn])
                }
            }
        }

        return availablePlacementDirections;
    }

    canPlaceNewShipCell(row,column) {
        const vectors = [
            [-1,-1],
            [-1, 0],
            [-1,1],
            [0,-1],
            [0,1],
            [1,-1],
            [1,0],
            [1,1]
        ]

        for (let vector of vectors) {
            const newRow = row + vector[0];
            const newColumn = column + vector[1];
            const grid = this.gameBoard.grid;
            const boardSize = this.gameBoard.gridSize;
            if (newRow < 0 || newRow >= boardSize || newColumn < 0 || newColumn >= boardSize) {
                continue;
            }
            if(grid[newRow][newColumn].ship instanceof Ship) {
                return false;
            }
        }
        return true;
    }
}