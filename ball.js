class Ball {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.radius = 15;
        
        // Physics parameters
        this.gravity = 0.6;
        this.bounce = 0.7;
        this.friction = 0.99;
        this.windResistance = 0.0001;
        
        // Ball properties
        this.rotation = 0;
        this.spinSpeed = 0;
        this.maxSpin = 0.3;
        this.trailPoints = [];
        this.maxTrailPoints = 10;
        
        this.reset();
    }

    reset() {
        this.x = 100;
        this.y = this.canvas.height - this.radius;
        this.velocityX = 0;
        this.velocityY = 0;
        this.spin = 0;
        this.rotation = 0;
        this.trailPoints = [];
    }

    update() {
        // Store trail point
        this.trailPoints.unshift({ x: this.x, y: this.y });
        if (this.trailPoints.length > this.maxTrailPoints) {
            this.trailPoints.pop();
        }

        // Apply physics
        this.velocityY += this.gravity;
        
        // Apply spin effect
        this.velocityX += this.spin * 0.15;
        
        // Apply wind resistance
        const speed = Math.sqrt(this.velocityX * this.velocityX + this.velocityY * this.velocityY);
        const drag = speed * this.windResistance;
        this.velocityX *= (1 - drag);
        this.velocityY *= (1 - drag);
        
        // Update position
        this.x += this.velocityX;
        this.y += this.velocityY;
        
        // Update rotation based on spin and velocity
        this.rotation += this.spin * 0.1;
        
        // Handle collisions
        this.handleCollisions();
        
        // Decay spin
        this.spin *= 0.98;
    }

    handleCollisions() {
        // Ground collision
        if (this.y + this.radius > this.canvas.height) {
            this.y = this.canvas.height - this.radius;
            this.velocityY = -this.velocityY * this.bounce;
            this.velocityX *= 0.8; // Ground friction
            document.getElementById('bounceSound').play();
        }
        
        // Wall collisions
        if (this.x + this.radius > this.canvas.width) {
            this.x = this.canvas.width - this.radius;
            this.velocityX = -this.velocityX * this.bounce;
        }
        if (this.x - this.radius < 0) {
            this.x = this.radius;
            this.velocityX = -this.velocityX * this.bounce;
        }
    }

    draw() {
        // Draw trail
        this.trailPoints.forEach((point, index) => {
            const alpha = 1 - (index / this.maxTrailPoints);
            this.ctx.beginPath();
            this.ctx.arc(point.x, point.y, this.radius * 0.5, 0, Math.PI * 2);
            this.ctx.fillStyle = `rgba(255, 165, 0, ${alpha * 0.3})`;
            this.ctx.fill();
        });

        // Draw ball
        this.ctx.save();
        this.ctx.translate(this.x, this.y);
        this.ctx.rotate(this.rotation);
        
        // Ball base
        this.ctx.beginPath();
        this.ctx.arc(0, 0, this.radius, 0, Math.PI * 2);
        this.ctx.fillStyle = '#ff6b6b';
        this.ctx.fill();
        
        // Ball lines for visual rotation
        for (let i = 0; i < 4; i++) {
            this.ctx.beginPath();
            this.ctx.arc(0, 0, this.radius, i * Math.PI/2, (i + 0.5) * Math.PI/2);
            this.ctx.strokeStyle = '#000';
            this.ctx.lineWidth = 2;
            this.ctx.stroke();
        }
        
        this.ctx.restore();
    }

    shoot(power, angle, spinDirection) {
        const radians = angle * Math.PI / 180;
        this.velocityX = Math.cos(radians) * power;
        this.velocityY = -Math.sin(radians) * power;
        this.spin = spinDirection * this.maxSpin;
        document.getElementById('swooshSound').play();
    }
}

