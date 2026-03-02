const inputText = document.getElementById("inputText");
const output = document.getElementById("output");
const loader = document.getElementById("loader");
const charCount = document.getElementById("charCount");
const wordCount = document.getElementById("wordCount");
const actionBtn = document.getElementById("actionBtn");
const mode = document.getElementById("mode");
const dots = document.getElementById("dots");

let dotInterval;

/* Character Counter */
function updateCount() {
    let text = inputText.value;
    charCount.innerHTML = "Characters: " + text.length + " / 2000";
    wordCount.innerHTML = "Words: " + (text.trim() === "" ? 0 : text.trim().split(/\s+/).length);
}

/* Auto Resize */
function autoResize(textarea) {
    textarea.style.height = "auto";
    textarea.style.height = textarea.scrollHeight + "px";
}

/* Thinking animation */
function startThinking() {
    loader.classList.remove("hidden");
    let count = 1;
    dotInterval = setInterval(() => {
        count = (count % 3) + 1;
        dots.innerText = ".".repeat(count);
    }, 400);
}

function stopThinking() {
    loader.classList.add("hidden");
    clearInterval(dotInterval);
}

/* Process Text */
function processText() {
    let text = inputText.value.trim();
    if (text === "") {
        output.innerHTML = "<span style='color:red;'>Please enter text first.</span>";
        return;
    }

    startThinking();
    actionBtn.disabled = true;

    setTimeout(() => {
        let response = "";

        switch (mode.value) {
            case "summarize":
                response = text.substring(0, 200) + "...";
                break;
            case "explain":
                response = "This text explains that: " + text.substring(0, 180) + "...";
                break;
            case "improve":
                response = text.charAt(0).toUpperCase() + text.slice(1) + " (Improved tone and clarity)";
                break;
            case "translate":
                response = "Simplified: " + text.substring(0, 180) + "...";
                break;
        }

        output.innerHTML = response;
        stopThinking();
        actionBtn.disabled = false;

    }, 1500);
}

/* Copy */
function copyResponse() {
    let text = output.innerText;
    if (text.includes("Assistant response")) return;

    navigator.clipboard.writeText(text);
    actionBtn.innerText = "Copied ✓";
    setTimeout(() => {
        actionBtn.innerText = "Generate";
    }, 1500);
}

/* Download */
function downloadResponse() {
    let text = output.innerText;
    if (text.includes("Assistant response")) return;

    let blob = new Blob([text], { type: "text/plain" });
    let link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "assistant-response.txt";
    link.click();
}

/* Clear */
function clearAll() {
    inputText.value = "";
    output.innerHTML = "Assistant response will appear here...";
    updateCount();
}

/* Dark Mode */
function toggleDarkMode() {
    document.body.classList.toggle("dark");
}
