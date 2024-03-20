document.addEventListener('DOMContentLoaded', () => {
    const gameArea = document.getElementById('gameArea');
    const player = document.getElementById('player');
    const pointB = document.getElementById('pointB');
    const scoreElement = document.getElementById('score');
    const messageElement = document.getElementById('message');
    const timerElement = document.getElementById('timer');
    const highScoreElement = document.getElementById('highScore');
    let playerX = 100, playerY = 10;
    let velocityY = 0;
    const gravity = -0.1;
    let jumpVelocity = 5;
    const playerHeight = 20;
    const playerWidth = 20;
    let tetrisPieces = [];
    let spikes = [];
    let powerUps = [];
    let platforms = [];
    let isOnGround = false;
    let moveRight = false;
    let moveLeft = false;
    let movePieceLeft = false;
    let movePieceRight = false;
    let rotatePiece = false;
    let speedUp = false;
    let score = 0;
    let gameSpeed = 1;
    let piecesSpawned = 0;
    let isInvincible = false;
    let invincibilityTimeout;
    let levelTimeout;
    let timeRemaining = 5000;
    let highScore = 0;
    let monster = null;
    let monsterSpeed = 1;
    let startTime;
    let elapsedTime = 0;

    createPlayer();
    spawnPiece();
    spawnSpikes();
    spawnPowerUps();
    spawnPlatforms();
    startTimer();

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
        if (piecesSpawned < 10) {
            createTetrisPiece();
            piecesSpawned++;
        }
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
    
        if (tetrisPieces.every(piece => piece.stopped) && piecesSpawned < 10) {
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
        spikes.forEach(spike => {
            gameArea.removeChild(spike);
        });
        spikes = [];
        powerUps.forEach(powerUp => {
            gameArea.removeChild(powerUp.element);
        });
        powerUps = [];
        platforms.forEach(platform => {
            gameArea.removeChild(platform.element);
        });
        platforms = [];
        gameSpeed *= 1.2;
        piecesSpawned = 0;
        isInvincible = false;
        clearTimeout(invincibilityTimeout);
        pointB.style.top = `${Math.min(Math.random() * (gameArea.offsetHeight * 0.2), gameArea.offsetHeight * 0.2)}px`;
        pointB.style.right = `${Math.random() * (gameArea.offsetWidth - 20)}px`;
        spawnPiece();
        spawnSpikes();
        spawnPowerUps();
        spawnPlatforms();
        startTimer();


        if (monster) {
            gameArea.removeChild(monster);
        }
        createMonster();
        
        startTime = Date.now();
        elapsedTime = 0;
        timeRemaining = 30 / gameSpeed;
        updateTimer();
    }

    function createMonster() {
        monster = document.createElement('div');
        monster.className = 'monster';
        monster.style.position = 'absolute';
        monster.style.width = '30px';
        monster.style.height = '30px';
        monster.style.backgroundColor = 'orange';
        monster.style.left = `${Math.random() * (gameArea.offsetWidth - 30)}px`;
        monster.style.bottom = `${Math.random() * (gameArea.offsetHeight - 30)}px`;
        gameArea.appendChild(monster);
    }

    function updateMonster() {
        const monsterRect = monster.getBoundingClientRect();
        const playerRect = player.getBoundingClientRect();

        let dx = playerRect.left - monsterRect.left;
        let dy = playerRect.bottom - monsterRect.bottom;
        const distance = Math.sqrt(dx * dx + dy * dy);

        dx /= distance;
        dy /= distance;

        const newX = monsterRect.left + dx * monsterSpeed;
        const newY = monsterRect.bottom + dy * monsterSpeed;

        monster.style.left = `${newX}px`;
        monster.style.bottom = `${newY}px`;
    }

    function checkPlayerCollidesWithMonster() {
        if (isInvincible) return;

        const playerRect = player.getBoundingClientRect();
        const monsterRect = monster.getBoundingClientRect();

        if (playerRect.right > monsterRect.left && playerRect.left < monsterRect.right &&
            playerRect.bottom > monsterRect.top && playerRect.top < monsterRect.bottom) {
            resetGame();
        }
    }

    function updateTimer() {
        elapsedTime = (Date.now() - startTime) / 1000;
        timeRemaining = Math.max(0, 30 / gameSpeed - elapsedTime);
        timerElement.textContent = `Time: ${timeRemaining.toFixed(1)}s`;

        if (timeRemaining <= 0) {
            resetGame();
        }
    }

    function checkPlayerReachedPointB() {
        const pointBRect = pointB.getBoundingClientRect();
        const playerRect = player.getBoundingClientRect();
        if (playerRect.right > pointBRect.left && playerRect.left < pointBRect.right &&
            playerRect.bottom > pointBRect.top && playerRect.top < pointBRect.bottom) {
            showSuccessMessage();
            score++;
            scoreElement.textContent = `Score: ${score}`;
            if (score > highScore) {
                highScore = score;
                highScoreElement.textContent = `High Score: ${highScore}`;
            }
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

    function spawnSpikes() {
        const numSpikes = Math.floor(Math.random() * 2) + 1;
        for (let i = 0; i < numSpikes; i++) {
            const spike = document.createElement('div');
            spike.className = 'spike';
            spike.style.position = 'absolute';
            spike.style.width = '20px';
            spike.style.height = '20px';
            spike.style.backgroundColor = 'purple';
            spike.style.left = `${Math.random() * (gameArea.offsetWidth - 20)}px`;
            spike.style.bottom = `${Math.random() * (gameArea.offsetHeight - 20)}px`;
            gameArea.appendChild(spike);
            spikes.push(spike);
        }
    }

    function checkPlayerCollidesWithSpike() {
        if (isInvincible) return;

        const playerRect = player.getBoundingClientRect();
        for (let spike of spikes) {
            const spikeRect = spike.getBoundingClientRect();
            if (playerRect.right > spikeRect.left && playerRect.left < spikeRect.right &&
                playerRect.bottom > spikeRect.top && playerRect.top < spikeRect.bottom) {
                resetGame();
                break;
            }
        }
    }

    function spawnPowerUps() {
        const numPowerUps = Math.floor(Math.random() * 2) + 1;
        for (let i = 0; i < numPowerUps; i++) {
            const powerUp = document.createElement('div');
            powerUp.className = 'powerUp';
            powerUp.style.position = 'absolute';
            powerUp.style.width = '20px';
            powerUp.style.height = '20px';
            powerUp.style.backgroundColor = 'yellow';
            powerUp.style.left = `${Math.random() * (gameArea.offsetWidth - 20)}px`;
            powerUp.style.bottom = `${Math.random() * (gameArea.offsetHeight - 20)}px`;
            gameArea.appendChild(powerUp);
            powerUps.push({
                element: powerUp,
                type: Math.random() < 0.5 ? 'jump' : 'invincibility'
            });
        }
    }

    function checkPlayerCollidesPowerUp() {
        const playerRect = player.getBoundingClientRect();
        for (let i = 0; i < powerUps.length; i++) {
            const powerUpRect = powerUps[i].element.getBoundingClientRect();
            if (playerRect.right > powerUpRect.left && playerRect.left < powerUpRect.right &&
                playerRect.bottom > powerUpRect.top && playerRect.top < powerUpRect.bottom) {
                activatePowerUp(powerUps[i].type);
                gameArea.removeChild(powerUps[i].element);
                powerUps.splice(i, 1);
                break;
            }
        }
    }

    function activatePowerUp(type) {
        if (type === 'jump') {
            jumpVelocity = 8;
            setTimeout(() => {
                jumpVelocity = 5;
            }, 5000);
        } else if (type === 'invincibility') {
            isInvincible = true;
            player.style.backgroundColor = 'orange';
            invincibilityTimeout = setTimeout(() => {
                isInvincible = false;
                player.style.backgroundColor = 'blue';
            }, 5000);
        }
    }

    function spawnPlatforms() {
        const numPlatforms = Math.floor(Math.random() * 3) + 1;
        for (let i = 0; i < numPlatforms; i++) {
            const platform = document.createElement('div');
            platform.className = 'platform';
            platform.style.position = 'absolute';
            platform.style.width = '80px';
            platform.style.height = '10px';
            platform.style.backgroundColor = 'gray';
            platform.style.left = `${Math.random() * (gameArea.offsetWidth - 80)}px`;
            platform.style.bottom = `${Math.random() * (gameArea.offsetHeight - 20)}px`;
            gameArea.appendChild(platform);
            platforms.push({
                element: platform,
                x: parseFloat(platform.style.left),
                y: parseFloat(platform.style.bottom),
                width: 80,
                height: 10,
                speed: Math.random() * 2 + 1
            });
        }
    }

    function updatePlatforms() {
        platforms.forEach(platform => {
            platform.x += platform.speed;
            if (platform.x > gameArea.offsetWidth) {
                platform.x = -platform.width;
            }
            platform.element.style.left = `${platform.x}px`;
        });
    }

    function onTopOfPlatform(playerX, playerY, platform) {
        return playerX + playerWidth > platform.x &&
               playerX < platform.x + platform.width &&
               playerY <= platform.y + platform.height &&
               playerY + playerHeight > platform.y;
    }

    function startTimer() {
        timerElement.textContent = `Time: ${timeRemaining}ms`;
        levelTimeout = setTimeout(() => {
            resetGame();
        }, timeRemaining * 1000);
    }

    function updateTimer() {
        timeRemaining--;
        timerElement.textContent = `Time: ${timeRemaining}s`;
        if (timeRemaining <= 0) {
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

        for (let platform of platforms) {
            if (onTopOfPlatform(newX, newY, platform)) {
                canMoveY = false;
                newY = platform.y + platform.height;
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
        updatePlatforms();
        checkPlayerReachedPointB();
        checkPlayerCollidesWithSpike();
        checkPlayerCollidesPowerUp();
        updateMonster();
        checkPlayerCollidesWithMonster();
        updateTimer();
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
