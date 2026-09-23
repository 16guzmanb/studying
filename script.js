/* ============================================================
   Squishy Study — shared script
   Handles: saved state, squishy sidebar, nav highlighting,
   spelling quiz, vocab quiz, squishy store
   ============================================================ */

/* ---------------- Data ---------------- */

const SQUISHIES = [
  { id: 1,  name: "Squish Cube",     emoji: "🩷", img: "images/squishy1.png" },
  { id: 2,  name: "Galaxy Dumpling", emoji: "🥟", img: "images/squishy2.png" },
  { id: 3,  name: "Pink Bao",        emoji: "🥮", img: "images/squishy3.png" },
  { id: 4,  name: "Galaxy Blob",     emoji: "🔮", img: "images/squishy4.png" },
  { id: 5,  name: "Butter Stick",    emoji: "🧈", img: "images/squishy5.png" },
  { id: 6,  name: "Honey Hamster",   emoji: "🐹", img: "images/squishy6.png" },
  { id: 7,  name: "Cheese Cube",     emoji: "🧀", img: "images/squishy7.png" },
  { id: 8,  name: "Sparkle Bun",     emoji: "✨", img: "images/squishy8.png" },
  { id: 9,  name: "Strawberry",      emoji: "🍓", img: "images/squishy9.png" },
  { id: 10, name: "Cat Burger",      emoji: "🐱", img: "images/squishy10.png" },
  { id: 11, name: "Crystal Apple",   emoji: "🍎", img: "images/squishy11.png" },
  { id: 12, name: "Gold Rush Blob",  emoji: "💰", img: "images/squishy12.png" },
  { id: 13, name: "Rainbow Bao",     emoji: "🌈", img: "images/squishy13.png" },
  { id: 14, name: "Violet Bao",      emoji: "💜", img: "images/squishy14.png" },
  { id: 15, name: "Ghost Cube",      emoji: "👻", img: "images/squishy15.png" },
  { id: 16, name: "S'mores Square",  emoji: "🍫", img: "images/squishy16.png" },
  { id: 17, name: "Glitter Axolotl", emoji: "🩵", img: "images/squishy17.png" },
  { id: 18, name: "Goofy Grin",      emoji: "🤪", img: "images/squishy18.png" },
  { id: 19, name: "Peekaboo Eye",    emoji: "👁️", img: "images/squishy19.png" },
  { id: 20, name: "Pink Pumpkin",    emoji: "🎃", img: "images/squishy20.png" },
  { id: 21, name: "Sprinkle Cookie", emoji: "🍪", img: "images/squishy21.png" },
  { id: 22, name: "Puppy Pal",       emoji: "🐶", img: "images/squishy22.png" },
  { id: 23, name: "Bunny Costume",   emoji: "🐰", img: "images/squishy23.png" },
  { id: 24, name: "Rainbow Bun",     emoji: "🌈", img: "images/squishy24.png" },
  { id: 25, name: "Purple Marble",   emoji: "🔮", img: "images/squishy25.png" },
  { id: 26, name: "Pink Swirl",      emoji: "🎀", img: "images/squishy26.png" },
  { id: 27, name: "Tie-Dye Butter",  emoji: "🧈", img: "images/squishy27.png" },
];

const FREE_SQUISHY_ID = 1;
const SQUISHY_PRICE = 100;
const POINTS_PER_QUESTION = 5;

const SPELLING_WORDS = [
  "splash", "strange", "scratch", "squeeze", "squeak", "squeal",
  "screen", "split", "splat", "sprain", "sprint", "strip", "strap",
  "scrap", "straddle", "splurge", "scrawl", "squirrel",
];

const VOCAB_WORDS = [
  { term: "immigrants", def: "A person who leaves their home country to permanently live in another country." },
  { term: "alternative", def: "Another choice." },
  { term: "epidemic",   def: "Widespread outbreak of a contagious disease that affects many people at the same time." },
  { term: "brutal",     def: "Mean, harsh, and/or tough." },
  { term: "debris",     def: "Pieces left after something has been broken." },
  { term: "colossal",   def: "Extremely large." },
  { term: "shoddily",   def: "Something is made or done in a careless way, or is of poor quality." },
  { term: "prejudice",  def: "Forming an unfair opinion about something before you know all the facts." },
];

const SPELLING_CHOICES = [
  { correct: "splash",   wrong: ["splach", "splashe"] },
  { correct: "strange",  wrong: ["strang", "strainge"] },
  { correct: "scratch",  wrong: ["scrach", "skratch"] },
  { correct: "squeeze",  wrong: ["squeez", "sqeeze"] },
  { correct: "squeak",   wrong: ["squeek", "sqeak"] },
  { correct: "squeal",   wrong: ["squeel", "sqeal"] },
  { correct: "screen",   wrong: ["scren", "screne"] },
  { correct: "split",    wrong: ["splitt", "spilt"] },
  { correct: "splat",    wrong: ["splatt", "splaat"] },
  { correct: "sprain",   wrong: ["spraine", "sprane"] },
  { correct: "sprint",   wrong: ["sprintt", "sprent"] },
  { correct: "strip",    wrong: ["strep", "stripe"] },
  { correct: "strap",    wrong: ["strapp", "strape"] },
  { correct: "scrap",    wrong: ["scrapp", "skrap"] },
  { correct: "straddle", wrong: ["stradle", "straddel"] },
  { correct: "splurge",  wrong: ["splerge", "splurg"] },
  { correct: "scrawl",   wrong: ["scraul", "scrall"] },
  { correct: "squirrel", wrong: ["squirel", "squrrel"] },
];

const MAP_LABELS = [
  { id: "na",  text: "North America",        x: 17.6, y: 33.2, w: 13.5, h: 7.5 },
  { id: "sa",  text: "South America",        x: 26.8, y: 59.2, w: 12,   h: 7   },
  { id: "eu",  text: "Europe",               x: 55.6, y: 31.7, w: 11,   h: 5.5 },
  { id: "af",  text: "Africa",               x: 51.2, y: 50.5, w: 10,   h: 5.5 },
  { id: "as",  text: "Asia",                 x: 70.5, y: 33.2, w: 9,    h: 5.5 },
  { id: "au",  text: "Australia",            x: 79.3, y: 61.2, w: 13,   h: 6   },
  { id: "an",  text: "Antarctica",           x: 79.3, y: 96.4, w: 16,   h: 4.5 },
  { id: "arc", text: "Arctic Ocean",         x: 59.8, y: 13.7, w: 20,   h: 6   },
  { id: "nat", text: "North Atlantic Ocean", x: 32.2, y: 42.8, w: 12,   h: 9.5 },
  { id: "sat", text: "South Atlantic Ocean", x: 40.7, y: 65.8, w: 12,   h: 9   },
  { id: "io",  text: "Indian Ocean",         x: 70.2, y: 64.5, w: 13,   h: 7   },
  { id: "so",  text: "Southern Ocean",       x: 57.8, y: 85.5, w: 23,   h: 6   },
];

const MATH_ITEMS = [
  "labubus", "squishies", "stickers", "gumballs", "marbles", "cookies",
  "crayons", "seashells", "pom-poms", "bracelets", "erasers", "buttons",
];

const MATH_GROUP_NAMES = [
  "sisters", "friends", "cousins", "teammates", "neighbors", "classmates",
];

const NUMBERLINE_MAX = 20;

function generateDivisionProblem() {
  const groups = 2 + Math.floor(Math.random() * 5); // 2-6 groups
  const perGroup = 2 + Math.floor(Math.random() * 9); // 2-10 each
  const total = groups * perGroup;
  const item = MATH_ITEMS[Math.floor(Math.random() * MATH_ITEMS.length)];
  const who = MATH_GROUP_NAMES[Math.floor(Math.random() * MATH_GROUP_NAMES.length)];
  const text = `There are ${total} ${item}. ${groups} ${who} share them equally. How many ${item} does each person get?`;
  return { text, total, groups, answer: perGroup };
}

function generateMultiplicationProblem() {
  const groups = 2 + Math.floor(Math.random() * 6); // 2-7 groups
  const each = 2 + Math.floor(Math.random() * 9); // 2-10 each
  const item = MATH_ITEMS[Math.floor(Math.random() * MATH_ITEMS.length)];
  const who = MATH_GROUP_NAMES[Math.floor(Math.random() * MATH_GROUP_NAMES.length)];
  const text = `${groups} ${who} each have ${each} ${item}. How many ${item} are there in all?`;
  return { text, answer: groups * each };
}

const STORAGE_KEY = "squishyStudyState";

/* ---------------- State ---------------- */

function defaultState() {
  return {
    points: 0,
    owned: [FREE_SQUISHY_ID],
    active: FREE_SQUISHY_ID,
  };
}

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultState();
    const parsed = JSON.parse(raw);
    if (!parsed.owned || !parsed.owned.length) return defaultState();
    return parsed;
  } catch (e) {
    return defaultState();
  }
}

function saveState(state) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (e) {
    /* storage unavailable — game still works, just won't persist */
  }
}

let state = loadState();

// one-time 300 point bonus (to make up for a cleared cache) — only ever fires once
if (!state.cacheBonusClaimed) {
  state.points += 300;
  state.cacheBonusClaimed = true;
  saveState(state);
}

function addPoints(amount) {
  state.points += amount;
  saveState(state);
}

function getSquishy(id) {
  return SQUISHIES.find((s) => s.id === id);
}

/* ---------------- Shared UI: nav + squishy panel ---------------- */

function squishyThumbHTML(squishy, size, extraClass = "") {
  return `
    <div class="squishy-thumb size-${size} ${extraClass}" data-id="${squishy.id}" title="${squishy.name}">
      <img src="${squishy.img}" alt="${squishy.name}"
           onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
      <div class="squishy-fallback" style="display:none;">${squishy.emoji}</div>
    </div>`;
}

/* ---- Canvas "squish" effect for the big active squishy ----
   Draws the squishy (photo or emoji) onto a canvas, then on click
   warps its pixels with a radial pinch (an "inverted fisheye") that
   sucks the image toward its center and releases — like it's being
   pressed by a finger. */

const squishyImageCache = {};

function getSquishyImage(squishy) {
  let entry = squishyImageCache[squishy.id];
  if (entry) return entry;
  entry = { img: new Image(), status: "loading" };
  entry.img.onload = () => {
    entry.status = "loaded";
    if (state.active === squishy.id) redrawActiveCanvas();
  };
  entry.img.onerror = () => {
    entry.status = "error";
  };
  entry.img.src = squishy.img;
  squishyImageCache[squishy.id] = entry;
  return entry;
}

function paintSquishyToCanvas(ctx, size, squishy) {
  ctx.clearRect(0, 0, size, size);
  ctx.save();
  ctx.beginPath();
  ctx.arc(size / 2, size / 2, size / 2 - 4, 0, Math.PI * 2);
  ctx.closePath();
  ctx.clip();

  const grad = ctx.createLinearGradient(0, 0, size, size);
  grad.addColorStop(0, "#ffb6e0");
  grad.addColorStop(1, "#b6e6ff");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, size, size);

  const entry = getSquishyImage(squishy);
  if (entry.status === "loaded") {
    ctx.drawImage(entry.img, 0, 0, size, size);
  } else {
    ctx.font = `${Math.floor(size * 0.5)}px serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(squishy.emoji, size / 2, size / 2 + size * 0.04);
  }
  ctx.restore();

  ctx.beginPath();
  ctx.arc(size / 2, size / 2, size / 2 - 4, 0, Math.PI * 2);
  ctx.lineWidth = 8;
  ctx.strokeStyle = "#ffffff";
  ctx.stroke();
}

/* amount 0 = no distortion. amount > 0 pulls pixels toward the
   center (a pinch / "inverted fisheye" squish). */
function applyPinchWarp(ctx, size, amount) {
  if (amount <= 0.001) return;
  const src = ctx.getImageData(0, 0, size, size);
  const dst = ctx.createImageData(size, size);
  const srcData = src.data;
  const dstData = dst.data;
  const cx = size / 2;
  const cy = size / 2;
  const maxR = size / 2;

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const dx = x - cx;
      const dy = y - cy;
      const r = Math.sqrt(dx * dx + dy * dy) / maxR;
      if (r > 1) continue; // stays transparent outside the circle
      const dstIdx = (y * size + x) * 4;
      const theta = Math.atan2(dy, dx);
      const rs = Math.pow(r, 1 - amount); // pull from farther out toward center
      const sx = Math.round(cx + Math.cos(theta) * rs * maxR);
      const sy = Math.round(cy + Math.sin(theta) * rs * maxR);
      const csx = Math.min(size - 1, Math.max(0, sx));
      const csy = Math.min(size - 1, Math.max(0, sy));
      const srcIdx = (csy * size + csx) * 4;
      dstData[dstIdx] = srcData[srcIdx];
      dstData[dstIdx + 1] = srcData[srcIdx + 1];
      dstData[dstIdx + 2] = srcData[srcIdx + 2];
      dstData[dstIdx + 3] = srcData[srcIdx + 3];
    }
  }
  ctx.putImageData(dst, 0, 0);
}

function drawActiveSquishyCanvas(canvas, squishy, amount = 0) {
  const ctx = canvas.getContext("2d");
  const size = canvas.width;
  paintSquishyToCanvas(ctx, size, squishy);
  applyPinchWarp(ctx, size, amount);
}

function redrawActiveCanvas() {
  const canvas = document.querySelector(".active-squishy-canvas");
  if (!canvas) return;
  drawActiveSquishyCanvas(canvas, getSquishy(state.active));
}

let squishAnimFrame = null;

function playSquishAnimation(canvas, squishy) {
  if (squishAnimFrame) cancelAnimationFrame(squishAnimFrame);
  const duration = 450;
  const start = performance.now();

  function tick(now) {
    const t = Math.min(1, (now - start) / duration);
    const wave = Math.sin(t * Math.PI); // 0 -> 1 -> 0, a press-and-release curve
    const amount = wave * 0.45;
    drawActiveSquishyCanvas(canvas, squishy, amount);
    if (t < 1) {
      squishAnimFrame = requestAnimationFrame(tick);
    } else {
      squishAnimFrame = null;
      drawActiveSquishyCanvas(canvas, squishy, 0);
    }
  }
  squishAnimFrame = requestAnimationFrame(tick);
}

function renderNav() {
  const nav = document.getElementById("side-nav");
  if (!nav) return;
  const page = document.body.dataset.page;
  const links = [
    { key: "spelling", label: "✏️ Spelling", href: "index.html" },
    { key: "whichone", label: "🔤 Which One?", href: "whichone.html" },
    { key: "vocab", label: "📖 Vocab", href: "vocab.html" },
    { key: "math", label: "🔢 Math", href: "math.html" },
    { key: "geography", label: "🗺️ World Map", href: "geography.html" },
    { key: "store", label: "🛍️ Squishy Shop", href: "store.html" },
  ];
  nav.innerHTML = `
    <p class="brand">Squishy<span>Study</span></p>
    <div class="checker-strip"></div>
    ${links
      .map(
        (l) =>
          `<a class="nav-link ${l.key === page ? "active" : ""}" href="${l.href}">${l.label}</a>`
      )
      .join("")}
    <div class="checker-strip"></div>
  `;
}

function renderSquishyPanel() {
  const panel = document.getElementById("squishy-panel");
  if (!panel) return;

  const active = getSquishy(state.active) || getSquishy(FREE_SQUISHY_ID);
  const ownedOthers = state.owned.filter((id) => id !== active.id);

  panel.innerHTML = `
    <div class="cheetah-strip"></div>
    <div class="points-badge">⭐ ${state.points} pts</div>
    <h3>My Squishy</h3>
    <div class="active-squishy-wrap">
      <div class="squishy-thumb size-large active-thumb" title="Tap to squish!">
        <canvas class="active-squishy-canvas" width="200" height="200"></canvas>
      </div>
      <div class="active-squishy-name">${active.name}</div>
      <div class="squish-hint">👆 tap to squish!</div>
    </div>
    ${
      ownedOthers.length
        ? `<h3>Also Owned</h3><div class="owned-row">${ownedOthers
            .map((id) => squishyThumbHTML(getSquishy(id), "small"))
            .join("")}</div>`
        : ""
    }
    <div class="panel-hint">
      ${
        state.owned.length < SQUISHIES.length
          ? `Earn ${SQUISHY_PRICE} pts to unlock more squishies in the <a href="store.html">Shop</a>!`
          : `You collected every squishy! 🎉`
      }
    </div>
    <div class="cheetah-strip"></div>
  `;

  // paint + wire up the click-to-squish canvas
  const activeCanvas = panel.querySelector(".active-squishy-canvas");
  if (activeCanvas) {
    drawActiveSquishyCanvas(activeCanvas, active, 0);
    activeCanvas.addEventListener("click", () => {
      playSquishAnimation(activeCanvas, active);
    });
  }

  // clicking a small owned squishy makes it active
  panel.querySelectorAll(".squishy-thumb.size-small").forEach((el) => {
    el.addEventListener("click", () => {
      state.active = Number(el.dataset.id);
      saveState(state);
      renderSquishyPanel();
      bounceActiveSquishy();
    });
  });
}

function bounceActiveSquishy() {
  const canvas = document.querySelector(".active-squishy-canvas");
  if (canvas) {
    playSquishAnimation(canvas, getSquishy(state.active));
  }
}

function refreshPointsDisplay() {
  renderSquishyPanel();
}

/* ---------------- Utility ---------------- */

function shuffle(array) {
  const arr = array.slice();
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

const VOICE_PREFS_KEY = "squishyStudyVoicePrefs";

function loadVoicePrefs() {
  try {
    const raw = localStorage.getItem(VOICE_PREFS_KEY);
    if (!raw) return { voiceName: null, rate: 0.85 };
    return JSON.parse(raw);
  } catch (e) {
    return { voiceName: null, rate: 0.85 };
  }
}

function saveVoicePrefs(prefs) {
  try {
    localStorage.setItem(VOICE_PREFS_KEY, JSON.stringify(prefs));
  } catch (e) {
    /* ignore */
  }
}

function getEnglishVoices() {
  if (!("speechSynthesis" in window)) return [];
  return window.speechSynthesis.getVoices().filter((v) => v.lang.toLowerCase().startsWith("en"));
}

function speak(word) {
  if (!("speechSynthesis" in window)) {
    alert("Sorry, this browser can't read words out loud.");
    return;
  }
  window.speechSynthesis.cancel();
  const prefs = loadVoicePrefs();
  const utterance = new SpeechSynthesisUtterance(word);
  utterance.rate = prefs.rate || 0.85;

  const voices = getEnglishVoices();
  if (prefs.voiceName) {
    const match = voices.find((v) => v.name === prefs.voiceName);
    if (match) utterance.voice = match;
  }
  window.speechSynthesis.speak(utterance);
}

/* ============================================================
   VOICE SETTINGS (spelling page)
   ============================================================ */

function initVoiceSettings() {
  const wrap = document.getElementById("voice-settings");
  if (!wrap) return;

  function populate() {
    const voices = getEnglishVoices();
    const prefs = loadVoicePrefs();
    const select = document.getElementById("voice-pick");
    if (!select) return;

    if (!voices.length) {
      select.innerHTML = `<option value="">Loading voices...</option>`;
      return;
    }

    select.innerHTML = voices
      .map((v) => `<option value="${v.name}">${v.name} (${v.lang})</option>`)
      .join("");

    if (prefs.voiceName && voices.some((v) => v.name === prefs.voiceName)) {
      select.value = prefs.voiceName;
    } else {
      select.value = voices[0].name;
      saveVoicePrefs({ ...prefs, voiceName: voices[0].name });
    }
  }

  wrap.innerHTML = `
    <div class="voice-settings-inner">
      <label for="voice-pick">🔊 Voice</label>
      <select id="voice-pick"></select>
      <label for="voice-speed">Speed</label>
      <input type="range" id="voice-speed" min="0.5" max="1.1" step="0.05">
      <button class="voice-test-btn" id="voice-test">Test</button>
    </div>`;

  const prefs = loadVoicePrefs();
  document.getElementById("voice-speed").value = prefs.rate || 0.85;

  populate();
  if ("speechSynthesis" in window) {
    window.speechSynthesis.onvoiceschanged = populate;
  }

  document.getElementById("voice-pick").addEventListener("change", (e) => {
    const p = loadVoicePrefs();
    saveVoicePrefs({ ...p, voiceName: e.target.value });
    speak("hello");
  });

  document.getElementById("voice-speed").addEventListener("change", (e) => {
    const p = loadVoicePrefs();
    saveVoicePrefs({ ...p, rate: parseFloat(e.target.value) });
    speak("hello");
  });

  document.getElementById("voice-test").addEventListener("click", () => {
    speak("spelling");
  });
}

/* ============================================================
   SPELLING PAGE
   ============================================================ */

function initSpellingPage() {
  const root = document.getElementById("spelling-root");
  if (!root) return;

  let queue = shuffle(SPELLING_WORDS);
  let index = 0;
  let mode = "ask"; // "ask" | "retry"

  function currentWord() {
    return queue[index];
  }

  function render() {
    if (index >= queue.length) {
      root.innerHTML = `
        <div class="finished-box">
          <div class="big-emoji">🎉</div>
          <h2>You finished all the spelling words!</h2>
          <button class="primary-btn" id="play-again">Play Again</button>
        </div>`;
      document.getElementById("play-again").addEventListener("click", () => {
        queue = shuffle(SPELLING_WORDS);
        index = 0;
        mode = "ask";
        render();
      });
      return;
    }

    const word = currentWord();

    if (mode === "ask") {
      root.innerHTML = `
        <p class="progress-line">Word ${index + 1} of ${queue.length}</p>
        <div class="quiz-card">
          <button class="speaker-btn" id="speak-btn" aria-label="Hear the word">🔊</button>
          <div>
            <input type="text" class="spelling-input" id="spelling-input"
                   placeholder="Type the word..." autocomplete="off" autocapitalize="off" spellcheck="false">
          </div>
          <button class="submit-btn" id="submit-btn">Submit</button>
          <div class="feedback" id="feedback"></div>
        </div>`;

      document.getElementById("speak-btn").addEventListener("click", () => speak(word));
      const input = document.getElementById("spelling-input");
      const submit = document.getElementById("submit-btn");

      function trySubmit() {
        const guess = input.value.trim().toLowerCase();
        if (!guess) return;
        const feedback = document.getElementById("feedback");
        if (guess === word.toLowerCase()) {
          addPoints(POINTS_PER_QUESTION);
          refreshPointsDisplay();
          bounceActiveSquishy();
          feedback.textContent = `Correct! +${POINTS_PER_QUESTION} pts 🎉`;
          feedback.className = "feedback show correct";
          submit.disabled = true;
          input.disabled = true;
          setTimeout(() => {
            index++;
            render();
          }, 1000);
        } else {
          mode = "retry";
          render();
        }
      }

      submit.addEventListener("click", trySubmit);
      input.addEventListener("keydown", (e) => {
        if (e.key === "Enter") trySubmit();
      });
      input.focus();

      // speak automatically when a new word appears
      speak(word);
    } else {
      // retry mode — show correct spelling, must retype exactly
      root.innerHTML = `
        <p class="progress-line">Word ${index + 1} of ${queue.length}</p>
        <div class="quiz-card">
          <button class="speaker-btn" id="speak-btn" aria-label="Hear the word">🔊</button>
          <div class="feedback show incorrect">Not quite! The word is:</div>
          <div class="retry-word">${word}</div>
          <div>
            <input type="text" class="spelling-input" id="spelling-input"
                   placeholder="Now type it correctly..." autocomplete="off" autocapitalize="off" spellcheck="false">
          </div>
          <button class="submit-btn" id="submit-btn">Submit</button>
          <div class="feedback" id="feedback"></div>
        </div>`;

      document.getElementById("speak-btn").addEventListener("click", () => speak(word));
      const input = document.getElementById("spelling-input");
      const submit = document.getElementById("submit-btn");

      function tryRetry() {
        const guess = input.value.trim().toLowerCase();
        if (!guess) return;
        const feedback = document.getElementById("feedback");
        if (guess === word.toLowerCase()) {
          addPoints(POINTS_PER_QUESTION);
          refreshPointsDisplay();
          bounceActiveSquishy();
          feedback.textContent = `Nice fix! +${POINTS_PER_QUESTION} pts 🎉`;
          feedback.className = "feedback show correct";
          submit.disabled = true;
          input.disabled = true;
          setTimeout(() => {
            mode = "ask";
            index++;
            render();
          }, 1000);
        } else {
          feedback.textContent = "Almost — check each letter and try again!";
          feedback.className = "feedback show incorrect";
        }
      }

      submit.addEventListener("click", tryRetry);
      input.addEventListener("keydown", (e) => {
        if (e.key === "Enter") tryRetry();
      });
      input.focus();
    }
  }

  render();
}

/* ============================================================
   WHICH ONE IS RIGHT? PAGE
   ============================================================ */

function initWhichOnePage() {
  const root = document.getElementById("whichone-root");
  if (!root) return;

  let queue = shuffle(SPELLING_CHOICES);
  let index = 0;

  function render() {
    if (index >= queue.length) {
      root.innerHTML = `
        <div class="finished-box">
          <div class="big-emoji">🎉</div>
          <h2>You finished every word!</h2>
          <button class="primary-btn" id="play-again">Play Again</button>
        </div>`;
      document.getElementById("play-again").addEventListener("click", () => {
        queue = shuffle(SPELLING_CHOICES);
        index = 0;
        render();
      });
      return;
    }

    const q = queue[index];
    const choices = shuffle([q.correct, ...q.wrong]);
    let answered = false;

    root.innerHTML = `
      <p class="progress-line">Word ${index + 1} of ${queue.length}</p>
      <div class="quiz-card">
        <p class="vocab-definition" style="font-size:1.1rem;">Which spelling is correct?</p>
        <div class="vocab-choices">
          ${choices
            .map(
              (c) => `<button class="vocab-choice" data-word="${c}">${c}</button>`
            )
            .join("")}
        </div>
        <button class="primary-btn next-btn" id="next-btn" style="display:none;">Next Word</button>
      </div>`;

    const buttons = root.querySelectorAll(".vocab-choice");
    buttons.forEach((btn) => {
      btn.addEventListener("click", () => {
        if (answered) return;
        answered = true;
        buttons.forEach((b) => (b.disabled = true));
        if (btn.dataset.word === q.correct) {
          btn.classList.add("correct");
          addPoints(POINTS_PER_QUESTION);
          refreshPointsDisplay();
          bounceActiveSquishy();
        } else {
          btn.classList.add("incorrect");
          const correctBtn = [...buttons].find((b) => b.dataset.word === q.correct);
          if (correctBtn) correctBtn.classList.add("correct");
        }
        document.getElementById("next-btn").style.display = "inline-block";
      });
    });

    document.getElementById("next-btn").addEventListener("click", () => {
      index++;
      render();
    });
  }

  render();
}

/* ============================================================
   VOCAB PAGE
   ============================================================ */

function initVocabPage() {
  const root = document.getElementById("vocab-root");
  if (!root) return;

  let queue = shuffle(VOCAB_WORDS);
  let index = 0;

  function render() {
    if (index >= queue.length) {
      root.innerHTML = `
        <div class="finished-box">
          <div class="big-emoji">🎉</div>
          <h2>You finished all the vocab words!</h2>
          <button class="primary-btn" id="play-again">Play Again</button>
        </div>`;
      document.getElementById("play-again").addEventListener("click", () => {
        queue = shuffle(VOCAB_WORDS);
        index = 0;
        render();
      });
      return;
    }

    const q = queue[index];
    const distractors = shuffle(
      VOCAB_WORDS.filter((v) => v.term !== q.term)
    ).slice(0, 2);
    const choices = shuffle([q, ...distractors]);
    let answered = false;

    root.innerHTML = `
      <p class="progress-line">Word ${index + 1} of ${queue.length}</p>
      <div class="quiz-card">
        <div class="vocab-definition">${q.def}</div>
        <div class="vocab-choices">
          ${choices
            .map(
              (c) =>
                `<button class="vocab-choice" data-term="${c.term}">${c.term}</button>`
            )
            .join("")}
        </div>
        <button class="primary-btn next-btn" id="next-btn" style="display:none;">Next Word</button>
      </div>`;

    const buttons = root.querySelectorAll(".vocab-choice");
    buttons.forEach((btn) => {
      btn.addEventListener("click", () => {
        if (answered) return;
        answered = true;
        buttons.forEach((b) => (b.disabled = true));
        if (btn.dataset.term === q.term) {
          btn.classList.add("correct");
          addPoints(POINTS_PER_QUESTION);
          refreshPointsDisplay();
          bounceActiveSquishy();
        } else {
          btn.classList.add("incorrect");
          const correctBtn = [...buttons].find((b) => b.dataset.term === q.term);
          if (correctBtn) correctBtn.classList.add("correct");
        }
        document.getElementById("next-btn").style.display = "inline-block";
      });
    });

    document.getElementById("next-btn").addEventListener("click", () => {
      index++;
      render();
    });
  }

  render();
}

/* ============================================================
   WORLD MAP PAGE
   ============================================================ */

function initMapPage() {
  const root = document.getElementById("map-root");
  if (!root) return;

  let roundLabels = [];
  let wordBank = [];
  let resultState = {};

  function newRound() {
    roundLabels = shuffle(MAP_LABELS).slice(0, 3);
    const others = MAP_LABELS.filter((l) => !roundLabels.includes(l));
    const distractors = shuffle(others).slice(0, 3);
    wordBank = shuffle([...roundLabels, ...distractors]);
    resultState = {};
    roundLabels.forEach((l) => (resultState[l.id] = "pending"));
    render();
  }

  function coverHTML(l) {
    const state = resultState[l.id];
    const style = `left:${l.x - l.w / 2}%; top:${l.y - l.h / 2}%; width:${l.w}%; height:${l.h}%;`;
    if (state === "correct") {
      return `<div class="map-cover correct" style="${style}"><span>${l.text}</span></div>`;
    }
    if (state === "retry") {
      return `<div class="map-cover revealed" style="${style}">
        <input type="text" data-id="${l.id}" placeholder="${l.text}"
               autocomplete="off" autocapitalize="off" spellcheck="false">
      </div>`;
    }
    return `<div class="map-cover" style="${style}">
      <input type="text" data-id="${l.id}" placeholder="?"
             autocomplete="off" autocapitalize="off" spellcheck="false">
    </div>`;
  }

  function render() {
    const allDone = roundLabels.every((l) => resultState[l.id] === "correct");

    root.innerHTML = `
      <div class="map-wrap">
        <img src="images/world-map.png" alt="World map with some labels to guess">
        ${roundLabels.map(coverHTML).join("")}
      </div>
      <div class="word-bank">
        ${wordBank.map((l) => `<span class="word-chip">${l.text}</span>`).join("")}
      </div>
      <div class="map-actions">
        ${
          allDone
            ? `<button class="primary-btn" id="map-next">Next Round</button>`
            : `<button class="submit-btn" id="map-submit">Check Answers</button>`
        }
      </div>
      <div class="feedback" id="map-feedback"></div>
    `;

    let lastFocused = null;
    const inputs = root.querySelectorAll(".map-cover input");
    inputs.forEach((inp) => {
      inp.addEventListener("focus", () => {
        lastFocused = inp;
      });
      inp.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
          const btn = document.getElementById("map-submit");
          if (btn) btn.click();
        }
      });
    });
    if (inputs.length) inputs[0].focus();

    root.querySelectorAll(".word-chip").forEach((chip) => {
      chip.addEventListener("click", () => {
        const target = lastFocused || root.querySelector(".map-cover input");
        if (target) {
          target.value = chip.textContent;
          target.focus();
        }
      });
    });

    if (allDone) {
      document.getElementById("map-next").addEventListener("click", newRound);
    } else {
      document.getElementById("map-submit").addEventListener("click", checkAnswers);
    }
  }

  function checkAnswers() {
    let anyWrong = false;
    let anyNewlyCorrect = false;

    roundLabels.forEach((l) => {
      if (resultState[l.id] === "correct") return;
      const input = root.querySelector(`input[data-id="${l.id}"]`);
      if (!input) return;
      const guess = input.value.trim().toLowerCase();
      if (guess === l.text.toLowerCase()) {
        resultState[l.id] = "correct";
        addPoints(POINTS_PER_QUESTION);
        anyNewlyCorrect = true;
      } else {
        resultState[l.id] = "retry";
        anyWrong = true;
      }
    });

    if (anyNewlyCorrect) {
      refreshPointsDisplay();
      bounceActiveSquishy();
    }

    render();

    const fb = document.getElementById("map-feedback");
    if (fb) {
      fb.className = "feedback show " + (anyWrong ? "incorrect" : "correct");
      fb.textContent = anyWrong
        ? "Not quite — the answer is shown, type it to earn your points!"
        : "All correct! Great job! 🎉";
    }
  }

  newRound();
}

/* ============================================================
   MATH PAGE
   ============================================================ */

const MATH_PEN_COLORS = ["#ff6fb5", "#9b5de5", "#5ec8f2", "#2fbf71", "#ffb703", "#4a1c63"];

function initMathPage() {
  const root = document.getElementById("math-root");
  if (!root) return;

  let mode = "division";

  function renderTabs() {
    return `
      <div class="math-tabs">
        <button class="math-tab ${mode === "division" ? "active" : ""}" data-mode="division">➗ Division</button>
        <button class="math-tab ${mode === "multiplication" ? "active" : ""}" data-mode="multiplication">✖️ Multiplication</button>
        <button class="math-tab ${mode === "numberline" ? "active" : ""}" data-mode="numberline">📏 Number Line</button>
      </div>
      <div id="math-mode-root"></div>`;
  }

  function renderShell() {
    root.innerHTML = renderTabs();
    root.querySelectorAll(".math-tab").forEach((btn) => {
      btn.addEventListener("click", () => {
        mode = btn.dataset.mode;
        renderShell();
      });
    });
    const modeRoot = document.getElementById("math-mode-root");
    if (mode === "division") renderDivision(modeRoot);
    else if (mode === "multiplication") renderMultiplication(modeRoot);
    else renderNumberLine(modeRoot);
  }

  // Shared answer-check UI: renders input + submit, handles retry-until-correct,
  // then calls onNext() when the person asks for a new problem.
  function renderAnswerArea(container, correctAnswer, onNext) {
    const box = document.createElement("div");
    box.className = "math-answer-box";
    box.innerHTML = `
      <input type="number" class="spelling-input math-answer-input" placeholder="Your answer" autocomplete="off">
      <button class="submit-btn" id="math-submit">Submit</button>
      <div class="feedback" id="math-feedback"></div>
    `;
    container.appendChild(box);

    const input = box.querySelector(".math-answer-input");
    const submit = box.querySelector("#math-submit");
    const feedback = box.querySelector("#math-feedback");
    let retryMode = false;

    function trySubmit() {
      const guess = parseInt(input.value, 10);
      if (isNaN(guess)) return;
      if (guess === correctAnswer) {
        addPoints(POINTS_PER_QUESTION);
        refreshPointsDisplay();
        bounceActiveSquishy();
        feedback.textContent = retryMode
          ? `Nice fix! +${POINTS_PER_QUESTION} pts 🎉`
          : `Correct! +${POINTS_PER_QUESTION} pts 🎉`;
        feedback.className = "feedback show correct";
        submit.disabled = true;
        input.disabled = true;
        const nextBtn = document.createElement("button");
        nextBtn.className = "primary-btn next-btn";
        nextBtn.textContent = "Next Problem";
        nextBtn.addEventListener("click", onNext);
        box.appendChild(nextBtn);
      } else if (!retryMode) {
        retryMode = true;
        feedback.textContent = `Not quite! The answer is ${correctAnswer}. Type it to earn your points.`;
        feedback.className = "feedback show incorrect";
        input.value = "";
        input.focus();
      } else {
        feedback.textContent = "Almost — try typing that number again!";
        feedback.className = "feedback show incorrect";
      }
    }

    submit.addEventListener("click", trySubmit);
    input.addEventListener("keydown", (e) => {
      if (e.key === "Enter") trySubmit();
    });
    input.focus();
  }

  function renderDivision(container) {
    const problem = generateDivisionProblem();
    container.innerHTML = `
      <div class="quiz-card math-card">
        <p class="math-problem-text">${problem.text}</p>
        <p class="math-hint">Pick a color and circle equal groups to help you figure it out!</p>
        <div class="pen-palette" id="pen-palette">
          ${MATH_PEN_COLORS.map(
            (c, i) => `<button class="pen-swatch ${i === 0 ? "active" : ""}" style="background:${c}" data-color="${c}"></button>`
          ).join("")}
          <button class="clear-btn" id="clear-canvas">Clear</button>
        </div>
        <div class="dot-board-wrap" id="dot-board-wrap">
          <div class="dot-layer" id="dot-layer">
            ${Array.from({ length: problem.total }, () => `<span class="math-dot"></span>`).join("")}
          </div>
          <canvas class="draw-canvas" id="draw-canvas"></canvas>
        </div>
      </div>
      <div id="math-answer-container"></div>
    `;

    setupDrawingBoard();
    renderAnswerArea(document.getElementById("math-answer-container"), problem.answer, () =>
      renderDivision(container)
    );
  }

  function renderMultiplication(container) {
    const problem = generateMultiplicationProblem();
    container.innerHTML = `
      <div class="quiz-card math-card">
        <p class="math-problem-text">${problem.text}</p>
      </div>
      <div id="math-answer-container"></div>
    `;
    renderAnswerArea(document.getElementById("math-answer-container"), problem.answer, () =>
      renderMultiplication(container)
    );
  }

  function renderNumberLine(container) {
    const target = Math.floor(Math.random() * (NUMBERLINE_MAX + 1));
    const svgW = 600;
    const svgH = 120;
    const marginX = 30;
    const usableW = svgW - marginX * 2;
    const xFor = (n) => marginX + (n / NUMBERLINE_MAX) * usableW;

    let ticks = "";
    for (let n = 0; n <= NUMBERLINE_MAX; n++) {
      const x = xFor(n);
      const isFive = n % 5 === 0;
      ticks += `<line x1="${x}" y1="50" x2="${x}" y2="${isFive ? 70 : 62}" stroke="#4a1c63" stroke-width="${isFive ? 2.5 : 1.5}" />`;
      if (isFive) {
        ticks += `<text x="${x}" y="90" text-anchor="middle" font-family="Baloo 2, sans-serif" font-weight="700" font-size="16" fill="#4a1c63">${n}</text>`;
      }
    }

    const markerX = xFor(target);

    container.innerHTML = `
      <div class="quiz-card math-card">
        <p class="math-problem-text">What number is the dot pointing to?</p>
        <svg viewBox="0 0 ${svgW} ${svgH}" class="number-line-svg" xmlns="http://www.w3.org/2000/svg">
          <line x1="${marginX}" y1="60" x2="${svgW - marginX}" y2="60" stroke="#4a1c63" stroke-width="3" />
          ${ticks}
          <circle cx="${markerX}" cy="60" r="8" fill="#ff6fb5" stroke="#4a1c63" stroke-width="2" />
        </svg>
      </div>
      <div id="math-answer-container"></div>
    `;
    renderAnswerArea(document.getElementById("math-answer-container"), target, () =>
      renderNumberLine(container)
    );
  }

  function setupDrawingBoard() {
    const wrap = document.getElementById("dot-board-wrap");
    const dotLayer = document.getElementById("dot-layer");
    const canvas = document.getElementById("draw-canvas");
    if (!wrap || !canvas) return;

    function sizeCanvas() {
      const rect = dotLayer.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = rect.height;
      wrap.style.height = rect.height + "px";
    }
    sizeCanvas();

    const ctx = canvas.getContext("2d");
    ctx.lineWidth = 5;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    let drawing = false;
    let currentColor = MATH_PEN_COLORS[0];

    function pos(e) {
      const rect = canvas.getBoundingClientRect();
      const point = e.touches ? e.touches[0] : e;
      return { x: point.clientX - rect.left, y: point.clientY - rect.top };
    }

    function start(e) {
      drawing = true;
      const p = pos(e);
      ctx.strokeStyle = currentColor;
      ctx.beginPath();
      ctx.moveTo(p.x, p.y);
      e.preventDefault();
    }
    function move(e) {
      if (!drawing) return;
      const p = pos(e);
      ctx.lineTo(p.x, p.y);
      ctx.stroke();
      e.preventDefault();
    }
    function end() {
      drawing = false;
    }

    canvas.addEventListener("mousedown", start);
    canvas.addEventListener("mousemove", move);
    window.addEventListener("mouseup", end);
    canvas.addEventListener("touchstart", start, { passive: false });
    canvas.addEventListener("touchmove", move, { passive: false });
    canvas.addEventListener("touchend", end);

    document.getElementById("pen-palette").querySelectorAll(".pen-swatch").forEach((btn) => {
      btn.addEventListener("click", () => {
        currentColor = btn.dataset.color;
        document.querySelectorAll(".pen-swatch").forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");
      });
    });
    document.getElementById("clear-canvas").addEventListener("click", () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    });
  }

  renderShell();
}

/* ============================================================
   STORE PAGE
   ============================================================ */

function initStorePage() {
  const root = document.getElementById("store-root");
  if (!root) return;

  function render() {
    root.innerHTML = `
      <div class="store-grid">
        ${SQUISHIES.map((sq) => {
          const owned = state.owned.includes(sq.id);
          const canAfford = state.points >= SQUISHY_PRICE;
          return `
            <div class="store-card ${owned ? "owned" : ""}">
              ${squishyThumbHTML(sq, "large")}
              <h3>${sq.name}</h3>
              ${
                owned
                  ? `<div class="owned-tag">Owned ✓</div>`
                  : `<div class="store-price">${SQUISHY_PRICE} pts</div>
                     <button class="buy-btn" data-id="${sq.id}" ${
                      canAfford ? "" : "disabled"
                    }>${canAfford ? "Buy" : `Need ${SQUISHY_PRICE - state.points} more`}</button>`
              }
            </div>`;
        }).join("")}
      </div>`;

    root.querySelectorAll(".buy-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        const id = Number(btn.dataset.id);
        if (state.points < SQUISHY_PRICE || state.owned.includes(id)) return;
        state.points -= SQUISHY_PRICE;
        state.owned.push(id);
        state.active = id;
        saveState(state);
        refreshPointsDisplay();
        render();
      });
    });
  }

  render();
}

/* ---------------- Boot ---------------- */

document.addEventListener("DOMContentLoaded", () => {
  renderNav();
  renderSquishyPanel();
  initVoiceSettings();
  initSpellingPage();
  initWhichOnePage();
  initVocabPage();
  initMathPage();
  initMapPage();
  initStorePage();
});
