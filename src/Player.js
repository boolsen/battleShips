import {GameBoard} from "./gameModules.js";
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

        this.getComputerShipComposition();
    }

    InitializeComputerBoard() {
        const ships = this.getComputerShipComposition();
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
}