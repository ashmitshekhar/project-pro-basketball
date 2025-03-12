class Player {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.width = 40;
        this.height = 80;
        this.x = 50;
        this.y = canvas.height - this.height;
        
        // Shooting parameters
        this.shootPower = 0;
        this.maxPower = 25;
        this.charging = false;
        this.currentSpin = 0;
        
        // Animation properties
        this.animationFrame = 0;
        this.sprites = {
            idle: [],
            shooting: []
        };
        this.loadSprites();
    }

    loadSprites() {
        // Create simple animation frames using canvas
        for (let i = 0; i < 4; i++) {
            const canvas = document.createElement('canvas');
            canvas.width = this.width;
            canvas.height = this.height;
            const ctx = canvas.getContext('2d');
            
            // Draw idle pose with slight movement
            ctx.fillStyle = '#4834d4';
            ctx.fillRect(0, Math.sin(i * Math.PI/2) * 2, this.width, this.height);
            this.sprites.idle.push(canvas);
            
            // Draw shooting pose
            const shootCanvas = document.createElement('canvas');
            shootCanvas.width = this.width;
            shootCanvas.height = this.height;
            const shootCtx = shootCanvas.getContext('2d');
            shootCtx.fillStyle = '#4834d4';
            shootCtx.fillRect(0, -i * 3, this.width, this.height);
            this.sprites.shooting.push(shootCanvas);
        }
    }

    draw() {
        this.ctx.save();
        
        // Draw player sprite
        const sprite = this.charging ? 
            this.sprites.shooting[Math.floor(this.animationFrame/10) % 4] :
            this.sprites.idle[Math.floor(this.animationFrame/15) % 4];
        this.ctx.drawImage(sprite, this.x, this.y);
        
        // Draw player head
        this.ctx.beginPath();
        this.ctx.arc(this.x + this.width/2, this.y, 15, 0, Math.PI * 2);
        this.ctx.fillStyle = '#786fa6';
        this.ctx.fill();

        // Draw power meter if charging
        if (this.charging) {
            const powerPercentage = this.shootPower / this.maxPower;
            const meterHeight = 100;
            const meterWidth = 10;
            
            // Draw meter background
            this.ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
            this.ctx.fillRect(
                this.x + this.width + 20,
                this.y,
                meterWidth,
                meterHeight
            );
            
            // Draw power level with color gradient
            const gradient = this.ctx.createLinearGradient(0, this.y + meterHeight, 0, this.y);
            gradient.addColorStop(0, '#27ae60');
            gradient.addColorStop(0.6, '#f1c40f');
            gradient.addColorStop(1, '#e74c3c');
            
            this.ctx.fillStyle = gradient;
            this.ctx.fillRect(
                this.x + this.width + 20,
                this.y + meterHeight * (1 - powerPercentage),
                meterWidth,
                meterHeight * powerPercentage
            );

            // Draw spin indicator
            const spinIndicator = this.currentSpin === -1 ? '↺' : this.currentSpin === 1 ? '↻' : '•';
            this.ctx.fillStyle = '#fff';
            this.ctx.font = '24px Arial';
            this.ctx.fillText(spinIndicator, this.x + this.width + 40, this.y + 30);
        }

        this.ctx.restore();
        this.animationFrame++;
    }

    startCharging() {
        this.charging = true;
        this.shootPower = 0;
        document.getElementById('powerFill').style.width = '0%';
    }

    updateCharge() {
        if (this.charging && this.shootPower < this.maxPower) {
            this.shootPower += 0.5;
            document.getElementById('powerFill').style.width = 
                (this.shootPower / this.maxPower * 100) + '%';
        }
    }

    releaseShot() {
        const power = this.shootPower;
        this.charging = false;
        this.shootPower = 0;
        document.getElementById('powerFill').style.width = '0%';
        return power;
    }

    setSpin(direction) {
        this.currentSpin = direction;
        // Visual feedback
        const buttons = {
            '-1': 'leftSpin',
            '0': 'noSpin',
            '1': 'rightSpin'
        };
        
        document.querySelectorAll('.spin-button').forEach(btn => {
            btn.classList.remove('active');
        });
        document.getElementById(buttons[direction]).classList.add('active');
    }
}
