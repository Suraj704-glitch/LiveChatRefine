// List of common doubts to simulate student behavior
const doubtPool = [
    "What is React?", "How to use Trie?", "Explain Priority Queue",
    "What is React?", "I don't understand Trie", "How to use Trie?",
    "What is React?", "Node.js vs Express?", "Trie vs Map?",
    "What is React?", "Please explain Trie again", "How to use Trie?"
];

let currentChunk = [];
let timeLeft = 10;

// 1. Simulate a student sending a chat every 1.5 seconds
setInterval(() => {
    const randomDoubt = doubtPool[Math.floor(Math.random() * doubtPool.length)];
    currentChunk.push(randomDoubt);

    // Update the UI "Stream"
    const stream = document.getElementById('chat-stream');
    const msg = document.createElement('div');
    msg.className = "p-2 border-bottom small";
    msg.innerHTML = `<strong>Student:</strong> ${randomDoubt}`;
    stream.prepend(msg);
}, 1500);

// 2. The "Chunking" Timer: Every 10 seconds, send data to Backend
setInterval(() => {
    timeLeft--;
    document.getElementById('timer-badge').innerText = `Next update in: ${timeLeft}s`;

    if (timeLeft <= 0) {
        sendChunkToBackend();
        timeLeft = 10;
    }
}, 1000);

// 3. API Call to your Node.js MVC Controller
async function sendChunkToBackend() {
    if (currentChunk.length === 0) return;

    try {
        const response = await fetch('/doubts/analyze', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ chatChunk: currentChunk })
        });

        const result = await response.json();
        
        if (result.status === "success") {
            renderTopDoubts(result.data);
            currentChunk = []; // CLEAR DATA FROM PQ/CHUNK (as per your logic)
        }
    } catch (err) {
        console.error("Error sending chunk:", err);
    }
}

function renderTopDoubts(doubts) {
    const container = document.getElementById('top-doubts-container');
    container.innerHTML = ""; // Clear old processed data

    if (doubts.length === 0) {
        container.innerHTML = "<p>No common patterns found yet.</p>";
        return;
    }

    doubts.forEach((item, index) => {
        const div = document.createElement('div');
        div.className = "alert alert-info d-flex justify-content-between align-items-center";
        div.innerHTML = `
            <span><strong>#${index + 1}</strong>: ${item.text}</span>
            <span class="badge bg-primary rounded-pill">${item.count} students asked this</span>
        `;
        container.appendChild(div);
    });
}