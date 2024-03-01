const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

let playerX = canvas.width / 2;
let playerY = canvas.height - 30;
let playerWidth = 30;
let playerHeight = 30;
let bullets = [];
let enemies = [];
let powerUps = [];
let shootInterval = 15;
let shootTimer = shootInterval;
let playerMoveSpeed = 10;
let bulletCount = 1;
let score = 0; // Initialize score

function addEnemy() {
    // Adjust maximum enemy size based on score, capped at 60
    const maxEnemySize = Math.min(60, 10 + Math.sqrt(score));
    const enemySize = Math.random() * (maxEnemySize - 10) + 10; // Enemies now range from 10 to maxEnemySize
    const enemyPositionX = Math.random() * (canvas.width - enemySize);
    enemies.push({ x: enemyPositionX, y: -enemySize, size: enemySize, hitCount: 0 });
}

function addPowerUp() {
    const powerUpX = Math.random() * (canvas.width - 15);
    const colors = ['yellow', 'orange', 'purple'];
    const color = colors[Math.floor(Math.random() * colors.length)];
    powerUps.push({ x: powerUpX, y: -15, width: 15, height: 15, color: color });
}

function updateGame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Display score
    ctx.font = '16px Arial';
    ctx.fillStyle = 'white';
    ctx.fillText('Score: ' + score, 10, 20);

    // Player
    ctx.fillStyle = 'blue';
    ctx.fillRect(playerX, playerY, playerWidth, playerHeight);

    // Shooting logic
    if (shootTimer <= 0) {
        shootBullet();
        shootTimer = shootInterval;
    } else {
        shootTimer--;
    }

    // Bullets
    bullets.forEach((bullet, index) => {
        bullet.x += bullet.speed * Math.cos(bullet.angle);
        bullet.y += bullet.speed * Math.sin(bullet.angle);

        // Bullet bounce on walls
        if (bullet.x <= 0 || bullet.x >= canvas.width) {
            bullet.angle = Math.PI - bullet.angle;
        }

        ctx.fillStyle = 'red';
        ctx.fillRect(bullet.x, bullet.y, 5, 10);

        // Bullet collision with enemies
        enemies.forEach((enemy, enemyIndex) => {
            if (bullet.x >= enemy.x && bullet.x <= enemy.x + enemy.size && bullet.y <= enemy.y + enemy.size && bullet.y >= enemy.y) {
                bullets.splice(index, 1);
                enemy.hitCount++;
                if (enemy.hitCount >= 10 || enemy.size <= 10) {
                    enemies.splice(enemyIndex, 1);
                    score++; // Increase score for each enemy defeated
                    if (score >= 1000) { // Game ends when score reaches 1000
                        alert("Congratulations! You've reached a score of 1000!");
                        window.location.reload(); // Reset the game
                    }
                } else {
                    enemy.size -= enemy.size > 10 ? 5 : 0;
                }
            }
        });

        if (bullet.y < 0 || bullet.y > canvas.height) {
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
        ctx.fillRect(enemy.x, enemy.y, enemy.size, enemy.size);

        if (enemy.y + enemy.size > playerY && enemy.x < playerX + playerWidth && enemy.x + enemy.size > playerX && enemy.y < playerY + playerHeight) {
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
        ctx.fillStyle = powerUp.color;
        ctx.fillRect(powerUp.x, powerUp.y, powerUp.width, powerUp.height);

        if (powerUp.x < playerX + playerWidth && powerUp.x + powerUp.width > playerX && powerUp.y + powerUp.height > playerY && powerUp.y < playerY + playerHeight) {
            powerUps.splice(index, 1);
            if (powerUp.color === 'yellow') {
                shootInterval = Math.max(5, shootInterval - 2);
            } else if (powerUp.color === 'orange') {
                playerMoveSpeed += 2;
            } else if (powerUp.color === 'purple') {
                bulletCount++;
            }
        }
    });

    requestAnimationFrame(updateGame);
}

function shootBullet() {
    let angleOffset = Math.PI / 4; // 45 degrees in radians for bullet spread
    for (let i = 0; i < bulletCount; i++) {
        let angle = -Math.PI / 2; // Default angle to shoot straight up
        if (bulletCount > 1) {
            angle += angleOffset * (i - (bulletCount - 1) / 2);
        }
        bullets.push({
            x: playerX + playerWidth / 2 - 2.5,
            y: playerY,
            speed: 5,
            angle: angle
        });
    }
}

document.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowLeft' && playerX > 0) {
        playerX -= playerMoveSpeed;
    } else if (event.key === 'ArrowRight' && playerX < canvas.width - playerWidth) {
        playerX += playerMoveSpeed;
    } else if (event.key === 'ArrowUp' && playerY > 0) {
        playerY -= playerMoveSpeed;
    } else if (event.key === 'ArrowDown' && playerY < canvas.height - playerHeight) {
        playerY += playerMoveSpeed;
    }
});

updateGame();