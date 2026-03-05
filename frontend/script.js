const inputText = document.getElementById("inputText");
const outputBox = document.getElementById("output");
const modeSelect = document.getElementById("mode");
const loader = document.getElementById("loader");

// CHARACTER + WORD COUNT
function updateCount() {
    const text = inputText.value;

    document.getElementById("charCount").innerText =
        "Characters: " + text.length + " / 2000";

    const words = text.trim() === "" ? 0 : text.trim().split(/\s+/).length;

    document.getElementById("wordCount").innerText =
        "Words: " + words;
}

// AUTO RESIZE TEXTAREA
function autoResize(textarea) {
    textarea.style.height = "auto";
    textarea.style.height = textarea.scrollHeight + "px";
}


// MAIN AI FUNCTION
async function processText() {

    const text = inputText.value.trim();
    const mode = modeSelect.value;

    if (text === "") {
        alert("Please enter text first.");
        return;
    }

    loader.classList.remove("hidden");
    outputBox.innerText = "Processing...";

    try {

        const response = await fetch("http://127.0.0.1:5000/process", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                text: text,
                mode: mode
            })
        });

        const data = await response.json();

        outputBox.innerText = data.result;

    } catch (error) {

        outputBox.innerText = "Error connecting to AI server.";
        console.error(error);

    }

    loader.classList.add("hidden");
}



// CLEAR
function clearAll() {
    inputText.value = "";
    outputBox.innerText = "";
    updateCount();
}



// COPY
function copyResponse() {

    const text = outputBox.innerText;

    if (text === "") {
        alert("Nothing to copy.");
        return;
    }

    navigator.clipboard.writeText(text);

    alert("Copied to clipboard!");
}



// DOWNLOAD
function downloadResponse() {

    const text = outputBox.innerText;

    if (text === "") {
        alert("Nothing to download.");
        return;
    }

    const blob = new Blob([text], { type: "text/plain" });

    const link = document.createElement("a");

    link.href = URL.createObjectURL(blob);

    link.download = "read-ease-output.txt";

    link.click();
}



// DARK MODE
function toggleDarkMode() {

    document.body.classList.toggle("dark");

}
