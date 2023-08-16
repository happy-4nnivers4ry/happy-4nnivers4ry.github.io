function checkSecretCode() {
    const userInput = document.getElementById("secretCodeInput").value.trim().toUpperCase();
    const outputElement = document.getElementById("outputMessage");
    const randomResponses = ["keep trying", "nice try", "not that"];
    
    let message = "";

    switch(userInput) {
        case "PASSWORD1":
            message = "ANSWER1";
            break;
        case "PASSWORD2":
            message = "ANSWER2";
            break;
        case "PASSWORD3":
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
