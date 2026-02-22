import {GameBoard} from "./gameModules.js";
export class Player {
    constructor(containerClass, cellClass, boardSize) {
        this.gameBoard = new GameBoard(this.boardSize),
        this.container = document.querySelector(`.${containerClass}`);
        this.cellClass = cellClass;
    }
}