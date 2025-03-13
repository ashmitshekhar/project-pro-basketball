class Game {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        
        // Set canvas size
        this.canvas.width = 800;
        this.canvas.height = 600;
        
        // Initialize game objects
        this.ball = new Ball(this.canvas);
        this.player = new Player(this.canvas);
        this.scoreboard = new Scoreboard();
        this.powerups = new PowerUps(this);
        this.controls = new Controls(this);
        
        // Game state
        this.isRunning = false;
        this.isPaused = false;
        this.gameTime = 60;
        this.timeRemaining = this.gameTime;
        this.showGuideLine = false;
        
        // Basketball hoop
        this.hoop = {
            x: this.canvas.width - 100,
            y: this.canvas.height - 200,
            width: 10,
            height: 80,
            rimSize: 40,
            netPoints: this.createNetPoints()
        };

        // High scores
        this.highScores = JSON.parse(localStorage.getItem('basketballHighScores')) || [];
        this.updateHighScoresList();

        // Bind methods
        this.gameLoop = this.gameLoop.bind(this);
        this.setupAudio();
    }

    setupAudio() {
        this.backgroundMusic = document.getElementById('backgroundMusic');
        this.backgroundMusic.volume = 0.3;
    }

    createNetPoints() {
        const points = [];
        const segments = 8;
        for (let i = 0; i < segments; i++) {
            points.push({
                x: this.canvas.width - 100 - (i * 5),
                y: this.canvas.height - 200 + 10,
                baseY: this.canvas.height - 200 + 10
            });
        }
        return points;
    }

    start() {
        if (!this.isRunning) {
            this.reset();
            this.isRunning = true;
            this.backgroundMusic.play();
            this.startTimer();
            this.gameLoop();
        }
    }

    reset() {
        this.timeRemaining = this.gameTime;
        this.scoreboard.reset();
        this.powerups.reset();
        this.ball.reset();
        this.isPaused = false;
        document.getElementById('gameOverModal').classList.add('hidden');
        document.getElementById('pauseModal').classList.add('hidden');
    }

    startTimer() {
        this.timer = setInterval(() => {
            if (!this.isPaused) {
                this.timeRemaining--;
                document.getElementById('time').textContent = this.timeRemaining;
                
                if (this.timeRemaining <= 0) {
                    this.endGame();
                }
            }
        }, 1000);
    }

    pauseTimer() {
        clearInterval(this.timer);
    }

    resumeTimer() {
        this.startTimer();
    }

    togglePause() {
        this.isPaused = !this.isPaused;
        document.getElementById('pauseModal').classList.toggle('hidden');
        
        if (this.isPaused) {
            this.backgroundMusic.pause();
        } else {
            this.backgroundMusic.play();
        }
    }

    gameLoop() {
        if (!this.isRunning) return;
        
        if (!this.isPaused) {
            this.update();
            this.draw();
        }
        
        requestAnimationFrame(this.gameLoop);
    }

    update() {
        this.ball.update();
        if (this.player.charging) {
            this.player.updateCharge();
        }
        this.updateNet();
        this.checkScore();
    }

    updateNet() {
        this.hoop.netPoints.forEach((point, i) => {
            const wave = Math.sin(Date.now() * 0.003 + i * 0.5) * 2;
            point.y = point.baseY + wave;
        });
    }

    draw() {
        // Clear canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw background elements
        this.drawBackground();
        
        // Draw game elements
        this.player.draw();
        this.ball.draw();
        this.drawHoop();
        
        // Draw guide line if powerup is active
        if (this.showGuideLine && this.player.charging) {
            this.drawGuideLine();
        }
    }

    drawBackground() {
        // Draw crowd
        const gradient = this.ctx.createLinearGradient(0, 0, 0, this.canvas.height);
        gradient.addColorStop(0, '#1a2a6c');
        gradient.addColorStop(1, '#b21f1f');
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }

    drawHoop() {
        // Draw backboard
        this.ctx.fillStyle = '#fff';
        this.ctx.fillRect(this.hoop.x + 10, this.hoop.y - 20, 10, 120);
        
        // Draw rim
        this.ctx.fillStyle = '#ff6b6b';
        this.ctx.fillRect(this.hoop.x - this.hoop.rimSize, this.hoop.y, 
                         this.hoop.rimSize + this.hoop.width, this.hoop.width);
        
        // Draw net
        this.ctx.beginPath();
        this.ctx.moveTo(this.hoop.x - this.hoop.rimSize, this.hoop.y + 10);
        this.hoop.netPoints.forEach(point => {
            this.ctx.lineTo(point.x, point.y);
        });
        this.ctx.strokeStyle = '#fff';
        this.ctx.stroke();
    }

    drawGuideLine() {
        const angle = utils.degreesToRadians(
            document.getElementById('angleSlider').value
        );
        const power = this.player.shootPower;
        
        this.ctx.beginPath();
        this.ctx.moveTo(this.ball.x, this.ball.y);
        this.ctx.lineTo(
            this.ball.x + Math.cos(angle) * power * 10,
            this.ball.y - Math.sin(angle) * power * 10
        );
        this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
        this.ctx.stroke();
    }

    shoot() {
        const power = this.player.releaseShot();
        const angle = parseInt(document.getElementById('angleSlider').value);
        this.ball.shoot(power, angle, this.player.currentSpin);
        this.scoreboard.shotsTaken++;
    }

    checkScore() {
        if (this.ball.velocityY > 0 && 
            this.ball.x > this.hoop.x - this.hoop.rimSize && 
            this.ball.x < this.hoop.x &&
            this.ball.y > this.hoop.y && 
            this.ball.y < this.hoop.y + this.hoop.width) {
            
            this.scoreboard.addPoints(2);
            this.ball.reset();
        }
        
        if (this.ball.y > this.canvas.height + 50) {
            this.scoreboard.missShot();
            this.ball.reset();
        }
    }

    endGame() {
        this.isRunning = false;
        clearInterval(this.timer);
        this.backgroundMusic.pause();
        this.backgroundMusic.currentTime = 0;
        
        // Update high scores
        const finalScore = this.scoreboard.score;
        this.highScores.push({
            score: finalScore,
            date: new Date().toLocaleDateString()
        });
        this.highScores.sort((a, b) => b.score - a.score);
        this.highScores = this.highScores.slice(0, 5); // Keep top 5
        localStorage.setItem('basketballHighScores', JSON.stringify(this.highScores));
        
        // Update game over modal
        document.getElementById('finalScore').textContent = finalScore;
        document.getElementById('bestStreak').textContent = this.scoreboard.bestStreak;
        document.getElementById('shotsMade').textContent = this.scoreboard.shotsMade;
        document.getElementById('accuracy').textContent = this.scoreboard.getAccuracy();
        
        document.getElementById('gameOverModal').classList.remove('hidden');
        this.updateHighScoresList();
    }

    updateHighScoresList() {
        const list = document.getElementById('highScoresList');
        list.innerHTML = '';
        this.highScores.forEach(score => {
            const li = document.createElement('li');
            li.textContent = `${score.score} pts - ${score.date}`;
            list.appendChild(li);
        });
    }
}

// Initialize game when window loads
window.onload = () => new Game();



