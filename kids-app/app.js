/* =========================================================
   あいぼうと せんかき（試作版）メインプログラム
   ---------------------------------------------------------
   大きく4つの部分に分かれています。
     1. データの保存と読み込み（端末の中だけに保存）
     2. 声と吹き出し（キャラのしゃべり）
     3. ホーム画面（なでる・タップ・えさをドラッグであげる）
     4. せんかき画面（●から★へ線を引く判定と応援）
   ========================================================= */

/* ---------------------------------------------------------
   1. データの保存と読み込み
   --------------------------------------------------------- */
const SAVE_KEY = "aibou-proto-v1";
const DAILY_REWARD_LIMIT = 5;   // 1日にもらえるごほうびの上限（やめどき）
const MAX_STAGE = 10;

// 次の段階に上がるのに必要なポイント（段階が上がるほど少し多く）
const needPoints = (stage) => 3 + stage;

function defaultState() {
  return {
    petType: null,     // えらんだあいぼう
    stage: 1,          // 成長段階 1〜10
    points: 0,         // 今の段階でたまったポイント
    water: 1,          // 最初に1つずつプレゼント（あげ方を覚えてもらうため）
    food: 1,
    level: 0,          // 次に出すせんかきの問題番号
    sound: true,
    graduated: [],     // 10段階まで育てたあいぼう（ずかん）
    daily: { date: "", rewards: 0 },
    learnedDrag: false // 一度でもえさをあげたか（ヒント表示用）
  };
}

function loadState() {
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    if (raw) return Object.assign(defaultState(), JSON.parse(raw));
  } catch (e) { /* 保存できない環境でも動くようにする */ }
  return defaultState();
}

function saveState() {
  try { localStorage.setItem(SAVE_KEY, JSON.stringify(state)); } catch (e) {}
}

let state = loadState();

function todayKey() {
  const d = new Date();
  return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
}

/* ---------------------------------------------------------
   2. 声と吹き出し
   --------------------------------------------------------- */
const pick = (list) => list[Math.floor(Math.random() * list.length)];
let lastSpeakAt = 0;

/**
 * キャラにしゃべらせる
 * @param {HTMLElement} bubbleEl - 吹き出しの要素
 * @param {string} text - ことば
 * @param {boolean|number} force - true なら必ずしゃべる。数字なら「前回から何ミリ秒あいていればしゃべるか」
 */
function say(bubbleEl, text, force = false) {
  const now = Date.now();
  // しゃべりすぎないよう、前回から一定時間（通常1.6秒）はがまんする
  const gap = force === true ? 0 : (typeof force === "number" ? force : 1600);
  if (now - lastSpeakAt < gap) return;
  lastSpeakAt = now;

  bubbleEl.textContent = text;
  bubbleEl.classList.add("show");
  clearTimeout(bubbleEl._timer);
  bubbleEl._timer = setTimeout(() => bubbleEl.classList.remove("show"), 2200);

  // 端末の読み上げ機能（試作用）。本番は録音した声に差し替え
  if (state.sound && "speechSynthesis" in window) {
    try {
      speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(text.replace(/[〜●★]/g, ""));
      u.lang = "ja-JP";
      u.pitch = 1.5;
      u.rate = 0.95;
      speechSynthesis.speak(u);
    } catch (e) {}
  }
}

/* ---------------------------------------------------------
   画面の切り替え
   --------------------------------------------------------- */
const $ = (id) => document.getElementById(id);

function showScreen(name) {
  document.querySelectorAll(".screen").forEach((s) => s.classList.remove("active"));
  $(`screen-${name}`).classList.add("active");
}

/* ---------------------------------------------------------
   お知らせ（モーダル）
   --------------------------------------------------------- */
function showModal(artHTML, text, buttonText, onClose) {
  $("modal-art").innerHTML = artHTML;
  $("modal-text").innerHTML = text;
  $("modal-btn").textContent = buttonText;
  $("modal").classList.remove("hidden");
  $("modal-btn").onclick = () => {
    $("modal").classList.add("hidden");
    if (onClose) onClose();
  };
}

/* ---------------------------------------------------------
   あいぼう選択画面
   --------------------------------------------------------- */
function renderSelect() {
  const list = $("select-list");
  list.innerHTML = "";
  Object.entries(PET_TYPES).forEach(([type, t]) => {
    const done = state.graduated.filter((g) => g === type).length;
    const btn = document.createElement("button");
    btn.className = "select-card";
    btn.innerHTML = `
      <div class="pet-thumb">${makePetSVG(type, 1, true)}</div>
      <div>
        <div class="name">${t.name}</div>
        <div class="desc">${t.desc}</div>
      </div>
      ${done ? `<span class="done-badge">ずかん ${done}</span>` : ""}`;
    btn.onclick = () => {
      state.petType = type;
      state.stage = 1;
      state.points = 0;
      saveState();
      goHome();
      setTimeout(() => say($("bubble"), `よろしくね！ ぼく ${t.name}`, true), 300);
    };
    list.appendChild(btn);
  });
  showScreen("select");
}

/* ---------------------------------------------------------
   3. ホーム画面
   --------------------------------------------------------- */
const petEl = $("pet");

function renderHome() {
  petEl.innerHTML = makePetSVG(state.petType, state.stage);
  $("stage-label").textContent = state.stage;
  const ratio = Math.min(1, state.points / needPoints(state.stage));
  $("gauge-fill").style.width = `${ratio * 100}%`;

  $("count-water").textContent = state.water;
  $("count-food").textContent = state.food;
  document.querySelector('[data-item="water"]').classList.toggle("empty", state.water <= 0);
  document.querySelector('[data-item="food"]').classList.toggle("empty", state.food <= 0);

  $("btn-sound").textContent = state.sound ? "🔊" : "🔈";

  // まだえさをあげたことがなく、手持ちがあればヒントを出す
  const hasItem = state.water > 0 || state.food > 0;
  $("drag-hint").classList.toggle("hidden", state.learnedDrag || !hasItem);
}

function goHome() {
  renderHome();
  showScreen("home");
}

// 動きのクラスを一時的につける（つけ直すとアニメーションが最初から再生される）
function playAnim(el, cls, ms) {
  el.classList.remove("bounce", "pet-happy", "eating", "grow");
  void el.offsetWidth; // ブラウザに一度描き直させる小技
  el.classList.add(cls);
  clearTimeout(el._animTimer);
  el._animTimer = setTimeout(() => el.classList.remove(cls), ms);
}

// ハートやきらきらを出す
function spawnFx(symbol, x, y) {
  const fx = document.createElement("div");
  fx.className = "fx";
  fx.textContent = symbol;
  fx.style.left = `${x}px`;
  fx.style.top = `${y}px`;
  $("effects").appendChild(fx);
  setTimeout(() => fx.remove(), 1000);
}

/* --- タップと「なでなで」の判定 ---
   指を置いて動かした距離が長ければ「なでた」、
   ほとんど動かさずに離したら「タップ」とみなします。 */
let petTouch = null;
let lastPetFxAt = 0;

petEl.addEventListener("pointerdown", (e) => {
  if (petTouch) return; // 2本目の指（手のひら等）は無視
  petTouch = { id: e.pointerId, x: e.clientX, y: e.clientY, moved: 0, petted: false };
  petEl.setPointerCapture(e.pointerId);
});

petEl.addEventListener("pointermove", (e) => {
  if (!petTouch || e.pointerId !== petTouch.id) return;
  petTouch.moved += Math.hypot(e.clientX - petTouch.x, e.clientY - petTouch.y);
  petTouch.x = e.clientX;
  petTouch.y = e.clientY;

  if (petTouch.moved > 60) {
    if (!petEl.classList.contains("pet-happy")) say($("bubble"), pick(VOICE.pet));
    playAnim(petEl, "pet-happy", 700);
    petTouch.petted = true;
    const now = Date.now();
    if (now - lastPetFxAt > 250) {
      const area = $("pet-area").getBoundingClientRect();
      spawnFx("💗", e.clientX - area.left, e.clientY - area.top - 20);
      lastPetFxAt = now;
    }
  }
});

function endPetTouch(e) {
  if (!petTouch || e.pointerId !== petTouch.id) return;
  if (!petTouch.petted && petTouch.moved < 20) {
    playAnim(petEl, "bounce", 600);
    say($("bubble"), pick(VOICE.tap));
  }
  petTouch = null;
}
petEl.addEventListener("pointerup", endPetTouch);
petEl.addEventListener("pointercancel", () => { petTouch = null; });

/* --- えさ・みずをドラッグであげる --- */
let drag = null;

document.querySelectorAll(".tray-item").forEach((itemEl) => {
  itemEl.addEventListener("pointerdown", (e) => {
    if (drag) return;
    const kind = itemEl.dataset.item;
    if (state[kind] <= 0) {
      say($("bubble"), pick(VOICE.hungry), true);
      return;
    }
    // 指についてくる分身を作る
    const ghost = document.createElement("div");
    ghost.className = "dragging";
    ghost.innerHTML = kind === "water" ? makeWaterSVG() : makeFoodSVG();
    document.body.appendChild(ghost);
    drag = { id: e.pointerId, kind, ghost };
    moveGhost(e);
    itemEl.setPointerCapture(e.pointerId);
  });

  itemEl.addEventListener("pointermove", (e) => {
    if (drag && e.pointerId === drag.id) moveGhost(e);
  });

  itemEl.addEventListener("pointerup", (e) => {
    if (!drag || e.pointerId !== drag.id) return;
    const r = petEl.getBoundingClientRect();
    // あいぼうの絵の中央付近（からだのあたり）に落としたら成功
    const inside = e.clientX > r.left + r.width * 0.15 && e.clientX < r.right - r.width * 0.15 &&
                   e.clientY > r.top + r.height * 0.25 && e.clientY < r.bottom;
    const kind = drag.kind;
    drag.ghost.remove();
    drag = null;
    if (inside) feed(kind);
  });

  itemEl.addEventListener("pointercancel", () => {
    if (drag) { drag.ghost.remove(); drag = null; }
  });
});

function moveGhost(e) {
  drag.ghost.style.left = `${e.clientX}px`;
  drag.ghost.style.top = `${e.clientY}px`;
}

function feed(kind) {
  state[kind] -= 1;
  state.points += kind === "water" ? 1 : 2;
  state.learnedDrag = true;
  playAnim(petEl, "eating", 1300);
  say($("bubble"), pick(kind === "water" ? VOICE.eatWater : VOICE.eatFood), true);
  const area = $("pet-area").getBoundingClientRect();
  spawnFx(kind === "water" ? "💧" : "✨", area.width / 2, area.height / 2);

  // 成長チェック
  if (state.points >= needPoints(state.stage)) {
    state.points -= needPoints(state.stage);
    state.stage += 1;
    saveState();
    renderHome();
    setTimeout(() => levelUp(), 1300);
    return;
  }
  saveState();
  renderHome();
}

function levelUp() {
  const t = PET_TYPES[state.petType];
  if (state.stage >= MAX_STAGE) {
    // 10段階まで成長 → ずかんに登録して次のあいぼうへ
    state.stage = MAX_STAGE;
    renderHome();
    playAnim(petEl, "grow", 1300);
    say($("bubble"), "ありがとう！ こんなに おおきく なったよ！", true);
    setTimeout(() => {
      showModal(
        `<div class="big-pet">${makePetSVG(state.petType, MAX_STAGE)}</div>`,
        `${t.name} が<br>りっぱに なったよ！<br>ずかんに とうろくしたよ`,
        "つぎの あいぼうを えらぶ",
        () => {
          state.graduated.push(state.petType);
          state.petType = null;
          saveState();
          renderSelect();
        }
      );
    }, 1500);
    return;
  }
  playAnim(petEl, "grow", 1300);
  say($("bubble"), `おおきく なった！ ${state.stage}だん だよ`, true);
  const area = $("pet-area").getBoundingClientRect();
  ["🌟", "✨", "🌟"].forEach((s, i) =>
    setTimeout(() => spawnFx(s, area.width * (0.3 + 0.2 * i), area.height * 0.4), i * 150));
}

$("btn-sound").onclick = () => {
  state.sound = !state.sound;
  if (!state.sound && "speechSynthesis" in window) speechSynthesis.cancel();
  saveState();
  renderHome();
};

$("btn-study").onclick = () => startTrace();

/* ---------------------------------------------------------
   4. せんかき画面
   --------------------------------------------------------- */
const SVG_NS = "http://www.w3.org/2000/svg";
const TOLERANCE = 30;   // 道の真ん中からどれだけ離れてもOKか（幼児向けに甘め）
const ROAD_WIDTH = 46;  // 見た目の道の太さ
const traceSvg = $("trace-svg");
const traceBubble = $("trace-bubble");

let trace = null; // 今の問題の状態

function el(tag, attrs) {
  const node = document.createElementNS(SVG_NS, tag);
  for (const k in attrs) node.setAttribute(k, attrs[k]);
  return node;
}

function startTrace() {
  const lv = LEVELS[state.level % LEVELS.length];
  $("level-label").textContent = `${(state.level % LEVELS.length) + 1}. ${lv.name}`;
  $("mini-pet").innerHTML = makePetSVG(state.petType, state.stage, true);
  traceSvg.innerHTML = "";

  // 道（太い薄い線）→ なぞった部分（黄色）→ 真ん中の点線 → 子どものインク の順に重ねる
  const road = el("path", { d: lv.path, fill: "none", stroke: "#F3E2C9", "stroke-width": ROAD_WIDTH, "stroke-linecap": "round", "stroke-linejoin": "round" });
  const done = el("path", { d: lv.path, fill: "none", stroke: "#FFD27A", "stroke-width": ROAD_WIDTH, "stroke-linecap": "round", "stroke-linejoin": "round" });
  const guide = el("path", { d: lv.path, fill: "none", stroke: "#D9BFA0", "stroke-width": 4, "stroke-dasharray": "2 12", "stroke-linecap": "round" });
  const ink = el("path", { d: "", fill: "none", stroke: "#FF8A5B", "stroke-width": 9, "stroke-linecap": "round", "stroke-linejoin": "round" });
  traceSvg.append(road, done, guide, ink);

  // 線の上に3ずつ間をあけて点を並べ、判定に使う
  const len = road.getTotalLength();
  const samples = [];
  for (let s = 0; s <= len; s += 3) samples.push(road.getPointAtLength(s));
  samples.push(road.getPointAtLength(len));

  const startPt = samples[0];
  const endPt = samples[samples.length - 1];

  // スタートの● と ゴールの★
  const star = el("text", { x: endPt.x, y: endPt.y + 16, "text-anchor": "middle", "font-size": 46, fill: "#FFB938", stroke: "#C98A1E", "stroke-width": 1.5 });
  star.textContent = "★";
  const dot = el("circle", { cx: startPt.x, cy: startPt.y, r: 17, fill: "#FF8A5B", stroke: "#fff", "stroke-width": 4 });
  const ring = el("circle", { cx: startPt.x, cy: startPt.y, r: 17, fill: "none", stroke: "#FF8A5B", "stroke-width": 3 });
  ring.innerHTML = `<animate attributeName="r" values="17;34" dur="1.2s" repeatCount="indefinite"/>
                    <animate attributeName="opacity" values="0.8;0" dur="1.2s" repeatCount="indefinite"/>`;
  traceSvg.append(star, ring, dot);

  done.setAttribute("stroke-dasharray", `0 ${len + 10}`);

  trace = {
    samples, len, done, ink, ring,
    progress: 0,        // どこまで進んだか（samples の番号）
    pointerId: null,    // 今描いている指
    inkD: "",
    offCount: 0,
    cheered: false,
    finished: false,
  };

  showScreen("trace");
  setTimeout(() => say(traceBubble, pick(VOICE.start), true), 300);
}

// 画面上の指の位置を、SVGのマス目（360×480）の座標に変換する
function toSvgPoint(e) {
  const p = new DOMPoint(e.clientX, e.clientY);
  return p.matrixTransform(traceSvg.getScreenCTM().inverse());
}

// 今の進み具合の近くで、一番近い点を探す（ぐるぐるの線で別の場所に飛ばないように範囲をしぼる）
function nearest(p) {
  const { samples, progress } = trace;
  const from = Math.max(0, progress - 10);
  const to = Math.min(samples.length - 1, progress + 25);
  let best = -1, bestD = Infinity;
  for (let i = from; i <= to; i++) {
    const d = Math.hypot(samples[i].x - p.x, samples[i].y - p.y);
    if (d < bestD) { bestD = d; best = i; }
  }
  return { index: best, dist: bestD };
}

traceSvg.addEventListener("pointerdown", (e) => {
  if (!trace || trace.finished || trace.pointerId !== null) return; // 2本目の指は無視
  // 手のひらなど、大きく触れたものは無視（対応端末のみ）
  if (e.width > 60 && e.height > 60) return;

  const p = toSvgPoint(e);
  const here = trace.samples[trace.progress];
  // 今の続きの場所（最初は●）の近くから始めたときだけ描ける
  if (Math.hypot(here.x - p.x, here.y - p.y) > TOLERANCE * 1.6) {
    say(traceBubble, trace.progress === 0 ? "●から はじめてね" : pick(VOICE.resume));
    return;
  }
  trace.pointerId = e.pointerId;
  traceSvg.setPointerCapture(e.pointerId);
  trace.ring.style.display = "none";
  trace.inkD += `M${p.x.toFixed(1)} ${p.y.toFixed(1)} `;
  trace.ink.setAttribute("d", trace.inkD);
});

traceSvg.addEventListener("pointermove", (e) => {
  if (!trace || e.pointerId !== trace.pointerId) return;
  const p = toSvgPoint(e);
  trace.inkD += `L${p.x.toFixed(1)} ${p.y.toFixed(1)} `;
  trace.ink.setAttribute("d", trace.inkD);

  const { index, dist } = nearest(p);
  if (dist <= TOLERANCE) {
    // 道の上 → 進める
    if (index > trace.progress) trace.progress = index;
    const doneLen = (trace.progress / (trace.samples.length - 1)) * trace.len;
    trace.done.setAttribute("stroke-dasharray", `${doneLen} ${trace.len + 10}`);

    // 半分まで来たら1回ほめる
    if (!trace.cheered && trace.progress > trace.samples.length * 0.5) {
      trace.cheered = true;
      say(traceBubble, pick(VOICE.good));
      playAnim($("mini-pet"), "bounce", 600);
    }
    // ゴール
    if (trace.progress >= trace.samples.length - 3) finishTrace();
  } else {
    // 道からはずれた → すぐに応援
    trace.offCount += 1;
    // はずれたときの応援は、ほかの声より優先して出す（ただし1.5秒に1回まで）
    const now = Date.now();
    if (now - (trace.lastOffAt || 0) > 1500) {
      trace.lastOffAt = now;
      say(traceBubble, pick(VOICE.off), true);
    }
  }
});

function endTraceStroke(e) {
  if (!trace || e.pointerId !== trace.pointerId) return;
  trace.pointerId = null;
  if (!trace.finished && trace.progress > 0) {
    say(traceBubble, pick(VOICE.resume));
  }
}
traceSvg.addEventListener("pointerup", endTraceStroke);
traceSvg.addEventListener("pointercancel", endTraceStroke);

function finishTrace() {
  trace.finished = true;
  trace.pointerId = null;
  say(traceBubble, pick(VOICE.clear), true);
  playAnim($("mini-pet"), "bounce", 600);

  state.level += 1;

  // 1日の上限までは、ごほうび（みず1つ＋ごはん1つ）がもらえる
  const today = todayKey();
  if (state.daily.date !== today) state.daily = { date: today, rewards: 0 };
  const canReward = state.daily.rewards < DAILY_REWARD_LIMIT;
  if (canReward) {
    state.daily.rewards += 1;
    state.water += 1;
    state.food += 1;
  }
  saveState();

  setTimeout(() => {
    if (canReward) {
      showModal(
        makeWaterSVG() + makeFoodSVG(),
        "みず と ごはん を<br>もらったよ！",
        "あいぼうに あげる",
        () => goHome()
      );
    } else {
      showModal(
        `<div class="big-pet">${makePetSVG(state.petType, state.stage)}</div>`,
        "きょうは たくさん<br>がんばったね！<br>また あした あそぼう",
        "ホームに もどる",
        () => goHome()
      );
    }
  }, 1200);
}

$("btn-back").onclick = () => goHome();

/* ---------------------------------------------------------
   保護者メニュー：歯車を2秒長押しでデータをリセット
   （子どもが間違えて押しても消えないように長押しにしています）
   --------------------------------------------------------- */
let resetTimer = null;
$("btn-reset").addEventListener("pointerdown", () => {
  resetTimer = setTimeout(() => {
    if (confirm("【保護者の方へ】 データをすべて消して、さいしょからに しますか？")) {
      state = defaultState();
      saveState();
      renderSelect();
    }
  }, 2000);
});
["pointerup", "pointerleave", "pointercancel"].forEach((ev) =>
  $("btn-reset").addEventListener(ev, () => clearTimeout(resetTimer)));

/* ---------------------------------------------------------
   はじめに
   --------------------------------------------------------- */
$("icon-water").innerHTML = makeWaterSVG();
$("icon-food").innerHTML = makeFoodSVG();

// 長押しメニューやダブルタップ拡大を防ぐ
document.addEventListener("contextmenu", (e) => e.preventDefault());
document.addEventListener("dblclick", (e) => e.preventDefault());

if (state.petType) goHome(); else renderSelect();

// オフラインでも動くようにする（サービスワーカー）
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("sw.js").catch(() => {});
  });
}
