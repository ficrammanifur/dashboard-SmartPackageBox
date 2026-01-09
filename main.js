// 🔧 GANTI DENGAN URL BACKEND FLASK KAMU
const API_BASE = "https://PASTE-BACKEND-URL-KAMU";

let currentTab = "chat";

function showTab(tab) {
  document.querySelectorAll(".tab-content").forEach(t => t.classList.remove("active"));
  document.querySelectorAll(".tab-btn").forEach(b => b.classList.remove("active"));

  document.getElementById(tab).classList.add("active");
  document.querySelector(`[data-tab="${tab}"]`).classList.add("active");

  currentTab = tab;
  if (tab === "dashboard") updateStatus();
}

function toggleTheme() {
  const theme = document.documentElement.getAttribute("data-theme") === "dark" ? "light" : "dark";
  document.documentElement.setAttribute("data-theme", theme);
  localStorage.setItem("theme", theme);
  document.querySelector(".theme-icon").textContent = theme === "dark" ? "☀️" : "🌙";
}

function sendChat() {
  const msg = document.getElementById("message").value.trim();
  if (!msg) return;

  fetch(`${API_BASE}/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      message: msg,
      input_type: "text",
      user_id: "web-user"
    })
  })
    .then(res => res.json())
    .then(data => {
      const log = document.getElementById("chat-log");

      log.innerHTML += `
        <div class="chat-message">
          <p><strong>You:</strong></p>
          <p>${escapeHtml(msg)}</p>
        </div>
        <div class="chat-message">
          <p><strong>AI:</strong></p>
          <p>${escapeHtml(data.text)}</p>
        </div>
      `;

      log.scrollTop = log.scrollHeight;

      if (data.audio_url) {
        const audio = document.getElementById("tts-player");
        audio.src = API_BASE + data.audio_url + "?t=" + Date.now();
        audio.play();
      }
    })
    .catch(err => console.error(err));

  document.getElementById("message").value = "";
}

function sendCommand(cmd) {
  const payload = { command: cmd };
  if (cmd === "name") payload.name = document.getElementById("name-input").value;

  fetch(`${API_BASE}/command`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  })
    .then(res => res.json())
    .then(d => alert(d.success ? "✓ Perintah dikirim" : "✗ Gagal"))
    .catch(console.error);
}

function updateStatus() {
  fetch(`${API_BASE}/status`)
    .then(res => res.json())
    .then(data => {
      const ul = document.getElementById("status-log");
      ul.innerHTML = "";
      data.statuses.forEach(s => {
        const li = document.createElement("li");
        li.textContent = s;
        ul.appendChild(li);
      });
    });
}

function escapeHtml(text) {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}

document.addEventListener("DOMContentLoaded", () => {
  const theme = localStorage.getItem("theme");
  if (theme) document.documentElement.setAttribute("data-theme", theme);
  showTab("chat");
});
