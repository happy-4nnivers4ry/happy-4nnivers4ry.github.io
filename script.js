function checkSecretCode() {
    const userInput = document.getElementById("secretCodeInput").value;
    const outputElement = document.getElementById("outputMessage");

    if (userInput === "ABCD") {
        outputElement.innerText = "The secret answer is: OpenAI is cool!";
    } else {
        outputElement.innerText = "Wrong code!";
    }
}
