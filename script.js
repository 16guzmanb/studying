/* ============================================================
   Squishy Study — shared script
   Handles: saved state, squishy sidebar, nav highlighting,
   spelling quiz, vocab quiz, squishy store
   ============================================================ */

/* ---------------- Data ---------------- */

const SQUISHIES = [
  { id: 1, name: "Berry Blob",    emoji: "🍓", img: "images/squishy1.jpg" },
  { id: 2, name: "Cloud Puff",    emoji: "☁️", img: "images/squishy2.jpg" },
  { id: 3, name: "Star Sparkle",  emoji: "⭐", img: "images/squishy3.jpg" },
  { id: 4, name: "Kitty Cheetah", emoji: "🐆", img: "images/squishy4.jpg" },
  { id: 5, name: "Rainbow Swirl", emoji: "🌈", img: "images/squishy5.jpg" },
];

const FREE_SQUISHY_ID = 1;
const SQUISHY_PRICE = 100;
const POINTS_PER_QUESTION = 5;

const SPELLING_WORDS = [
  "lay", "real", "trail", "sweet", "today", "dream", "sleep", "tea",
  "treat", "afraid", "leave", "bait", "speed", "lead", "flavor",
  "even", "between", "pavement",
];

const VOCAB_WORDS = [
  { term: "venturing",   def: "You are going somewhere that is unfamiliar and may be unsafe." },
  { term: "predictable", def: "Just what you expected, with no surprises." },
  { term: "emergency",   def: "An unexpected situation that requires help or quick action to make it better." },
  { term: "consult",     def: "You look at it to find information." },
  { term: "distract",    def: "You focus attention away from something." },
  { term: "drastic",     def: "To do something very different from what you have always done." },
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
      ${squishyThumbHTML(active, "large", "active-thumb")}
      <div class="active-squishy-name">${active.name}</div>
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

  // clicking a small owned squishy makes it active
  panel.querySelectorAll(".squishy-thumb.size-small").forEach((el) => {
    el.addEventListener("click", () => {
      state.active = Number(el.dataset.id);
      saveState(state);
      renderSquishyPanel();
      const activeEl = panel.querySelector(".active-thumb");
      if (activeEl) {
        activeEl.classList.add("squish-bounce");
        setTimeout(() => activeEl.classList.remove("squish-bounce"), 500);
      }
    });
  });
}

function bounceActiveSquishy() {
  const activeEl = document.querySelector(".active-thumb");
  if (activeEl) {
    activeEl.classList.add("squish-bounce");
    setTimeout(() => activeEl.classList.remove("squish-bounce"), 500);
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
