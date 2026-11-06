/* =========================================================
   キャラクターの絵を作るファイル
   ---------------------------------------------------------
   ・添付資料「ゆるキャラ進化図鑑」の3体（こぐま／ショベルカー／
     にんじん）と、それぞれ10段階の進化の絵を使っています。
   ・今は1枚絵（方式A）なので、動きは体全体のぽよん・ぷにっ・ゆらゆら。
     本番はパーツ分けした絵（方式B）で、まばたき・口・手も動かす予定です。
   ========================================================= */

const PET_TYPES = {
  animal: {
    name: "ころん", kind: "こぐま", desc: "どうぶつ の なかま", counter: "ひき",
    title: "どうぶつ しんか ずかん", catch: "まるくて ぽにょっと そだっていく！",
    line: "#8A6A4F",
    stages: [
      "ちいさな まるい ようたい",
      "おおきな おみみと てあしが はえた",
      "ほっぺに うっすら もよう",
      "おなかに もようが ついた",
      "おみみの うちがわに いろが ついて しっぽが はえた",
      "あたまに はっぱの かざり",
      "ほっぺが はっきりして ちいさな リュック",
      "おみみに おうかんの かざり",
      "ふわふわ しっぽと むねもとの リボン",
      "かんせい！ こぐまの おうさま！",
    ],
  },
  car: {
    name: "ぶっぶ", kind: "ショベルカー", desc: "はたらく くるま の なかま", counter: "だい",
    title: "はたらくくるま しんか ずかん", catch: "まるくて ぽにょっと がんばるよ！",
    line: "#8C6420",
    stages: [
      "まるい ボディ！",
      "タイヤが 2つ！",
      "ショベルが ついたよ！",
      "まどが ついたよ！",
      "タイヤが 4つに！",
      "アームが のびたよ！",
      "キャタピラに なったよ！",
      "ショベルが おおきく！",
      "ちからもちに なったよ！",
      "おうさまに なったよ！",
    ],
  },
  veggie: {
    name: "キャロ", kind: "にんじん", desc: "やさい の なかま", counter: "ほん",
    title: "やさい しんか ずかん", catch: "まるくて ぽにょっと おいしく そだつ！",
    line: "#9A5A2A",
    stages: [
      "たねの めばえ",
      "ちいさな オレンジの まるみに め",
      "はっぱが 2まい",
      "からだが すこし ながく なる",
      "はっぱが ふえて てあしが できる",
      "からだに うすい しましま",
      "はっぱが ひろがって エプロン！",
      "おおきく まるく なって しろい みずたま",
      "はっぱの かんむりと こべら！",
      "りょうりずきな にんじん おうじ・おうじょ！",
    ],
  },
};

/* ---------- キャラクター画像 ----------
   資料「ゆるキャラ進化図鑑」の絵を、背景透過の画像として使っています。
   [横幅, 高さ] は元画像の大きさ（px）。資料の中での大きさの差＝成長の差なので、
   この比率を使って「段階が上がると大きくなる」を表現します。 */
const PET_IMAGES = {
  animal: [[102,122],[160,167],[162,171],[167,175],[188,178],[184,200],[179,191],[180,201],[219,200],[249,252]],
  car:    [[115,98],[144,118],[198,128],[214,139],[201,146],[219,176],[225,170],[239,186],[289,215],[331,225]],
  veggie: [[60,79],[80,108],[93,130],[89,183],[107,203],[111,207],[117,217],[137,229],[166,232],[204,262]],
};

/**
 * あいぼうの絵（HTML）を作る
 * @param {string} type  - "animal" / "car" / "veggie"
 * @param {number} stage - 成長段階 1〜10
 * @param {boolean} fullSize - true なら枠いっぱいに表示（アイコン用）。
 *                             false なら段階に合わせた大きさで、足もとをそろえて表示
 */
function makePetSVG(type, stage, fullSize = false) {
  const [w, h] = PET_IMAGES[type][stage - 1];
  const src = `img/${type}-${String(stage).padStart(2, "0")}.png`;
  const alt = `${PET_TYPES[type].name} ${stage}だん`;
  if (fullSize) {
    return `<div class="pet-art"><img class="body-group" src="${src}" alt="${alt}" draggable="false" style="width:100%;height:100%;object-fit:contain;object-position:50% 100%"></div>`;
  }
  // そのキャラの一番大きい姿（10段階）を枠いっぱいとして、相対的な大きさを決める
  const all = PET_IMAGES[type];
  const maxSide = Math.max(...all.map(([a, b]) => Math.max(a, b)));
  const r = Math.max(w, h) / maxSide;      // 本来の大きさ（0〜1）
  const shown = 0.45 + 0.55 * r;           // 小さすぎると触りにくいので、最小でも45%に
  const k = shown / Math.max(w, h);
  return `<div class="pet-art"><img class="body-group" src="${src}" alt="${alt}" draggable="false"
            style="width:${(w * k * 100).toFixed(1)}%;height:${(h * k * 100).toFixed(1)}%"></div>`;
}

// みず（しずく）のアイコン
function makeWaterSVG() {
  return `
  <svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
    <path d="M32 6 C24 20 14 30 14 40 a18 18 0 0 0 36 0 C50 30 40 20 32 6 z"
          fill="#9AD6F2" stroke="#4F8DB0" stroke-width="3" stroke-linejoin="round"/>
    <ellipse cx="25" cy="40" rx="4" ry="7" fill="#fff" opacity=".7"/>
  </svg>`;
}

// ごはん（まるいおだんご）のアイコン
function makeFoodSVG() {
  return `
  <svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
    <circle cx="32" cy="36" r="20" fill="#FFC98B" stroke="#B9774A" stroke-width="3"/>
    <path d="M32 16 q2 -8 10 -8 q-2 8 -10 8" fill="#86C35C" stroke="#4E8A3A" stroke-width="2"/>
    <ellipse cx="25" cy="31" rx="5" ry="3.5" fill="#fff" opacity=".6"/>
  </svg>`;
}
