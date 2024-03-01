const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

let playerX = canvas.width / 2;
let playerWidth = 30;
let playerHeight = 30;
let bullets = [];
let enemies = [];
let powerUps = [];
let shootInterval = 15;
let shootTimer = 0;
let playerColor = 'blue'; // Player color to change on power-up

function addEnemy() {
    const enemyPositionX = Math.random() * (canvas.width - 30);
    enemies.push({ x: enemyPositionX, y: -30 });
}

function addPowerUp() {
    const powerUpX = Math.random() * (canvas.width - 15);
    powerUps.push({ x: powerUpX, y: -15, width: 15, height: 15 });
}

function updateGame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Player
    ctx.fillStyle = playerColor;
    ctx.fillRect(playerX, canvas.height - 20, playerWidth, playerHeight);

    // Bullets
    bullets.forEach((bullet, index) => {
        bullet.y -= 5;
        ctx.fillStyle = 'red';
        ctx.fillRect(bullet.x, bullet.y, 5, 10);

        if (bullet.y < 0) {
            bullets.splice(index, 1);
        }
    });

    // Enemies
    if (Math.random() < 0.02) {
        addEnemy();
    }

    enemies.forEach((enemy, index) => {
        enemy.y += 2;
        ctx.fillStyle = 'green';
        ctx.fillRect(enemy.x, enemy.y, 30, 30);

        if (enemy.y + 30 > canvas.height - 20 && enemy.x < playerX + playerWidth && enemy.x + 30 > playerX) {
            // Game over
            alert("Game Over");
            window.location.reload(); // Reset the game
            return;
        }

        if (enemy.y > canvas.height) {
            enemies.splice(index, 1);
        }
    });

    // Power-ups
    if (Math.random() < 0.01) {  // Adjust for more frequent power-ups
        addPowerUp();
    }

    powerUps.forEach((powerUp, index) => {
        powerUp.y += 1;
        ctx.fillStyle = 'yellow';
        ctx.fillRect(powerUp.x, powerUp.y, powerUp.width, powerUp.height);

        if (powerUp.x < playerX + playerWidth && powerUp.x + powerUp.width > playerX && powerUp.y + powerUp.height > canvas.height - 20 && powerUp.y < canvas.height) {
            powerUps.splice(index, 1);
            playerColor = 'orange'; // Change player color to indicate power-up
            setTimeout(() => playerColor = 'blue', 5000); // Power-up lasts for 5 seconds
        }
    });

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
