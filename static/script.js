document.addEventListener('DOMContentLoaded', () => {
    const inputText = document.getElementById('inputText');
    const textStats = document.getElementById('textStats');
    const modeBtns = document.querySelectorAll('.mode-btn');
    const generateBtn = document.getElementById('generateBtn');
    const btnText = document.getElementById('btnText');
    const resultContent = document.getElementById('resultContent');
    const emptyState = document.getElementById('emptyState');
    const loader = document.getElementById('loader');
    const speakBtn = document.getElementById('speakBtn');
    const historyList = document.getElementById('historyList');
    const noHistoryText = document.getElementById('noHistory');

    let currentMode = 'Summarize';
    let isSpeaking = false;

    // Word and Character counter
    function updateStats() {
        const text = inputText.value;
        const chars = text.length;
        const words = text.trim().split(/\s+/).filter(w => w.length > 0).length;
        textStats.textContent = `${words} words • ${chars} chars`;
    }
    inputText.addEventListener('input', updateStats);

    // Clear content
    document.getElementById('clearBtn').addEventListener('click', () => {
        inputText.value = '';
        updateStats();
    });

    // Toggle modes
    modeBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            modeBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentMode = btn.dataset.mode;
            if (btnText) btnText.textContent = `Generate ${currentMode}`;
        });
    });

    // Generate Request
    if (generateBtn) {
        generateBtn.addEventListener('click', async () => {
            const text = inputText.value.trim();
            if (!text) return alert('Please enter some text first.');

            emptyState.style.display = 'none';
            resultContent.style.display = 'none';
            loader.style.display = 'block';

            try {
                const response = await fetch('/api/generate', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ text: text, mode: currentMode })
                });
                
                const data = await response.json();
                loader.style.display = 'none';
                
                if (response.ok) {
                    // Update AI box
                    resultContent.textContent = data.result;
                    resultContent.style.display = 'block';

                    // DYNAMICALLY ADD TO HISTORY (Instead of reloading page)
                    if (noHistoryText) noHistoryText.remove();

                    const newHistoryLi = document.createElement('li');
                    newHistoryLi.className = 'history-item';
                    newHistoryLi.setAttribute('data-input', data.input);
                    newHistoryLi.setAttribute('data-output', data.result);
                    newHistoryLi.setAttribute('data-mode', data.mode);
                    newHistoryLi.innerHTML = `
                        <span class="badge">${data.mode}</span>
                        <p>"${data.input.substring(0, 60)}..."</p>
                    `;
                    
                    // Add listener to the newly created history item
                    addHistoryClickListener(newHistoryLi);

                    // Insert at the top of the history list
                    historyList.insertBefore(newHistoryLi, historyList.firstChild);
                } else {
                    resultContent.textContent = 'Error: ' + data.error;
                    resultContent.style.display = 'block';
                }
            } catch (error) {
                loader.style.display = 'none';
                resultContent.textContent = 'Connection error occurred.';
                resultContent.style.display = 'block';
            }
        });
    }

    // Function to handle clicking history items
    function addHistoryClickListener(element) {
        element.addEventListener('click', () => {
            const savedInput = element.getAttribute('data-input');
            const savedOutput = element.getAttribute('data-output');
            const savedMode = element.getAttribute('data-mode');

            // 1. Restore input textarea
            inputText.value = savedInput;
            updateStats();

            // 2. Restore output panel
            emptyState.style.display = 'none';
            loader.style.display = 'none';
            resultContent.textContent = savedOutput;
            resultContent.style.display = 'block';

            // 3. Highlight matched mode button
            modeBtns.forEach(b => {
                b.classList.remove('active');
                if (b.dataset.mode === savedMode) {
                    b.classList.add('active');
                    currentMode = savedMode;
                    if (btnText) btnText.textContent = `Generate ${currentMode}`;
                }
            });
        });
    }

    // Apply click listeners to all existing history loaded by Jinja
    document.querySelectorAll('.history-item').forEach(item => {
        addHistoryClickListener(item);
    });

    // Clip to clipboard
    document.getElementById('copyBtn').addEventListener('click', () => {
        if (resultContent.textContent) {
            navigator.clipboard.writeText(resultContent.textContent);
            alert('Copied to clipboard!');
        }
    });

    // Download as .txt
    document.getElementById('downloadBtn').addEventListener('click', () => {
        if (!resultContent.textContent) return;
        const blob = new Blob([resultContent.textContent], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `LumiraText_${currentMode}.txt`;
        a.click();
    });

    // TTS with Stop Toggle
    speakBtn.addEventListener('click', () => {
        if (!resultContent.textContent) return;

        if (isSpeaking) {
            window.speechSynthesis.cancel();
            isSpeaking = false;
            speakBtn.innerHTML = '<i class="fa-solid fa-volume-high"></i>';
        } else {
            const utterance = new SpeechSynthesisUtterance(resultContent.textContent);
            utterance.onend = () => {
                isSpeaking = false;
                speakBtn.innerHTML = '<i class="fa-solid fa-volume-high"></i>';
            };
            window.speechSynthesis.speak(utterance);
            isSpeaking = true;
            speakBtn.innerHTML = '<i class="fa-solid fa-circle-stop"></i>';
        }
    });

    // Speech Recognition
    const micBtn = document.getElementById('micBtn');
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.lang = 'en-US';

        micBtn.addEventListener('click', () => {
            try {
                recognition.start();
                micBtn.style.color = '#ef4444'; 
            } catch (e) {
                recognition.stop();
            }
        });

        recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript;
            inputText.value += (inputText.value ? ' ' : '') + transcript;
            updateStats();
        };

        recognition.onend = () => {
            micBtn.style.color = ''; 
        };
    } else {
        micBtn.style.display = 'none';
    }
});
