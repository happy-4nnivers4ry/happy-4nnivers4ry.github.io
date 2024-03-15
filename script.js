document.addEventListener('DOMContentLoaded', () => {
    const gameArea = document.getElementById('gameArea');
    const player = document.getElementById('player');
    let playerX = 100, playerY = 0;
    let velocityY = 0;
    const gravity = -0.3; // Less gravity for a lower jump
    const playerHeight = 60; // The player is now three squares tall
    let tetrisPieces = [];
    let currentPiece = null;
    let pieceCount = 0;
    let isOnGround = false;
    let moveRight = false;
    let moveLeft = false;

    createPlayer();
    spawnPiece();

    function createPlayer() {
        player.style.width = '20px';
        player.style.height = `${playerHeight}px`;
        player.style.backgroundColor = 'blue';
        player.style.position = 'absolute';
        player.style.left = `${playerX}px`;
        player.style.bottom = `${playerY}px`;
        gameArea.appendChild(player);
    }

    function spawnPiece() {
        if (pieceCount < 10) {
            createTetrisPiece();
            pieceCount++;
        }
    }

    function createTetrisPiece() {
        const shapes = ['I', 'L']; // I and L shapes
        const shape = shapes[Math.floor(Math.random() * shapes.length)];
        const piece = document.createElement('div');
        piece.className = 'tetrisPiece';
        // L is two blocks wide and one block tall, I is one block wide and three blocks tall
        piece.style.width = shape === 'L' ? '40px' : '20px';
        piece.style.height = shape === 'L' ? '20px' : '60px';
        piece.style.backgroundColor = 'green';
        piece.style.position = 'absolute';
        piece.style.left = `${Math.random() * (gameArea.offsetWidth - (shape === 'L' ? 40 : 20))}px`;
        piece.style.bottom = `${gameArea.offsetHeight}px`;
        gameArea.appendChild(piece);
        currentPiece = { element: piece, x: parseFloat(piece.style.left), y: parseFloat(piece.style.bottom), width: shape === 'L' ? 40 : 20, height: shape === 'L' ? 20 : 60, stopped: false, shape: shape };
        tetrisPieces.push(currentPiece);
    }

    function update() {
        // Player movement
        if (moveRight) playerX += 5;
        if (moveLeft) playerX -= 5;

        // Update gravity and jump
        velocityY += gravity; // Apply gravity
        playerY += velocityY;

        // Check if the player is on the ground or hitting a piece
        if (playerY <= 0) {
            playerY = 0; // Keep the player above the ground
            velocityY = 0; // Stop vertical movement
            isOnGround = true;
        } else {
            let collisionResult = checkCollisionWithPieces(player);
            if (collisionResult.collided) {
                if (velocityY < 0) { // Player is moving down
                    playerY = collisionResult.blockTop; // Position player on top of the block
                    velocityY = 0; // Stop vertical movement
                }
                isOnGround = true;
            } else {
                isOnGround = false;
            }
        }

        // Update the Tetris pieces
        if (currentPiece && !currentPiece.stopped) {
            currentPiece.y -= 1; // Pieces fall down by 1px every frame
            if (currentPiece.y <= 0 || checkCollisionWithPieces(currentPiece)) {
                currentPiece.stopped = true;
                currentPiece = null;
                spawnPiece();
            } else {
                currentPiece.element.style.bottom = `${currentPiece.y}px`;
            }
        }

        // Set the player's position
        player.style.left = `${playerX}px`;
        player.style.bottom = `${playerY}px`;
    }

    function checkCollisionWithPieces(entity) {
        let collision = { collided: false, blockTop: 0 };
        for (let piece of tetrisPieces) {
            if (entity !== piece &&
                entity.x < piece.x + piece.width &&
                entity.x + entity.width > piece.x &&
                entity.y < piece.y + piece.height &&
                entity.y + (entity === player ? playerHeight : 0) > piece.y) {
                // Detect top collision for the player
                if (entity === player && velocityY < 0 && entity.y < piece.y + piece.height) {
                    collision = { collided: true, blockTop: piece.y + piece.height };
                } else if (entity !== player) {
                    collision.collided = true;
                }
            }
        }
        return collision;
    }

    setInterval(update, 20);

    document.addEventListener('keydown', (e) => {
        switch (e.key) {
            case 'ArrowRight':
                moveRight = true;
                break;
            case 'ArrowLeft':
                moveLeft = true;
                break;
            case 'ArrowUp':
                if (isOnGround) {
                    velocityY = 10; // Adjust to a reasonable jump velocity
                    isOnGround = false;
                }
                break;
            // Other controls...
        }
    });

    document.addEventListener('keyup', (e) => {
        // Stop moving when the arrow keys are released
        if (e.key === 'ArrowRight') {
            moveRight = false;
        } else if (e.key === 'ArrowLeft') {
            moveLeft = false;
        }
    });
});
