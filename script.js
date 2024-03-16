document.addEventListener('DOMContentLoaded', () => {
    const gameArea = document.getElementById('gameArea');
    const player = document.getElementById('player');
    let playerX = 100, playerY = 10;
    let velocityY = 0;
    const gravity = -0.2;
    const jumpVelocity = 10;
    const playerHeight = 60;
    const playerWidth = 20;
    let tetrisPieces = [];
    let isOnGround = false;
    let moveRight = false;
    let moveLeft = false;

    createPlayer();
    spawnPiece();

    function createPlayer() {
        player.style.width = `${playerWidth}px`;
        player.style.height = `${playerHeight}px`;
        player.style.backgroundColor = 'blue';
        player.style.position = 'absolute';
        player.style.left = `${playerX}px`;
        player.style.bottom = `${playerY}px`;
        player.style.zIndex = '10';
        gameArea.appendChild(player);
    }

    function spawnPiece() {
        createTetrisPiece();
    }

    function createTetrisPiece() {
        const shapes = ['I', 'L'];
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

        tetrisPieces.push({
            element: piece,
            x: parseFloat(piece.style.left),
            y: parseFloat(piece.style.bottom),
            width: shape === 'L' ? 40 : 20,
            height: shape === 'L' ? 20 : 60,
            stopped: false,
            shape: shape
        });
    }

    function update() {
        velocityY += gravity;
        let newX = playerX + (moveRight ? 5 : 0) - (moveLeft ? 5 : 0);
        let newY = playerY + velocityY;

        // Reset ground status
        isOnGround = false;

        // Check for collisions
        tetrisPieces.forEach(piece => {
            if (isColliding(newX, newY, playerWidth, playerHeight, piece)) {
                handleCollision(newX, newY, piece);
            }
        });

        // Update player position
        playerX = Math.max(0, Math.min(gameArea.offsetWidth - playerWidth, newX));
        playerY = Math.max(0, newY);
        player.style.left = `${playerX}px`;
        player.style.bottom = `${playerY}px`;

        updateTetrisPieces();
    }

    function isColliding(playerX, playerY, playerWidth, playerHeight, piece) {
        return playerX < piece.x + piece.width &&
               playerX + playerWidth > piece.x &&
               playerY < piece.y + piece.height &&
               playerY + playerHeight > piece.y;
    }

    function handleCollision(newX, newY, piece) {
        // Player is above the piece
        if (newY - velocityY >= piece.y + piece.height) {
            playerY = piece.y + piece.height;
            velocityY = 0;
            isOnGround = true;
        }
        // Player is colliding from the sides
        else if (newX < piece.x + piece.width && newX + playerWidth > piece.x) {
            playerX = moveRight ? piece.x - playerWidth : piece.x + piece.width;
        }
    }

    function updateTetrisPieces() {
        tetrisPieces.forEach(piece => {
            if (!piece.stopped) {
                piece.y -= 1;
                piece.element.style.bottom = `${piece.y}px`;
                if (piece.y <= 0 || intersectsAnyPiece(piece)) {
                    piece.stopped = true;
                }
            }
        });

        if (tetrisPieces.every(piece => piece.stopped)) {
            spawnPiece();
        }
    }

    function intersectsAnyPiece(piece) {
        return tetrisPieces.some(otherPiece => 
            piece !== otherPiece &&
            intersects(piece.x, piece.y, piece.width, piece.height, otherPiece.x, otherPiece.y, otherPiece.width, otherPiece.height));
    }

    function intersects(x1, y1, w1, h1, x2, y2, w2, h2) {
        return !(x2 >= x1 + w1 || x2 + w2 <= x1 || y2 >= y1 + h1 || y2 + h2 <= y1);
    }

    function keydownHandler(e) {
        switch (e.key) {
            case 'ArrowRight':
                moveRight = true;
                break;
            case 'ArrowLeft':
                moveLeft = true;
                break;
            case 'ArrowUp':
                if (isOnGround) {
                    velocityY = jumpVelocity;
                    isOnGround = false;
                }
                break;
        }
    }

    function keyupHandler(e) {
        if (e.key === 'ArrowRight') {
            moveRight = false;
        } else if (e.key === 'ArrowLeft') {
            moveLeft = false;
        }
    }

    document.addEventListener('keydown', keydownHandler);
    document.addEventListener('keyup', keyupHandler);

    setInterval(update, 20);
});
