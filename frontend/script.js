const inputText = document.getElementById("inputText");
const outputText = document.getElementById("outputText");

const summarizeBtn = document.getElementById("summarizeBtn");
const clearBtn = document.getElementById("clearBtn");
const copyBtn = document.getElementById("copyBtn");
const downloadBtn = document.getElementById("downloadBtn");


// SUMMARIZE BUTTON
summarizeBtn.addEventListener("click", async () => {

    const text = inputText.value.trim();

    if(text === ""){
        alert("Please enter text first.");
        return;
    }

    outputText.value = "Processing...";

    try{

        const response = await fetch("http://127.0.0.1:5000/summarize", {
            method: "POST",
            headers:{
                "Content-Type":"application/json"
            },
            body: JSON.stringify({
                text:text
            })
        });

        const data = await response.json();

        outputText.value = data.summary;

    }
    catch(error){

        outputText.value = "Error connecting to AI server.";

        console.error(error);

    }

});



// CLEAR BUTTON
clearBtn.addEventListener("click", () => {

    inputText.value = "";
    outputText.value = "";

});



// COPY BUTTON
copyBtn.addEventListener("click", () => {

    if(outputText.value === ""){
        alert("Nothing to copy.");
        return;
    }

    navigator.clipboard.writeText(outputText.value);

    alert("Summary copied to clipboard.");

});



// DOWNLOAD BUTTON
downloadBtn.addEventListener("click", () => {

    if(outputText.value === ""){
        alert("Nothing to download.");
        return;
    }

    const blob = new Blob([outputText.value], {type:"text/plain"});

    const link = document.createElement("a");

    link.href = URL.createObjectURL(blob);

    link.download = "summary.txt";

    link.click();

});
