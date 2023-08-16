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

        if (snakeX == food.x && snakeY == food.y) {
            score++;
            food = {
                x: Math.floor(Math.random() * 15) * box,
                y: Math.floor(Math.random() * 15) * box
            };
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

        if (snakeX < 0 || snakeY < 0 || snakeX >= canvas.width || snakeY >= canvas.height || collision(newHead, snake)) {
            clearInterval(game);
            startSnakeGame();
        }

        snake.unshift(newHead);

        if(score == 10) {
            clearInterval(game);
            document.getElementById("outputMessage").innerText = "ANSWER2";
            canvas.style.display = 'none';
        }
    }

    let game = setInterval(draw, 100);
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
            message = "ANSWER1";
            break;
        case "TRES AYERES":
            document.getElementById('snakeGame').style.display = 'block';
            startSnakeGame();
            break;
        case "PASSWORD0":
            message = "ANSWER3";
            break;
        default:
            message = randomResponses[Math.floor(Math.random() * randomResponses.length)];
    }
    
    outputElement.innerText = message;
}


function showHint() {
    const hintElement = document.getElementById("hintMessage");
    hintElement.innerText = "This is your first hint: [PLACEHOLDER]";
}
