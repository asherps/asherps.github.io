// Get the canvas and context
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d', { alpha: false });

// Enable hardware acceleration
canvas.style.transform = 'translateZ(0)';

// Pre-render leaves to separate canvases for better performance
const leafCache = new Map();
function createLeafCanvas(emoji, size) {
    const key = `${emoji}-${size}`;
    if (leafCache.has(key)) {
        return leafCache.get(key);
    }

    const leafCanvas = document.createElement('canvas');
    const leafCtx = leafCanvas.getContext('2d');
    leafCanvas.width = size * 2;
    leafCanvas.height = size * 2;
    leafCtx.font = size + 'px sans-serif';
    leafCtx.textAlign = 'center';
    leafCtx.textBaseline = 'middle';
    leafCtx.fillText(emoji, size, size);
    leafCache.set(key, leafCanvas);
    return leafCanvas;
}

// Resize canvas to full window size
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

// Define a Leaf class
class Leaf {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * -canvas.height;
        this.speedY = (1 + Math.random() * 2) * 60; // Increased base speed
        this.speedX = (-1 + Math.random() * 2) * 60; // Increased base speed
        this.size = Math.floor(15 + Math.random() * 20); // Round size for better caching
        this.rotation = Math.random() * Math.PI * 2;
        this.rotationSpeed = (-0.05 + Math.random() * 0.1) * 60;
        this.emoji = Math.random() > 0.5 ? '🍃' : '🍂';
        // Pre-render this leaf's canvas
        this.leafCanvas = createLeafCanvas(this.emoji, this.size);
    }

    update(deltaTime) {
        this.x += this.speedX * deltaTime;
        this.y += this.speedY * deltaTime;
        this.rotation += this.rotationSpeed * deltaTime;

        // Wrap around if leaf goes off-screen at the bottom
        if (this.y > canvas.height + this.size) {
            this.y = -this.size;
            this.x = Math.random() * canvas.width;
        }
        if (this.x > canvas.width + this.size) {
            this.x = -this.size;
        } else if (this.x < -this.size) {
            this.x = canvas.width + this.size;
        }
    }

    draw(ctx) {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation);
        // Draw the pre-rendered leaf
        ctx.drawImage(
            this.leafCanvas,
            -this.size,
            -this.size,
            this.size * 2,
            this.size * 2
        );
        ctx.restore();
    }
}

// Create an array of leaves
const leaves = [];
const numLeaves = 40; // increased for more density
for (let i = 0; i < numLeaves; i++) {
    leaves.push(new Leaf());
}

// Animation loop
let lastTime = performance.now();
function animate() {
    requestAnimationFrame(animate); // Move to start for better timing

    let now = performance.now();
    let deltaTime = (now - lastTime) / 1000;
    deltaTime = Math.min(deltaTime, 1 / 30);
    lastTime = now;

    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Batch all updates before draws to reduce state changes
    for (const leaf of leaves) {
        leaf.update(deltaTime);
    }

    for (const leaf of leaves) {
        leaf.draw(ctx);
    }
}

animate(); 