export class StateManager {
    static PHASES = {
        MENU: 'MENU',
        PLACEMENT: 'PLACEMENT',
        BOMBING: 'BOMBING',
        GAME_OVER: 'GAME_OVER'
    };

    constructor() {
        this.currentPhase = StateManager.PHASES.PLACEMENT;
    }

    // Explicitly set the phase
    setPhase(newPhase) {
        const validPhases = Object.values(StateManager.PHASES);
        if (validPhases.includes(newPhase)) {
            this.currentPhase = newPhase;
        } else {
            console.error(`${newPhase} is not a valid game phase.`);
        }
    }

    // Helper methods for clean conditionals
    isPlacement() { return this.currentPhase === StateManager.PHASES.PLACEMENT; }
    isBombing() { return this.currentPhase === StateManager.PHASES.BOMBING; }
}