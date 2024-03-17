document.addEventListener('DOMContentLoaded', () => {
    const gameArea = document.getElementById('gameArea');
    const player = document.getElementById('player');
    const pointB = document.getElementById('pointB');
    let playerX = 100, playerY = 10;
    let velocityY = 0;
    const gravity = -0.1;
    const jumpVelocity = 7;
    const playerHeight = 60;
    const playerWidth = 20;
    let tetrisPieces = [];
    let pieceCount = 0;
    let isOnGround = false;
    let moveRight = false, moveLeft = false;
    let movePieceLeft = false, movePieceRight = false;
    let rotatePiece = false, speedUp = false;

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
        if (pieceCount < 10) {
            createTetrisPiece();
            pieceCount++;
        }
    }

    function createTetrisPiece() {
        const shapes = ['I', 'L', 'T', 'O'];
        const shape = shapes[Math.floor(Math.random() * shapes.length)];
        const piece = document.createElement('div');
        piece.className = 'tetrisPiece';
        switch (shape) {
            case 'I':
            case 'L':
                piece.style.width = shape === 'L' ? '40px' : '20px';
                piece.style.height = shape === 'L' ? '20px' : '60px';
                break;
            case 'T':
                piece.style.width = '60px';
                piece.style.height = '40px';
                break;
            case 'O':
                piece.style.width = '40px';
                piece.style.height = '40px';
                break;
        }
        piece.style.backgroundColor = 'green';
        piece.style.position = 'absolute';
        piece.style.left = `${Math.random() * (gameArea.offsetWidth - parseInt(piece.style.width))}px`;
        piece.style.bottom = `${gameArea.offsetHeight}px`;
        gameArea.appendChild(piece);

        tetrisPieces.push({
            element: piece,
            x: parseFloat(piece.style.left),
            y: parseFloat(piece.style.bottom),
            width: parseInt(piece.style.width),
            height: parseInt(piece.style.height),
            stopped: false,
            shape: shape,
            orientation: 0 // Additional property to track the orientation of the piece
        });
    }

    function rotateTetrisPiece(piece) {
        // Handle rotation based on the shape
        if (piece.shape === 'I' || piece.shape === 'L') {
            let temp = piece.width;
            piece.width = piece.height;
            piece.height = temp;
        } else if (piece.shape === 'T') {
            piece.orientation = (piece.orientation + 1) % 3;
            if (piece.orientation === 0) { // Upright
                piece.width = 60;
                piece.height = 40;
            } else if (piece.orientation === 1) { // Leftward
                piece.width = 40;
                piece.height = 60;
            } else if (piece.orientation === 2) { // Rightward
                piece.width = 40;
                piece.height = 60;
            }
        }
        // 'O' shape does not need rotation handling

        piece.element.style.width = `${piece.width}px`;
        piece.element.style.height = `${piece.height}px`;
    }

    function update() {
        velocityY += gravity;
        let newX = playerX + (moveRight ? 5 : 0) - (moveLeft ? 5 : 0);
        let newY = playerY + velocityY;

        let canMoveY = true;
        isOnGround = false;

        for (let piece of tetrisPieces) {
            if (onTopOfPiece(newX, newY, piece)) {
                canMoveY = false;
                newY = piece.y + piece.height;
                velocityY = 0;
                isOnGround = true;
                break;
            }
        }

        if (canMoveY) {
            playerY = newY >= 0 ? newY : 0;
            isOnGround = playerY === 0;
        }

        playerX = newX >= 0 ? (newX <= gameArea.offsetWidth - playerWidth ? newX : gameArea.offsetWidth - playerWidth) : 0;
        player.style.left = `${playerX}px`;
        player.style.bottom = `${playerY}px`;

        updateTetrisPieces();

        // Check if the player reached point B
        if (playerX + playerWidth > pointB.offsetLeft && playerX < pointB.offsetLeft + pointB.offsetWidth &&
            playerY + playerHeight > pointB.offsetTop && playerY < pointB.offsetTop + pointB.offsetHeight) {
            // Restart the game
            gameArea.removeChild(player);
            tetrisPieces.forEach(piece => gameArea.removeChild(piece.element));
            tetrisPieces = [];
            pieceCount = 0;
            createPlayer();
            spawnPiece();
        }
    }

    function updateTetrisPieces() {
        tetrisPieces.forEach(piece => {
            if (!piece.stopped) {
                if (movePieceLeft) piece.x -= 5;
                if (movePieceRight) piece.x += 5;
                piece.element.style.left = `${piece.x}px`;

                let speed = speedUp ? 5 : 1;
                if (rotatePiece) {
                    rotateTetrisPiece(piece);
                    rotatePiece = false;
                }

                piece.y -= speed;
                piece.element.style.bottom = `${piece.y}px`;

                if (piece.y <= 0 || intersectsAnyPiece(piece)) {
                    piece.stopped = true;
                }
            }
        });

        if (tetrisPieces.filter(p => !p.stopped).length === 0 && pieceCount < 10) {
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
            case 'a':
                movePieceLeft = true;
                break;
            case 'd':
                movePieceRight = true;
                break;
            case 'w':
                rotatePiece = true;
                break;
            case 's':
                speedUp = true;
                break;
        }
    }
    
    function keyupHandler(e) {
        if (e.key === 'ArrowRight') {
            moveRight = false;
        } else if (e.key === 'ArrowLeft') {
            moveLeft = false;
        } else if (e.key === 'a') {
            movePieceLeft = false;
        } else if (e.key === 'd') {
            movePieceRight = false;
        } else if (e.key === 's') {
            speedUp = false;
        }
        // No need to add a case for 'w' since rotation is a one-time action per key press
    }

    document.addEventListener('keydown', keydownHandler);
    document.addEventListener('keyup', keyupHandler);

    setInterval(update, 10);
});
