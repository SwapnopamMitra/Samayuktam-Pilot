const TRACES = {
  cagm: {
    title: "./cagm",
    lines: [
      [{ t: "$ ./cagm diabetes_cagm_ready.csv --hidden 64 --epochs 100 --batch 64 --lr 0.005 --lr-end 0.0003 --warmup 8 --patience 20 --threads 4 --verbose", c: "" }],
      [{ t: "License OK — uses remaining: ", c: "term-dim" }, { t: "15", c: "term-ok" }],
      [{ t: "Loaded: ", c: "term-dim" }, { t: "diabetes_cagm_ready.csv", c: "" }, { t: "  rows=768  features=8  classes=2", c: "term-dim" }],
      [{ t: "Config: hidden=64 epochs=100 batch=64 lr=0.0050 lr_end=0.0003 warmup=8 patience=20 threads=4", c: "term-dim" }],
      [{ t: "Epoch  10 | acc=0.8261 | best=0.8333 | patience=1/20  | lr=0.00500", c: "term-dim" }],
      [{ t: "Epoch  20 | acc=0.8043 | best=0.8333 | patience=11/20 | lr=0.00483", c: "term-dim" }],
      [{ t: "Early stopping at epoch 29 (best=9, acc=0.8333)", c: "term-dim" }],
      [{ t: "accuracy  ", c: "" }, { t: "0.785156", c: "term-ok" }],
      [{ t: "proof     ", c: "" }, { t: "f8e66dd34cb782bf090211c6c63c0342999fe4f1cf5c8c55b54f532e8071c975", c: "term-warn" }],
      [{ t: "ie_verify ", c: "" }, { t: "PASS", c: "term-pass" }, { t: "  (hash=0x59E4A8B7)", c: "term-dim" }]
    ]
  },
  spcmp: {
    title: "./app",
    lines: [
      [{ t: "$ ./app sort floats.bin --runs 3", c: "" }],
      [{ t: "License OK — uses remaining: ", c: "term-dim" }, { t: "15", c: "term-ok" }, { t: " | days remaining: ", c: "term-dim" }, { t: "1", c: "term-ok" }],
      [{ t: "uses remaining: ", c: "term-dim" }, { t: "14", c: "term-ok" }],
      [{ t: "sort best time: ", c: "term-dim" }, { t: "0.000453 s", c: "term-ok" }],
      [{ t: "$ ./app unsort floats", c: "" }],
      [{ t: "License OK — uses remaining: ", c: "term-dim" }, { t: "14", c: "term-ok" }, { t: " | days remaining: ", c: "term-dim" }, { t: "1", c: "term-ok" }],
      [{ t: "reconstructed: ", c: "term-dim" }, { t: "floats.unsorted.bin", c: "" }, { t: "  (byte-identical to input)", c: "term-dim" }]
    ]
  }
};

const body = document.getElementById("terminal-body");
const titleEl = document.getElementById("terminal-title");
const tabs = document.querySelectorAll(".term-tab");
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

let activeTrace = "cagm";
let runId = 0;

function sleep(ms) {
  return new Promise(res => setTimeout(res, ms));
}

function renderFinal(trace) {
  body.innerHTML = "";
  trace.lines.forEach(line => {
    const div = document.createElement("div");
    line.forEach(seg => {
      const span = document.createElement("span");
      if (seg.c) span.className = seg.c;
      span.textContent = seg.t;
      div.appendChild(span);
    });
    body.appendChild(div);
  });
}

async function typeLine(line, container, myRun) {
  for (const seg of line) {
    if (myRun !== runId) return;
    const span = document.createElement("span");
    if (seg.c) span.className = seg.c;
    container.appendChild(span);
    for (let i = 0; i < seg.t.length; i++) {
      if (myRun !== runId) return;
      span.textContent += seg.t[i];
      await sleep(seg.c === "term-dim" ? 4 : 9);
    }
  }
}

async function runTrace(key) {
  const myRun = ++runId;
  const trace = TRACES[key];
  titleEl.textContent = trace.title;
  body.innerHTML = "";
  const cursor = document.createElement("span");
  cursor.className = "cursor";

  for (let i = 0; i < trace.lines.length; i++) {
    if (myRun !== runId) return;
    const div = document.createElement("div");
    body.appendChild(div);
    div.appendChild(cursor);
    await typeLine(trace.lines[i], div, myRun);
    if (myRun !== runId) return;
    div.removeChild(cursor);
    await sleep(i === 0 ? 260 : 90);
  }

  if (myRun !== runId) return;
  const finalDiv = document.createElement("div");
  const prompt = document.createElement("span");
  prompt.textContent = "$ ";
  finalDiv.appendChild(prompt);
  finalDiv.appendChild(cursor);
  body.appendChild(finalDiv);

  await sleep(6000);
  if (myRun !== runId) return;
  runTrace(key);
}

tabs.forEach(btn => {
  btn.addEventListener("click", () => {
    tabs.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    activeTrace = btn.dataset.trace;
    if (reduceMotion) {
      titleEl.textContent = TRACES[activeTrace].title;
      renderFinal(TRACES[activeTrace]);
    } else {
      runTrace(activeTrace);
    }
  });
});

if (reduceMotion) {
  titleEl.textContent = TRACES[activeTrace].title;
  renderFinal(TRACES[activeTrace]);
} else {
  runTrace(activeTrace);
}
