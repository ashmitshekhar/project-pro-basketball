class PowerUps {
    constructor(game) {
        this.game = game;
        this.activePowerups = new Set();
        this.powerupDuration = 10000; // 10 seconds

        // Initialize powerup buttons
        this.freezeTimeBtn = document.getElementById('freezeTime');
        this.doublePointsBtn = document.getElementById('doublePoints');
        this.guideLineBtn = document.getElementById('guideLine');

        this.setupEventListeners();
    }

    setupEventListeners() {
        this.freezeTimeBtn.addEventListener('click', () => this.activatePowerup('freezeTime'));
        this.doublePointsBtn.addEventListener('click', () => this.activatePowerup('doublePoints'));
        this.guideLineBtn.addEventListener('click', () => this.activatePowerup('guideLine'));
    }

    activatePowerup(type) {
        if (this.activePowerups.has(type)) return;

        const button = document.getElementById(type);
        button.classList.add('active');
        this.activePowerups.add(type);

        switch(type) {
            case 'freezeTime':
                this.game.pauseTimer();
                break;
            case 'doublePoints':
                this.game.scoreboard.multiplier = 2;
                break;
            case 'guideLine':
                this.game.showGuideLine = true;
                break;
        }

        // Set timeout to deactivate
        setTimeout(() => this.deactivatePowerup(type), this.powerupDuration);
    }

    deactivatePowerup(type) {
        const button = document.getElementById(type);
        button.classList.remove('active');
        this.activePowerups.delete(type);

        switch(type) {
            case 'freezeTime':
                this.game.resumeTimer();
                break;
            case 'doublePoints':
                this.game.scoreboard.multiplier = 1;
                break;
            case 'guideLine':
                this.game.showGuideLine = false;
                break;
        }
    }

    reset() {
        this.activePowerups.clear();
        document.querySelectorAll('.powerup').forEach(btn => btn.classList.remove('active'));
    }
}





