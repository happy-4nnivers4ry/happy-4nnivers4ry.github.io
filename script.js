document.addEventListener('DOMContentLoaded', () => {
    const gameArea = document.getElementById('gameArea');
    const player = document.getElementById('player');
    let playerX = 10, playerY = 0;
    let velocityY = 0;
    const gravity = -0.5;
    let tetrisPieces = [];
    let currentPiece = null;
    let gameInterval = null;
    const pieceShapes = ['L', 'I']; // The two types of pieces

    function createPlayer() {
        player.style.width = '20px';
        player.style.height = '60px'; // Player is now three squares tall
        player.style.backgroundColor = 'blue';
        player.style.position = 'absolute';
        player.style.left = `${playerX}px`;
        player.style.bottom = `${playerY}px`;
    }

    function updatePlayer() {
        if ((playerY > 0 || velocityY > 0) && !checkCollisionWithPieces(player)) {
            velocityY += gravity; // Apply gravity
            playerY += velocityY;
            if (playerY < 0) {
                playerY = 0; // Land on the ground
                velocityY = 0; // Reset velocity
            }
        }

        player.style.left = `${playerX}px`;
        player.style.bottom = `${playerY}px`;
    }

    function createTetrisPiece() {
        const shape = pieceShapes[Math.floor(Math.random() * pieceShapes.length)]; // Randomly choose a shape
        const piece = document.createElement('div');
        piece.className = 'tetrisPiece';
        piece.style.width = shape === 'L' ? '40px' : '20px'; // L is 2 blocks wide, I is 1 block wide
        piece.style.height = '20px';
        piece.style.backgroundColor = 'green';
        piece.style.position = 'absolute';
        piece.style.left = `${Math.random() * (gameArea.offsetWidth - (shape === 'L' ? 40 : 20))}px`;
        piece.style.bottom = `${gameArea.offsetHeight}px`;
        gameArea.appendChild(piece);
        currentPiece = { element: piece, x: parseFloat(piece.style.left), y: parseFloat(piece.style.bottom), stopped: false, shape: shape };
    }

    function updateTetrisPiece() {
        if (currentPiece && !currentPiece.stopped) {
            currentPiece.y -= 1; // Piece falls down
            currentPiece.element.style.bottom = `${currentPiece.y}px`;

            // Check for collision with floor or other pieces
            if (currentPiece.y <= 0 || checkCollisionWithOtherPieces(currentPiece)) {
                currentPiece.stopped = true;
                currentPiece = null; // Allow the next piece to start falling
                if (tetrisPieces.length < 10) {
                    createTetrisPiece(); // Create next piece
                }
            }
        }
    }

    function checkCollisionWithOtherPieces(piece) {
        // Add piece to the list when it stops
        if (piece.stopped) {
            tetrisPieces.push(piece);
            return true;
        }
        // Check for collision with existing pieces
        for (let other of tetrisPieces) {
            if (piece !== other && piece.x < other.x + 20 && piece.x + 20 > other.x && piece.y < other.y + 20) {
                return true;
            }
        }
        return false;
    }

    function checkCollisionWithPieces(entity) {
        // This simple collision detection assumes all pieces are 20px in height.
        for (let piece of tetrisPieces) {
            if (entity.x < piece.x + 20 && entity.x + 20 > piece.x && entity.y < piece.y + 20 && entity.y + 60 > piece.y) {
                return true;
            }
        }
        return false;
    }

    function startGame() {
        createPlayer();
        createTetrisPiece(); // Create the first Tetris piece

        gameInterval = setInterval(() => {
            updatePlayer();
            if (!currentPiece) {
                updateTetrisPiece();
            }
        }, 20);
    }

    document.addEventListener('keydown', (e) => {
        if (currentPiece && e.key.toLowerCase() === 's') {
            currentPiece.y -= 5; // Speed up the fall
            return;
        }

        switch (e.key) {
            case 'ArrowRight':
                playerX += 5;
                break;
            case 'ArrowLeft':
                playerX -= 5;
                break;
            case 'ArrowUp':
                if (playerY === 0 || checkCollisionWithPieces({ x: playerX, y: playerY, width: 20, height: 60 })) velocityY = 10; // Jump
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
            // R key for rotation and other controls can be implemented later
        }
    });

    startGame();
});
