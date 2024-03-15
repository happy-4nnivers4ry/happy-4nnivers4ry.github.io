document.addEventListener('DOMContentLoaded', () => {
    const gameArea = document.getElementById('gameArea');
    const player = document.getElementById('player');
    let playerX = 10, playerY = 0;
    let velocityY = 0;
    const gravity = -0.98;
    const playerHeight = 60; // The player is now three squares tall
    let tetrisPieces = [];
    let currentPiece = null;
    let pieceCount = 0;
    let isOnGround = false;

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
        piece.style.width = shape === 'L' ? '60px' : '20px'; // Adjust width for L shape
        piece.style.height = shape === 'L' ? '40px' : '60px'; // Adjust height for L shape
        piece.style.backgroundColor = 'green';
        piece.style.position = 'absolute';
        piece.style.left = `${Math.random() * (gameArea.offsetWidth - 60)}px`; // Spawn within bounds
        piece.style.bottom = `${gameArea.offsetHeight}px`;
        gameArea.appendChild(piece);
        currentPiece = { element: piece, x: parseFloat(piece.style.left), y: parseFloat(piece.style.bottom), width: shape === 'L' ? 60 : 20, height: shape === 'L' ? 40 : 60, stopped: false, shape: shape };
        tetrisPieces.push(currentPiece);
    }

    function update() {
        if (currentPiece && !currentPiece.stopped) {
            currentPiece.y -= 1; // Tetris piece falls
            if (currentPiece.y <= 0 || checkCollision(currentPiece, tetrisPieces)) {
                currentPiece.stopped = true;
                currentPiece = null;
                spawnPiece();
            } else {
                currentPiece.element.style.bottom = `${currentPiece.y}px`;
            }
        }

        velocityY += gravity; // Gravity affects player
        playerY += velocityY;
        isOnGround = false;

        // Collision detection for player
        if (playerY <= 0 || checkCollision(player, tetrisPieces, true)) {
            velocityY = 0;
            playerY = Math.max(playerY, 0); // Prevent going below the ground
            isOnGround = true;
        }

        player.style.left = `${playerX}px`;
        player.style.bottom = `${playerY}px`;
    }

    function checkCollision(entity, pieces, isPlayer = false) {
        for (let piece of pieces) {
            if (entity !== piece && entity.x < piece.x + piece.width && entity.x + entity.width > piece.x &&
                entity.y < piece.y + piece.height && entity.y + (isPlayer ? playerHeight : entity.height) > piece.y) {
                if (isPlayer && velocityY < 0) {
                    playerY = piece.y + piece.height; // Adjust player position on top of the piece
                    isOnGround = true;
                }
                return true;
            }
        }
        return false;
    }

    setInterval(update, 20);

    document.addEventListener('keydown', (e) => {
        switch (e.key) {
            case 'ArrowRight':
                playerX += 5;
                break;
            case 'ArrowLeft':
                playerX -= 5;
                break;
            case 'ArrowUp':
                if (isOnGround) {
                    velocityY = 10; // Jump only if on the ground or a piece
                    isOnGround = false;
                }
                break;
            case 'a':
                if (currentPiece) {
                    currentPiece.x -= 5;
                    currentPiece.element.style.left = `${currentPiece.x}px`;
                }
                break;
            case 'd':
                if (currentPiece) {
                    currentPiece.x += 5;
                    currentPiece.element.style.left = `${currentPiece.x}px`;
                }
                break;
            case 's':
                if (currentPiece) {
                    currentPiece.y -= 10; // Make the piece fall faster
                    currentPiece.element.style.bottom = `${currentPiece.y}px`;
                }
                break;
            // Rotation logic for the pieces will be more complex and is not included here.
        }
    });
});
