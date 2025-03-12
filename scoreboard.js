class Scoreboard {
    constructor() {
        this.score = 0;
        this.streak = 0;
        this.bestStreak = 0;
        this.shotsTaken = 0;
        this.shotsMade = 0;
        this.multiplier = 1;
        
        // DOM elements
        this.scoreElement = document.getElementById('score');
        this.streakElement = document.getElementById('current-streak');
    }

    addPoints(points) {
        const finalPoints = points * this.multiplier;
        this.score += finalPoints;
        this.streak++;
        this.bestStreak = Math.max(this.streak, this.bestStreak);
        this.shotsMade++;
        this.updateDisplay();

        // Visual feedback
        this.scoreElement.classList.add('score-flash');
        setTimeout(() => this.scoreElement.classList.remove('score-flash'), 300);
    }

    missShot() {
        this.streak = 0;
        this.updateDisplay();
    }

    updateDisplay() {
        this.scoreElement.textContent = this.score;
        this.streakElement.textContent = this.streak;
        
        // Update streak multiplier visual
        if (this.streak >= 3) {
            this.streakElement.classList.add('streak-bonus');
        } else {
            this.streakElement.classList.remove('streak-bonus');
        }
    }

    getAccuracy() {
        return this.shotsTaken > 0 ? Math.round((this.shotsMade / this.shotsTaken) * 100) : 0;
    }

    reset() {
        this.score = 0;
        this.streak = 0;
        this.shotsTaken = 0;
        this.shotsMade = 0;
        this.multiplier = 1;
        this.updateDisplay();
    }}
