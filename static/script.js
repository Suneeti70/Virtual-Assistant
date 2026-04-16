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

    // State
    let currentMode = 'Summarize';
    let isProcessing = false;

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
        // Remove active class from all
        modeButtons.forEach(btn => btn.classList.remove('active'));

        // Add to clicked
        const clickedBtn = e.currentTarget;
        clickedBtn.classList.add('active');

        // Update state and button text
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
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    text: text,
                    mode: currentMode
                }),
            });

            const data = await response.json();

            if (response.ok) {
                showResult(data.result);
                // Add new entry to top of history list dynamically
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
        loader.style.display = 'none';
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
        // Remove 'No history' text if it exists
        if (noHistory) noHistory.remove();

        const li = document.createElement('li');
        li.className = 'history-item';

        // Store data as attributes for restoration
        li.setAttribute('data-input', data.input);
        li.setAttribute('data-output', data.result);
        li.setAttribute('data-mode', data.mode);

        const truncatedInput = data.input.length > 60 ? data.input.substring(0, 60) + '...' : data.input;

        li.innerHTML = `
            <span class="badge">${data.mode}</span>
            <p>"${truncatedInput}"</p>
        `;

        // Add event listener to new item
        li.addEventListener('click', restoreFromHistory);

        historyList.prepend(li);
    };

    // 5. Restore from History
    const restoreFromHistory = (e) => {
        const item = e.currentTarget;
        const input = item.getAttribute('data-input');
        const output = item.getAttribute('data-output');
        const mode = item.getAttribute('data-mode');

        // Update Input
        inputText.value = input;
        updateStats();

        // Update Output
        showResult(output);

        // Update Mode Button
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
            // Optional: Show a brief "Copied!" notification
            copyBtn.innerHTML = '<i class="fa-solid fa-check"></i>';
            setTimeout(() => {
                copyBtn.innerHTML = '<i class="fa-regular fa-copy"></i>';
            }, 2000);
        });
    };

    // --- Event Listeners ---
    inputText.addEventListener('input', updateStats);
    clearBtn.addEventListener('click', clearText);
    generateBtn.addEventListener('click', generateContent);
    copyBtn.addEventListener('click', copyOutput);
    modeButtons.forEach(btn => btn.addEventListener('click', handleModeChange));

    // Add listeners to existing history items loaded on page start
    const existingHistoryItems = document.querySelectorAll('.history-item');
    existingHistoryItems.forEach(item => item.addEventListener('click', restoreFromHistory));
});
