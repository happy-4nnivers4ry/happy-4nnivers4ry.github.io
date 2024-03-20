document.addEventListener('DOMContentLoaded', () => {
    const gameArea = document.getElementById('gameArea');
    const player = document.getElementById('player');
    const pointA = document.getElementById('pointA');
    const pointB = document.getElementById('pointB');
    const scoreElement = document.getElementById('score');
    const messageElement = document.getElementById('message');
    let playerX = 100, playerY = 10;
    let velocityY = 0;
    const gravity = -0.1;
    const jumpVelocity = 7;
    const playerHeight = 20;
    const playerWidth = 20;
    let tetrisPieces = [];
    let isOnGround = false;
    let moveRight = false;
    let moveLeft = false;
    let movePieceLeft = false;
    let movePieceRight = false;
    let rotatePiece = false;
    let speedUp = false;
    let score = 0;
    let gameSpeed = 1;

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
        const shapes = ['I', 'L', 'T', 'Z', 'O'];
        const shape = shapes[Math.floor(Math.random() * shapes.length)];
        const piece = document.createElement('div');
        piece.className = 'tetrisPiece';
    
        let pieceWidth, pieceHeight;
        let pieceShape = [];
    
        switch (shape) {
            case 'I':
                pieceWidth = 80;
                pieceHeight = 20;
                pieceShape = [
                    [1, 1, 1, 1]
                ];
                break;
            case 'L':
                pieceWidth = 60;
                pieceHeight = 40;
                pieceShape = [
                    [1, 0],
                    [1, 0],
                    [1, 1]
                ];
                break;
            case 'T':
                pieceWidth = 60;
                pieceHeight = 40;
                pieceShape = [
                    [1, 1, 1],
                    [0, 1, 0]
                ];
                break;
            case 'Z':
                pieceWidth = 60;
                pieceHeight = 40;
                pieceShape = [
                    [1, 1, 0],
                    [0, 1, 1]
                ];
                break;
            case 'O':
                pieceWidth = 40;
                pieceHeight = 40;
                pieceShape = [
                    [1, 1],
                    [1, 1]
                ];
                break;
        }
    
        piece.style.width = `${pieceWidth}px`;
        piece.style.height = `${pieceHeight}px`;
        piece.style.position = 'absolute';
        piece.style.left = `${Math.random() * (gameArea.offsetWidth - pieceWidth)}px`;
        piece.style.bottom = `${gameArea.offsetHeight}px`;
    
        // Render the piece shape
        for (let row = 0; row < pieceShape.length; row++) {
            for (let col = 0; col < pieceShape[row].length; col++) {
                if (pieceShape[row][col] === 1) {
                    const block = document.createElement('div');
                    block.className = 'block';
                    block.style.position = 'absolute';
                    block.style.width = `${pieceWidth / pieceShape[row].length}px`;
                    block.style.height = `${pieceHeight / pieceShape.length}px`;
                    block.style.backgroundColor = 'green';
                    block.style.left = `${col * (pieceWidth / pieceShape[row].length)}px`;
                    block.style.bottom = `${row * (pieceHeight / pieceShape.length)}px`;
                    piece.appendChild(block);
                }
            }
        }
    
        gameArea.appendChild(piece);
    
        tetrisPieces.push({
            element: piece,
            x: parseFloat(piece.style.left),
            y: parseFloat(piece.style.bottom),
            width: pieceWidth,
            height: pieceHeight,
            stopped: false,
            shape: pieceShape
        });
    }
    

    function rotateTetrisPiece(piece) {
        const newShape = [];
        const rows = piece.shape.length;
        const cols = piece.shape[0].length;
    
        for (let col = 0; col < cols; col++) {
            const newRow = [];
            for (let row = rows - 1; row >= 0; row--) {
                newRow.push(piece.shape[row][col]);
            }
            newShape.push(newRow);
        }
    
        piece.shape = newShape;
        [piece.width, piece.height] = [piece.height, piece.width];
    
        // Clear existing blocks
        while (piece.element.firstChild) {
            piece.element.removeChild(piece.element.firstChild);
        }
    
        // Render the rotated piece shape
        for (let row = 0; row < piece.shape.length; row++) {
            for (let col = 0; col < piece.shape[row].length; col++) {
                if (piece.shape[row][col] === 1) {
                    const block = document.createElement('div');
                    block.className = 'block';
                    block.style.position = 'absolute';
                    block.style.width = `${piece.width / piece.shape[row].length}px`;
                    block.style.height = `${piece.height / piece.shape.length}px`;
                    block.style.backgroundColor = 'green';
                    block.style.left = `${col * (piece.width / piece.shape[row].length)}px`;
                    block.style.bottom = `${row * (piece.height / piece.shape.length)}px`;
                    piece.element.appendChild(block);
                }
            }
        }
    
        piece.element.style.width = `${piece.width}px`;
        piece.element.style.height = `${piece.height}px`;
    }
    
    function updateTetrisPieces() {
        tetrisPieces.forEach(piece => {
            if (!piece.stopped) {
                if (movePieceLeft && piece.x > 0) piece.x -= 5;
                if (movePieceRight && piece.x + piece.width < gameArea.offsetWidth) piece.x += 5;
                piece.element.style.left = `${piece.x}px`;
    
                let speed = speedUp ? 5 * gameSpeed : 1 * gameSpeed;
    
                if (rotatePiece && !piece.rotated) {
                    rotateTetrisPiece(piece);
                    piece.rotated = true;
                }
    
                piece.y -= speed;
                piece.element.style.bottom = `${piece.y}px`;
    
                if (piece.y <= 0 || intersectsAnyPiece(piece)) {
                    piece.stopped = true;
                    piece.y = Math.max(piece.y, 0);
                    piece.element.style.bottom = `${piece.y}px`;
                }
            }
        });
    
        if (tetrisPieces.every(piece => piece.stopped)) {
            spawnPiece();
        }
    }
    
    

    function intersectsAnyPiece(currentPiece) {
        return tetrisPieces.some(piece => {
            return currentPiece !== piece &&
                currentPiece.x < piece.x + piece.width &&
                currentPiece.x + currentPiece.width > piece.x &&
                currentPiece.y < piece.y + piece.height &&
                currentPiece.y + currentPiece.height > piece.y;
        });
    }

    function resetGame() {
        playerX = Math.random() * (gameArea.offsetWidth - playerWidth);
        playerY = 10;
        velocityY = 0;
        tetrisPieces.forEach(piece => {
            gameArea.removeChild(piece.element);
        });
        tetrisPieces = [];
        gameSpeed += 0.1;
        pointB.style.top = `${Math.random() * (gameArea.offsetHeight - 20)}px`;
        pointB.style.right = `${Math.random() * (gameArea.offsetWidth - 20)}px`;
        spawnPiece();
    }

    function checkPlayerReachedPointB() {
        const pointBRect = pointB.getBoundingClientRect();
        const playerRect = player.getBoundingClientRect();
        if (playerRect.right > pointBRect.left && playerRect.left < pointBRect.right &&
            playerRect.bottom > pointBRect.top && playerRect.top < pointBRect.bottom) {
            showSuccessMessage();
            score++;
            scoreElement.textContent = `Score: ${score}`;
            resetGame();
        }
    }
    
    
    function showSuccessMessage() {
        messageElement.textContent = 'Success!';
        messageElement.style.display = 'block';
        setTimeout(() => {
            messageElement.style.display = 'none';
        }, 2000);
    }

    function onTopOfPiece(playerX, playerY, piece) {
        return playerX + playerWidth > piece.x &&
               playerX < piece.x + piece.width &&
               playerY <= piece.y + piece.height &&
               playerY + playerHeight > piece.y;
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
        switch (e.key) {
            case 'ArrowRight':
                moveRight = false;
                break;
            case 'ArrowLeft':
                moveLeft = false;
                break;
            case 'a':
                movePieceLeft = false;
                break;
            case 'd':
                movePieceRight = false;
                break;
            case 'w':
                rotatePiece = false;
                tetrisPieces.forEach(piece => piece.rotated = false);
                break;
            case 's':
                speedUp = false;
                break;
        }
    }

    document.addEventListener('keydown', keydownHandler);
    document.addEventListener('keyup', keyupHandler);

    setInterval(update, 10);
});