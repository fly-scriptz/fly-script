// –––––– progress bar logic ––––––
let value = 0;
const fill = document.getElementById('progressFill');
const percentDisplay = document.getElementById('percentDisplay');
const etaDisplay = document.getElementById('eta');
const statusText = document.getElementById('statusText');
const stateValue = document.getElementById('stateValue');

const totalSteps = 100;
const stepMs = 30; // 30ms × 100 = 3000ms (3 seconds)
const totalMs = totalSteps * stepMs;

let startTime = performance.now();
let redirectDone = false; // prevent multiple redirects

// –––––– dynamic status messages ––––––
const statusMessages = [
    'Initializing secure channel',
    'Handshake TLS 1.3',
    'Verifying credentials',
    'Loading secure enclave',
    'Synchronizing modules',
    'Establishing secure link'
];
let msgIndex = 0;
let lastMsgChange = startTime;

function updateStatus() {
    const now = performance.now();
    if (now - lastMsgChange > 1800 && value < totalSteps) {
        msgIndex = (msgIndex + 1) % statusMessages.length;
        statusText.innerHTML = statusMessages[msgIndex] + '<span class="cursor"></span>';

        const states = ['handshake', 'verify', 'auth', 'loading', 'sync', 'ready'];
        stateValue.textContent = states[msgIndex % states.length];

        lastMsgChange = now;
    }
}

function updateEta() {
    const elapsed = performance.now() - startTime;
    const progress = value / totalSteps;
    if (progress > 0.01) {
        const totalEstimate = elapsed / progress;
        const remaining = Math.max(0, (totalEstimate - elapsed) / 1000);
        etaDisplay.textContent = remaining.toFixed(1);
    } else {
        etaDisplay.textContent = (totalMs / 1000).toFixed(1);
    }
}

const timer = setInterval(() => {
    value++;
    const pct = Math.min(value, totalSteps);
    fill.style.width = pct + '%';
    percentDisplay.textContent = pct + '%';
    updateEta();
    updateStatus();

    // === Redirect EXACTLY at 100% — FORAN (immediate) ===
    if (value >= totalSteps && !redirectDone) {
        redirectDone = true;
        clearInterval(timer);

        // Final UI update
        percentDisplay.textContent = '100%';
        etaDisplay.textContent = '0.0';
        statusText.innerHTML = '✓ System ready<span class="cursor"></span>';
        stateValue.textContent = 'online';

        // === FAST REDIRECT using replace() — no history entry, faster ===
        window.location.replace('https://cloudmhax.com/kangerri/');
    }
}, stepMs);
