const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

let playerX = canvas.width / 2;
let playerWidth = 30;
let playerHeight = 30;
let playerLives = 3;
let bullets = [];
let enemies = [];
let powerUps = [];
let shootInterval = 15;
let shootTimer = 0;

function addEnemy() {
    // Function to add an enemy at a random position at the top
    const enemyPositionX = Math.random() * (canvas.width - 30);
    enemies.push({ x: enemyPositionX, y: -30 });
}

function updateGame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Player
    ctx.fillStyle = 'blue';
    ctx.fillRect(playerX, canvas.height - 20, playerWidth, playerHeight);

    // Bullets
    bullets.forEach((bullet, index) => {
        bullet.y -= 5;
        ctx.fillStyle = 'red';
        ctx.fillRect(bullet.x, bullet.y, 5, 10);

        // Remove bullets that are off the screen
        if (bullet.y < 0) {
            bullets.splice(index, 1);
        }
    });

    // Enemies
    if (Math.random() < 0.02) {  // Adjust probability as needed
        addEnemy();
    }

    enemies.forEach((enemy, index) => {
        enemy.y += 2;  // Adjust speed as needed
        ctx.fillStyle = 'green';
        ctx.fillRect(enemy.x, enemy.y, 30, 30);

        // Remove enemies that are off the screen
        if (enemy.y > canvas.height) {
            enemies.splice(index, 1);
        }
    });

    // Power-ups
    // Power-up logic here (omitted for brevity)

    // Shooting logic
    if (shootTimer > 0) {
        shootTimer--;
    }

    requestAnimationFrame(updateGame);
}

function shootBullet() {
    if (shootTimer <= 0) {
        bullets.push({ x: playerX + 12.5, y: canvas.height - 20 });
        shootTimer = shootInterval;
    }
}

document.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowLeft' && playerX > 0) playerX -= 10;
    if (event.key === 'ArrowRight' && playerX < canvas.width - playerWidth) playerX += 10;
    if (event.key === ' ') shootBullet();
});

updateGame();
