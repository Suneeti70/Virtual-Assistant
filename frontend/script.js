const inputText = document.getElementById("inputText");
const outputBox = document.getElementById("output");
const modeSelect = document.getElementById("mode");

const loader = document.getElementById("loader");


// MAIN AI FUNCTION
async function processText() {

    const text = inputText.value.trim();

    if(text === ""){
        alert("Please enter text first.");
        return;
    }

    loader.classList.remove("hidden");
    outputBox.innerText = "";

    try{

        const response = await fetch("http://127.0.0.1:5000/summarize",{

            method:"POST",

            headers:{
                "Content-Type":"application/json"
            },

            body: JSON.stringify({
                text:text,
                mode:modeSelect.value
            })

        });

        const data = await response.json();

        outputBox.innerText = data.summary;

    }

    catch(error){

        outputBox.innerText = "Error connecting to AI server.";

        console.error(error);

    }

    loader.classList.add("hidden");

}



function clearAll(){

    inputText.value = "";
    outputBox.innerText = "";

    updateCount();

}



function copyResponse(){

    const text = outputBox.innerText;

    if(text === ""){
        alert("Nothing to copy.");
        return;
    }

    navigator.clipboard.writeText(text);

    alert("Response copied.");

}



function downloadResponse(){

    const text = outputBox.innerText;

    if(text === ""){
        alert("Nothing to download.");
        return;
    }

    const blob = new Blob([text],{type:"text/plain"});

    const link = document.createElement("a");

    link.href = URL.createObjectURL(blob);

    link.download = "response.txt";

    link.click();

}



function updateCount(){

    const text = inputText.value;

    document.getElementById("charCount").innerText =
        "Characters: " + text.length + " / 2000";

    const words = text.trim().split(/\s+/).filter(word => word.length > 0);

    document.getElementById("wordCount").innerText =
        "Words: " + words.length;

}



function autoResize(textarea){

    textarea.style.height = "auto";
    textarea.style.height = textarea.scrollHeight + "px";

}



// DARK MODE
function toggleDarkMode(){

    document.body.classList.toggle("dark");

}
