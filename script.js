document.addEventListener('DOMContentLoaded', () => {
    const gameArea = document.getElementById('gameArea');
    const player = document.getElementById('player');
    let playerX = 100, playerY = 10; // Start the player a bit above the ground
    let velocityY = 0;
    const gravity = -0.2; // Lower gravity for a less powerful jump
    const playerHeight = 60; // The player is now three squares tall
    let tetrisPieces = [];
    let currentPiece = null;
    let pieceCount = 0;
    let isOnGround = true;
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
        player.style.zIndex = '10'; // Ensure the player is visually on top of Tetris pieces
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
        piece.style.width = shape === 'L' ? '40px' : '20px';
        piece.style.height = shape === 'L' ? '20px' : '60px';
        piece.style.backgroundColor = 'green';
        piece.style.position = 'absolute';
        piece.style.left = `${Math.random() * (gameArea.offsetWidth - (shape === 'L' ? 40 : 20))}px`;
        piece.style.bottom = `${gameArea.offsetHeight}px`;
        gameArea.appendChild(piece);
        currentPiece = {
            element: piece,
            x: parseFloat(piece.style.left),
            y: parseFloat(piece.style.bottom),
            width: shape === 'L' ? 40 : 20,
            height: shape === 'L' ? 20 : 60,
            stopped: false,
            shape: shape
        };
        tetrisPieces.push(currentPiece);
    }

    function update() {
        // Apply gravity if the player is not on the ground
        if (!isOnGround) {
            velocityY += gravity; // Apply gravity
        }

        // Player movement
        if (moveRight) playerX += 5;
        if (moveLeft) playerX -= 5;

        // Check for collision and update the player's Y position
        let collisionResult = checkCollisionWithPieces(player);
        if (collisionResult.collided) {
            if (velocityY <= 0) {
                playerY = collisionResult.blockTop; // Position the player on top of the block
                velocityY = 0; // Stop vertical movement
            }
            isOnGround = true;
        } else {
            playerY += velocityY;
            if (playerY <= 0) {
                playerY = 0; // Keep the player above the ground
                velocityY = 0; // Stop vertical movement
                isOnGround = true;
            } else {
                isOnGround = false;
            }
        }

        // Update the player's position
        player.style.left = `${playerX}px`;
        player.style.bottom = `${playerY}px`;

        // Update Tetris pieces
        if (currentPiece && !currentPiece.stopped) {
            currentPiece.y -= 1; // Tetris piece falls
            if (currentPiece.y < 0 || checkCollisionWithPieces(currentPiece).collided) {
                currentPiece.stopped = true;
                currentPiece = null;
                spawnPiece();
            }
            currentPiece.element.style.bottom = `${currentPiece.y}px`;
        }
    }

    function checkCollisionWithPieces(entity) {
        let collision = { collided: false, blockTop: 0 };
        for (let piece of tetrisPieces) {
            if (entity !== piece &&
                entity.x < piece.x + piece.width &&
                entity.x + entity.width > piece.x &&
                entity.y < piece.y + piece.height &&
                entity.y + (entity === player ? playerHeight : entity.height) > piece.y) {
                if (entity === player && velocityY <= 0 && entity.y < piece.y + piece.height) {
                    // Detect top collision for the player
                    collision = { collided: true, blockTop: piece.y + piece.height };
                    break;
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
                    velocityY = 10; // Jump
                    isOnGround = false;
                }
                break;
        }
    });

    document.addEventListener('keyup', (e) => {
        switch (e.key) {
            case 'ArrowRight':
                moveRight = false;
                break;
            case 'ArrowLeft':
                moveLeft = false;
                break;
        }
    });
});
