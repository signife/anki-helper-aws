export interface CardTemplate {
  Name: string;
  Front: string;
  Back: string;
}

export function buildCardTemplates(): CardTemplate[] {
 const front = `
<div class="jlpt-card jlpt-front">
  <div class="front-center no-select">
    <div class="word-area">
      <div id="frontWordCharacters" class="top-word-ruby word-ruby word-characters"></div>
      <span id="frontWordSource" hidden>{{Word}}</span>
    </div>

    <div class="front-extra front-hidden">
      {{#KanjiData}}<div class="front-kanji-data">{{KanjiData}}</div>{{/KanjiData}}
    </div>

    <div id="frontWordAudioStore" class="audio-store">{{WordAudio}}</div>
  </div>
</div>

<script>
(() => {
  const sourceEl = document.getElementById("frontWordSource");
  const wordEl = document.getElementById("frontWordCharacters");
  const pressArea = document.querySelector(".front-center");
  if (!sourceEl || !wordEl || !pressArea) return;

  for (const character of Array.from(sourceEl.textContent || "")) {
    const span = document.createElement("span");
    span.className = "word-character";
    span.textContent = character;
    wordEl.appendChild(span);
  }

  const hidden = pressArea.querySelectorAll(".front-hidden");
  let pressed = false;
  let timer = null;

  const show = () => hidden.forEach(el => el.classList.add("show"));
  const hide = () => hidden.forEach(el => el.classList.remove("show"));

  const start = event => {
    if (event.type === "touchstart") event.preventDefault();
    pressed = true;
    clearTimeout(timer);
    timer = setTimeout(() => {
      if (pressed) show();
    }, 500);
  };

  const end = () => {
    pressed = false;
    clearTimeout(timer);
    hide();
  };

  pressArea.addEventListener("mousedown", start);
  pressArea.addEventListener("mouseup", end);
  pressArea.addEventListener("mouseleave", end);
  pressArea.addEventListener("touchstart", start, { passive: false });
  pressArea.addEventListener("touchend", end, { passive: true });
  pressArea.addEventListener("touchcancel", end, { passive: true });
})();
<\/script>`;

  const back = `
<div class="jlpt-card jlpt-back">
  <div class="back-layout">
    <header class="back-header">
      <div class="word-area">
        <div id="backDisplayWord" class="top-word-ruby word-ruby word-characters">
          {{furigana:FuriganaWord}}
        </div>
        <span id="backWordSource" hidden>{{Word}}</span>
        <span id="backKanjiSource" hidden>{{KanjiData}}</span>
      </div>

      <div id="kanjiPopup" class="kanji-popup" hidden>
        <strong id="kanjiPopupTitle"></strong>
        <div id="kanjiPopupContent"></div>
      </div>

      <div class="mode-source" data-card-mode="{{CardMode}}" hidden></div>

      <div id="wordAudioStore" class="audio-store">{{WordAudio}}</div>
      <div id="examplesAudioStore" class="audio-store">{{ExamplesAudio}}</div>
      <div id="expressionsAudioStore" class="audio-store">{{ExpressionsAudio}}</div>

      <div class="meaning-divider"></div>

      <section id="definitionSection" class="meaning-section">
        <div class="definition">{{Definition}}</div>
      </section>

      <section id="nativeMeaningSection" class="meaning-section native-meaning-section">
        <div class="native-meaning">{{NativeMeaning}}</div>
      </section>

      <div class="meaning-divider"></div>
    </header>

    <div class="reading-controls">
      <label for="toggle-ruby" class="toggle-switch">
        <input type="checkbox" id="toggle-ruby">
        <span class="slider"></span>
        요미가나
      </label>
    </div>

    <main class="detail-tray">
      {{#Examples}}
      <section class="detail-section examples-section">
        <div class="content-list">{{Examples}}</div>
      </section>
      {{/Examples}}

      {{#Expressions}}
      <section class="detail-section expressions-section">
        <div class="detail-label">Common expressions</div>
        <div class="content-list">{{Expressions}}</div>
      </section>
      {{/Expressions}}

      {{#Synonyms}}
      <section class="detail-section synonyms-section">
        <div class="detail-label">Synonyms</div>
        <div class="content-list">{{Synonyms}}</div>
      </section>
      {{/Synonyms}}
    </main>
  </div>
</div>

<script>
(() => {
  const wordSourceEl = document.getElementById("backWordSource");
  const kanjiSourceEl = document.getElementById("backKanjiSource");
  const displayWordEl = document.getElementById("backDisplayWord");
  const popupEl = document.getElementById("kanjiPopup");
  const popupTitleEl = document.getElementById("kanjiPopupTitle");
  const popupContentEl = document.getElementById("kanjiPopupContent");

  const rawKanji = kanjiSourceEl?.textContent || "{}";

  let kanjiData = {};
  try {
    kanjiData = JSON.parse(rawKanji);
  } catch (_) {
    kanjiData = {};
  }

  const isKanji = character => /[\\u3400-\\u9FFF々]/.test(character);

  const hidePopup = () => {
    if (!popupEl) return;
    popupEl.hidden = true;
    popupEl.style.visibility = "hidden";
    document.querySelectorAll(".word-character.clicked").forEach(el => {
      el.classList.remove("clicked");
    });
  };

  const positionPopup = target => {
    if (!popupEl) return;

    popupEl.hidden = false;
    popupEl.style.visibility = "hidden";
    popupEl.style.left = "0px";
    popupEl.style.top = "0px";

    requestAnimationFrame(() => {
      const targetRect = target.getBoundingClientRect();
      const popupRect = popupEl.getBoundingClientRect();
      const edge = 10;

      let left = targetRect.left + targetRect.width / 2 - popupRect.width / 2;
      left = Math.max(edge, Math.min(left, window.innerWidth - popupRect.width - edge));

      let top = targetRect.bottom + 9;
      if (top + popupRect.height > window.innerHeight - edge) {
        top = Math.max(edge, targetRect.top - popupRect.height - 9);
      }

      popupEl.style.left = left + "px";
      popupEl.style.top = top + "px";
      popupEl.style.visibility = "visible";
    });
  };

  const attachKanjiPopup = span => {
    const character = span.textContent.trim();
    const info = kanjiData[character];

    if (!info || !popupEl || !popupTitleEl || !popupContentEl) return;

    span.classList.add("word-character-clickable");
    span.tabIndex = 0;
    span.setAttribute("role", "button");

    const showPopup = event => {
      event.preventDefault();
      event.stopPropagation();

      document.querySelectorAll(".word-character.clicked").forEach(el => {
        el.classList.remove("clicked");
      });

      span.classList.add("clicked");
      popupTitleEl.textContent = character;
      popupContentEl.textContent =
        typeof info === "string"
          ? info
          : JSON.stringify(info, null, 2);

      positionPopup(span);
    };

    span.addEventListener("click", showPopup);
    span.addEventListener("keydown", event => {
      if (event.key === "Enter" || event.key === " ") showPopup(event);
    });
  };

  const wrapKanjiTextNodes = root => {
    if (!root) return;

    const walker = document.createTreeWalker(
      root,
      NodeFilter.SHOW_TEXT,
      {
        acceptNode(node) {
          const parent = node.parentElement;
          if (!parent) return NodeFilter.FILTER_REJECT;
          if (parent.closest("rt, rp")) return NodeFilter.FILTER_REJECT;
          if (!node.textContent || !/[\\u3400-\\u9FFF々]/.test(node.textContent)) {
            return NodeFilter.FILTER_REJECT;
          }
          return NodeFilter.FILTER_ACCEPT;
        }
      }
    );

    const textNodes = [];
    while (walker.nextNode()) {
      textNodes.push(walker.currentNode);
    }

    for (const node of textNodes) {
      const fragment = document.createDocumentFragment();

      for (const character of Array.from(node.textContent)) {
        if (isKanji(character)) {
          const span = document.createElement("span");
          span.className = "word-character";
          span.textContent = character;
          attachKanjiPopup(span);
          fragment.appendChild(span);
        } else {
          fragment.appendChild(document.createTextNode(character));
        }
      }

      node.replaceWith(fragment);
    }
  };

  wrapKanjiTextNodes(displayWordEl);

  if (popupEl) {
    popupEl.addEventListener("click", event => event.stopPropagation());
    document.addEventListener("click", hidePopup);
    window.addEventListener("resize", hidePopup);
    window.addEventListener("scroll", hidePopup, true);
  }

  const mode = document.querySelector(".mode-source")?.dataset.cardMode || "jp-jp";
  const definition = document.getElementById("definitionSection");
  const nativeMeaning = document.getElementById("nativeMeaningSection");

  if (mode === "jp-native") {
    if (definition) definition.hidden = true;
    if (nativeMeaning) nativeMeaning.hidden = false;
  } else {
    if (definition) definition.hidden = false;
    if (nativeMeaning) nativeMeaning.hidden = true;
  }

  const toggleRuby = document.getElementById("toggle-ruby");
  const detailTray = document.querySelector(".detail-tray");

  if (toggleRuby) {
    const rts = [
      ...(displayWordEl ? displayWordEl.querySelectorAll("ruby rt") : []),
      ...(detailTray ? detailTray.querySelectorAll("ruby rt") : [])
    ];

    let rubyOn = localStorage.getItem("rubyOn");
    rubyOn = rubyOn === null ? true : rubyOn === "true";

    toggleRuby.checked = rubyOn;

    const updateRuby = () => {
      rts.forEach(rt => {
        rt.style.display = toggleRuby.checked ? "" : "none";
      });
    };

    updateRuby();

    toggleRuby.addEventListener("change", () => {
      localStorage.setItem("rubyOn", String(toggleRuby.checked));
      updateRuby();
    });
  }

  const flashClickedItem = item => {
    item.classList.remove("audio-flash");
    void item.offsetWidth;
    item.classList.add("audio-flash");

    clearTimeout(item.audioFlashTimer);
    item.audioFlashTimer = setTimeout(() => {
      item.classList.remove("audio-flash");
    }, 280);
  };

  const setupListAudio = (sectionSelector, audioStoreSelector) => {
  const items = document.querySelectorAll(sectionSelector + " .content-list li");
  const buttons = document.querySelectorAll(audioStoreSelector + " .replay-button");

  const MAX_TAP_MS = 200;
  const LONG_PRESS_MS = 250;
  const MOVE_LIMIT = 8;
  const SYNTHETIC_CLICK_BLOCK_MS = 900;

  items.forEach((item, index) => {
    item.classList.add("clickable-audio");

    let startX = 0;
    let startY = 0;
    let startAt = 0;

    let moved = false;
    let longPressed = false;
    let trackingTouch = false;

    let longPressTimer = null;
    let blockClickUntil = 0;
    let lastPlayedAt = 0;

    const hasTextSelection = () => {
      const selection = window.getSelection?.();
      return !!selection && selection.toString().trim().length > 0;
    };

    const stopAnkiCardTap = event => {
      event.stopPropagation();
      if (event.stopImmediatePropagation) {
        event.stopImmediatePropagation();
      }
    };

    const blockSyntheticClick = () => {
      blockClickUntil = Date.now() + SYNTHETIC_CLICK_BLOCK_MS;
    };

    const playItemAudio = event => {
      const now = Date.now();
      if (now - lastPlayedAt < 350) return;
      lastPlayedAt = now;

      stopAnkiCardTap(event);
      event.preventDefault();

      flashClickedItem(item);
      buttons[index]?.click();
    };

    const markMovedIfNeeded = point => {
      if (!point) return;

      const dx = Math.abs(point.clientX - startX);
      const dy = Math.abs(point.clientY - startY);

      if (dx > MOVE_LIMIT || dy > MOVE_LIMIT) {
        moved = true;
        clearTimeout(longPressTimer);
        blockSyntheticClick();
      }
    };

    item.addEventListener("touchstart", event => {
      if (event.touches.length !== 1) return;

      const touch = event.touches[0];

      startX = touch.clientX;
      startY = touch.clientY;
      startAt = Date.now();

      moved = false;
      longPressed = false;
      trackingTouch = true;

      clearTimeout(longPressTimer);

      longPressTimer = setTimeout(() => {
        longPressed = true;
        blockSyntheticClick();
      }, LONG_PRESS_MS);

   
      stopAnkiCardTap(event);
    }, { passive: true, capture: true });

    item.addEventListener("touchmove", event => {
      if (!trackingTouch) return;

      markMovedIfNeeded(event.touches[0]);
      stopAnkiCardTap(event);
    }, { passive: true, capture: true });

    item.addEventListener("touchend", event => {
      if (!trackingTouch) return;

      clearTimeout(longPressTimer);
      trackingTouch = false;

      markMovedIfNeeded(event.changedTouches[0]);

      const duration = Date.now() - startAt;

 
      blockSyntheticClick();

 
      stopAnkiCardTap(event);


      if (hasTextSelection()) return;

  
      if (moved) return;


      if (longPressed) return;


      if (duration > MAX_TAP_MS) return;


      playItemAudio(event);
    }, { passive: false, capture: true });

    item.addEventListener("touchcancel", event => {
      clearTimeout(longPressTimer);

      trackingTouch = false;
      moved = true;
      longPressed = true;

      blockSyntheticClick();
      stopAnkiCardTap(event);
    }, { passive: true, capture: true });

    item.addEventListener("click", event => {
      stopAnkiCardTap(event);

      const now = Date.now();

      
      if (now < blockClickUntil) {
        if (!hasTextSelection()) {
          event.preventDefault();
        }
        return;
      }


      if (hasTextSelection()) {
        return;
      }

      playItemAudio(event);
    }, { capture: true });
  });
};

setupListAudio(".examples-section", "#examplesAudioStore");
setupListAudio(".expressions-section", "#expressionsAudioStore");
})();
<\/script>`;

  return [{
    Name: "Japanese Dictionary Card",
    Front: front,
    Back: back
  }];
}

export function buildCardCss(fontStack: string): string {
  return `
* {
  box-sizing: border-box;
}

html,
body,
.card {
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 0;
  overflow: hidden;
}

.card {
  color: #f5f5f5;
  background: #222;
  font-family: ${fontStack};
  font-size: 18px;
  font-weight: 400;
  line-height: 1.65;
  text-align: left;
}

.jlpt-card {
  width: 100%;
  height: 100dvh;

  /* 상단 Word / 루비 전용 조절값 */
  --top-word-size: clamp(38px, 5.6vw, 54px);
  --top-word-ruby-size: .35em;
  --top-word-line-height: 1.16;
  --top-word-letter-spacing: .035em;

  /* 요미가나 색상: 예문 / Common expressions / 상단 Word ruby 공통 */
  --ruby-color: #666;

  /* 문장 클릭 반응 색상 */
  --audio-flash-bg: rgba(255,255,255,.48);
  --audio-flash-color: #000;
}

.no-select {
  user-select: none;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
}

.jlpt-front {
  display: block;
  padding: 0;
 
}

.front-center {
  width: 100%;
  min-height: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  gap: 18px;
  padding: 20px 18px 14px;
}

.back-layout {
  display: grid;
  grid-template-rows: auto auto minmax(0, 1fr);
  height: 100dvh;
  overflow: hidden;
}

.back-header {
  padding: 20px 18px 14px;
  
  text-align: center;
}

.word-area {
  display: flex;
  justify-content: center;
  width: 100%;
  text-align: center;
}


.word-ruby,
.word-ruby rb,
.word-characters,
.word-character,
.word-ruby rt {
  font-synthesis: none;
}

.word-ruby {
  font-family: ${fontStack} !important;
  font-size: clamp(2.05rem, 5.8vw, 2.65rem) !important;
  font-weight: 400 !important;
  line-height: 1.15 !important;
  letter-spacing: .02em !important;
  ruby-align: center;
}

.word-ruby rb,
.word-characters,
.word-character {
  font-family: ${fontStack} !important;
  font-size: inherit !important;
  font-weight: inherit !important;
  font-style: normal !important;
  line-height: inherit !important;
  letter-spacing: inherit !important;
}

.word-ruby rt {
  color: var(--ruby-color, #666);
  font-family: ${fontStack} !important;
  font-size: .32em !important;
  font-weight: 400 !important;
  line-height: 1.1 !important;
  letter-spacing: .04em !important;
}

/* 상단 Word 전용: 여기만 바꾸면 위쪽 단어 크기와 루비 크기만 따로 바뀜 */
#frontWordCharacters.top-word-ruby,
#backDisplayWord.top-word-ruby {
  font-size: var(--top-word-size) !important;
  line-height: var(--top-word-line-height) !important;
  letter-spacing: var(--top-word-letter-spacing) !important;
}

#frontWordCharacters.top-word-ruby rt,
#backDisplayWord.top-word-ruby rt {
  color: var(--ruby-color, #666) !important;
  font-size: var(--top-word-ruby-size) !important;
}

.word-character {
  display: inline;
  padding: 0 .018em;
  color: inherit;
}

.front-hidden {
  opacity: 0;
  visibility: hidden;
  pointer-events: none;
  transition: opacity .25s ease, visibility .25s ease;
}

.front-hidden.show {
  opacity: 1;
  visibility: visible;
}

.front-extra {
  min-height: 1.8em;
  margin-top: 8px;
  color: #d7d7d7;
  font-size: 1rem;
  text-align: center;
}

.word-audio,
.examples-audio {
  margin-top: 14px;
  text-align: center;
}

.word-audio .replay-button,
.examples-audio .replay-button {
  margin-left: auto !important;
  margin-right: auto !important;
}

.replay-button {
  display: inline-grid !important;
  place-items: center;
  width: 46px !important;
  height: 46px !important;
  margin: 0 !important;
  padding: 0 !important;
  border-radius: 50% !important;
}

.replay-button svg {
  width: 31px !important;
  height: 31px !important;
}

.meaning-divider {
  width: min(700px, 100%);
  height: 1px;
  margin: 15px auto;
  background: rgba(255,255,255,.22);
}

.reading-controls {
  position: relative;
  z-index: 5;
  padding: 0 18px 10px;
  text-align: center;
}

.detail-tray {
  position: relative;
  z-index: 1;
}

.toggle-switch {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  color: #ddd;
  font-family: ${fontStack};
  font-size: .85rem;
  font-weight: 400;
  line-height: 1.3;
  cursor: pointer;
  user-select: none;
}

.toggle-switch input {
  cursor: pointer;
}

.slider {
  display: inline-block;
}

.meaning-section {
  min-height: 1.7em;
  padding: 0 8px;
  text-align: center;
}

.audio-store {
  position: absolute;
  left: -9999px;
  top: auto;
  width: 1px;
  height: 1px;
  overflow: hidden;
  opacity: 0;
  pointer-events: none;
}

.clickable-audio {
  cursor: pointer;
  border-radius: 7px;
  transition: background-color .18s ease, color .18s ease, opacity .18s ease;
}

.clickable-audio:active {
  opacity: .72;
}

.clickable-audio.audio-flash {
  color: var(--audio-flash-color, #000);
  background: var(--audio-flash-bg, rgba(255,255,255,.48));
}

.definition {
  max-width: 700px;
  margin: 0 auto;
  color: #fff;
  font-family: ${fontStack};
  font-size: clamp(1.1rem, 3.2vw, 1.45rem);
  font-weight: 400;
  line-height: 1.45;
  text-align: center;
}

.native-meaning {
  max-width: 700px;
  margin: 0 auto;
  color: #fff;
  font-family: ${fontStack};
  font-size: clamp(1.15rem, 3.4vw, 1.55rem);
  font-weight: 400;
  line-height: 1.4;
  text-align: center;
}
.detail-tray {
  width: min(700px, calc(100% - 36px));
  min-height: 0;
  margin: 0 auto 14px;
  padding: 16px;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: none;
  color: #151515;
  background: rgba(176,176,176,.88);
  border-radius: 10px;
}

.detail-tray::-webkit-scrollbar {
  display: none;
}

.detail-section {
  margin: 0;
  padding: 0;
}

.detail-section + .detail-section {
  margin-top: 18px;
  padding-top: 16px;
  border-top: 1px solid rgba(40,40,40,.25);
}

.detail-label {
  margin-bottom: 10px;
  color: #252525;
  font-size: 1.05rem;
  font-weight: 700;
  text-align: center;
}

.content-list {
  color: #111;
  font-family: ${fontStack};
  font-size: 1.15rem;
  line-height: 1.8;
  text-align: center;
  word-break: keep-all;
  overflow-wrap: anywhere;
}

.content-list p:first-child,
.content-list ul:first-child,
.content-list ol:first-child {
  margin-top: 0;
}

.content-list p:last-child,
.content-list ul:last-child,
.content-list ol:last-child {
  margin-bottom: 0;
}

.content-list ul,
.content-list ol {
  margin-left: 0;
  padding-left: 0;
  list-style: none;
  text-align: center;
}
.content-list li {
  width: fit-content;
  max-width: 100%;
  margin: .65em auto;
  padding: .03em .38em;
  text-align: center;
}
.detail-tray,
.content-list,
.content-list li,
.content-list li * {
  user-select: text;
  -webkit-user-select: text;
  -webkit-touch-callout: default;
}

.content-list ruby {
  ruby-align: center;
}

.content-list ruby rt {
  color: var(--ruby-color, #666);
  font-family: ${fontStack};
  font-size: .58em;
  font-weight: 400;
  line-height: 1;
}

.word-character-clickable {
  cursor: pointer;
  border-radius: .08em;
}

.word-character-clickable.clicked {
  color: #d32f2f;
  font-weight: 400 !important;
  transform: scale(1.06);
}

.kanji-popup {
  position: fixed;
  z-index: 9999;
  width: min(360px, calc(100vw - 20px));
  padding: 13px 15px;
  border: 1px solid rgba(255,255,255,.28);
  border-radius: 10px;
  color: #eee;
  background: rgba(28,28,28,.96);
  box-shadow: 0 12px 34px rgba(0,0,0,.45);
  font-family: ${fontStack};
  font-size: .9rem;
  line-height: 1.6;
  text-align: left;
  white-space: pre-wrap;
  visibility: hidden;
}

.kanji-popup[hidden] {
  display: none;
}

.kanji-popup strong {
  display: block;
  margin-bottom: 5px;
  color: #fff;
  font-size: 1.35rem;
  line-height: 1.2;
  text-align: center;
}

@media (max-width: 480px) {
  .jlpt-card {
    --top-word-size: clamp(34px, 9.6vw, 44px);
    --top-word-ruby-size: .26em;
  }

  .front-center,
  .back-header {
    padding: 16px 12px 11px;
  }

  .word-ruby {
    font-size: clamp(1.95rem, 9.5vw, 2.45rem) !important;
  }

  .definition {
    font-size: clamp(1rem, 4.4vw, 1.25rem);
  }

  .native-meaning {
    font-size: clamp(1.05rem, 4.8vw, 1.35rem);
  }

  .detail-tray {
    width: min(390px, calc(100vw - 34px));
    margin: 0 auto 10px;
    padding: 12px 10px;
    touch-action: pan-y;
    overscroll-behavior: contain;
  }

  .content-list {
    font-size: 1.02rem;
    line-height: 1.78;
    overflow-wrap: break-word;
    word-break: normal;
  }

  .content-list li {
  width: 100%;
  max-width: 22em;
  margin: .72em auto;
  padding: .42em .52em;
  text-align: left;
  touch-action: pan-y;
  -webkit-tap-highlight-color: rgba(255,255,255,.25);
  user-select: text;
  -webkit-user-select: text;
  -webkit-touch-callout: default;
}

  .content-list ruby {
    ruby-align: start;
  }

  .content-list ruby rt {
    font-size: .48em;
    line-height: .95;
  }
}
`;
}
