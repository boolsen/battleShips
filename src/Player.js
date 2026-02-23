import {GameBoard} from "./gameModules.js";
export class Player {
    constructor(containerClass, cellClass, boardSize, name) {
        this.gameBoard = new GameBoard(boardSize),
        this.container = document.querySelector(`.${containerClass}`);
        this.cellClass = cellClass;
        this.name = name;
    }
}