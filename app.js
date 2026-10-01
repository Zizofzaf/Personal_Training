const DEFAULT_PROGRAMS = [
  {
    id: "ir",
    name: "Incident Response",
    category: "Defensive Analysis",
    weeklyTarget: 12,
    durationWeeks: 52,
    roadmap: [
      ["Phase 1 — Fundamentals", [
        "Incident Response lifecycle", "IOC vs IOA", "MITRE ATT&CK basics",
        "Windows fundamentals", "Linux fundamentals", "TCP/IP, DNS, HTTP, SMB, RDP"
      ]],
      ["Phase 2 — Windows Investigation", [
        "Windows Event Logs", "Security.evtx", "PowerShell logs", "Sysmon",
        "Windows Registry", "Scheduled Tasks", "Prefetch", "Amcache", "Shimcache",
        "LNK files", "Jump Lists", "Browser artifacts", "SRUM"
      ]],
      ["Phase 3 — Disk & Memory Forensics", [
        "Disk image concepts", "MBR / GPT", "Deleted files", "File carving",
        "Timeline analysis", "Autopsy", "FTK Imager", "KAPE",
        "Volatility 3", "Process analysis", "Memory network connections"
      ]],
      ["Phase 4 — Network Investigation", [
        "PCAP analysis", "Wireshark", "TCP streams", "DNS analysis",
        "HTTP analysis", "TLS basics", "Beaconing", "C2 traffic patterns", "Zeek basics"
      ]],
      ["Phase 5 — Incident Cases", [
        "Phishing", "Malware infection", "Credential theft", "Ransomware",
        "Account compromise", "Lateral movement", "Persistence", "Data exfiltration"
      ]],
      ["Phase 6 — Investigation & Reporting", [
        "Build attack timeline", "Identify initial access", "Determine scope",
        "Find persistence", "Trace lateral movement", "Extract IOCs",
        "MITRE ATT&CK mapping", "Technical report", "Executive summary"
      ]]
    ]
  },
  {
    id: "malware",
    name: "Malware Analysis",
    category: "Reverse Engineering",
    weeklyTarget: 8,
    durationWeeks: 52,
    roadmap: [
      ["Phase 1 — Foundations", [
        "CPU basics", "Registers", "Stack", "Heap", "Memory",
        "Calling conventions", "x86 basics", "x64 basics", "Windows API basics"
      ]],
      ["Phase 2 — Windows Internals & PE", [
        "Processes", "Threads", "Handles", "DLLs", "Virtual memory",
        "PE headers", "Sections", "Imports", "Exports", "Resources", "IAT", "RVA"
      ]],
      ["Phase 3 — Static Analysis", [
        "Hashing", "Strings", "Metadata", "PE structure", "Suspicious APIs",
        "Entropy", "Pack detection", "PEStudio", "Detect It Easy", "FLOSS", "capa"
      ]],
      ["Phase 4 — Dynamic Analysis", [
        "Safe malware lab", "Process Monitor", "Process Explorer", "TCPView",
        "Wireshark", "FakeNet-NG", "Regshot", "File / Registry / Network behavior"
      ]],
      ["Phase 5 — Debugging & Reverse Engineering", [
        "Breakpoints", "Registers", "Stack", "Memory view", "Stepping",
        "API breakpoints", "x64dbg", "WinDbg basics", "Ghidra", "IDA basics",
        "Control flow", "Cross references", "Decompiler"
      ]],
      ["Phase 6 — Malware Behaviors", [
        "Persistence", "Process injection", "DLL injection", "Process hollowing",
        "Credential theft", "C2 communication", "Downloaders", "Droppers",
        "Loaders", "RATs", "Ransomware"
      ]],
      ["Phase 7 — Advanced Analysis & Detection", [
        "Packing", "Unpacking", "Obfuscation", "Anti-debugging", "Anti-VM",
        "API hashing", "Shellcode", "Config extraction", "YARA", "Sigma basics",
        "Behavioral detection", "MITRE ATT&CK mapping"
      ]]
    ]
  },
  {
    id: "cti",
    name: "Cyber Threat Intelligence",
    category: "Threat Research",
    weeklyTarget: 6,
    durationWeeks: 52,
    roadmap: [
      ["Phase 1 — CTI Fundamentals", [
        "Data vs information vs intelligence", "Tactical intelligence",
        "Operational intelligence", "Strategic intelligence",
        "Intelligence lifecycle", "Intelligence requirements"
      ]],
      ["Phase 2 — IOC & OSINT", [
        "IP, Domain, URL, Hash", "Email indicators", "Certificates",
        "WHOIS", "DNS", "Passive DNS", "Certificate Transparency",
        "ASN", "Hosting providers", "GitHub research", "Social media research"
      ]],
      ["Phase 3 — Threat Actor Analysis", [
        "Threat actor profiles", "APT groups", "Cybercrime groups",
        "Ransomware groups", "Initial access brokers", "Vendor naming differences"
      ]],
      ["Phase 4 — MITRE ATT&CK", [
        "Tactics", "Techniques", "Sub-techniques", "Procedures",
        "ATT&CK Navigator", "Mapping reports", "Comparing campaigns"
      ]],
      ["Phase 5 — Infrastructure Tracking", [
        "Domain pivoting", "IP pivoting", "ASN relationships", "Certificates",
        "Historical infrastructure", "Hosting patterns", "Infrastructure clustering"
      ]],
      ["Phase 6 — Campaign & Malware Intelligence", [
        "Malware families", "C2 infrastructure", "Campaign tracking",
        "Victimology", "Timeline analysis", "TTP comparison", "Confidence levels"
      ]],
      ["Phase 7 — Intelligence Reporting", [
        "Intelligence question", "Key findings", "Evidence",
        "Confidence assessment", "IOC table", "ATT&CK mapping",
        "Technical report", "Executive report"
      ]]
    ]
  },
  {
    id: "core",
    name: "Core Technical Foundations",
    category: "Foundation",
    weeklyTarget: 4,
    durationWeeks: 52,
    roadmap: [
      ["Systems", [
        "Windows fundamentals", "Linux fundamentals", "Processes and services",
        "Users and permissions", "NTFS basics", "EXT basics"
      ]],
      ["Networking", [
        "TCP/IP", "DNS", "HTTP", "TLS", "SMB", "RDP", "Routing basics",
        "Ports and sockets", "Packet capture basics"
      ]],
      ["Scripting & Data", [
        "Python", "PowerShell", "Bash", "Git", "Regex", "JSON", "CSV", "SQL"
      ]],
      ["Security Foundations", [
        "Hashing", "Encoding", "Base64", "Basic cryptography",
        "Logs", "Sysmon", "MITRE ATT&CK"
      ]],
      ["Investigation Mindset", [
        "Ask good questions", "Build timelines", "Validate assumptions",
        "Correlate artifacts", "Separate fact from hypothesis",
        "Document evidence", "Assign confidence", "Reproduce findings"
      ]]
    ]
  }
];

const STORAGE_KEY = "technicalTrainingV1";
const START_DATE_KEY = "technicalTrainingStartDate";

const state = {
  programs: DEFAULT_PROGRAMS,
  sessions: [],
  completed: {}
};

function loadState() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      state.sessions = parsed.sessions || [];
      state.completed = parsed.completed || {};
    } catch {}
  }
  if (!localStorage.getItem(START_DATE_KEY)) {
    localStorage.setItem(START_DATE_KEY, new Date().toISOString());
  }
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify({
    sessions: state.sessions,
    completed: state.completed
  }));
}

function startOfWeek(date = new Date()) {
  const d = new Date(date);
  const day = d.getDay();
  const diff = (day + 6) % 7;
  d.setHours(0,0,0,0);
  d.setDate(d.getDate() - diff);
  return d;
}

function hoursForProgram(programId, weeklyOnly = false) {
  const weekStart = startOfWeek();
  return state.sessions
    .filter(s => s.programId === programId)
    .filter(s => !weeklyOnly || new Date(s.date) >= weekStart)
    .reduce((sum, s) => sum + s.duration, 0);
}

function totalHours(weeklyOnly = false) {
  const weekStart = startOfWeek();
  return state.sessions
    .filter(s => !weeklyOnly || new Date(s.date) >= weekStart)
    .reduce((sum, s) => sum + s.duration, 0);
}

function formatHours(value) {
  if (!value) return "0h";
  const h = Math.floor(value);
  const m = Math.round((value - h) * 60);
  return m ? `${h}h ${m}m` : `${h}h`;
}

function currentTrainingWeek() {
  const start = new Date(localStorage.getItem(START_DATE_KEY));
  const now = new Date();
  const diffDays = Math.max(0, Math.floor((now - start) / 86400000));
  return Math.floor(diffDays / 7) + 1;
}

function renderDashboard() {
  document.getElementById("totalHours").textContent = formatHours(totalHours());
  document.getElementById("weekHours").textContent = formatHours(totalHours(true));
  document.getElementById("activePrograms").textContent = state.programs.length;
  document.getElementById("currentWeek").textContent = `Week ${currentTrainingWeek()}`;

  const grid = document.getElementById("programGrid");
  grid.innerHTML = "";

  state.programs.forEach(program => {
    const total = hoursForProgram(program.id);
    const weekly = hoursForProgram(program.id, true);
    const percent = Math.min(100, (weekly / program.weeklyTarget) * 100);

    const card = document.createElement("article");
    card.className = "program-card";
    card.innerHTML = `
      <div class="program-top">
        <div>
          <p class="eyebrow">${program.category.toUpperCase()}</p>
          <h3>${program.name}</h3>
          <div class="meta">${program.durationWeeks} week program · ${program.weeklyTarget}h/week</div>
        </div>
        <span class="badge">${formatHours(total)}</span>
      </div>

      <div class="progress-block">
        <div class="progress-meta">
          <span>This week</span>
          <span>${formatHours(weekly)} / ${program.weeklyTarget}h</span>
        </div>
        <div class="progress-track">
          <div class="progress-fill" style="width:${percent}%"></div>
        </div>
      </div>

      <div class="card-footer">
        <span>${Math.round(percent)}% weekly target</span>
        <span>Open roadmap →</span>
      </div>
    `;
    card.addEventListener("click", () => openProgram(program.id));
    grid.appendChild(card);
  });

  renderHistory();
}

function renderHistory() {
  const list = document.getElementById("historyList");
  if (!state.sessions.length) {
    list.innerHTML = `<div class="empty-state">No training logged yet. Start with your first session.</div>`;
    return;
  }

  const sorted = [...state.sessions].sort((a,b) => new Date(b.date) - new Date(a.date));
  list.innerHTML = sorted.slice(0, 12).map(session => {
    const program = state.programs.find(p => p.id === session.programId);
    const date = new Date(session.date);
    return `
      <div class="history-item">
        <div class="history-date">${date.toLocaleDateString(undefined, {day:"2-digit", month:"short"})}</div>
        <div class="history-main">
          <strong>${session.topic}</strong>
          <span>${program?.name || "Unknown"} · ${session.type}</span>
        </div>
        <div class="history-hours">${formatHours(session.duration)}</div>
      </div>
    `;
  }).join("");
}

function openProgram(programId) {
  const program = state.programs.find(p => p.id === programId);
  if (!program) return;

  const total = hoursForProgram(program.id);
  const weekly = hoursForProgram(program.id, true);
  const percent = Math.min(100, (weekly / program.weeklyTarget) * 100);

  document.getElementById("dialogProgramType").textContent = program.category.toUpperCase();
  document.getElementById("dialogProgramName").textContent = program.name;
  document.getElementById("dialogHours").textContent = formatHours(total);
  document.getElementById("dialogWeekHours").textContent = formatHours(weekly);
  document.getElementById("dialogTarget").textContent = `${program.weeklyTarget}h`;
  document.getElementById("dialogProgressText").textContent = `${Math.round(percent)}%`;
  document.getElementById("dialogProgressBar").style.width = `${percent}%`;

  const roadmapList = document.getElementById("roadmapList");
  roadmapList.innerHTML = "";

  program.roadmap.forEach(([phaseName, skills], phaseIndex) => {
    const phase = document.createElement("section");
    phase.className = "roadmap-phase";
    const skillsHtml = skills.map((skill, skillIndex) => {
      const key = `${program.id}:${phaseIndex}:${skillIndex}`;
      const checked = !!state.completed[key];
      return `
        <div class="skill-item ${checked ? "done" : ""}">
          <input type="checkbox" data-skill-key="${key}" ${checked ? "checked" : ""}>
          <label>${skill}</label>
        </div>
      `;
    }).join("");

    phase.innerHTML = `<h4>${phaseName}</h4>${skillsHtml}`;
    roadmapList.appendChild(phase);
  });

  roadmapList.querySelectorAll("input[type=checkbox]").forEach(box => {
    box.addEventListener("change", e => {
      const key = e.target.dataset.skillKey;
      state.completed[key] = e.target.checked;
      saveState();
      e.target.closest(".skill-item").classList.toggle("done", e.target.checked);
    });
  });

  document.getElementById("programDialog").showModal();
}

function setupLogForm() {
  const select = document.getElementById("logProgram");
  select.innerHTML = state.programs.map(p => `<option value="${p.id}">${p.name}</option>`).join("");

  document.getElementById("logForm").addEventListener("submit", e => {
    e.preventDefault();
    const hours = Number(document.getElementById("logHours").value || 0);
    const minutes = Number(document.getElementById("logMinutes").value || 0);
    const duration = hours + (minutes / 60);

    if (duration <= 0) {
      alert("Enter a training duration greater than 0.");
      return;
    }

    state.sessions.push({
      id: crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}`,
      programId: select.value,
      topic: document.getElementById("logTopic").value.trim(),
      duration,
      type: document.getElementById("logType").value,
      notes: document.getElementById("logNotes").value.trim(),
      date: new Date().toISOString()
    });

    saveState();
    document.getElementById("logForm").reset();
    document.getElementById("logHours").value = 1;
    document.getElementById("logMinutes").value = 0;
    document.getElementById("logDialog").close();
    renderDashboard();
  });
}

document.addEventListener("DOMContentLoaded", () => {
  loadState();
  setupLogForm();
  renderDashboard();

  document.getElementById("openLogBtn").addEventListener("click", () => {
    document.getElementById("logDialog").showModal();
  });

  document.querySelectorAll("[data-close]").forEach(btn => {
    btn.addEventListener("click", () => {
      document.getElementById(btn.dataset.close).close();
    });
  });

  document.getElementById("resetBtn").addEventListener("click", () => {
    const ok = confirm("Reset all training logs and roadmap progress?");
    if (!ok) return;
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(START_DATE_KEY);
    state.sessions = [];
    state.completed = {};
    loadState();
    renderDashboard();
  });
});
