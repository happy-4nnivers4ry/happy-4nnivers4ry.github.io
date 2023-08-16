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
        case "CATORCE AYERES":
            message = "ANSWER2";
            break;
        case "CODIGO SUPER SECRETO":
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
