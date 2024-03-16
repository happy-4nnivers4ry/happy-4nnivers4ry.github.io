document.addEventListener('DOMContentLoaded', () => {
    const gameArea = document.getElementById('gameArea');
    const player = document.getElementById('player');
    let playerX = 100, playerY = 10;
    let velocityY = 0;
    const gravity = -0.2;
    const playerHeight = 60;
    const playerWidth = 20; // Define playerWidth here
    let tetrisPieces = [];
    let currentPiece = null;
    let pieceCount = 0;
    let isOnGround = true;
    let moveRight = false;
    let moveLeft = false;

    createPlayer();
    spawnPiece();


    function createPlayer() {
        player.style.width = '20px';
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
        currentPiece = {
            element: piece,
            x: parseFloat(piece.style.left),
            y: parseFloat(piece.style.bottom),
            width: shape === 'L' ? 40 : 20,
            height: shape === 'L' ? 20 : 60,
            stopped: false,
            shape: shape
        };
        tetrisPieces.push(currentPiece);
    }
    function update() {
        velocityY += gravity;
    
        let newX = playerX + (moveRight ? 5 : 0) - (moveLeft ? 5 : 0);
        let newY = playerY + velocityY;
    
        let moveCheck = canMoveTo(newX, newY);
    
        if (moveCheck.vertical) {
            // Prevent the player from going below the floor level
            playerY = newY >= 0 ? newY : 0;
            if (playerY === 0) {
                velocityY = 0; // Stop vertical movement when hitting the floor
                isOnGround = true;
            }
        } else {
            velocityY = 0;
            if (newY < playerY) {
                let landingPiece = findLandingPiece(newX, playerY);
                if (landingPiece) {
                    playerY = landingPiece.y + landingPiece.height;
                } else {
                    // If there's no piece and player is going below the floor, set to floor level
                    playerY = newY >= 0 ? newY : 0;
                    if (playerY === 0) {
                        isOnGround = true;
                    }
                }
            }
        }
    
        if (moveCheck.horizontal) {
            playerX = newX;
        }
    
        isOnGround = !moveCheck.vertical && newY <= playerY;
    
        player.style.left = `${playerX}px`;
        player.style.bottom = `${playerY}px`;
    
        updateTetrisPieces();
    }
    
    
    function findLandingPiece(playerX, playerY) {
        for (let piece of tetrisPieces) {
            if (playerX < piece.x + piece.width && playerX + 20 > piece.x && // 20 is player's width
                playerY >= piece.y && playerY <= piece.y + piece.height) {
                return piece;
            }
        }
        return null;
    }
    
    function canMoveTo(newX, newY) {
        let canMoveHorizontally = true;
        let canMoveVertically = true;
    
        for (let piece of tetrisPieces) {
            if (intersects(newX, newY, 20, playerHeight, piece.x, piece.y, piece.width, piece.height)) {
                if (newY - playerHeight < piece.y + piece.height && playerY - playerHeight >= piece.y) {
                    canMoveVertically = false;
                } else {
                    canMoveHorizontally = newX === playerX;
                }
            }
        }
    
        return { horizontal: canMoveHorizontally, vertical: canMoveVertically };
    }
    

    function onTopOfPiece(playerX, playerY, piece) {
        return playerX < piece.x + piece.width &&
               playerX + playerWidth > piece.x &&
               playerY >= piece.y + piece.height &&
               playerY <= piece.y + piece.height + 10; // Use a small threshold to detect if on top
    }
    
    function updateTetrisPieces() {
        if (currentPiece && !currentPiece.stopped) {
            currentPiece.y -= 1;
            if (currentPiece.y <= 0 || intersectsAnyPiece(currentPiece.x, currentPiece.y, currentPiece)) {
                currentPiece.stopped = true;
                currentPiece = null;
                spawnPiece();
            }
            currentPiece.element.style.bottom = `${currentPiece.y}px`;
        }
    }
    

    

    function intersectsAnyPiece(x, y, excludePiece) {
        for (let piece of tetrisPieces) {
            if (piece !== excludePiece && intersects(x, y, excludePiece.width, excludePiece.height, piece.x, piece.y, piece.width, piece.height)) {
                return true;
            }
        }
        return false;
    }

    function intersects(x1, y1, w1, h1, x2, y2, w2, h2) {
        return !(x2 >= x1 + w1 || x2 + w2 <= x1 || y2 >= y1 + h1 || y2 + h2 <= y1);
    }

    function keydownHandler(e) {
        if (e.key === 'ArrowRight') {
            moveRight = true;
        } else if (e.key === 'ArrowLeft') {
            moveLeft = true;
        } else if (e.key === 'ArrowUp' && isOnGround) {
            velocityY = 10; // Adjust the jump strength
            isOnGround = false;
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
