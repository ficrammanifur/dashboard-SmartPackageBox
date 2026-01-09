const API_BASE = "http://127.0.0.1:4040"; /* http://10.224.26.179:5000 */

const statusText = document.getElementById("statusText");
const logBox = document.getElementById("logBox");

function log(msg) {
  logBox.textContent += msg + "\n";
  logBox.scrollTop = logBox.scrollHeight;
}

/* === COMMAND === */

async function askName() {
  await sendCommand("ask_name");
}

async function closeBox() {
  await sendCommand("close_box");
}

async function sendName() {
  const name = document.getElementById("nameInput").value.trim();
  if (!name) {
    alert("Nama kosong");
    return;
  }
  await sendCommand("name:" + name);
}

/* === SEND TO FLASK → MQTT === */
async function sendCommand(cmd) {
  log("SEND: " + cmd);

  const res = await fetch(`${API_BASE}/mqtt_publish`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      topic: "package/chat",
      message: cmd
    })
  });

  if (!res.ok) {
    log("ERROR send command");
  }
}

/* === STATUS POLLING === */
async function pollStatus() {
  try {
    const res = await fetch(`${API_BASE}/mqtt_status`);
    const data = await res.json();

    if (data.status) {
      statusText.textContent = data.status.toUpperCase();
    }
  } catch (e) {
    statusText.textContent = "OFFLINE";
  }
}

setInterval(pollStatus, 1000);
