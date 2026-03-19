const inputText = document.getElementById("inputText");
const output = document.getElementById("output");
const mode = document.getElementById("mode");
const loader = document.getElementById("loader");
const charCount = document.getElementById("charCount");
const wordCount = document.getElementById("wordCount");


function updateCount() {

    const text = inputText.value;

    charCount.innerText = "Characters: " + text.length + " / 2000";

    const words = text.trim() === "" ? 0 : text.trim().split(/\s+/).length;

    wordCount.innerText = "Words: " + words;
}


function autoResize(element) {

    element.style.height = "auto";
    element.style.height = element.scrollHeight + "px";
}


async function processText() {

    const text = inputText.value.trim();
    const selectedMode = window.selectedMode || "summarize";

    if(text === ""){
        alert("Please enter text first.");
        return;
    }

    loader.classList.remove("hidden");
    typeText(data.result);

    try{

        const response = await fetch("http://127.0.0.1:5000/process", {

            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                text: text,
                mode: selectedMode
            })
        });

        const data = await response.json();

        if(data.result){
            output.innerText = data.result;

            speakResponse();

        } else {
            output.innerText = "Unexpected response from server.";
        }

    } catch(error){

        output.innerText = "Error connecting to AI server.";
        console.error(error);
    }

    loader.classList.add("hidden");
}

function startVoice(){

    if(!('webkitSpeechRecognition' in window)){
        alert("Speech recognition not supported in this browser.");
        return;
    }

    const recognition = new webkitSpeechRecognition();

    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.start();

    output.innerText = "🎤 Listening... Speak now.";

    recognition.onresult = function(event){

        const transcript = event.results[0][0].transcript;

        inputText.value = transcript;

        updateCount();
        autoResize(inputText);

        output.innerText = "Voice captured. Click Generate.";
    };

    recognition.onerror = function(event){
        console.error(event.error);
        output.innerText = "❌ Voice recognition error.";
    };

    recognition.onend = function(){
        console.log("Voice recognition ended.");
    };
}

function speakResponse(){

    const text = output.innerText;

    if(text === "" || text.includes("Assistant response")){
        return;
    }

    const speech = new SpeechSynthesisUtterance(text);

    speech.lang = "en-US";
    speech.rate = 1;
    speech.pitch = 1;
    speech.volume = 1;

    window.speechSynthesis.cancel(); 
    window.speechSynthesis.speak(speech);
}

function clearAll(){

    inputText.value = "";
    output.innerText = "Assistant response will appear here...";

    updateCount();
}


// ================= COPY =================
function copyResponse(){

    const text = output.innerText;

    if(text === "" || text.includes("Assistant response")){
        alert("Nothing to copy.");
        return;
    }

    navigator.clipboard.writeText(text);

    alert("Copied to clipboard.");
}

function downloadResponse(){

    const text = output.innerText;

    if(text === "" || text.includes("Assistant response")){
        alert("Nothing to download.");
        return;
    }

    const blob = new Blob([text], {type:"text/plain"});

    const link = document.createElement("a");

    link.href = URL.createObjectURL(blob);
    link.download = "assistant_response.txt";

    link.click();
}


function toggleDarkMode(){
    document.body.classList.toggle("dark");
}

let dots = document.getElementById("dots");

setInterval(() => {

    if(dots){
        dots.innerText = dots.innerText.length >= 3 ? "." : dots.innerText + ".";
    }

}, 500);

updateCount();

function speakOutput(){

    const text = document.getElementById("output").innerText;

    if(!text || text.includes("Assistant response")){
        alert("Nothing to speak.");
        return;
    }

    const speech = new SpeechSynthesisUtterance(text);

    speech.rate = 1;
    speech.pitch = 1;

    window.speechSynthesis.speak(speech);
}

let selectedMode = "summarize";

document.querySelectorAll(".mode-card").forEach(card => {

    card.addEventListener("click", () => {

        document.querySelectorAll(".mode-card").forEach(c => c.classList.remove("active"));

        card.classList.add("active");

        selectedMode = card.getAttribute("data-mode");

    });

});

function typeText(text) {

    output.innerText = "";
    let i = 0;

    function typing() {
        if (i < text.length) {
            output.innerText += text.charAt(i);
            i++;
            setTimeout(typing, 15);
        }
    }

    typing();
}

function typeText(text) {

    output.innerText = "";
    let i = 0;

    function typing() {
        if (i < text.length) {
            output.innerText += text.charAt(i);
            i++;
            setTimeout(typing, 15);
        }
    }

    typing();
}

let typingTimer;

inputText.addEventListener("input", () => {

    clearTimeout(typingTimer);

    typingTimer = setTimeout(() => {

        output.innerText = "🤖 It looks like you paused... Need help?";

    }, 4000);

});
