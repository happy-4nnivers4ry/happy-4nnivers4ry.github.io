let game;  // Declare the game interval variable outside the function to ensure it's accessible

function startSnakeGame() {
    const canvas = document.getElementById('snakeGame');
    const context = canvas.getContext('2d');
    const box = 20;
    let score = 0;
    let snake = [];
    snake[0] = { x: 10 * box, y: 10 * box };
    let food = {
        x: Math.floor(Math.random() * 15) * box,
        y: Math.floor(Math.random() * 15) * box
    };
    let d;

    function getSpeed() {
        return Math.max(100 - (snake.length * 2), 50);
    }

    document.addEventListener("keydown", direction);

    function direction(event) {
        if (event.keyCode == 37 && d != "RIGHT") d = "LEFT";
        if (event.keyCode == 38 && d != "DOWN") d = "UP";
        if (event.keyCode == 39 && d != "LEFT") d = "RIGHT";
        if (event.keyCode == 40 && d != "UP") d = "DOWN";
    }

    function draw() {
        context.clearRect(0, 0, canvas.width, canvas.height);

        for (let i = 0; i < snake.length; i++) {
            context.fillStyle = (i == 0) ? "green" : "white";
            context.fillRect(snake[i].x, snake[i].y, box, box);
            context.strokeStyle = "black";
            context.strokeRect(snake[i].x, snake[i].y, box, box);
        }

        context.fillStyle = "red";
        context.fillRect(food.x, food.y, box, box);

        let snakeX = snake[0].x;
        let snakeY = snake[0].y;

        if (d == "LEFT") snakeX -= box;
        if (d == "UP") snakeY -= box;
        if (d == "RIGHT") snakeX += box;
        if (d == "DOWN") snakeY += box;

        // Logic for the snake to go through walls
        if (snakeX < -1) snakeX = canvas.width - box;
        if (snakeY < -1) snakeY = canvas.height - box;
        if (snakeX >= canvas.width) snakeX = 0;
        if (snakeY >= canvas.height) snakeY = 0;

        if (snakeX == food.x && snakeY == food.y) {
            score++;
            food = {
                x: Math.floor(Math.random() * 15) * box,
                y: Math.floor(Math.random() * 15) * box
            };
            clearInterval(game);  // Clear the current interval
            game = setInterval(gameLoop, getSpeed());  // Set a new interval with adjusted speed
        } else {
            snake.pop();
        }

        let newHead = {
            x: snakeX,
            y: snakeY
        };

        function collision(head, array) {
            for (let i = 0; i < array.length; i++) {
                if (head.x == array[i].x && head.y == array[i].y) {
                    return true;
                }
            }
            return false;
        }

        if (collision(newHead, snake)) {
            clearInterval(game);
            startSnakeGame();
        }

        snake.unshift(newHead);

        if(score == 10) {
            clearInterval(game);
            document.getElementById("outputMessage").innerText = "El siguiente tesoro está en Vollspark Fshain. Si usás la entrada de Danziger Straße, vas a ver un camino que te permite caminar de manera totalmente recta. Seguilo hasta que se termine. El tesoro va a estar a cinco metros de donde se termina, en el suelo.";
            canvas.style.display = 'none';
        }
    }

    function gameLoop() {
        draw();

        // Adjust the game speed here
        clearInterval(game);
        game = setInterval(gameLoop, getSpeed());
    }
}


function startArkanoidGame() {
    const gameElement = document.getElementById('arkanoidGame');
    const width = 40;
    const height = 20;
    let ball = { x: 20, y: 18, dx: 1, dy: -1 };
    let paddle = { x: 18, y: 19, dx: 0 };
    let bricks = [
        { x: 5, y: 5, type: 'double' },
        { x: 15, y: 5, type: 'simple' },
        { x: 25, y: 5, type: 'double' },
        { x: 10, y: 7, type: 'simple' },
        { x: 20, y: 7, type: 'simple' },
        { x: 30, y: 7, type: 'double' },
        { x: 5, y: 9, type: 'simple' },
        { x: 15, y: 9, type: 'double' },
        { x: 25, y: 9, type: 'simple' },
        { x: 20, y: 11, type: 'double' }
    ];

    document.addEventListener("keydown", function(event) {
        if (event.keyCode == 37) paddle.dx = -2;
        if (event.keyCode == 39) paddle.dx = 2;
    });

    document.addEventListener("keyup", function(event) {
        if (event.keyCode == 37 || event.keyCode == 39) paddle.dx = 0;
    });

    function draw() {
        let display = Array(height).fill(null).map(row => Array(width).fill(' '));
        
        // Draw ball
        display[ball.y][ball.x] = 'o';
        
        // Draw paddle
        display[paddle.y][paddle.x] = '=';
        display[paddle.y][paddle.x + 1] = '=';
        display[paddle.y][paddle.x + 2] = '=';
        display[paddle.y][paddle.x + 3] = '=';
        display[paddle.y][paddle.x + 4] = '=';

        // Draw bricks
        for (let brick of bricks) {
            display[brick.y][brick.x] = '[';
            display[brick.y][brick.x + 1] = brick.type === 'double' ? 'X' : ' ';
            display[brick.y][brick.x + 2] = brick.type === 'double' ? 'X' : ' ';
            display[brick.y][brick.x + 3] = ']';
        }

        gameElement.textContent = display.map(row => row.join('')).join('\n');
    }

    function update() {
        ball.x += ball.dx;
        ball.y += ball.dy;
        paddle.x += paddle.dx;

        // Ball collisions with walls
        if (ball.x <= 0 || ball.x >= width - 1) ball.dx = -ball.dx;
        if (ball.y <= 0) ball.dy = -ball.dy;

        // Ball collision with paddle
        if (ball.y === paddle.y && ball.x >= paddle.x && ball.x <= paddle.x + 4) ball.dy = -ball.dy;

        // Ball collision with bricks
        for (let i = 0; i < bricks.length; i++) {
            if (ball.y === bricks[i].y && ball.x >= bricks[i].x && ball.x <= bricks[i].x + 3) {
                ball.dy = -ball.dy;
                if (bricks[i].type === 'double') {
                    bricks[i].type = 'simple';
                } else {
                    bricks.splice(i, 1);
                }
                break;
            }
        }

        // Game over condition
        if (ball.y >= height) {
            clearInterval(gameInterval);
            startArkanoidGame();
        }

        // Winning condition
        if (bricks.length === 0) {
            clearInterval(gameInterval);
            gameElement.style.display = 'none';
            document.getElementById("outputMessage").innerText = "El último tesoro está muy cerca...de casa. Bajá, y caminá por el jardín interno del edificio. El tesoro está en el piso, escondido debajo de unas piedras.";
        }
    }

    function gameLoop() {
        update();
        draw();
    }

    const gameInterval = setInterval(gameLoop, 100);
}



function checkSecretCode() {
    const userInput = document.getElementById("secretCodeInput").value.trim().toUpperCase();
    const outputElement = document.getElementById("outputMessage");
    const randomResponses = ["nop", "casi", "eso no", "segui intentando",
                             "posta, no te va a salir por fuerza bruta", "dale, juga en serio",
                             "no se supone que puedas adivinar", "no", "eso tampoco", "jaja no eso no",
                            "ninguna de estas respuestas te da una pista", "bueno ok el primer codigo es `MAÑANA`, no, mentira"];
    
    let message = "";

    switch(userInput) {
        case "DOS MAÑANAS":
            message = "El siguiente tesoro está en Vollskark Prenzlauer Berg. Si vas a la parada del M5, vas a ver un camino de tierra que empieza muy, muy angosto, que te lleva al parque. Seguí por el camino de tierra hasta que se termine. Ahí, a tu derecha, entre los arbustos y los árboles, está el segundo tesoro.";
            break;
        case "TRES AYERES":
            document.getElementById('snakeGame').style.display = 'block';
            startSnakeGame();
            break;
        case "PASSWORD0":
            document.getElementById('arkanoidGame').style.display = 'block';
            startArkanoidGame();
            break;
        default:
            message = randomResponses[Math.floor(Math.random() * randomResponses.length)];
    }
    
    outputElement.innerText = message;
}


function showHint() {
    const hintElement = document.getElementById("hintMessage");
    hintElement.innerText = "El primer tesoro está en el parque que no te gusta que tiene un lago chiquito. Si caminás alrededor del agua, cerca de dos bancos gigantes hay un árbol trillizo. El tesoro está escondido dentro del árbol.";
}
