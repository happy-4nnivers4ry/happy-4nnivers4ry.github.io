
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
    let movePieceLeft = false;
    let movePieceRight = false;
    let rotatePiece = false;
    let speedUp = false;
    
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


    const groundTolerance = 20;
    
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
        isOnGround = false;  // Assume not on ground until proven otherwise
    
        for (let piece of tetrisPieces) {
            if (onTopOfPiece(newX, newY, piece)) {
                canMoveY = false;
                newY = piece.y + piece.height;  // Player should be on top of the piece
                velocityY = 0;
                isOnGround = true;  // Player is on a piece, hence on ground
                break;
            }
        }
    
        if (canMoveY) {
            playerY = newY >= 0 ? newY : 0;
            // If the player is not moving vertically and is on the bottom, consider it on the ground
            isOnGround = playerY === 0;
        }
    
        playerX = newX >= 0 ? (newX <= gameArea.offsetWidth - playerWidth ? newX : gameArea.offsetWidth - playerWidth) : 0;
        player.style.left = `${playerX}px`;
        player.style.bottom = `${playerY}px`;
    
        updateTetrisPieces();
    }

    function rotateTetrisPiece(piece) {
        // For simplicity, toggle between 'I' and 'L' shapes. Implement as needed.
        if (piece.shape === 'I') {
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
        let allPiecesStopped = true;
    
        tetrisPieces.forEach(piece => {
            if (!piece.stopped) {
                allPiecesStopped = false;
                
                // Move the piece left or right
                if (movePieceLeft) piece.x -= 5;
                if (movePieceRight) piece.x += 5;
                piece.element.style.left = `${piece.x}px`;
    
                // Speed up the piece's descent
                let speed = speedUp ? 5 : 1;
    
                // Rotate the piece
                if (rotatePiece) {
                    rotateTetrisPiece(piece);
                    rotatePiece = false; // Reset after rotation
                }
    
                piece.y -= speed;
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
