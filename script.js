document.addEventListener('DOMContentLoaded', () => {
    const gameArea = document.getElementById('gameArea');
    const player = document.getElementById('player');
    let playerX = 10, playerY = 0;
    let velocityY = 0;
    const gravity = -0.5;
    let currentPiece = null;
    let gameInterval = null;

    function createPlayer() {
        player.style.width = '20px';
        player.style.height = '60px'; // Player is now three squares tall
        player.style.backgroundColor = 'blue';
        player.style.position = 'absolute';
        player.style.left = `${playerX}px`;
        player.style.bottom = `${playerY}px`;
    }

    function updatePlayer() {
        if (playerY > 0 || velocityY > 0) {
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
        const piece = document.createElement('div');
        piece.className = 'tetrisPiece';
        piece.style.width = '20px';
        piece.style.height = '20px';
        piece.style.backgroundColor = 'green';
        piece.style.position = 'absolute';
        piece.style.left = `${Math.random() * (gameArea.offsetWidth - 20)}px`;
        piece.style.bottom = `${gameArea.offsetHeight}px`;
        gameArea.appendChild(piece);
        currentPiece = { element: piece, x: parseFloat(piece.style.left), y: parseFloat(piece.style.bottom), stopped: false };
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
        return Array.from(gameArea.getElementsByClassName('tetrisPiece')).some(other => {
            const otherPiece = other.getBoundingClientRect();
            const thisPiece = piece.element.getBoundingClientRect();
            return piece !== currentPiece && thisPiece.bottom <= otherPiece.top &&
                   thisPiece.right > otherPiece.left && thisPiece.left < otherPiece.right;
        });
    }

    function startGame() {
        createPlayer();
        createTetrisPiece(); // Create the first Tetris piece

        gameInterval = setInterval(() => {
            updatePlayer();
            updateTetrisPiece();
        }, 20);
    }

    document.addEventListener('keydown', (e) => {
        if (!currentPiece) return; // Do nothing if no piece is falling

        switch (e.key) {
            case 'ArrowRight':
                playerX += 5;
                break;
            case 'ArrowLeft':
                playerX -= 5;
                break;
            case 'ArrowUp':
                if (playerY === 0) velocityY = 10; // Jump
                break;
            case 'a':
                currentPiece.x -= 5;
                currentPiece.element.style.left = `${currentPiece.x}px`;
                break;
            case 'd':
                currentPiece.x += 5;
                currentPiece.element.style.left = `${currentPiece.x}px`;
                break;
            case 'r':
            case 'R':
                // TODO: Implement rotation
                break;
        }
    });

    startGame();
});
