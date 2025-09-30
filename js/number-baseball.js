// ===== DOM =====
const input       = document.querySelector("#input");
const form        = document.querySelector("#form");
const logs        = document.querySelector("#logs");
const message     = document.querySelector("#message");
const newGameBtn  = document.querySelector("#newGame");
const hintBtn     = document.querySelector("#hintBtn");

const winsEl      = document.querySelector("#wins");
const lossesEl    = document.querySelector("#losses");
const avgTurnsEl  = document.querySelector("#avgTurns");
const bestScoreEl = document.querySelector("#bestScore");
const effect      = document.querySelector("#effect");

// Welcome modal
const welcomeModal  = document.querySelector("#welcomeModal");
const welcomeStart  = document.querySelector("#welcomeStart");

// Hint modal
const hintModal   = document.querySelector("#hintModal");
const hintBox     = document.querySelector("#hintBox");
const hintUse     = document.querySelector("#hintUse");
const hintCancel  = document.querySelector("#hintCancel");
const hintClose   = document.querySelector("#hintClose");
const hintResult  = document.querySelector("#hintResult");

// Sounds (có thể trống, sẽ fallback beep)
const soundStrike  = document.querySelector("#sound-strike");
const soundBall    = document.querySelector("#sound-ball");
const soundOut     = document.querySelector("#sound-out");
const soundHomerun = document.querySelector("#sound-homerun");
const soundHint    = document.querySelector("#sound-hint");

// ===== WebAudio fallback + Audio unlock =====
let audioCtx;

// Tạo beep fallback khi không phát được file
function beep(freq=880, dur=120, type="sine", gain=0.08){
  try {
    audioCtx = audioCtx || new (window.AudioContext || window.webkitAudioContext)();
    const o = audioCtx.createOscillator();
    const g = audioCtx.createGain();
    o.type = type; o.frequency.value = freq; g.gain.value = gain;
    o.connect(g); g.connect(audioCtx.destination);
    o.start(); setTimeout(()=>o.stop(), dur);
  } catch(e) {}
}

// Mở khóa audio trên tương tác đầu tiên của người dùng (tránh chặn autoplay)
function unlockAudioOnce(){
  // Resume AudioContext (nếu có)
  try {
    audioCtx = audioCtx || new (window.AudioContext || window.webkitAudioContext)();
    if (audioCtx.state === "suspended") audioCtx.resume();
  } catch(e) {}

  // “Prime” các thẻ <audio> một lần để trình duyệt cho phép phát về sau
  [soundStrike, soundBall, soundOut, soundHomerun, soundHint].forEach(a => {
    if (!a) return;
    try {
      a.muted = true;
      const p = a.play();
      if (p && typeof p.then === "function") {
        p.then(() => { a.pause(); a.currentTime = 0; a.muted = false; })
         .catch(() => { a.muted = false; });
      } else {
        // Trình duyệt không trả Promise
        a.pause(); a.currentTime = 0; a.muted = false;
      }
    } catch(e) { a.muted = false; }
  });

  // Gỡ listener sau lần đầu
  window.removeEventListener("pointerdown", unlockAudioOnce);
  window.removeEventListener("keydown", unlockAudioOnce);
  window.removeEventListener("touchstart", unlockAudioOnce);
}
window.addEventListener("pointerdown", unlockAudioOnce, { once: true });
window.addEventListener("keydown", unlockAudioOnce, { once: true });
window.addEventListener("touchstart", unlockAudioOnce, { once: true });

// Thử phát 1 <audio>; trả về Promise<boolean> thành công/thất bại
function tryPlayEl(el) {
  if (!el || typeof el.play !== "function") return Promise.resolve(false);
  try { el.currentTime = 0; } catch(e){}
  const p = el.play();
  if (p && typeof p.then === "function") {
    return p.then(() => true).catch(() => false);
  }
  // Một số trình duyệt trả void: coi như ok
  return Promise.resolve(true);
}

// Phát âm với fallback beep nếu thất bại
function playSound(kind){
  const map = {
    strike: { el: soundStrike,  beep: () => beep(1000,130,"square") },
    ball:   { el: soundBall,    beep: () => beep(700,140,"triangle") },
    out:    { el: soundOut,     beep: () => beep(220,220,"sawtooth") },
    homerun:{ el: soundHomerun, beep: () => { beep(900,160,"square"); setTimeout(()=>beep(1200,180,"square"),160); } },
    hint:   { el: soundHint,    beep: () => beep(600,160,"sine") },
  };
  const item = map[kind];
  if (!item) return;

  tryPlayEl(item.el).then(ok => {
    if (!ok) item.beep();
  });
}

// ===== State & Stats =====
let answerArray = [];
let tries = [];
const maxTurns = 10;

let stats = { wins: 0, losses: 0, totalTurns: 0, bestScore: 0 };

function loadStats(){
  const s = localStorage.getItem("nbStats");
  if (s) stats = JSON.parse(s);
  updateStats();
}
function saveStats(){ localStorage.setItem("nbStats", JSON.stringify(stats)); }
function updateStats(){
  winsEl.textContent   = stats.wins;
  lossesEl.textContent = stats.losses;
  avgTurnsEl.textContent = stats.wins ? (stats.totalTurns / stats.wins).toFixed(1) : 0;
  bestScoreEl.textContent = stats.bestScore;
}

// ===== Answer =====
function generateAnswer(){
  const pool = [1,2,3,4,5,6,7,8,9];
  answerArray = [];
  while (answerArray.length < 4){
    const i = Math.floor(Math.random()*pool.length);
    answerArray.push(pool.splice(i,1)[0]);
  }
  console.log("정답:", answerArray.join("")); // Dev test
}

// ===== Reset / End =====
function resetGame(){
  generateAnswer();
  tries = [];
  input.disabled = false; input.value = "";
  message.textContent = `도전 기회: ${maxTurns}번`;
  logs.innerHTML = `<table>
    <tr><th>시도</th><th>입력값</th><th>⚡ 스트라이크</th><th>🎯 볼</th></tr>
  </table>`;
  newGameBtn.style.display = "none";
  message.style.color = "#2c3e50";
}

function endGame(result, score=0){
  input.disabled = true;
  newGameBtn.style.display = "inline";
  if (result === "win"){
    stats.wins++; stats.totalTurns += tries.length;
    if (score > stats.bestScore) stats.bestScore = score;
    message.style.color = "green";
    showPopup("homerun", "🎉 Home Run!"); confetti(); playSound("homerun");
  } else {
    stats.losses++; message.style.color = "red";
  }
  updateStats(); saveStats();
}

// ===== Effects =====
function confetti(){
  for(let i=0;i<34;i++){
    const c = document.createElement("div");
    c.className = "confetti";
    c.style.left = Math.random()*100 + "vw";
    c.style.background = ["#e74c3c","#f1c40f","#2ecc71","#3498db"][Math.floor(Math.random()*4)];
    c.style.animationDuration = 1.2 + Math.random()*1.6 + "s";
    effect.appendChild(c);
    setTimeout(()=>c.remove(), 2200);
  }
}
function showPopup(type, text){
  const p = document.createElement("div");
  p.className = "popup " + type; p.textContent = text;
  document.body.appendChild(p);
  setTimeout(()=>p.remove(), 1050);
  playSound(type);
}

// hiệu ứng rung input khi lỗi
function shakeInput(){
  input.classList.add("shake");
  setTimeout(()=> input.classList.remove("shake"), 450);
}

// ===== Validate =====
function checkInput(v){
  if (v.length !== 4){
    showPopup("out", "⚠️ 4자리 숫자를 입력하세요!");
    shakeInput();
    return false;
  }
  if (!/^[1-9]{4}$/.test(v)){
    showPopup("out", "⚠️ 1~9 숫자만 사용 (0 불가)");
    shakeInput();
    return false;
  }
  if (new Set(v).size !== 4){
    showPopup("out", "⚠️ 중복되지 않게 입력하세요!");
    shakeInput();
    return false;
  }
  if (tries.includes(v)){
    showPopup("out", "⚠️ 이미 시도한 값입니다!");
    shakeInput();
    return false;
  }
  return true;
}

// ===== Submit Guess =====
form.addEventListener("submit", (e)=>{
  e.preventDefault();
  const value = input.value;

  if (!checkInput(value)){ input.value=""; input.focus(); return; }
  tries.push(value);

  if (value === answerArray.join("")){
    const score = (maxTurns - tries.length) * 10;
    message.textContent = `🎉 홈런! ${tries.length}번 만에 성공! 점수: ${score}`;
    endGame("win", score);
    return;
  }

  if (tries.length >= maxTurns){
    message.textContent = `😢 패배! 정답은 ${answerArray.join("")}`;
    endGame("lose");
    return;
  }

  // Tính strike/ball
  let strike=0, ball=0;
  for (let i=0;i<4;i++){
    const ch = String(answerArray[i]);
    const idx = value.indexOf(ch);
    if (idx > -1){ if (idx === i) strike++; else ball++; }
  }

  const table = logs.querySelector("table");
  const row = table.insertRow();
  row.insertCell().textContent = tries.length;
  row.insertCell().textContent = value;
  row.insertCell().textContent = "⚡ " + strike;
  row.insertCell().textContent = "🎯 " + ball;

  if (strike >= 3) row.classList.add("highlight-strike");
  else if (ball >= 3) row.classList.add("highlight-ball");

  if (strike > 0) showPopup("strike", `⚡ ${strike} Strike`);
  if (ball   > 0) showPopup("ball",   `🎯 ${ball} Ball`);
  if (strike === 0 && ball === 0) showPopup("out", "⚫ Out!");

  message.textContent = `도전 기회: ${maxTurns - tries.length}번 남음`;
  input.value = ""; input.focus();
});

// ===== Hint Flow =====
hintBtn.addEventListener("click", ()=>{
  hintResult.textContent = "";
  hintUse.style.display    = "inline-block";
  hintCancel.style.display = "inline-block";
  hintClose.style.display  = "none";
  hintUse.disabled = false; hintCancel.disabled = false;
  hintModal.style.display = "flex";
});

hintCancel.addEventListener("click", ()=>{
  hintBox.classList.add("shake");
  setTimeout(()=>{
    hintBox.classList.remove("shake");
    hintModal.style.display = "none";
  }, 450);
});

hintUse.addEventListener("click", ()=>{
  if (tries.length + 3 >= maxTurns){
    hintResult.textContent = "⚠️ 힌트를 쓰면 기회가 부족합니다!";
    hintBox.classList.add("shake");
    setTimeout(()=> hintBox.classList.remove("shake"), 450);
    return;
  }

  const pos   = Math.floor(Math.random()*4);
  const digit = answerArray[pos];

  tries.push("HINT"); tries.push("HINT"); tries.push("HINT");

  hintUse.disabled = true; hintCancel.disabled = true;
  hintResult.textContent = `👉 정답의 ${pos+1}번째 자리는 ${digit} 입니다! (기회 3회 차감)`;
  hintResult.style.fontSize = "18px";
  showPopup("ball", `💡 ${pos+1}번째 = ${digit}`);
  playSound("hint");

  if (tries.length >= maxTurns){
    message.textContent = `😢 패배! 정답은 ${answerArray.join("")}`;
    hintUse.style.display = "none";
    hintCancel.style.display = "none";
    hintClose.style.display = "inline-block";
    hintClose.onclick = () => { hintModal.style.display = "none"; endGame("lose"); };
    return;
  }

  message.textContent = `도전 기회: ${maxTurns - tries.length}번 남음 (힌트 사용됨)`;
  hintUse.style.display = "none";
  hintCancel.style.display = "none";
  hintClose.style.display = "inline-block";
});

hintClose.addEventListener("click", ()=>{
  hintModal.style.display = "none";
});

// ===== New Game =====
newGameBtn.addEventListener("click", resetGame);

// ===== Init =====
loadStats();
hintModal.style.display = "none";
welcomeModal.style.display = "flex";
welcomeStart.addEventListener("click", ()=>{
  welcomeModal.style.display = "none";
  resetGame();
});
