document.getElementById("simplifyBtn").addEventListener("click", function() {
    let input = document.getElementById("inputText").value;
    let output = "Simplified version of: " + input;
    document.getElementById("outputText").innerText = output;
});

document.getElementById("speakBtn").addEventListener("click", function() {
    let text = document.getElementById("outputText").innerText;
    let speech = new SpeechSynthesisUtterance(text);
    window.speechSynthesis.speak(speech);
});
