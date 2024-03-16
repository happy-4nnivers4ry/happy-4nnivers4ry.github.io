document.addEventListener('DOMContentLoaded', () => {
    const gameArea = document.getElementById('gameArea');
    const player = document.getElementById('player');
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
    let movePieceDownFaster = false;

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
            shape: shape,
            movingRight: false,
            movingLeft: false,
        });
    }

    function onTopOfPiece(playerX, playerY, piece) {
        let effectivePieceHeight = piece.height;
        if (!piece.stopped && velocityY < 0) {
            effectivePieceHeight += 20; // ground tolerance
        }
        return playerX + playerWidth > piece.x &&
               playerX < piece.x + piece.width &&
               playerY + velocityY <= piece.y + effectivePieceHeight &&
               playerY + playerHeight > piece.y;
    }

    function update() {
        velocityY += gravity;
        let newX = playerX + (moveRight ? 5 : 0) - (moveLeft ? 5 : 0);
        let newY = playerY + velocityY;
    
        let canMoveY = true;
        isOnGround = false;
    
        tetrisPieces.forEach(piece => {
            if (onTopOfPiece(newX, newY, piece)) {
                canMoveY = false;
                newY = piece.y + piece.height;
                velocityY = 0;
                isOnGround = true;
                break;
            }
        });

        if (canMoveY) {
            playerY = newY >= 0 ? newY : 0;
            isOnGround = playerY === 0;
        }

        playerX = newX >= 0 ? (newX <= gameArea.offsetWidth - playerWidth ? newX : gameArea.offsetWidth - playerWidth) : 0;
        player.style.left = `${playerX}px`;
        player.style.bottom = `${playerY}px`;
    
        updateTetrisPieces();
    }

    function updateTetrisPieces() {
        let allPiecesStopped = true;
    
        tetrisPieces.forEach(piece => {
            if (!piece.stopped) {
                allPiecesStopped = false;
                let pieceDropSpeed = movePieceDownFaster ? 2 : 1;
                piece.y -= pieceDropSpeed;
                piece.element.style.bottom = `${piece.y}px`;

                if (piece.movingRight) {
                    piece.x = Math.min(gameArea.offsetWidth - piece.width, piece.x + 5);
                    piece.element.style.left = `${piece.x}px`;
                } else if (piece.movingLeft) {
                    piece.x = Math.max(0, piece.x - 5);
                    piece.element.style.left = `${piece.x}px`;
                }

                if (piece.y <= 0 || intersectsAnyPiece(piece)) {
                    piece.stopped = true;
                }
            }
        });

        if (allPiecesStopped) {
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
            case 'W':
            case 'w':
                rotatePiece();
                break;
            case 'A':
            case 'a':
                movePieceLeft();
                break;
            case 'D':
            case 'd':
                movePieceRight();
                break;
            case 'S':
            case 's':
                movePieceDownFaster = true;
                break;
        }
    }

    function keyupHandler(e) {
        if (e.key === 'ArrowRight') {
            moveRight = false;
        } else if (e.key === 'ArrowLeft') {
            moveLeft = false;
        } else if (e.key.toLowerCase() === 's') {
            movePieceDownFaster = false;
        } else if (e.key.toLowerCase() === 'd') {
            tetrisPieces.forEach(piece => piece.movingRight = false);
        } else if (e.key.toLowerCase() === 'a') {
            tetrisPieces.forEach(piece => piece.movingLeft = false);
        }
    }

    function rotatePiece() {
        // Implement rotation logic here
    }

    function movePieceLeft() {
        tetrisPieces.forEach(piece => {
            if (!piece.stopped) piece.movingLeft = true;
        });
    }

    function movePieceRight() {
        tetrisPieces.forEach(piece => {
            if (!piece.stopped) piece.movingRight = true;
        });
    }

    document.addEventListener('keydown', keydownHandler);
    document.addEventListener('keyup', keyupHandler);

    setInterval(update, 10);
});
