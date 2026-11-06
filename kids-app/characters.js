/* =========================================================
   キャラクター（仮）の絵を作るファイル
   ---------------------------------------------------------
   ・ここにあるのは「仕組みを試すための仮キャラ」です。
     本番のキャラは人の手で描いたものに差し替えます。
   ・絵はSVG（線と図形で描く画像）を文字列で組み立てています。
   ・成長段階（1〜10）で「大きさ」と「小物」が変わります。
   ========================================================= */

// あいぼうの種類（本番では15種類に増やす）
const PET_TYPES = {
  animal: { name: "ころん", desc: "どうぶつ の なかま", body: "#F6D7B0", line: "#7A5C46", counter: "ひき" },
  car:    { name: "ぶっぶ", desc: "はたらく くるま の なかま", body: "#A9D3EE", line: "#4F6B80", counter: "だい" },
  veggie: { name: "ぷちとま", desc: "やさい の なかま", body: "#F59B8B", line: "#7E4A44", counter: "こ" },
};

/**
 * あいぼうのSVGを作る
 * @param {string} type  - "animal" / "car" / "veggie"
 * @param {number} stage - 成長段階 1〜10
 * @param {boolean} fullSize - true なら段階に関係なく大きく描く（アイコン用）
 */
function makePetSVG(type, stage, fullSize = false) {
  const t = PET_TYPES[type];
  const L = t.line;
  // 段階1で0.72倍、段階10で等倍まで大きくなる
  const scale = fullSize ? 1 : 0.72 + 0.031 * (stage - 1);

  // --- 種類ごとの「頭の上・からだの横」のパーツ ---
  let back = "";   // からだの後ろに描くもの
  let front = "";  // からだの前に描くもの
  if (type === "animal") {
    back = `
      <ellipse cx="70" cy="74" rx="14" ry="20" fill="${t.body}" stroke="${L}" stroke-width="3" transform="rotate(-18 70 74)"/>
      <ellipse cx="130" cy="74" rx="14" ry="20" fill="${t.body}" stroke="${L}" stroke-width="3" transform="rotate(18 130 74)"/>
      <ellipse cx="70" cy="77" rx="6" ry="10" fill="#F4B3A8" transform="rotate(-18 70 77)"/>
      <ellipse cx="130" cy="77" rx="6" ry="10" fill="#F4B3A8" transform="rotate(18 130 77)"/>`;
  } else if (type === "car") {
    back = `
      <rect x="74" y="62" width="52" height="30" rx="12" fill="${t.body}" stroke="${L}" stroke-width="3"/>
      <rect x="83" y="69" width="34" height="16" rx="6" fill="#E8F6FF" stroke="${L}" stroke-width="2"/>`;
    front = `
      <circle cx="66" cy="180" r="13" fill="#6E7B85" stroke="${L}" stroke-width="3"/>
      <circle cx="66" cy="180" r="4" fill="#D9E2E8"/>
      <circle cx="134" cy="180" r="13" fill="#6E7B85" stroke="${L}" stroke-width="3"/>
      <circle cx="134" cy="180" r="4" fill="#D9E2E8"/>`;
  } else if (type === "veggie") {
    back = `<path d="M100 62 q3 -12 10 -16" fill="none" stroke="#5E9F55" stroke-width="5" stroke-linecap="round"/>`;
    front = `
      <path d="M100 76 l-22 -8 l12 14 l-14 8 l20 0 l4 14 l4 -14 l20 0 l-14 -8 l12 -14 z"
            fill="#7CC47F" stroke="#4F8A4C" stroke-width="2.5" stroke-linejoin="round"/>`;
  }

  // --- 成長段階で増える小物 ---
  let extras = "";
  if (stage >= 3) {
    // ぴょこっとしたアホ毛
    extras += `<path d="M100 70 q-6 -14 6 -18" fill="none" stroke="${L}" stroke-width="3" stroke-linecap="round"/>`;
  }
  if (stage >= 5) {
    // おなかの小さなほし
    extras += `<path d="M100 150 l4 8 l9 1 l-7 6 l2 9 l-8 -5 l-8 5 l2 -9 l-7 -6 l9 -1 z" fill="#FFE08A" stroke="${L}" stroke-width="1.5" stroke-linejoin="round"/>`;
  }
  if (stage >= 7) {
    // スカーフ
    extras += `<path d="M58 152 q42 18 84 0" fill="none" stroke="#FF9F6B" stroke-width="7" stroke-linecap="round"/>`;
  }
  if (stage >= 10) {
    // おうかん
    extras += `<path d="M84 66 l4 -18 l8 10 l4 -14 l4 14 l8 -10 l4 18 z" fill="#FFD25E" stroke="${L}" stroke-width="2.5" stroke-linejoin="round"/>`;
  }

  // ほっぺの赤みは成長すると少し濃くなる
  const cheekOpacity = stage >= 5 ? 0.75 : 0.5;

  return `
  <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
    <g transform="translate(100 185) scale(${scale}) translate(-100 -185)">
      <g class="body-group">
        ${back}
        <!-- 手（小さく） -->
        <g class="arm-l"><ellipse cx="40" cy="146" rx="10" ry="7" fill="${t.body}" stroke="${L}" stroke-width="3" transform="rotate(-25 40 146)"/></g>
        <g class="arm-r"><ellipse cx="160" cy="146" rx="10" ry="7" fill="${t.body}" stroke="${L}" stroke-width="3" transform="rotate(25 160 146)"/></g>
        <!-- まるいからだ -->
        <ellipse cx="100" cy="128" rx="64" ry="56" fill="${t.body}" stroke="${L}" stroke-width="3"/>
        ${front}
        <!-- ほっぺ -->
        <ellipse cx="68" cy="134" rx="9" ry="6" fill="#F7A3A0" opacity="${cheekOpacity}"/>
        <ellipse cx="132" cy="134" rx="9" ry="6" fill="#F7A3A0" opacity="${cheekOpacity}"/>
        <!-- 目（ふだん） -->
        <g class="eyes-normal">
          <ellipse cx="82" cy="118" rx="5.5" ry="7" fill="${L}"/>
          <ellipse cx="118" cy="118" rx="5.5" ry="7" fill="${L}"/>
          <circle cx="83.8" cy="115.5" r="2" fill="#fff"/>
          <circle cx="119.8" cy="115.5" r="2" fill="#fff"/>
        </g>
        <!-- 目（うれしい） -->
        <g class="eyes-happy" fill="none" stroke="${L}" stroke-width="3.5" stroke-linecap="round">
          <path d="M75 120 q7 -9 14 0"/>
          <path d="M111 120 q7 -9 14 0"/>
        </g>
        <!-- 口 -->
        <path class="mouth-normal" d="M94 131 q3 4 6 0 q3 4 6 0" fill="none" stroke="${L}" stroke-width="2.5" stroke-linecap="round"/>
        <ellipse class="mouth-open" cx="100" cy="134" rx="6" ry="7" fill="#C9625A" stroke="${L}" stroke-width="2"/>
        ${extras}
      </g>
    </g>
  </svg>`;
}

// みず（しずく）のアイコン
function makeWaterSVG() {
  return `
  <svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
    <path d="M32 6 C24 20 14 30 14 40 a18 18 0 0 0 36 0 C50 30 40 20 32 6 z"
          fill="#8FD0F2" stroke="#4F8DB0" stroke-width="3" stroke-linejoin="round"/>
    <ellipse cx="25" cy="40" rx="4" ry="7" fill="#fff" opacity=".7"/>
  </svg>`;
}

// ごはん（まるいおだんご）のアイコン
function makeFoodSVG() {
  return `
  <svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
    <circle cx="32" cy="36" r="20" fill="#FFC98B" stroke="#B9774A" stroke-width="3"/>
    <path d="M32 16 q2 -8 10 -8 q-2 8 -10 8" fill="#7CC47F" stroke="#4F8A4C" stroke-width="2"/>
    <ellipse cx="25" cy="31" rx="5" ry="3.5" fill="#fff" opacity=".6"/>
  </svg>`;
}
