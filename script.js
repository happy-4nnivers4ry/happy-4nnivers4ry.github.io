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
    let currentPiece = null;
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
        const piece = createTetrisPiece();
        currentPiece = piece;
        tetrisPieces.push(piece);
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

        return {
            element: piece,
            x: parseFloat(piece.style.left),
            y: parseFloat(piece.style.bottom),
            width: shape === 'L' ? 40 : 20,
            height: shape === 'L' ? 20 : 60,
            stopped: false,
            shape: shape
        };
    }

    function rotatePiece(piece) {
        if (piece.shape === 'L') {
            if (piece.width === 40) {
                piece.width = 20;
                piece.height = 40;
            } else {
                piece.width = 40;
                piece.height = 20;
            }
            piece.element.style.width = `${piece.width}px`;
            piece.element.style.height = `${piece.height}px`;
        }
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
    
        if (allPiecesStopped && currentPiece.stopped) {
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
                if (currentPiece && !currentPiece.stopped) {
                    rotatePiece(currentPiece);
                }
                break;
            case 'A':
                if (currentPiece && !currentPiece.stopped) {
                    currentPiece.x = Math.max(0, currentPiece.x - 10);
                    currentPiece.element.style.left = `${currentPiece.x}px`;
                }
                break;
            case 'D':
                if (currentPiece && !currentPiece.stopped) {
                    currentPiece.x = Math.min(gameArea.offsetWidth - currentPiece.width, currentPiece.x + 10);
                    currentPiece.element.style.left = `${currentPiece.x}px`;
                }
                break;
            case 'S':
                if (currentPiece && !currentPiece.stopped) {
                    currentPiece.y = Math.max(0, currentPiece.y - 10);
                    currentPiece.element.style.bottom = `${currentPiece.y}px`;
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

    setInterval(update, 10);
});
