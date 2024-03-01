const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

let playerX = canvas.width / 2;
let playerWidth = 30;
let playerHeight = 30;
let playerSpeed = 10; // Initial player speed
let bullets = [];
let enemies = [];
let powerUps = [];
let shootInterval = 15;
let shootTimer = shootInterval;

function addEnemy() {
    const enemyPositionX = Math.random() * (canvas.width - 30);
    enemies.push({ x: enemyPositionX, y: -30 });
}

function addPowerUp() {
    const powerUpX = Math.random() * (canvas.width - 15);
    const powerUpType = 'orange'; // For now, all power-ups are orange
    powerUps.push({ x: powerUpX, y: -15, width: 15, height: 15, type: powerUpType });
}

function updateGame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Player
    ctx.fillStyle = 'blue';
    ctx.fillRect(playerX, canvas.height - 20, playerWidth, playerHeight);

    // Shooting logic
    if (shootTimer <= 0) {
        shootBullet();
        shootTimer = shootInterval;
    } else {
        shootTimer--;
    }

    // Bullets
    bullets.forEach((bullet, index) => {
        bullet.y -= 5;
        ctx.fillStyle = 'red';
        ctx.fillRect(bullet.x, bullet.y, 5, 10);

        // Bullet collision with enemies
        enemies.forEach((enemy, enemyIndex) => {
            if (bullet.x >= enemy.x && bullet.x <= enemy.x + 30 && bullet.y <= enemy.y + 30 && bullet.y >= enemy.y) {
                bullets.splice(index, 1);
                enemies.splice(enemyIndex, 1);
            }
        });

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
            alert("Game Over");
            window.location.reload(); // Reset the game
            return;
        }

        if (enemy.y > canvas.height) {
            enemies.splice(index, 1);
        }
    });

    // Power-ups
    if (Math.random() < 0.01) {
        addPowerUp();
    }

    powerUps.forEach((powerUp, index) => {
        powerUp.y += 1;
        ctx.fillStyle = 'yellow';
        ctx.fillRect(powerUp.x, powerUp.y, powerUp.width, powerUp.height);

        if (powerUp.x < playerX + playerWidth && powerUp.x + powerUp.width > playerX && powerUp.y + powerUp.height > canvas.height - 
