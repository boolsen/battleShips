import {Ship,GameBoard,Cell} from "./gameModules.js";
import {Player,Computer} from './Player.js';
import { StateManager } from "./StateManager.js";

export class DomController {
    constructor() {
        this.boardSize = 10;
        this.mainContainer = document.querySelector('.main');
        this.playerContainer = document.querySelector('.player-gameboard');
        this.computerContainer = document.querySelector('.computer-gameboard');
        this.infoTextEle = document.querySelector('.info-text');
        this.players = {
            player: new Player('player-gameboard','player-cell',this.boardSize),
            computer: new Computer('computer-gameboard','computer-cell',this.boardSize),
        }
        this.CreateGridElementsForPlayers();
        this.players.computer.InitializeComputerBoard();
        this.containerAddEventListener();
        this.stateManager = new StateManager();
        this.gameOver = false;
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

        if (!target || this.gameOver) {
            return;
        }

        if (this.stateManager.isPlacement() && target.type === "player" && !event.target.classList.contains("occupied")) {
            this.PlaceShip(row, column, target);
        } else if (this.stateManager.isBombing() && target.type === "computer") {
            // Player bombs computer
            this.BombCell(row,column, target);
            const playerWin = this.players["computer"].CheckForOpponentWin();

            if (playerWin) {
                this.gameEnded("Player");
                return;
            }

            // Computer bombs player
            this.BombCell(row,column, this.players["player"]);
            const computerWin = this.players["player"].CheckForOpponentWin();
            //this.ComputerBomb()

            if (playerWin) {
                this.gameEnded("Computer");
            }
        }
    }

    gameEnded(playerName) {
        console.log(`${playerName} wins!`);
        this.gameOver = true;
        this.infoTextEle.textContent = `${playerName} wins! Reload to play again`;
    }

    ComputerBomb() {
        const row = Math.floor(Math.round * this.players["computer"].gridSize);
        const column = Math.floor(Math.round * this.players["computer"].gridSize);
        const targetCell = players["player"].grid[row][column];

        if (targetCell.hit) {
            return;
        }

        this.BombCell(row,column,)
    }

    BombCell(row,column, player) {
        player.gameBoard.BombCell(row, column);
    }

    PlaceShip(row, column, player) {
        const placementStatus = player.gameBoard.placeShipInCell(row, column);
        if (placementStatus.maxShipCellsReached) {
            this.ActivateBombingPhase();
            this.playerContainer.classList.toggle('placement-phase');
            this.computerContainer.classList.toggle('bombing-phase');
        }
    }

    ActivateBombingPhase() {
        this.stateManager.setPhase("BOMBING");
        this.infoTextEle.textContent = 'Bomb your enemy!';
    }

    CreateGridElements(gameBoard, targetContainer,cellClass) {
        const size = gameBoard.gridSize;
        const grid = gameBoard.grid;
        for (let i = 0; i < size; i++) {
            for (let j = 0; j < size; j++) {
                const newElement = this.CreateCellElement(j,i,cellClass);
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