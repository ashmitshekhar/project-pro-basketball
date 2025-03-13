class Controls {
    constructor(game) {
        this.game = game;
        this.mouseDown = false;
        this.currentSpin = 0;
        this.setupEventListeners();
    }

    setupEventListeners() {
        // Game state controls
        document.getElementById('playButton').addEventListener('click', () => {
            document.getElementById('menuScreen').classList.add('hidden');
            document.getElementById('gameScreen').classList.remove('hidden');
            this.game.start();
        });

        document.getElementById('restartButton').addEventListener('click', () => {
            document.getElementById('gameOverModal').classList.add('hidden');
            this.game.start();
        });

        document.getElementById('menuButton').addEventListener('click', () => {
            this.game.returnToMenu();
        });

        // Tutorial controls
        document.getElementById('tutorialButton').addEventListener('click', () => {
            document.getElementById('tutorialModal').classList.remove('hidden');
        });

        document.getElementById('closeTutorial').addEventListener('click', () => {
            document.getElementById('tutorialModal').classList.add('hidden');
        });

        // Settings controls
        document.getElementById('settingsButton').addEventListener('click', () => {
            this.showSettings();
        });

        document.getElementById('saveSettings').addEventListener('click', () => {
            this.saveSettings();
        });

        // Pause controls
        document.getElementById('resumeButton').addEventListener('click', () => {
            this.game.togglePause();
        });

        document.getElementById('quitButton').addEventListener('click', () => {
            this.game.returnToMenu();
        });

        // Shooting controls
        this.game.canvas.addEventListener('mousedown', () => {
            if (!this.game.isPaused) {
                this.mouseDown = true;
                this.game.player.startCharging();
            }
        });

        this.game.canvas.addEventListener('mouseup', () => {
            if (this.mouseDown && !this.game.isPaused) {
                this.mouseDown = false;
                this.game.shoot();
            }
        });

        // Angle control
        document.getElementById('angleSlider').addEventListener('input', (e) => {
            document.getElementById('angleValue').textContent = e.target.value;
        });

        // Enhanced spin controls
        document.getElementById('leftSpin').addEventListener('click', () => {
            this.updateSpinControl('left');
        });

        document.getElementById('noSpin').addEventListener('click', () => {
            this.updateSpinControl('none');
        });

        document.getElementById('rightSpin').addEventListener('click', () => {
            this.updateSpinControl('right');
        });

        // Enhanced keyboard controls
        document.addEventListener('keydown', (e) => {
            switch(e.code) {
                case 'Space':
                    this.game.togglePause();
                    break;
                case 'Escape':
                    if (this.game.isRunning) {
                        this.game.togglePause();
                    }
                    break;
                case 'KeyQ':
                    this.updateSpinControl('left');
                    break;
                case 'KeyW':
                    this.updateSpinControl('none');
                    break;
                case 'KeyE':
                    this.updateSpinControl('right');
                    break;
            }
        });
    }

    updateSpinControl(direction) {
        // Remove active class from all spin buttons
        document.querySelectorAll('.spin-button').forEach(btn => {
            btn.classList.remove('active');
        });

        // Set spin value and activate button
        switch(direction) {
            case 'left':
                this.currentSpin = -1;
                document.getElementById('leftSpin').classList.add('active');
                break;
            case 'right':
                this.currentSpin = 1;
                document.getElementById('rightSpin').classList.add('active');
                break;
            default:
                this.currentSpin = 0;
                document.getElementById('noSpin').classList.add('active');
        }

        // Update game state and show visual feedback
        this.game.player.setSpin(this.currentSpin);
    }

    showSettings() {
        document.getElementById('settingsModal').classList.remove('hidden');
        const settings = JSON.parse(localStorage.getItem('basketballSettings')) || {
            musicVolume: 30,
            soundVolume: 50,
            difficulty: 'normal'
        };
        
        document.getElementById('musicVolume').value = settings.musicVolume;
        document.getElementById('soundVolume').value = settings.soundVolume;
        document.getElementById('difficulty').value = settings.difficulty;
    }

    saveSettings() {
        const settings = {
            musicVolume: document.getElementById('musicVolume').value,
            soundVolume: document.getElementById('soundVolume').value,
            difficulty: document.getElementById('difficulty').value
        };
        
        localStorage.setItem('basketballSettings', JSON.stringify(settings));
        this.game.applySettings(settings);
        document.getElementById('settingsModal').classList.add('hidden');
    }
}

