/* static/js/main.js */
document.addEventListener('DOMContentLoaded', () => {
    // --- Elements ---
    const inputText = document.getElementById('inputText');
    const textStats = document.getElementById('textStats');
    const clearBtn = document.getElementById('clearBtn');
    const generateBtn = document.getElementById('generateBtn');
    const btnText = document.getElementById('btnText');
    const modeButtons = document.querySelectorAll('.mode-btn');
    const historyList = document.getElementById('historyList');
    const noHistory = document.getElementById('noHistory');

    // Output Elements
    const emptyState = document.getElementById('emptyState');
    const resultContent = document.getElementById('resultContent');
    const loader = document.getElementById('loader');
    const copyBtn = document.getElementById('copyBtn');

    // --- NEW ELEMENTS FOR MIC, SPEAKER, DOWNLOAD ---
    const micBtn = document.getElementById('micBtn');
    const speakBtn = document.getElementById('speakBtn');
    const downloadBtn = document.getElementById('downloadBtn');

    // State
    let currentMode = 'Summarize';
    let isProcessing = false;
    let isSpeaking = false; // Track TTS state

    // --- Core Functions ---

    // 1. Text Statistics
    const updateStats = () => {
        const text = inputText.value;
        const charCount = text.length;
        const wordCount = text.trim() === '' ? 0 : text.trim().split(/\s+/).length;
        textStats.textContent = `${wordCount} words • ${charCount} chars`;
    };

    // 2. Clear Text
    const clearText = () => {
        inputText.value = '';
        updateStats();
        inputText.focus();
    };

    // 3. Mode Selection
    const handleModeChange = (e) => {
        modeButtons.forEach(btn => btn.classList.remove('active'));
        const clickedBtn = e.currentTarget;
        clickedBtn.classList.add('active');
        currentMode = clickedBtn.getAttribute('data-mode');
        btnText.textContent = `Generate ${currentMode}`;
    };

    // 4. API Call & History Update
    const generateContent = async () => {
        const text = inputText.value;
        if (!text || isProcessing) return;

        isProcessing = true;
        showLoading();

        try {
            const response = await fetch('/api/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    text: text,
                    mode: currentMode
                }),
            });

            const data = await response.json();

            if (response.ok) {
                showResult(data.result);
                addHistoryItem(data);
            } else {
                showError(data.error || 'Something went wrong.');
            }
        } catch (error) {
            showError('Failed to connect to server.');
        } finally {
            isProcessing = false;
        }
    };

    // --- Helper Functions (UI Updates) ---

    const showLoading = () => {
        generateBtn.disabled = true;
        btnText.textContent = 'Processing...';
        emptyState.style.display = 'none';
        resultContent.style.display = 'none';
        loader.style.display = 'block';
    };

    const showResult = (text) => {
        generateBtn.disabled = false;
        btnText.textContent = `Generate ${currentMode}`;

        // 1. Hide the loader
        loader.style.display = 'none';

        // 2. Hide the empty placeholder state explicitly
        if (emptyState) {
            emptyState.style.display = 'none';
        }

        // 3. Set and show the actual content
        resultContent.textContent = text;
        resultContent.style.display = 'block';
    };

    const showError = (message) => {
        generateBtn.disabled = false;
        btnText.textContent = `Generate ${currentMode}`;
        loader.style.display = 'none';
        resultContent.innerHTML = `<span style="color: #ef4444;">Error: ${message}</span>`;
        resultContent.style.display = 'block';
    };

    const addHistoryItem = (data) => {
        if (noHistory) noHistory.remove();
        const li = document.createElement('li');
        li.className = 'history-item';
        li.setAttribute('data-input', data.input);
        li.setAttribute('data-output', data.result);
        li.setAttribute('data-mode', data.mode);
        const truncatedInput = data.input.length > 60 ? data.input.substring(0, 60) + '...' : data.input;
        li.innerHTML = `<span class="badge">${data.mode}</span><p>"${truncatedInput}"</p>`;
        li.addEventListener('click', restoreFromHistory);
        historyList.prepend(li);
    };

    // 5. Restore from History
    const restoreFromHistory = (e) => {
        const item = e.currentTarget;
        const input = item.getAttribute('data-input');
        const output = item.getAttribute('data-output');
        const mode = item.getAttribute('data-mode');
        inputText.value = input;
        updateStats();
        showResult(output);
        modeButtons.forEach(btn => {
            if (btn.getAttribute('data-mode') === mode) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });
        currentMode = mode;
        btnText.textContent = `Generate ${currentMode}`;
    };

    // 6. Copy Output
    const copyOutput = () => {
        const text = resultContent.textContent;
        if (!text) return;
        navigator.clipboard.writeText(text).then(() => {
            copyBtn.innerHTML = '<i class="fa-solid fa-check"></i>';
            setTimeout(() => {
                copyBtn.innerHTML = '<i class="fa-regular fa-copy"></i>';
            }, 2000);
        });
    };

    // --- NEW: VOICE INPUT (MIC) ---
    const startMic = () => {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRecognition) {
            alert("Your browser does not support Voice Input. Please use Chrome.");
            return;
        }

        const recognition = new SpeechRecognition();
        recognition.lang = 'en-US';

        recognition.onstart = () => {
            micBtn.style.color = "#ff1f5b"; // Visual feedback
            micBtn.innerHTML = '<i class="fa-solid fa-microphone-lines"></i>';
        };

        recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript;
            inputText.value += (inputText.value ? ' ' : '') + transcript;
            updateStats();
        };

        recognition.onerror = () => {
            alert("Microphone error. Ensure you allowed access.");
        };

        recognition.onend = () => {
            micBtn.style.color = "";
            micBtn.innerHTML = '<i class="fa-solid fa-microphone"></i>';
        };

        recognition.start();
    };

    // --- NEW: TEXT TO SPEECH (SPEAKER) ---
    const toggleSpeech = () => {
        const text = resultContent.textContent;
        if (!text || text.includes("Error:")) return;

        if (isSpeaking) {
            window.speechSynthesis.cancel();
            isSpeaking = false;
            speakBtn.innerHTML = '<i class="fa-solid fa-volume-high"></i>';
            speakBtn.style.color = "";
        } else {
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.onend = () => {
                isSpeaking = false;
                speakBtn.innerHTML = '<i class="fa-solid fa-volume-high"></i>';
                speakBtn.style.color = "";
            };
            window.speechSynthesis.speak(utterance);
            isSpeaking = true;
            speakBtn.innerHTML = '<i class="fa-solid fa-circle-stop"></i>';
            speakBtn.style.color = "#ff1f5b";
        }
    };

    // --- NEW: DOWNLOAD AS TXT ---
    const downloadTxt = () => {
        const text = resultContent.textContent;
        if (!text || text.includes("Error:")) return;

        const blob = new Blob([text], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `ReadEase_${currentMode}_Result.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    // --- Event Listeners ---
    inputText.addEventListener('input', updateStats);
    clearBtn.addEventListener('click', clearText);
    generateBtn.addEventListener('click', generateContent);
    copyBtn.addEventListener('click', copyOutput);
    modeButtons.forEach(btn => btn.addEventListener('click', handleModeChange));

    // NEW LISTENERS
    micBtn.addEventListener('click', startMic);
    speakBtn.addEventListener('click', toggleSpeech);
    downloadBtn.addEventListener('click', downloadTxt);

    const existingHistoryItems = document.querySelectorAll('.history-item');
    existingHistoryItems.forEach(item => item.addEventListener('click', restoreFromHistory));
});
