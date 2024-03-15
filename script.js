document.addEventListener('DOMContentLoaded', () => {
    const gameArea = document.getElementById('gameArea');
    const player = document.getElementById('player');
    let playerX = 10, playerY = 380;
    let velocityY = 0;
    const gravity = 0.5;
    const tetrisPieces = [];

    function updatePlayer() {
        playerY += velocityY;
        velocityY += gravity;

        // Prevent the player from falling out of the game area
        if (playerY < 0) {
            playerY = 0;
            velocityY = 0;
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
        piece.style.left = `${Math.random() * (gameArea.offsetWidth - 20)}px`; // Random horizontal position
        piece.style.bottom = `${gameArea.offsetHeight}px`;
        gameArea.appendChild(piece);
        tetrisPieces.push({ element: piece, x: parseFloat(piece.style.left), y: parseFloat(piece.style.bottom) });
    }

    function updateTetrisPieces() {
        tetrisPieces.forEach(piece => {
            piece.y -= 1; // Pieces fall down
            if (piece.y < 0) piece.y = 0; // Stop at the bottom
            piece.element.style.bottom = `${piece.y}px`;
        });
    }

    // Creating 10 Tetris pieces at the start
    for (let i = 0; i < 10; i++) {
        createTetrisPiece();
    }

    setInterval(() => {
        updatePlayer();
        updateTetrisPieces();
    }, 20);

    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowRight') playerX += 5;
        if (e.key === 'ArrowLeft') playerX -= 5;
        if (e.key === 'ArrowUp' && playerY === 0) velocityY = 10; // Simple jump mechanic

        // Tetris piece control
        if (e.key === 'a' || e.key === 'A') { // Move left
            tetrisPieces.forEach(piece => {
                piece.x -= 5;
                piece.element.style.left = `${piece.x}px`;
            });
        }
        if (e.key === 'd' || e.key === 'D') { // Move right
            tetrisPieces.forEach(piece => {
                piece.x += 5;
                piece.element.style.left = `${piece.x}px`;
            });
        }
        // Implementing rotation and additional controls can be more complex and would require a more detailed piece representation.
    });
});
