import {Ship,GameBoard,Cell} from "./gameModules.js";
import {Player} from './Player.js';
import { StateManager } from "./StateManager.js";

export class DomController {
    constructor() {
        this.placementPhase = true;
        this.boardSize = 10;
        this.mainContainer = document.querySelector('.main');
        this.playerContainer = document.querySelector('.player-gameboard');
        this.computerContainer = document.querySelector('.computer-gameboard');
        this.players = {
            player: new Player('player-gameboard','player-cell',this.boardSize, "player"),
            computer: new Player('computer-gameboard','computer-cell',this.boardSize, "computer"),
        }
        this.CreateGridElementsForPlayers();
        this.containerAddEventListener();
        this.stateManager = new StateManager();
        console.log("Controller initialization done");
    }

    containerAddEventListener() {
        this.mainContainer.addEventListener('click',(e) => {
            this.containerClicked(e);
        })
    }

    CreateGridElementsForPlayers() {
        for (let playerName in this.players) {
            const player = this.players[playerName];
            this.CreateGridElements(player.gameBoard, player.container, player.cellClass)
        }
    }

    containerClicked(event) {
        const row = parseInt(event.target.dataset.row);
        const column = parseInt(event.target.dataset.column);
        const parent = event.target.parentNode.dataset.player;
        const target = this.players[parent];

        if (!Number.isInteger(row) || !Number.isInteger(column)) {
            console.log('clicked outside of grid');
        } else {
            console.log({parent, player, row, column});
        }

        if (this.stateManager.isPlacement && player.name === "player") {
            //PLACE SHIP
        } else if (this.stateManager.isBombing && player.name === "computer") {
            //BOMB TARGET CELL
        }
    }

    CreateGridElements(gameBoard, targetContainer,cellClass) {
        const size = gameBoard.gridSize;
        const grid = gameBoard.grid;
        console.log("test");
        for (let i = 0; i < size; i++) {
            for (let j = 0; j < size; j++) {
                const newElement = this.CreateCellElement(i,j,cellClass);
                grid[i][j].element = newElement;
                targetContainer.append(newElement);
            }
        }
    }

    CreateCellElement(x,y, cellClass) {
        const cellEle = document.createElement('div');
        cellEle.classList.add('cell',cellClass);
        cellEle.dataset.column = x;
        cellEle.dataset.row = y;
        return cellEle;
    }

    UpdateCSSGridSize() {
        const size = this.gridSize;
        //update css for grid rows/columns
        const sizeString = '1fr '.repeat(size);
        this.playerContainer.style.gridTemplateRows = sizeString;
        this.playerContainer.style.gridTemplateColumns = sizeString;
    }
}