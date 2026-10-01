const WEEKLY_TARGET_HOURS = 12;


const TRACKS = [

  {
    id: "ir",

    name: "Incident Response",

    type: "DEFENSIVE ANALYSIS",

    roadmap: [

      [
        "Fundamentals",
        [
          "Incident Response Lifecycle",
          "IOC vs IOA",
          "MITRE ATT&CK Basics",
          "Windows Fundamentals",
          "Linux Fundamentals",
          "Networking Fundamentals"
        ]
      ],

      [
        "Windows Investigation",
        [
          "Windows Event Logs",
          "Sysmon",
          "Windows Registry",
          "Scheduled Tasks",
          "Prefetch",
          "Amcache",
          "LNK Files",
          "Jump Lists"
        ]
      ],

      [
        "Disk & Memory Forensics",
        [
          "Disk Imaging",
          "Timeline Analysis",
          "Autopsy",
          "FTK Imager",
          "KAPE",
          "Volatility 3"
        ]
      ],

      [
        "Network Investigation",
        [
          "Wireshark",
          "PCAP Analysis",
          "DNS Analysis",
          "HTTP Analysis",
          "TLS Basics",
          "Beaconing and C2"
        ]
      ]

    ]

  },


  {
    id: "malware",

    name: "Malware Analysis",

    type: "REVERSE ENGINEERING",

    roadmap: [

      [
        "Foundation",
        [
          "CPU and Registers",
          "Stack and Heap",
          "x86 / x64 Assembly",
          "Windows API"
        ]
      ],

      [
        "PE Analysis",
        [
          "PE Headers",
          "Sections",
          "Imports",
          "Exports",
          "IAT",
          "RVA"
        ]
      ],

      [
        "Static Analysis",
        [
          "Hashes",
          "Strings",
          "PEStudio",
          "Detect It Easy",
          "FLOSS",
          "capa"
        ]
      ],

      [
        "Dynamic Analysis",
        [
          "Process Monitor",
          "Process Explorer",
          "TCPView",
          "Wireshark",
          "FakeNet-NG",
          "Regshot"
        ]
      ],

      [
        "Reverse Engineering",
        [
          "x64dbg",
          "WinDbg",
          "Ghidra",
          "IDA",
          "Control Flow",
          "Cross References"
        ]
      ]

    ]

  },


  {
    id: "cti",

    name: "Cyber Threat Intelligence",

    type: "THREAT RESEARCH",

    roadmap: [

      [
        "CTI Fundamentals",
        [
          "Intelligence Lifecycle",
          "Tactical Intelligence",
          "Operational Intelligence",
          "Strategic Intelligence",
          "Intelligence Requirements"
        ]
      ],

      [
        "IOC & OSINT",
        [
          "IP Investigation",
          "Domain Investigation",
          "URL Investigation",
          "WHOIS",
          "Passive DNS",
          "Certificates",
          "ASN"
        ]
      ],

      [
        "Threat Actors",
        [
          "APT Groups",
          "Cybercrime Groups",
          "Ransomware Groups",
          "Threat Actor Profiling"
        ]
      ],

      [
        "MITRE ATT&CK",
        [
          "Tactics",
          "Techniques",
          "Sub-techniques",
          "ATT&CK Navigator"
        ]
      ]

    ]

  },


  {
    id: "core",

    name: "Core Foundations",

    type: "TECHNICAL FOUNDATION",

    roadmap: [

      [
        "Systems",
        [
          "Windows",
          "Linux",
          "Processes",
          "Services",
          "Users and Permissions"
        ]
      ],

      [
        "Networking",
        [
          "TCP/IP",
          "DNS",
          "HTTP",
          "TLS",
          "SMB",
          "RDP"
        ]
      ],

      [
        "Scripting",
        [
          "Python",
          "PowerShell",
          "Bash",
          "Git",
          "Regex",
          "JSON",
          "SQL"
        ]
      ]

    ]

  }

];



const STORAGE_KEY =
  "personalTrainingV3";


let state = {

  completed: {},

  answers: {},

  weeklySeconds: 0,

  timerRunning: false,

  timerStartedAt: null

};


let activeTopic = null;



/* =========================
   LOAD / SAVE
========================= */

function loadState() {

  try {

    const saved =
      localStorage.getItem(
        STORAGE_KEY
      );


    if (saved) {

      const parsed =
        JSON.parse(saved);


      state = {

        ...state,

        ...parsed

      };

    }

  }

  catch (error) {

    console.error(
      error
    );

  }

}


function saveState() {

  localStorage.setItem(

    STORAGE_KEY,

    JSON.stringify(
      state
    )

  );

}



/* =========================
   LIVE CLOCK
========================= */

function updateClock() {

  const now =
    new Date();


  document
    .getElementById(
      "liveClock"
    )
    .textContent =
      now.toLocaleTimeString(
        [],
        {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit"
        }
      );


  document
    .getElementById(
      "liveDate"
    )
    .textContent =
      now.toLocaleDateString(
        [],
        {
          weekday: "short",
          day: "2-digit",
          month: "short",
          year: "numeric"
        }
      );

}



/* =========================
   TIMER
========================= */

function getCurrentSessionSeconds() {

  if (
    !state.timerRunning ||
    !state.timerStartedAt
  ) {

    return 0;

  }


  return Math.floor(

    (
      Date.now() -
      state.timerStartedAt
    )

    / 1000

  );

}


function getTotalWeekSeconds() {

  return (

    state.weeklySeconds +

    getCurrentSessionSeconds()

  );

}


function formatTimer(seconds) {

  const hours =
    Math.floor(
      seconds / 3600
    );


  const minutes =
    Math.floor(
      (seconds % 3600) / 60
    );


  const secs =
    seconds % 60;


  return [

    hours,
    minutes,
    secs

  ]

  .map(
    value =>
      String(value)
      .padStart(2, "0")
  )

  .join(":");

}


function formatHours(seconds) {

  const hours =
    Math.floor(
      seconds / 3600
    );


  const minutes =
    Math.floor(
      (
        seconds % 3600
      )
      / 60
    );


  return `${hours}h ${minutes}m`;

}


function updateTimerUI() {

  const sessionSeconds =
    getCurrentSessionSeconds();


  const weekSeconds =
    getTotalWeekSeconds();


  document
    .getElementById(
      "timerDisplay"
    )
    .textContent =
      formatTimer(
        sessionSeconds
      );


  document
    .getElementById(
      "weekTotal"
    )
    .textContent =
      formatHours(
        weekSeconds
      );


  const targetSeconds =

    WEEKLY_TARGET_HOURS
    *
    3600;


  const percent =

    Math.min(

      100,

      (
        weekSeconds
        /
        targetSeconds
      )
      *
      100

    );


  document
    .getElementById(
      "weeklyProgress"
    )
    .style.width =
      `${percent}%`;


  document
    .getElementById(
      "weeklyPercent"
    )
    .textContent =
      `${Math.floor(percent)}%`;


  const remaining =

    Math.max(

      0,

      targetSeconds -
      weekSeconds

    );


  document
    .getElementById(
      "weeklyRemaining"
    )
    .textContent =

      remaining === 0

      ? "Weekly target completed"

      : `${formatHours(remaining)} remaining`;


  const startButton =
    document.getElementById(
      "startTimer"
    );


  const finishButton =
    document.getElementById(
      "finishTimer"
    );


  if (
    state.timerRunning
  ) {

    startButton.textContent =
      "Pause";

    finishButton.disabled =
      false;


    document
      .getElementById(
        "timerStatus"
      )
      .textContent =
        "Training in progress";

  }

  else {

    startButton.textContent =
      sessionSeconds > 0
      ? "Continue"
      : "Start Training";


    finishButton.disabled =
      true;


    document
      .getElementById(
        "timerStatus"
      )
      .textContent =
        "Ready to train";

  }

}



function startPauseTimer() {

  if (
    state.timerRunning
  ) {

    state.weeklySeconds +=
      getCurrentSessionSeconds();


    state.timerRunning =
      false;


    state.timerStartedAt =
      null;

  }

  else {

    state.timerRunning =
      true;


    state.timerStartedAt =
      Date.now();

  }


  saveState();

  updateTimerUI();

}



function finishTimer() {

  if (
    state.timerRunning
  ) {

    state.weeklySeconds +=
      getCurrentSessionSeconds();

  }


  state.timerRunning =
    false;


  state.timerStartedAt =
    null;


  saveState();

  updateTimerUI();

}



/* =========================
   ROADMAP
========================= */

function getTrackProgress(track) {

  let total = 0;

  let completed = 0;


  track.roadmap
    .forEach(

      (
        [group, topics],
        groupIndex
      ) => {

        topics.forEach(

          (
            topic,
            topicIndex
          ) => {

            total++;


            const key =

              `${track.id}:` +
              `${groupIndex}:` +
              `${topicIndex}`;


            if (
              state.completed[key]
            ) {

              completed++;

            }

          }

        );

      }

    );


  return {

    completed,
    total

  };

}



function renderTracks() {

  const container =
    document.getElementById(
      "tracks"
    );


  container.innerHTML =

    TRACKS
    .map(

      track => {

        const progress =
          getTrackProgress(
            track
          );


        const percent =

          progress.total

          ? Math.round(

              progress.completed
              /
              progress.total
              *
              100

            )

          : 0;


        return `

          <article
            class="track-card"
            data-track="${track.id}"
          >

            <div>

              <div class="track-title">

                <div>

                  <h3>
                    ${track.name}
                  </h3>

                  <div class="track-type">
                    ${track.type}
                  </div>

                </div>

                <div class="track-percent">
                  ${percent}%
                </div>

              </div>

            </div>


            <div class="track-progress">

              <div class="track-progress-meta">

                <span>
                  Roadmap Progress
                </span>

                <span>
                  ${progress.completed}
                  /
                  ${progress.total}
                </span>

              </div>


              <div class="progress">

                <div
                  style="
                    width:${percent}%
                  "
                ></div>

              </div>


              <div class="track-footer">

                <span>
                  ${progress.completed}
                  topics completed
                </span>

                <strong>
                  Open Roadmap →
                </strong>

              </div>

            </div>

          </article>

        `;

      }

    )

    .join("");


  document
    .querySelectorAll(
      ".track-card"
    )
    .forEach(

      card => {

        card.addEventListener(

          "click",

          () => {

            openRoadmap(
              card.dataset.track
            );

          }

        );

      }

    );

}



/* =========================
   OPEN ROADMAP
========================= */

function openRoadmap(
  trackId
) {

  const track =
    TRACKS.find(
      item =>
        item.id === trackId
    );


  if (!track) return;


  document
    .getElementById(
      "roadmapTitle"
    )
    .textContent =
      track.name;


  document
    .getElementById(
      "roadmapType"
    )
    .textContent =
      track.type;


  const progress =
    getTrackProgress(
      track
    );


  document
    .getElementById(
      "roadmapDone"
    )
    .textContent =

      `${progress.completed} / ${progress.total}`;


  document
    .getElementById(
      "roadmapProgress"
    )
    .style.width =

      `${

        progress.total

        ? (
            progress.completed
            /
            progress.total
            *
            100
          )

        : 0

      }%`;


  const roadmapList =
    document.getElementById(
      "roadmapList"
    );


  roadmapList.innerHTML =

    track.roadmap

    .map(

      (
        [group, topics],
        groupIndex
      ) => {

        const topicHTML =

          topics

          .map(

            (
              topic,
              topicIndex
            ) => {

              const key =

                `${track.id}:` +
                `${groupIndex}:` +
                `${topicIndex}`;


              const completed =
                !!state.completed[key];


              return `

                <div
                  class="
                    topic
                    ${
                      completed
                      ? "completed"
                      : ""
                    }
                  "
                  data-track="${track.id}"
                  data-group="${groupIndex}"
                  data-topic="${topicIndex}"
                >

                  <span>
                    ${topic}
                  </span>

                  <span
                    class="topic-status"
                  >

                    ${
                      completed
                      ? "✓ Completed"
                      : "Start →"
                    }

                  </span>

                </div>

              `;

            }

          )

          .join("");


        return `

          <section
            class="roadmap-group"
          >

            <h3>
              ${group}
            </h3>

            ${topicHTML}

          </section>

        `;

      }

    )

    .join("");


  roadmapList
    .querySelectorAll(
      ".topic"
    )
    .forEach(

      element => {

        element
          .addEventListener(

            "click",

            () => {

              openQuestions(

                element.dataset.track,

                Number(
                  element.dataset.group
                ),

                Number(
                  element.dataset.topic
                )

              );

            }

          );

      }

    );


  const dialog =
    document.getElementById(
      "roadmapDialog"
    );


  if (!dialog.open) {

    dialog.showModal();

  }

}



/* =========================
   QUESTIONS
========================= */

function buildQuestions(
  topic
) {

  return [

    `Explain "${topic}" using your own words.`,

    `Why is "${topic}" important in a real investigation or analysis?`,

    `What are the main concepts, artifacts, tools, or indicators related to "${topic}"?`,

    `Give one practical example where you would use "${topic}".`,

    `If you needed to investigate "${topic}" now, what would you check or do first?`

  ];

}



function openQuestions(
  trackId,
  groupIndex,
  topicIndex
) {

  const track =
    TRACKS.find(
      item =>
        item.id === trackId
    );


  const topic =

    track
    .roadmap[groupIndex][1]
    [topicIndex];


  const key =

    `${trackId}:` +
    `${groupIndex}:` +
    `${topicIndex}`;


  activeTopic = {

    trackId,
    groupIndex,
    topicIndex,
    key,
    topic

  };


  document
    .getElementById(
      "questionTopic"
    )
    .textContent =
      topic;


  const questions =
    buildQuestions(
      topic
    );


  const existingAnswers =
    state.answers[key] || [];


  document
    .getElementById(
      "questionContainer"
    )
    .innerHTML =

      questions

      .map(

        (
          question,
          index
        ) => `

          <div
            class="question-block"
          >

            <label>

              ${index + 1}.
              ${question}

            </label>

            <textarea
              data-question="${index}"
              required
            >${existingAnswers[index] || ""}</textarea>

          </div>

        `

      )

      .join("");


  document
    .getElementById(
      "questionDialog"
    )
    .showModal();

}



/* =========================
   COMPLETE TOPIC
========================= */

document
  .getElementById(
    "questionForm"
  )
  .addEventListener(

    "submit",

    event => {

      event.preventDefault();


      if (!activeTopic) return;


      const answers =

        Array.from(

          document
          .querySelectorAll(
            "#questionContainer textarea"
          )

        )

        .map(

          textarea =>
            textarea
            .value
            .trim()

        );


      const allAnswered =

        answers.every(

          answer =>
            answer.length > 0

        );


      if (!allAnswered) {

        alert(
          "Please answer all 5 questions first."
        );

        return;

      }


      state.answers[
        activeTopic.key
      ] = answers;


      state.completed[
        activeTopic.key
      ] = true;


      saveState();


      document
        .getElementById(
          "questionDialog"
        )
        .close();


      openRoadmap(
        activeTopic.trackId
      );


      renderTracks();

    }

  );



/* =========================
   CLOSE BUTTONS
========================= */

document
  .querySelectorAll(
    "[data-close]"
  )
  .forEach(

    button => {

      button
        .addEventListener(

          "click",

          () => {

            document
              .getElementById(
                button.dataset.close
              )
              .close();

          }

        );

    }

  );



/* =========================
   TIMER BUTTONS
========================= */

document
  .getElementById(
    "startTimer"
  )
  .addEventListener(

    "click",

    startPauseTimer

  );


document
  .getElementById(
    "finishTimer"
  )
  .addEventListener(

    "click",

    finishTimer

  );



/* =========================
   START APP
========================= */

loadState();

renderTracks();

updateClock();

updateTimerUI();


setInterval(

  () => {

    updateClock();

    updateTimerUI();

  },

  1000

);