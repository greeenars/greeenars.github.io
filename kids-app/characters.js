/* =========================================================
   キャラクターの絵を作るファイル
   ---------------------------------------------------------
   ・添付資料「ゆるキャラ進化図鑑」の3体（こぐま／ショベルカー／
     にんじん）と、それぞれ10段階の進化に合わせて描いています。
   ・絵はSVG（線と図形で描く画像）です。パーツごとに分けてあるので、
     目・口・手を動かしたり、段階ごとに小物を足したりできます。
   ・本番では、確定したイラストに差し替えます。
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

/* ---------- 色のグラデーション（全画面で共通の1か所に置く） ----------
   同じ名前の定義が非表示の画面にあると色が消えるブラウザがあるため、
   ページ読み込み時に、常に表示されている見えないSVGへ1つだけ置きます。 */
const PET_DEFS = `
      <radialGradient id="g-animal" cx="40%" cy="32%" r="75%"><stop offset="0" stop-color="#FFFEF8"/><stop offset="1" stop-color="#F6E7C8"/></radialGradient>
      <radialGradient id="g-tail" cx="40%" cy="35%" r="70%"><stop offset="0" stop-color="#FCEBC0"/><stop offset="1" stop-color="#EDC27A"/></radialGradient>
      <radialGradient id="g-car" cx="38%" cy="30%" r="75%"><stop offset="0" stop-color="#FFE68A"/><stop offset="1" stop-color="#F2AE22"/></radialGradient>
      <radialGradient id="g-veggie" cx="38%" cy="30%" r="75%"><stop offset="0" stop-color="#FFC07A"/><stop offset="1" stop-color="#F0822C"/></radialGradient>`;
document.body.insertAdjacentHTML("afterbegin",
  `<svg width="0" height="0" style="position:absolute" aria-hidden="true"><defs>${PET_DEFS}</defs></svg>`);

/* ---------- 共通パーツ ---------- */

// 目（ふだん・うれしい）。class名はアニメーション用（style.css参照）
function eyesSVG(x1, x2, y, L, size = 1, glossy = false) {
  const rx = 4.6 * size, ry = 5.8 * size;
  const normal = glossy
    ? `<ellipse cx="${x1}" cy="${y}" rx="${rx + 1}" ry="${ry + 1}" fill="#BFE4F5" stroke="${L}" stroke-width="1.8"/>
       <ellipse cx="${x2}" cy="${y}" rx="${rx + 1}" ry="${ry + 1}" fill="#BFE4F5" stroke="${L}" stroke-width="1.8"/>
       <ellipse cx="${x1 + 0.8}" cy="${y + 1}" rx="${rx * 0.55}" ry="${ry * 0.6}" fill="#3B3226"/>
       <ellipse cx="${x2 + 0.8}" cy="${y + 1}" rx="${rx * 0.55}" ry="${ry * 0.6}" fill="#3B3226"/>`
    : `<ellipse cx="${x1}" cy="${y}" rx="${rx}" ry="${ry}" fill="#3B3226"/>
       <ellipse cx="${x2}" cy="${y}" rx="${rx}" ry="${ry}" fill="#3B3226"/>`;
  return `
    <g class="eyes-normal" style="transform-origin:${(x1 + x2) / 2}px ${y}px">
      ${normal}
      <circle cx="${x1 + 1.6 * size}" cy="${y - 2.2 * size}" r="${1.7 * size}" fill="#fff"/>
      <circle cx="${x2 + 1.6 * size}" cy="${y - 2.2 * size}" r="${1.7 * size}" fill="#fff"/>
    </g>
    <g class="eyes-happy" fill="none" stroke="#3B3226" stroke-width="${3 * size}" stroke-linecap="round">
      <path d="M${x1 - 6 * size} ${y + 2} q${6 * size} ${-8 * size} ${12 * size} 0"/>
      <path d="M${x2 - 6 * size} ${y + 2} q${6 * size} ${-8 * size} ${12 * size} 0"/>
    </g>`;
}

// 口（ふだん・ぱくっ）
function mouthSVG(x, y, L, w = 6) {
  return `
    <path class="mouth-normal" d="M${x - w} ${y} q${w / 2} ${w * 0.7} ${w} 0 q${w / 2} ${w * 0.7} ${w} 0"
          fill="none" stroke="${L}" stroke-width="2.3" stroke-linecap="round"/>
    <ellipse class="mouth-open" cx="${x}" cy="${y + 3}" rx="${w * 0.9}" ry="${w}" fill="#C9625A" stroke="${L}" stroke-width="2"/>`;
}

function cheeksSVG(x1, x2, y, opacity, color = "#F5A99B") {
  return `<ellipse cx="${x1}" cy="${y}" rx="9" ry="5.5" fill="${color}" opacity="${opacity}"/>
          <ellipse cx="${x2}" cy="${y}" rx="9" ry="5.5" fill="${color}" opacity="${opacity}"/>`;
}

// 王冠
function crownSVG(cx, y, L, w = 40) {
  const h = w * 0.62, l = cx - w / 2, r = cx + w / 2;
  return `
    <path d="M${l} ${y} L${l + 2} ${y - h} L${cx - w * 0.22} ${y - h * 0.45} L${cx} ${y - h * 1.15}
             L${cx + w * 0.22} ${y - h * 0.45} L${r - 2} ${y - h} L${r} ${y} Z"
          fill="#F6C944" stroke="${L}" stroke-width="2.2" stroke-linejoin="round"/>
    <rect x="${l}" y="${y - 5}" width="${w}" height="6" rx="2" fill="#E8AE2C" stroke="${L}" stroke-width="1.6"/>
    <circle cx="${cx}" cy="${y - h * 0.55}" r="${w * 0.08}" fill="#E25B5B"/>
    <circle cx="${l + 2}" cy="${y - h - 2}" r="2.6" fill="#F6C944" stroke="${L}" stroke-width="1.2"/>
    <circle cx="${r - 2}" cy="${y - h - 2}" r="2.6" fill="#F6C944" stroke="${L}" stroke-width="1.2"/>`;
}

function shadowSVG(w = 40) {
  return `<ellipse cx="100" cy="190" rx="${w}" ry="5" fill="#7A5C46" opacity=".13"/>`;
}

/* ---------- こぐま ---------- */
function drawAnimal(s, L) {
  const body = "url(#g-animal)";
  let back = "", main = "", front = "";

  if (s === 1) {
    // ちいさな まるい ようたい
    main = `
      ${shadowSVG(30)}
      <circle cx="72" cy="122" r="11" fill="${body}" stroke="${L}" stroke-width="2.6"/>
      <circle cx="128" cy="122" r="11" fill="${body}" stroke="${L}" stroke-width="2.6"/>
      <circle cx="72" cy="122" r="5.5" fill="#F6D9A8"/>
      <circle cx="128" cy="122" r="5.5" fill="#F6D9A8"/>
      <circle cx="100" cy="152" r="38" fill="${body}" stroke="${L}" stroke-width="2.8"/>
      ${eyesSVG(86, 114, 148, L, 0.9)}
      <ellipse cx="100" cy="161" rx="10" ry="7.5" fill="#FFFBF2"/>
      <ellipse cx="100" cy="157.5" rx="3.5" ry="2.6" fill="#3B3226"/>
      ${mouthSVG(100, 161, L, 4.5)}`;
    return { back, main, front };
  }

  const innerEar = s >= 5 ? "#F4BBAE" : "#F6D9A8";
  // しっぽ（5段階〜。9段階からふわふわの大きなしっぽ）
  if (s >= 9) back += `<ellipse cx="164" cy="160" rx="27" ry="22" fill="url(#g-tail)" stroke="${L}" stroke-width="2.6"/>`;
  else if (s >= 5) back += `<circle cx="157" cy="166" r="12" fill="${body}" stroke="${L}" stroke-width="2.6"/>`;
  // マント（10段階）
  if (s === 10) back += `
      <path d="M54 104 Q30 150 30 186 L170 186 Q170 150 146 104 Z" fill="#E27D6E" stroke="${L}" stroke-width="2.6" stroke-linejoin="round"/>
      <rect x="26" y="178" width="148" height="12" rx="6" fill="#FFFDF7" stroke="${L}" stroke-width="2"/>`;
  // リュック（7〜8段階）
  if (s === 7 || s === 8) back += `
      <rect x="136" y="102" width="36" height="50" rx="11" fill="#E9897A" stroke="${L}" stroke-width="2.6"/>
      <path d="M138 118 h32" stroke="${L}" stroke-width="2" fill="none"/>`;

  main = `
    ${shadowSVG(50)}
    <circle cx="60" cy="80" r="17" fill="${body}" stroke="${L}" stroke-width="2.8"/>
    <circle cx="140" cy="80" r="17" fill="${body}" stroke="${L}" stroke-width="2.8"/>
    <circle cx="60" cy="81" r="9" fill="${innerEar}"/>
    <circle cx="140" cy="81" r="9" fill="${innerEar}"/>
    <ellipse cx="80" cy="181" rx="16" ry="9" fill="${body}" stroke="${L}" stroke-width="2.6"/>
    <ellipse cx="120" cy="181" rx="16" ry="9" fill="${body}" stroke="${L}" stroke-width="2.6"/>
    <ellipse cx="100" cy="128" rx="58" ry="55" fill="${body}" stroke="${L}" stroke-width="2.8"/>
    <g class="arm-l"><ellipse cx="45" cy="138" rx="10" ry="15" fill="${body}" stroke="${L}" stroke-width="2.6" transform="rotate(25 45 138)"/></g>
    <g class="arm-r"><ellipse cx="155" cy="138" rx="10" ry="15" fill="${body}" stroke="${L}" stroke-width="2.6" transform="rotate(-25 155 138)"/></g>
    ${s >= 3 ? cheeksSVG(70, 130, 136, s >= 7 ? 0.75 : 0.35) : ""}
    ${eyesSVG(84, 116, 118, L)}
    <ellipse cx="100" cy="134" rx="15" ry="11" fill="#FFFBF2"/>
    <ellipse cx="100" cy="129" rx="4.2" ry="3.1" fill="#3B3226"/>
    ${mouthSVG(100, 134, L, 5)}`;

  // おなかの肉球もよう（4〜9段階）
  if (s >= 4 && s <= 9) front += `
      <ellipse cx="100" cy="166" rx="8.5" ry="6.5" fill="#F3D3A0"/>
      <circle cx="91" cy="157" r="2.8" fill="#F3D3A0"/><circle cx="100" cy="154" r="2.8" fill="#F3D3A0"/><circle cx="109" cy="157" r="2.8" fill="#F3D3A0"/>`;
  // はっぱのかざり（6段階）
  if (s === 6) front += `
      <path d="M100 76 C82 72 80 50 100 42 C120 50 118 72 100 76 Z" fill="#8BBF5E" stroke="#4E7F3A" stroke-width="2.4"/>
      <path d="M100 74 V50" stroke="#4E7F3A" stroke-width="1.8" fill="none"/>`;
  // リュックのかたひも
  if (s === 7 || s === 8) front += `<path d="M132 92 Q144 116 140 150" stroke="#D46F61" stroke-width="4.5" fill="none" stroke-linecap="round"/>`;
  // おみみのおうかん（8〜9段階）
  if (s === 8 || s === 9) front += crownSVG(56, 66, L, 16) + crownSVG(144, 66, L, 16);
  // むねもとのリボン（9段階）
  if (s === 9) front += `
      <path d="M64 146 Q100 160 136 146" stroke="#EC8A80" stroke-width="4" fill="none" stroke-linecap="round"/>
      <path d="M100 152 L84 142 L84 162 Z M100 152 L116 142 L116 162 Z" fill="#EC8A80" stroke="${L}" stroke-width="2" stroke-linejoin="round"/>
      <circle cx="100" cy="152" r="4" fill="#E06F66" stroke="${L}" stroke-width="1.6"/>`;
  // おうさま（10段階）：王冠・ファーのえり・みどりのブローチ
  if (s === 10) front += `
      ${crownSVG(100, 78, L, 46)}
      <path d="M52 140 Q100 166 148 140 Q148 152 100 172 Q52 152 52 140 Z" fill="#FFFDF7" stroke="${L}" stroke-width="2"/>
      <circle cx="100" cy="160" r="7" fill="#7DBA6A" stroke="#C99A2E" stroke-width="3"/>`;

  return { back, main, front };
}

/* ---------- ショベルカー ---------- */
function drawCar(s, L) {
  const body = "url(#g-car)";
  let back = "", main = "", front = "";

  // アームとショベル（3段階〜、6段階で長く、8段階で大きなショベル）
  const armPath = s >= 6 ? "M60 118 L40 50 L20 128" : "M54 142 L34 152 L26 168";
  if (s >= 3) back += `
      <path d="${armPath}" stroke="${L}" stroke-width="13" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="${armPath}" stroke="#F6C23E" stroke-width="8" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`;
  const bx = s >= 6 ? 20 : 24, by = s >= 6 ? 132 : 168, bk = s >= 8 ? 1.45 : 1;
  if (s >= 3) back += `
      <path d="M${bx - 10 * bk} ${by - 2} L${bx + 12 * bk} ${by} L${bx + 10 * bk} ${by + 16 * bk} Q${bx - 2} ${by + 22 * bk} ${bx - 12 * bk} ${by + 10 * bk} Z"
            fill="#F6C23E" stroke="${L}" stroke-width="2.4" stroke-linejoin="round"/>`;
  // マント（10段階）
  if (s === 10) back += `<path d="M118 82 Q176 96 178 172 L150 176 Q148 120 118 82 Z" fill="#E2683C" stroke="${L}" stroke-width="2.4" stroke-linejoin="round"/>`;
  // どうぐばこ（7段階〜）
  if (s >= 7) back += `
      <rect x="140" y="98" width="28" height="24" rx="4" fill="#EE8E3C" stroke="${L}" stroke-width="2.4"/>
      <path d="M148 98 v-4 h12 v4" fill="none" stroke="${L}" stroke-width="2"/>`;

  if (s === 1) {
    main = `
      ${shadowSVG(32)}
      <circle cx="100" cy="150" r="38" fill="${body}" stroke="${L}" stroke-width="2.8"/>
      <path d="M66 160 Q100 176 136 158" stroke="#F0893C" stroke-width="7" fill="none" stroke-linecap="round"/>
      ${eyesSVG(110, 132, 145, L, 1.1, true)}
      ${mouthSVG(121, 159, L, 4)}`;
    return { back, main, front };
  }

  main = `
    ${shadowSVG(56)}
    ${s >= 8 ? "" : s >= 6 ? `<path d="M90 82 Q98 66 106 82 Z" fill="#F08A3C" stroke="${L}" stroke-width="2.2"/>` : ""}
    <ellipse cx="100" cy="128" rx="55" ry="49" fill="${body}" stroke="${L}" stroke-width="2.8"/>
    <path d="M47 140 Q100 160 153 136" stroke="#F0893C" stroke-width="8" fill="none" stroke-linecap="round"/>
    ${s >= 4 ? `
      <rect x="60" y="88" width="50" height="32" rx="10" fill="#CFEAF7" stroke="${L}" stroke-width="2.4"/>
      <path d="M85 89 V119" stroke="${L}" stroke-width="2"/>
      <path d="M66 96 l8 -4" stroke="#fff" stroke-width="3" stroke-linecap="round"/>` : ""}
    ${s >= 9 ? cheeksSVG(108, 154, 141, 0.75, "#F07D5A") : ""}
    ${eyesSVG(117, 143, 127, L, 1.3, true)}
    ${mouthSVG(130, 143, L, 5)}`;

  // ヘルメット（8段階〜）
  if (s >= 8) front += `
      <path d="M52 100 Q56 52 100 50 Q144 52 148 100 Z" fill="#F7CC4A" stroke="${L}" stroke-width="2.6" stroke-linejoin="round"/>
      <path d="M44 100 H156" stroke="${L}" stroke-width="5" stroke-linecap="round"/>
      <path d="M44 100 H156" stroke="#F7CC4A" stroke-width="2.5" stroke-linecap="round"/>
      <path d="M100 52 V98" stroke="${L}" stroke-width="1.6" opacity=".5"/>
      ${s < 10 ? `<path d="M93 52 Q100 36 107 52 Z" fill="#F08A3C" stroke="${L}" stroke-width="2.2"/>` : ""}`;
  // ちからもちのしるし（9段階〜）
  if (s >= 9) front += `<path d="M76 148 l3 6 l7 1 l-5 5 l1 7 l-6 -3 l-6 3 l1 -7 l-5 -5 l7 -1 z" fill="#FFE07A" stroke="${L}" stroke-width="1.6" stroke-linejoin="round"/>`;
  // 王冠（10段階）
  if (s === 10) front += crownSVG(100, 54, L, 44);

  // タイヤ → キャタピラ
  if (s >= 7) {
    front += `
      <rect x="38" y="164" width="126" height="26" rx="13" fill="#45464D" stroke="${L}" stroke-width="2.4"/>
      ${[54, 78, 101, 124, 148].map((x) => `<circle cx="${x}" cy="177" r="6.5" fill="#9BA3AA" stroke="#2E2F35" stroke-width="1.6"/>`).join("")}`;
  } else {
    const xs = s >= 5 ? [54, 86, 118, 150] : [74, 128];
    front += xs.map((x) => `
      <circle cx="${x}" cy="176" r="${s >= 5 ? 13 : 15}" fill="#45464D" stroke="${L}" stroke-width="2.4"/>
      <circle cx="${x}" cy="176" r="5" fill="#C9D2D8"/>`).join("");
  }
  return { back, main, front };
}

/* ---------- にんじん ---------- */
function leafSVG(x, y, angle, size) {
  const h = 26 * size, w = 11 * size;
  return `<path d="M${x} ${y} C${x - w} ${y - h * 0.4} ${x - w * 0.6} ${y - h} ${x} ${y - h} C${x + w * 0.6} ${y - h} ${x + w} ${y - h * 0.4} ${x} ${y} Z"
            transform="rotate(${angle} ${x} ${y})" fill="#86C35C" stroke="#4E8A3A" stroke-width="2.2" stroke-linejoin="round"/>`;
}

function drawVeggie(s, L) {
  const body = "url(#g-veggie)";
  let back = "", main = "", front = "";

  if (s <= 3) {
    // まるい ころころ期（1〜3段階）
    const r = [24, 30, 36][s - 1], cy = 186 - r - 2;
    const top = cy - r;
    const sprout = s === 3
      ? leafSVG(100, top + 2, -35, 0.9) + leafSVG(100, top + 2, 35, 0.9)
      : `<path d="M100 ${top + 2} V${top - 8}" stroke="#4E8A3A" stroke-width="3" stroke-linecap="round"/>` +
        leafSVG(100, top - 6, -50, 0.45) + leafSVG(100, top - 6, 50, 0.45);
    main = `
      ${shadowSVG(r + 4)}
      ${sprout}
      <circle cx="100" cy="${cy}" r="${r}" fill="${body}" stroke="${L}" stroke-width="2.6"/>
      ${cheeksSVG(100 - r * 0.55, 100 + r * 0.55, cy + r * 0.12, 0.7)}
      ${eyesSVG(100 - r * 0.32, 100 + r * 0.32, cy - r * 0.08, L, 0.65 + r / 120)}
      ${mouthSVG(100, cy + r * 0.2, L, 3.5)}`;
    return { back, main, front };
  }

  const big = s >= 8;
  const shape = big
    ? "M54 112 Q54 70 100 70 Q146 70 146 112 Q146 162 118 182 Q100 194 82 182 Q54 162 54 112 Z"
    : "M68 104 Q68 78 100 78 Q132 78 132 104 Q132 150 114 176 Q100 192 86 176 Q68 150 68 104 Z";
  const topY = big ? 74 : 82;
  const leaves = s >= 5
    ? leafSVG(100, topY, -60, 1) + leafSVG(100, topY, 60, 1) + leafSVG(100, topY, -28, 1.15) + leafSVG(100, topY, 28, 1.15) + leafSVG(100, topY, 0, 1.25)
    : leafSVG(100, topY, -32, 0.95) + leafSVG(100, topY, 32, 0.95) + leafSVG(100, topY, 0, 1.05);

  // マント（10段階）
  if (s === 10) back += `
      <path d="M58 100 Q26 150 24 188 L176 188 Q174 150 142 100 Z" fill="#6FAE63" stroke="${L}" stroke-width="2.4" stroke-linejoin="round"/>
      <path d="M58 100 Q26 150 24 188" stroke="#FFFDF7" stroke-width="7" fill="none"/>
      <path d="M142 100 Q174 150 176 188" stroke="#FFFDF7" stroke-width="7" fill="none"/>`;

  const eyeY = big ? 116 : 114;
  main = `
    ${shadowSVG(big ? 48 : 36)}
    ${s < 10 ? leaves : ""}
    ${s >= 5 ? `
      <ellipse cx="90" cy="186" rx="9" ry="6" fill="#F39A44" stroke="${L}" stroke-width="2.2"/>
      <ellipse cx="110" cy="186" rx="9" ry="6" fill="#F39A44" stroke="${L}" stroke-width="2.2"/>` : ""}
    <path d="${shape}" fill="${body}" stroke="${L}" stroke-width="2.8" stroke-linejoin="round"/>
    ${s >= 5 ? `
      <g class="arm-l"><ellipse cx="${big ? 52 : 66}" cy="138" rx="7" ry="11" fill="#F39A44" stroke="${L}" stroke-width="2.2" transform="rotate(30 ${big ? 52 : 66} 138)"/></g>
      <g class="arm-r"><ellipse cx="${big ? 148 : 134}" cy="138" rx="7" ry="11" fill="#F39A44" stroke="${L}" stroke-width="2.2" transform="rotate(-30 ${big ? 148 : 134} 138)"/></g>` : ""}
    ${s === 6 || s === 7 ? `
      <path d="M76 140 q8 3 14 0 M108 152 q8 3 14 0 M86 164 q6 2 12 0" stroke="${L}" stroke-width="1.6" fill="none" opacity=".35" stroke-linecap="round"/>` : ""}
    ${big && s !== 10 ? [[70, 140], [128, 140], [82, 164], [118, 166], [100, 150], [64, 116], [136, 116]]
        .map(([x, y]) => `<circle cx="${x}" cy="${y}" r="5" fill="#FFE6A8" opacity=".9"/>`).join("") : ""}
    ${cheeksSVG(big ? 72 : 78, big ? 128 : 122, eyeY + 14, 0.75)}
    ${eyesSVG(big ? 86 : 89, big ? 114 : 111, eyeY, L, big ? 1.05 : 0.9)}
    ${mouthSVG(100, eyeY + 14, L, 4.5)}`;

  // エプロン（7・10段階）
  if (s === 7 || s === 10) front += `
      <path d="M${big ? 72 : 80} 142 H${big ? 128 : 120} L${big ? 132 : 122} 176 Q100 188 ${big ? 68 : 78} 176 Z"
            fill="#FFFDF5" stroke="${L}" stroke-width="2.2" stroke-linejoin="round"/>
      <path d="M${big ? 72 : 80} 142 H${big ? 128 : 120}" stroke="#8CC46A" stroke-width="4" stroke-linecap="round"/>
      ${s === 10 ? `<path d="M100 156 l-4 12 l4 3 l4 -3 z" fill="#F39A44" stroke="${L}" stroke-width="1.2"/>${leafSVG(100, 156, 0, 0.3)}` : `<rect x="94" y="156" width="12" height="9" rx="2" fill="none" stroke="#8CC46A" stroke-width="2"/>`}`;
  // はっぱのかんむりと こべら（9段階）
  if (s === 9) front += `
      <path d="M58 92 Q100 74 142 92" stroke="#6FAE52" stroke-width="7" fill="none" stroke-linecap="round" stroke-dasharray="1 8"/>
      <path d="M58 92 Q100 74 142 92" stroke="#4E8A3A" stroke-width="2" fill="none"/>
      <path d="M156 136 L170 96" stroke="#9A6A3A" stroke-width="5" stroke-linecap="round"/>
      <rect x="163" y="76" width="16" height="24" rx="6" fill="#C38A52" stroke="${L}" stroke-width="2" transform="rotate(20 171 88)"/>`;
  // おうじ・おうじょ（10段階）：コックぼう・王冠・ちょうネクタイ・あわだてき
  if (s === 10) front += `
      <path d="M70 76 Q60 50 80 46 Q86 30 100 34 Q114 30 120 46 Q140 50 130 76 Z" fill="#FFFFFF" stroke="${L}" stroke-width="2.2" stroke-linejoin="round"/>
      ${crownSVG(100, 82, L, 50)}
      <path d="M100 141 L89 135 L89 147 Z M100 141 L111 135 L111 147 Z" fill="#7DBA6A" stroke="${L}" stroke-width="1.8" stroke-linejoin="round"/>
      <path d="M40 140 L30 100" stroke="#9AA4AB" stroke-width="4" stroke-linecap="round"/>
      <ellipse cx="28" cy="90" rx="8" ry="13" fill="none" stroke="#9AA4AB" stroke-width="2.4"/>
      <ellipse cx="28" cy="90" rx="3.5" ry="13" fill="none" stroke="#9AA4AB" stroke-width="2"/>`;
  return { back, main, front };
}

/**
 * あいぼうのSVGを作る
 * @param {string} type  - "animal" / "car" / "veggie"
 * @param {number} stage - 成長段階 1〜10
 * @param {boolean} fullSize - true なら段階に関係なく大きく描く（アイコン用）
 */
function makePetSVG(type, stage, fullSize = false) {
  const t = PET_TYPES[type];
  const L = t.line;
  const draw = { animal: drawAnimal, car: drawCar, veggie: drawVeggie }[type];
  const { back, main, front } = draw(stage, L);
  // 絵そのものも段階で大きくなるので、全体の拡大は控えめ（0.85倍→1倍）
  const scale = fullSize ? 1 : 0.85 + 0.0167 * (stage - 1);

  return `
  <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
    <g transform="translate(100 188) scale(${scale}) translate(-100 -188)">
      <g class="body-group">
        ${back}
        ${main}
        ${front}
      </g>
    </g>
  </svg>`;
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
