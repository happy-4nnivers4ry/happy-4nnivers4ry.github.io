const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

let playerX = canvas.width / 2;
let playerWidth = 30;
let playerHeight = 30;
let bullets = [];
let enemies = [];
let powerUps = [];
let shootInterval = 15;
let shootTimer = shootInterval;
let playerMoveSpeed = 10;
let bulletCount = 1; // Number of bullets to fire

function addEnemy() {
    const enemyPositionX = Math.random() * (canvas.width - 30);
    enemies.push({ x: enemyPositionX, y: -30 });
}

function addPowerUp() {
    // Randomly choose between yellow and orange and purple power-ups
    const powerUpX = Math.random() * (canvas.width - 15);
    const colors = ['yellow', 'orange', 'purple']; // Possible power-up colors
    const color = colors[Math.floor(Math.random() * colors.length)];
    powerUps.push({ x: powerUpX, y: -15, width: 15, height: 15, color: color });
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
        // Update position based on angle
        bullet.x += bullet.speed * Math.cos(bullet.angle);
        bullet.y += bullet.speed * Math.sin(bullet.angle);

        ctx.fillStyle = 'red';
        ctx.fillRect(bullet.x, bullet.y, 5, 10);

        // Bullet collision with enemies
        enemies.forEach((enemy, enemyIndex) => {
            if (bullet.x >= enemy.x && bullet.x <= enemy.x + 30 && bullet.y <= enemy.y + 30 && bullet.y >= enemy.y) {
                bullets.splice(index, 1);
                enemies.splice(enemyIndex, 1);
            }
        });

        if (bullet.y < 0 || bullet.x < 0 || bullet.x > canvas.width) {
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
        ctx.fillStyle = powerUp.color;
        ctx.fillRect(powerUp.x, powerUp.y, powerUp.width, powerUp.height);

        if (powerUp.x < playerX + playerWidth && powerUp.x + powerUp.width > playerX && powerUp.y + powerUp.height > canvas.height - 20 && powerUp.y < canvas.height) {
            powerUps.splice(index, 1);
            if (powerUp.color === 'yellow') {
                shootInterval = Math.max(5, shootInterval - 2);
            } else if (powerUp.color === 'orange') {
                playerMoveSpeed += 2;
            } else if (powerUp.color === 'purple') {
                bulletCount++; // Increase the number of bullets fired
            }
        }
    });

    requestAnimationFrame(updateGame);
}

function shootBullet() {
    let angleOffset = 0.785398; // 45 degrees in radians
    for (let i = 0; i < bulletCount; i++) {
        let angle = -Math.PI / 2; // Default angle to shoot straight up
        if (bulletCount > 1) {
            angle += angleOffset * (i - (bulletCount - 1) / 2);
        }
        bullets.push({
            x: playerX + 12.5,
            y: canvas.height - 20,
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
    }
});

updateGame();