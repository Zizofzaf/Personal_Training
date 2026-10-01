const TRACKS = [
  {
    id: "ir",
    name: "Incident Response",
    weeklyTarget: 12,
    type: "DEFENSIVE ANALYSIS",
    roadmap: [
      ["Basics", ["IR lifecycle", "IOC vs IOA", "MITRE ATT&CK basics", "Windows basics", "Linux basics", "Networking basics"]],
      ["Windows", ["Event Logs", "Sysmon", "Registry", "Scheduled Tasks", "Prefetch", "Amcache", "LNK / Jump Lists"]],
      ["Forensics", ["Disk imaging", "Timeline analysis", "Autopsy", "FTK Imager", "KAPE", "Volatility 3"]],
      ["Network", ["Wireshark", "PCAP analysis", "DNS", "HTTP", "TLS", "Beaconing / C2"]],
      ["Cases", ["Phishing", "Malware infection", "Credential theft", "Ransomware", "Lateral movement", "Data exfiltration"]],
      ["Reporting", ["Attack timeline", "Determine scope", "Extract IOCs", "ATT&CK mapping", "Technical report"]]
    ]
  },
  {
    id: "malware",
    name: "Malware Analysis",
    weeklyTarget: 8,
    type: "REVERSE ENGINEERING",
    roadmap: [
      ["Foundation", ["CPU / registers", "Stack / heap", "x86 / x64", "Windows API"]],
      ["PE & Windows", ["Processes / threads", "DLLs", "Virtual memory", "PE headers", "Imports / exports", "IAT / RVA"]],
      ["Static", ["Hashes", "Strings", "PEStudio", "Detect It Easy", "FLOSS", "capa"]],
      ["Dynamic", ["Procmon", "Process Explorer", "TCPView", "Wireshark", "FakeNet-NG", "Regshot"]],
      ["Reverse Engineering", ["x64dbg", "WinDbg basics", "Ghidra", "IDA basics", "Control flow", "Cross references"]],
      ["Advanced", ["Packing", "Unpacking", "Obfuscation", "Anti-debugging", "Shellcode", "Config extraction", "YARA"]]
    ]
  },
  {
    id: "cti",
    name: "Cyber Threat Intelligence",
    weeklyTarget: 6,
    type: "THREAT RESEARCH",
    roadmap: [
      ["Foundation", ["Intelligence lifecycle", "Tactical / operational / strategic CTI", "Intelligence requirements"]],
      ["IOC & OSINT", ["IP / domain / URL / hash", "WHOIS", "DNS", "Passive DNS", "Certificates", "ASN"]],
      ["Threat Actors", ["APT groups", "Cybercrime groups", "Ransomware groups", "Vendor naming differences"]],
      ["MITRE ATT&CK", ["Tactics", "Techniques", "Sub-techniques", "ATT&CK Navigator"]],
      ["Infrastructure", ["Domain pivoting", "IP pivoting", "ASN relationships", "Infrastructure clustering"]],
      ["Reporting", ["Campaign timeline", "Confidence levels", "IOC table", "ATT&CK mapping", "Technical report"]]
    ]
  },
  {
    id: "core",
    name: "Core Foundations",
    weeklyTarget: 4,
    type: "FOUNDATION",
    roadmap: [
      ["Systems", ["Windows", "Linux", "Processes / services", "Users / permissions"]],
      ["Networking", ["TCP/IP", "DNS", "HTTP", "TLS", "SMB", "RDP"]],
      ["Scripting", ["Python", "PowerShell", "Bash", "Git", "Regex", "JSON", "SQL"]],
      ["Security", ["Hashing", "Encoding", "Base64", "Logs", "Sysmon", "MITRE ATT&CK"]],
      ["Mindset", ["Build timelines", "Validate assumptions", "Correlate artifacts", "Document evidence", "Assign confidence"]]
    ]
  }
];

const KEY = "simpleTrainingTrackerV1";
let state = { sessions: [], completed: {} };

function load() {
  const saved = localStorage.getItem(KEY);
  if (saved) {
    try { state = JSON.parse(saved); } catch {}
  }
}

function save() {
  localStorage.setItem(KEY, JSON.stringify(state));
}

function weekStart() {
  const d = new Date();
  const diff = (d.getDay() + 6) % 7;
  d.setHours(0,0,0,0);
  d.setDate(d.getDate() - diff);
  return d;
}

function hours(trackId, weekly=false) {
  const start = weekStart();
  return state.sessions
    .filter(s => s.trackId === trackId)
    .filter(s => !weekly || new Date(s.date) >= start)
    .reduce((a,b) => a + b.duration, 0);
}

function total(weekly=false) {
  const start = weekStart();
  return state.sessions
    .filter(s => !weekly || new Date(s.date) >= start)
    .reduce((a,b) => a + b.duration, 0);
}

function fmt(v) {
  const h = Math.floor(v || 0);
  const m = Math.round(((v || 0) - h) * 60);
  if (!h && !m) return "0h";
  if (!m) return `${h}h`;
  if (!h) return `${m}m`;
  return `${h}h ${m}m`;
}

function render() {
  document.getElementById("weekTotal").textContent = fmt(total(true));
  document.getElementById("allTotal").textContent = fmt(total());

  const tracks = document.getElementById("tracks");
  tracks.innerHTML = TRACKS.map(t => {
    const week = hours(t.id, true);
    const overall = hours(t.id);
    const pct = Math.min(100, (week / t.weeklyTarget) * 100);
    return `
      <article class="track" data-track="${t.id}">
        <div class="track-top">
          <div>
            <h3>${t.name}</h3>
            <div class="track-meta">${t.weeklyTarget}h/week · tap for roadmap</div>
          </div>
          <div class="track-hours">${fmt(overall)}</div>
        </div>
        <div class="progress-row">
          <div class="progress-meta">
            <span>This week</span>
            <span>${fmt(week)} / ${t.weeklyTarget}h</span>
          </div>
          <div class="bar"><div class="fill" style="width:${pct}%"></div></div>
        </div>
      </article>
    `;
  }).join("");

  document.querySelectorAll(".track").forEach(el => {
    el.addEventListener("click", () => openRoadmap(el.dataset.track));
  });

  const recent = document.getElementById("recentList");
  if (!state.sessions.length) {
    recent.innerHTML = `<div class="empty">No training logged yet.</div>`;
  } else {
    recent.innerHTML = [...state.sessions]
      .sort((a,b) => new Date(b.date) - new Date(a.date))
      .slice(0, 8)
      .map(s => {
        const t = TRACKS.find(x => x.id === s.trackId);
        const d = new Date(s.date).toLocaleDateString(undefined, {day:"2-digit", month:"short"});
        return `
          <div class="recent-item">
            <div>
              <strong>${s.topic}</strong>
              <span>${t?.name || ""} · ${d}</span>
            </div>
            <div class="recent-time">${fmt(s.duration)}</div>
          </div>
        `;
      }).join("");
  }
}

function openRoadmap(trackId) {
  const t = TRACKS.find(x => x.id === trackId);
  if (!t) return;

  document.getElementById("roadmapType").textContent = t.type;
  document.getElementById("roadmapTitle").textContent = t.name;

  const box = document.getElementById("roadmapList");
  box.innerHTML = t.roadmap.map(([group, skills], gi) => `
    <section class="roadmap-group">
      <h3>${group}</h3>
      ${skills.map((skill, si) => {
        const key = `${trackId}:${gi}:${si}`;
        const checked = !!state.completed[key];
        return `
          <label class="skill ${checked ? "done" : ""}">
            <input type="checkbox" data-key="${key}" ${checked ? "checked" : ""}>
            <span>${skill}</span>
          </label>
        `;
      }).join("")}
    </section>
  `).join("");

  box.querySelectorAll("input[type=checkbox]").forEach(cb => {
    cb.addEventListener("change", () => {
      state.completed[cb.dataset.key] = cb.checked;
      cb.closest(".skill").classList.toggle("done", cb.checked);
      save();
    });
  });

  document.getElementById("roadmapDialog").showModal();
}

function setup() {
  document.getElementById("trackSelect").innerHTML =
    TRACKS.map(t => `<option value="${t.id}">${t.name}</option>`).join("");

  document.getElementById("openLog").addEventListener("click", () => {
    document.getElementById("logDialog").showModal();
  });

  document.querySelectorAll("[data-close]").forEach(btn => {
    btn.addEventListener("click", () => {
      document.getElementById(btn.dataset.close).close();
    });
  });

  document.getElementById("logForm").addEventListener("submit", e => {
    e.preventDefault();

    const topic = document.getElementById("topicInput").value.trim();
    const h = Number(document.getElementById("hoursInput").value || 0);
    const m = Number(document.getElementById("minutesInput").value || 0);
    const duration = h + m / 60;

    if (!topic || duration <= 0) return;

    state.sessions.push({
      id: Date.now(),
      trackId: document.getElementById("trackSelect").value,
      topic,
      duration,
      date: new Date().toISOString()
    });

    save();
    e.target.reset();
    document.getElementById("hoursInput").value = 1;
    document.getElementById("minutesInput").value = 0;
    document.getElementById("logDialog").close();
    render();
  });

  document.getElementById("clearAll").addEventListener("click", () => {
    if (!confirm("Reset all training data?")) return;
    state = { sessions: [], completed: {} };
    save();
    render();
  });
}

load();
setup();
render();
