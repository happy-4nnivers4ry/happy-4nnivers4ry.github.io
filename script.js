const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

let playerX = canvas.width / 2;
let playerWidth = 30;
let playerHeight = 30;
let playerLives = 3; // Number of player lives
let bullets = [];
let enemies = [];
let powerUps = [];
let shootInterval = 15;
let shootTimer = 0;

function updateGame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Player
    ctx.fillStyle = 'blue';
    ctx.fillRect(playerX, canvas.height - playerHeight, playerWidth, playerHeight);

    // Bullets
    for (let i = 0; i < bullets.length; i++) {
        bullets[i].y -= 5;
        ctx.fillStyle = 'red';
        ctx.fillRect(bullets[i].x, bullets[i].y, 5, 10);

        // Bullet collision with enemies
        for (let j = 0; j < enemies.length; j++) {
            if (bullets[i] && bullets[i].y <= enemies[j].y + 30 && bullets[i].x >= enemies[j].x && bullets[i].x <= enemies[j].x + 30) {
                enemies.splice(j, 1);
                bullets.splice(i, 1);
                i--;
                break;
            }
        }

        if (bullets[i] && bullets[i].y < 0) {
            bullets.splice(i, 1);
            i--;
        }
    }

    // Enemies
    for (let i = 0; i < enemies.length; i++) {
        enemies[i].y += 2;
        ctx.fillStyle = 'green';
        ctx.fillRect(enemies[i].x, enemies[i].y, 30, 30);

        // Enemy collision with player
        if (enemies[i].y + 30 > canvas.height - playerHeight && enemies[i].x < playerX + playerWidth && enemies[i].x + 30 > playerX) {
            enemies.splice(i, 1);
            playerLives--;
            if (playerLives <= 0) {
                alert("Game Over");
                window.location.reload(); // Reset the game
            }
            break;
        }

        if (enemies[i] && enemies[i].y > canvas.height) {
            enemies.splice(i, 1);
            i--;
        }
    }

    // Power-ups
    for (let i = 0; i < powerUps.length; i++) {
        powerUps[i].y += 1;
        ctx.fillStyle = 'yellow';
        ctx.fillRect(powerUps[i].x, powerUps[i].y, 15, 15);

        // Power-up collision with player
        if (powerUps[i].x < playerX + playerWidth && powerUps[i].x + 15 > playerX && powerUps[i].y < canvas.height && powerUps[i].y + 15 > canvas.height - playerHeight) {
            powerUps.splice(i, 1);
            shootInterval = 5; // Faster shooting
            setTimeout(() => shootInterval = 15, 5000); // Lasts for 5 seconds
        }
    }

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