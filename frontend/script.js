const inputText = document.getElementById("inputText");
const output = document.getElementById("output");
const mode = document.getElementById("mode");
const loader = document.getElementById("loader");
const charCount = document.getElementById("charCount");
const wordCount = document.getElementById("wordCount");


// CHARACTER + WORD COUNTER
function updateCount() {

    const text = inputText.value;

    charCount.innerText = "Characters: " + text.length + " / 2000";

    const words = text.trim() === "" ? 0 : text.trim().split(/\s+/).length;

    wordCount.innerText = "Words: " + words;

}


// AUTO RESIZE TEXTAREA
function autoResize(element) {

    element.style.height = "auto";
    element.style.height = element.scrollHeight + "px";

}


// MAIN AI PROCESS FUNCTION
async function processText() {

    const text = inputText.value.trim();
    const selectedMode = mode.value;

    if(text === ""){
        alert("Please enter text first.");
        return;
    }

    loader.classList.remove("hidden");
    output.innerText = "";

    try{

        const response = await fetch("http://127.0.0.1:5000/process",{

            method:"POST",
            headers:{
                "Content-Type":"application/json"
            },

            body:JSON.stringify({
                text:text,
                mode:selectedMode
            })

        });

        const data = await response.json();

        output.innerText = data.result;

    }
    catch(error){

        output.innerText = "Error connecting to AI server.";
        console.error(error);

    }

    loader.classList.add("hidden");

}


// VOICE INPUT FUNCTION
function startVoice(){

    if(!('webkitSpeechRecognition' in window)){
        alert("Speech recognition not supported in this browser.");
        return;
    }

    const recognition = new webkitSpeechRecognition();

    recognition.lang = "en-US";
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.start();

    recognition.onstart = function(){
        output.innerText = "🎤 Listening... Speak now.";
    };

    recognition.onresult = function(event){

        const transcript = event.results[0][0].transcript;

        inputText.value = transcript;

        updateCount();
        autoResize(inputText);

        output.innerText = "Voice captured. Click Generate.";

    };

    recognition.onerror = function(event){
        console.error("Speech recognition error:", event.error);
        output.innerText = "Voice recognition error.";
    };

}


// CLEAR BUTTON
function clearAll(){

    inputText.value = "";
    output.innerText = "Assistant response will appear here...";

    updateCount();

}


// COPY BUTTON
function copyResponse(){

    const text = output.innerText;

    if(text === "" || text === "Assistant response will appear here..."){
        alert("Nothing to copy.");
        return;
    }

    navigator.clipboard.writeText(text);

    alert("Copied to clipboard.");

}


// DOWNLOAD BUTTON
function downloadResponse(){

    const text = output.innerText;

    if(text === "" || text === "Assistant response will appear here..."){
        alert("Nothing to download.");
        return;
    }

    const blob = new Blob([text],{type:"text/plain"});

    const link = document.createElement("a");

    link.href = URL.createObjectURL(blob);

    link.download = "assistant_response.txt";

    link.click();

}


// DARK MODE
function toggleDarkMode(){

    document.body.classList.toggle("dark");

}


// LOADER ANIMATION
let dots = document.getElementById("dots");

setInterval(()=>{

    if(dots){
        dots.innerText = dots.innerText.length >= 3 ? "." : dots.innerText + ".";
    }

},500);


// INITIAL COUNT
updateCount();
