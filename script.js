/* ============================================================
   Squishy Study — shared script
   Handles: saved state, squishy sidebar, nav highlighting,
   spelling quiz, vocab quiz, squishy store
   ============================================================ */

/* ---------------- Data ---------------- */

const SQUISHIES = [
  { id: 1, name: "Squish Cube",     emoji: "🩷", img: "images/squishy1.png" },
  { id: 2, name: "Galaxy Dumpling", emoji: "🥟", img: "images/squishy2.png" },
  { id: 3, name: "Pink Bao",        emoji: "🥮", img: "images/squishy3.png" },
  { id: 4, name: "Galaxy Blob",     emoji: "🔮", img: "images/squishy4.png" },
  { id: 5, name: "Butter Stick",    emoji: "🧈", img: "images/squishy5.png" },
  { id: 6, name: "Honey Hamster",   emoji: "🐹", img: "images/squishy6.png" },
  { id: 7, name: "Cheese Cube",     emoji: "🧀", img: "images/squishy7.png" },
  { id: 8, name: "Sparkle Bun",     emoji: "✨", img: "images/squishy8.png" },
  { id: 9, name: "Strawberry",      emoji: "🍓", img: "images/squishy9.png" },
];

const FREE_SQUISHY_ID = 1;
const SQUISHY_PRICE = 100;
const POINTS_PER_QUESTION = 5;

const SPELLING_WORDS = [
  "load", "open", "told", "yellow", "soak", "shadow", "toe", "follow",
  "glow", "sold", "window", "almost", "most", "doe", "chosen", "approach",
  "alone", "below",
];

const VOCAB_WORDS = [
  { term: "express",   def: "Show what you feel and think." },
  { term: "convey",    def: "Communicate or make an idea understandable to someone." },
  { term: "chronicle", def: "A story or account of a series of events." },
  { term: "creative",  def: "Imagine ideas and invent new things." },
  { term: "video",     def: "A recording of movements and actions that you can see on a television or computer screen." },
  { term: "hydrant",   def: "An outdoor pipe firefighters use to get water to put out fires." },
  { term: "block",     def: "A section of a community with streets on all of its sides." },
  { term: "costumes",  def: "Special clothes that people may wear to pretend that they are from another time or place." },
  { term: "march",     def: "Walk with even steps, often in a group." },
];

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
    { key: "vocab", label: "📖 Vocab", href: "vocab.html" },
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

function speak(word) {
  if (!("speechSynthesis" in window)) {
    alert("Sorry, this browser can't read words out loud.");
    return;
  }
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(word);
  utterance.rate = 0.85;
  window.speechSynthesis.speak(utterance);
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
  initSpellingPage();
  initVocabPage();
  initStorePage();
});
