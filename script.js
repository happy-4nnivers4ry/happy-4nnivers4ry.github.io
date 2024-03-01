const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

let playerX = canvas.width / 2;
let bullets = [];

function updateGame() {
    // Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw player
    ctx.fillStyle = 'blue';
    ctx.fillRect(playerX, canvas.height - 20, 30, 30); // Simple player block

    // Update and draw bullets
    for (let i = 0; i < bullets.length; i++) {
        bullets[i].y -= 5;
        ctx.fillStyle = 'red';
        ctx.fillRect(bullets[i].x, bullets[i].y, 5, 10); // Simple bullet rectangle

        // Remove bullets that go off screen
        if (bullets[i].y < 0) {
            bullets.splice(i, 1);
            i--;
        }
    }

    requestAnimationFrame(updateGame);
}

function shootBullet() {
    // Add new bullet
    bullets.push({ x: playerX + 12.5, y: canvas.height - 20 });
}

// Event listener for keypresses
document.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowLeft') playerX -= 10;
    if (event.key === 'ArrowRight') playerX += 10;
    if (event.key === ' ') shootBullet();
});

updateGame();