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
    let isOnGround = false;
    let moveRight = false;
    let moveLeft = false;
    let movePieceLeft = false;
    let movePieceRight = false;
    let rotatePiece = false;
    let speedUp = false;
    let pieceCounter = 0;

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
        if (pieceCounter < 10) {
            createTetrisPiece();
            pieceCounter++;
        }
    }

    function createTetrisPiece() {
        const shapes = ['I', 'L', 'T', 'Z'];
        const shape = shapes[Math.floor(Math.random() * shapes.length)];
        const piece = document.createElement('div');
        piece.className = 'tetrisPiece';
        
        // Determine size based on shape
        let pieceWidth, pieceHeight;
        switch (shape) {
            case 'I':
                pieceWidth = 20;
                pieceHeight = 60;
                break;
            case 'L':
                pieceWidth = 40;
                pieceHeight = 20;
                break;
            case 'T':
            case 'Z':
                pieceWidth = 60;
                pieceHeight = 20;
                break;
        }

        piece.style.width = `${pieceWidth}px`;
        piece.style.height = `${pieceHeight}px`;
        piece.style.backgroundColor = 'green';
        piece.style.position = 'absolute';
        piece.style.left = `${Math.random() * (gameArea.offsetWidth - pieceWidth)}px`;
        piece.style.bottom = `${gameArea.offsetHeight}px`;
        gameArea.appendChild(piece);

        tetrisPieces.push({
            element: piece,
            x: parseFloat(piece.style.left),
            y: parseFloat(piece.style.bottom),
            width: pieceWidth,
            height: pieceHeight,
            stopped: false,
            shape: shape
        });
    }

    function rotateTetrisPiece(piece) {
        if (piece.shape === 'T' || piece.shape === 'Z') {
            let temp = piece.width;
            piece.width = piece.height;
            piece.height = temp;
        } else if (piece.shape === 'I') {
            piece.shape = 'L';
            piece.width = 40;
            piece.height = 20;
        } else if (piece.shape === 'L') {
            piece.shape = 'I';
            piece.width = 20;
            piece.height = 60;
        }
        piece.element.style.width = `${piece.width}px`;
        piece.element.style.height = `${piece.height}px`;
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

        if (tetrisPieces.every(piece => piece.stopped)) {
            spawnPiece();
        }
    }

    function resetGame() {
        playerX = 100;
        playerY = 10;
        tetrisPieces.forEach(piece => gameArea.removeChild(piece.element));
        tetrisPieces = [];
        pieceCounter = 0;
        spawnPiece();
    }

    function checkPlayerReachedPointB() {
        const pointBRect = pointB.getBoundingClientRect();
        const playerRect = player.getBoundingClientRect();
        if (playerRect.right > pointBRect.left && playerRect.left < pointBRect.right &&
            playerRect.bottom < pointBRect.bottom && playerRect.top > pointBRect.top) {
            resetGame();
        }
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
        checkPlayerReachedPointB();
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
    }

    document.addEventListener('keydown', keydownHandler);
    document.addEventListener('keyup', keyupHandler);

    setInterval(update, 10);
});
