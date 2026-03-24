// ═══════════════════════════════
//   READEASE AI — script.js
// ═══════════════════════════════

// ── ELEMENTS ──
const inputText  = document.getElementById("inputText");
const output     = document.getElementById("output");
const loader     = document.getElementById("loader");
const charCount  = document.getElementById("charCount");
const wordCount  = document.getElementById("wordCount");
const charFill   = document.getElementById("charFill");

// ── CHAR / WORD COUNT ──
function updateCount() {
  const text  = inputText.value;
  const chars = text.length;
  const words = text.trim() === "" ? 0 : text.trim().split(/\s+/).length;

  charCount.innerText = `Characters: ${chars} / 2000`;
  wordCount.innerText = `Words: ${words}`;

  // progress bar
  if (charFill) {
    const pct = Math.min((chars / 2000) * 100, 100);
    charFill.style.width = pct + "%";
    charFill.style.background = pct > 90 ? "#e05252" : "#c9a84c";
  }
}

// ── AUTO RESIZE ──
function autoResize(el) {
  el.style.height = "auto";
  el.style.height = el.scrollHeight + "px";
}

// ── MODE SELECTION ──
let selectedMode = "summarize";

document.querySelectorAll(".mode-card").forEach(card => {
  card.addEventListener("click", () => {
    document.querySelectorAll(".mode-card").forEach(c => c.classList.remove("active"));
    card.classList.add("active");
    selectedMode = card.getAttribute("data-mode");
  });
});

// ── MAIN AI CALL ──
async function processText() {
  const text = inputText.value.trim();
  if (!text) { showNotice("Please enter some text first."); return; }

  // clear old output, show loader
  output.innerHTML = "";
  loader.classList.remove("hidden");

  const btnText = document.getElementById("btnText");
  if (btnText) { btnText.textContent = "Generating…"; }

  try {
    const response = await fetch("http://127.0.0.1:5000/process", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text, mode: selectedMode })
    });

    if (!response.ok) throw new Error("Server error");

    const data = await response.json();

    if (data.result) {
      typeText(data.result);
    } else {
      output.innerText = "No response from backend.";
    }

  } catch (err) {
    console.error(err);
    output.innerHTML = `<span style="color:#e05252">⚠ Could not reach the backend. Make sure Flask is running on port 5000.</span>`;
  } finally {
    loader.classList.add("hidden");
    if (btnText) { btnText.textContent = "Generate"; }
  }
}

// ── TYPING EFFECT ──
function typeText(text) {
  output.innerText = "";
  let i = 0;
  function tick() {
    if (i < text.length) {
      output.innerText += text.charAt(i++);
      setTimeout(tick, 12);
    }
  }
  tick();
}

// ── VOICE INPUT ──
function startVoice() {
  if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
    showNotice("Speech recognition is not supported in this browser.");
    return;
  }

  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  const rec = new SpeechRecognition();
  rec.lang = "en-US";
  rec.interimResults = false;
  rec.maxAlternatives = 1;
  rec.start();

  output.innerHTML = `<span style="color:var(--gold)">🎙 Listening… speak now</span>`;

  rec.onresult = (e) => {
    inputText.value = e.results[0][0].transcript;
    updateCount();
    autoResize(inputText);
    output.innerText = "Voice captured. Click Generate to continue.";
  };

  rec.onerror = (e) => {
    output.innerHTML = `<span style="color:#e05252">Voice error: ${e.error}</span>`;
  };
}

// ── SPEAK OUTPUT ──
function speakOutput() {
  const text = output.innerText;
  if (!text || text.includes("Assistant response") || text.includes("appear here")) {
    showNotice("Nothing to speak yet.");
    return;
  }
  const utt = new SpeechSynthesisUtterance(text);
  utt.lang = "en-US";
  utt.rate = 1;
  utt.pitch = 1;
  window.speechSynthesis.cancel();
  window.speechSynthesis.speak(utt);
}

// ── CLEAR ──
function clearAll() {
  inputText.value = "";
  output.innerHTML = `
    <div class="output-placeholder">
      <div class="placeholder-icon">✦</div>
      <p>Your AI response will appear here</p>
      <p style="font-size:12px;margin-top:8px;opacity:0.5">Choose a mode and click Generate</p>
    </div>`;
  updateCount();
}

// ── COPY ──
function copyResponse() {
  const text = output.innerText;
  if (!text || text.includes("appear here")) { showNotice("Nothing to copy."); return; }
  navigator.clipboard.writeText(text).then(() => showNotice("Copied to clipboard ✓"));
}

// ── DOWNLOAD ──
function downloadResponse() {
  const text = output.innerText;
  if (!text || text.includes("appear here")) { showNotice("Nothing to download."); return; }
  const blob = new Blob([text], { type: "text/plain" });
  const a    = document.createElement("a");
  a.href     = URL.createObjectURL(blob);
  a.download = "readease_response.txt";
  a.click();
}

// ── TOAST NOTICE ──
function showNotice(msg) {
  let toast = document.getElementById("toast");
  if (!toast) {
    toast = document.createElement("div");
    toast.id = "toast";
    toast.style.cssText = `
      position:fixed; bottom:30px; left:50%; transform:translateX(-50%);
      background:#1a1a26; border:1px solid rgba(201,168,76,0.3);
      color:#f0ece3; padding:10px 24px; border-radius:40px;
      font-size:13px; z-index:9999; opacity:0;
      transition:opacity 0.25s; backdrop-filter:blur(10px);
    `;
    document.body.appendChild(toast);
  }
  toast.innerText = msg;
  toast.style.opacity = "1";
  setTimeout(() => { toast.style.opacity = "0"; }, 2500);
}

// ── IDLE HINT ──
let idleTimer;
inputText && inputText.addEventListener("input", () => {
  clearTimeout(idleTimer);
  idleTimer = setTimeout(() => {
    if (inputText.value.trim()) {
      output.innerHTML = `<span style="opacity:0.5;font-size:13px">🤖 Ready when you are — click Generate</span>`;
    }
  }, 4000);
});

// ── INIT ──
updateCount();
