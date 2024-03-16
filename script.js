document.addEventListener('DOMContentLoaded', () => {
    const gameArea = document.getElementById('gameArea');
    const player = document.getElementById('player');
    let playerX = 100, playerY = 10;
    let velocityY = 0;
    const gravity = -0.1;
    const jumpVelocity = 8;
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


    const groundTolerance = 30;
    
    function onTopOfPiece(playerX, playerY, piece) {
        let effectivePieceHeight = piece.height;
        
        // Apply tolerance only if the piece is not stopped and the player is falling
        if (!piece.stopped && velocityY < 0) {
            effectivePieceHeight += groundTolerance;
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
        for (let piece of tetrisPieces) {
            if (onTopOfPiece(newX, newY, piece)) {
                canMoveY = false;
                newY = piece.stopped ? piece.y + piece.height : piece.y + piece.height + groundTolerance - playerHeight;
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
    }

    function updateTetrisPieces() {
        let allPiecesStopped = true;
    
        tetrisPieces.forEach(piece => {
            if (!piece.stopped) {
                allPiecesStopped = false;
                piece.y -= 1;
                piece.element.style.bottom = `${piece.y}px`;
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

    setInterval(update, 5);
});
