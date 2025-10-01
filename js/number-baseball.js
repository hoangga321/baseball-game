// ============ DOM ============
const input       = document.querySelector("#input");
const form        = document.querySelector("#form");
const logsTable   = document.querySelector("#logs tbody");
const logCards    = document.querySelector("#logCards");
const message     = document.querySelector("#message");
const newGameBtn  = document.querySelector("#newGame");
const hintBtn     = document.querySelector("#hintBtn");

const winsEl      = document.querySelector("#wins");
const lossesEl    = document.querySelector("#losses");
const avgTurnsEl  = document.querySelector("#avgTurns");
const bestScoreEl = document.querySelector("#bestScore");
const effect      = document.querySelector("#effect");

const welcomeModal  = document.querySelector("#welcomeModal");
const welcomeStart  = document.querySelector("#welcomeStart");

const hintModal   = document.querySelector("#hintModal");
const hintBox     = document.querySelector("#hintBox");
const hintUse     = document.querySelector("#hintUse");
const hintCancel  = document.querySelector("#hintCancel");
const hintClose   = document.querySelector("#hintClose");
const hintResult  = document.querySelector("#hintResult");
// hint options
const existDigit  = document.querySelector("#existDigit");

const muteToggle  = document.querySelector("#muteToggle");
const volumeRange = document.querySelector("#volume");
const themeToggle = document.querySelector("#themeToggle");
const langSelect  = document.querySelector("#langSelect");
const resetStatsBtn = document.querySelector("#resetStats");
const difficultySel = document.querySelector("#difficulty");

const ringText = document.querySelector("#ringText");
const ringFg   = document.querySelector("#ringFg");

// Audio elements
const soundStrike  = document.querySelector("#sound-strike");
const soundBall    = document.querySelector("#sound-ball");
const soundOut     = document.querySelector("#sound-out");
const soundHomerun = document.querySelector("#sound-homerun");
const soundHint    = document.querySelector("#sound-hint");

// ============ i18n (KO / EN) ============
const I18N = {
  ko: {
    title: "숫자 야구",
    wins: "승리", losses: "패배", avg: "평균 시도", best: "최고 점수",
    resetStats: "전적 초기화",
    history: "기록", input: "입력",
    strike: "스트라이크", ball: "볼",
    enter4: "4자리 숫자 입력",
    welcomeTitle: "숫자 야구에 오신 것을 환영합니다!",
    welcomeDesc: "1~9 사이의 중복 없는 4자리 숫자를 맞춰보세요.",
    start: "게임 시작",
    hint: "힌트",
    hintTitle: "힌트",
    hintRule: "정답의 1자리와 위치를 알려주며 기회 3회가 차감됩니다.",
    use: "사용", cancel: "취소", ok: "확인",
    submit: "제출",
    newGame: "새 게임",
    turnsLeft: (n)=>`도전 기회: ${n}번`,
    winMsg: (n,score)=>`🎉 홈런! ${n}번 만에 성공! 점수: ${score}`,
    loseMsg: (ans)=>`😢 패배! 정답은 ${ans}`,
    invalidLen: "⚠️ 4자리 숫자를 입력하세요!",
    invalidDigits: "⚠️ 1~9 숫자만 사용 (0 불가)",
    invalidDup: "⚠️ 중복되지 않게 입력하세요!",
    invalidRepeat: "⚠️ 이미 시도한 값입니다!",
    hintLack: "⚠️ 힌트를 쓰면 기회가 부족합니다!",
    hintReveal: (pos,digit)=>`👉 정답의 ${pos}번째 자리는 ${digit} 입니다! (기회 3회 차감)`,
    // New hint text
    opt_reveal_pos: "정답 자리 1개 공개 (−3)",
    opt_existence: "숫자 존재 여부 확인 (−1)",
    opt_exclude_two: "존재하지 않는 숫자 2개 알려주기 (−2)",
    existence_yes: (d)=>`✅ 숫자 ${d} 은(는) 정답에 포함됩니다.`,
    existence_no:  (d)=>`❌ 숫자 ${d} 은(는) 정답에 없습니다.`,
    exclude_two_msg: (arr)=>`🚫 정답에 없는 숫자: ${arr.join(", ")}`,
    need_digit: "⚠️ 1~9 한 자리 숫자를 입력하세요.",
  },
  en: {
    title: "Number Baseball",
    wins: "Wins", losses: "Losses", avg: "Avg Turns", best: "Best Score",
    resetStats: "Reset Stats",
    history: "History", input: "Guess",
    strike: "Strike", ball: "Ball",
    enter4: "Enter 4 digits",
    welcomeTitle: "Welcome to Number Baseball!",
    welcomeDesc: "Guess a 4-digit number (1–9, no duplicates).",
    start: "Start Game",
    hint: "Hint",
    hintTitle: "Hint",
    hintRule: "Reveals one correct digit & position. Costs 3 turns.",
    use: "Use", cancel: "Cancel", ok: "OK",
    submit: "Submit",
    newGame: "New Game",
    turnsLeft: (n)=>`Tries left: ${n}`,
    winMsg: (n,score)=>`🎉 Home Run! Solved in ${n} turns. Score: ${score}`,
    loseMsg: (ans)=>`😢 You lose! Answer: ${ans}`,
    invalidLen: "⚠️ Enter exactly 4 digits!",
    invalidDigits: "⚠️ Digits must be 1–9 (no 0)",
    invalidDup: "⚠️ Digits must be unique!",
    invalidRepeat: "⚠️ You already tried that!",
    hintLack: "⚠️ Not enough turns to use hint!",
    hintReveal: (pos,digit)=>`👉 The ${pos}ᵗʰ digit is ${digit}. (−3 turns)`,
    // New hint text
    opt_reveal_pos: "Reveal one correct digit & position (−3)",
    opt_existence: "Check if a digit exists (−1)",
    opt_exclude_two: "Show 2 digits that don't exist (−2)",
    existence_yes: (d)=>`✅ Digit ${d} is in the answer.`,
    existence_no:  (d)=>`❌ Digit ${d} is NOT in the answer.`,
    exclude_two_msg: (arr)=>`🚫 Digits not in the answer: ${arr.join(", ")}`,
    need_digit: "⚠️ Please enter one digit (1–9).",
  }
};
function t(key, ...args){
  const lang = localStorage.getItem("nb-lang") || "ko";
  const dict = I18N[lang];
  const val = dict[key];
  return (typeof val === "function") ? val(...args) : val ?? key;
}
function applyI18N(){
  document.querySelectorAll("[data-i18n]").forEach(el=>{
    const key = el.getAttribute("data-i18n");
    el.textContent = t(key);
  });
  document.title = t("title");
}

// ============ Theme ============
function setTheme(mode){
  const root = document.documentElement;
  if (mode === "dark") root.classList.add("dark"); else root.classList.remove("dark");
  localStorage.setItem("nb-theme", mode);
}
function toggleTheme(){
  const current = localStorage.getItem("nb-theme") || "light";
  setTheme(current === "light" ? "dark" : "light");
}

// ============ Audio (unlock + volume/mute + fallback) ============
let audioCtx;
function getMuted(){ return localStorage.getItem("nb-muted")==="1"; }
function getVolume(){
  const v = parseFloat(localStorage.getItem("nb-vol") ?? "1");
  return Number.isFinite(v) ? Math.min(1, Math.max(0, v)) : 1;
}
function beep(freq=880, dur=120, type="sine"){
  if (getMuted()) return;
  const gainLevel = 0.12 * getVolume();
  if (gainLevel <= 0) return;
  try{
    audioCtx = audioCtx || new (window.AudioContext || window.webkitAudioContext)();
    const o = audioCtx.createOscillator();
    const g = audioCtx.createGain();
    o.type = type; o.frequency.value = freq; g.gain.value = gainLevel;
    o.connect(g); g.connect(audioCtx.destination);
    o.start(); setTimeout(()=>o.stop(), dur);
  }catch(e){}
}
function unlockAudioOnce(){
  try{
    audioCtx = audioCtx || new (window.AudioContext || window.webkitAudioContext)();
    if (audioCtx.state === "suspended") audioCtx.resume();
  }catch(e){}
  [soundStrike,soundBall,soundOut,soundHomerun,soundHint].forEach(a=>{
    if (!a) return;
    try{
      a.muted = true;
      const p = a.play();
      if (p?.then) p.then(()=>{ a.pause(); a.currentTime=0; a.muted=getMuted(); a.volume=getVolume(); })
                   .catch(()=>{ a.muted=getMuted(); a.volume=getVolume(); });
      else { a.pause(); a.currentTime=0; a.muted=getMuted(); a.volume=getVolume(); }
    }catch{ a.muted=getMuted(); a.volume=getVolume(); }
  });
  window.removeEventListener("pointerdown", unlockAudioOnce);
  window.removeEventListener("keydown", unlockAudioOnce);
  window.removeEventListener("touchstart", unlockAudioOnce);
}
window.addEventListener("pointerdown", unlockAudioOnce, { once:true });
window.addEventListener("keydown", unlockAudioOnce, { once:true });
window.addEventListener("touchstart", unlockAudioOnce, { once:true });
function prepareAudioEl(el){
  if (!el) return false;
  el.muted  = getMuted();
  el.volume = getVolume();
  try { el.currentTime = 0; } catch {}
  return true;
}
function tryPlayEl(el){
  if (!el?.play) return Promise.resolve(false);
  const p = el.play();
  return p?.then ? p.then(()=>true).catch(()=>false) : Promise.resolve(true);
}
function playSound(kind){
  const map = {
    strike : { el: soundStrike,  beep:()=>beep(1000,130,"square") },
    ball   : { el: soundBall,    beep:()=>beep(700,140,"triangle") },
    out    : { el: soundOut,     beep:()=>beep(220,220,"sawtooth") },
    homerun: { el: soundHomerun, beep:()=>{ beep(900,160,"square"); setTimeout(()=>beep(1200,180,"square"),160);} },
    hint   : { el: soundHint,    beep:()=>beep(600,160,"sine") },
  };
  const item = map[kind];
  if (!item) return;
  if (!prepareAudioEl(item.el)) { item.beep(); return; }
  tryPlayEl(item.el).then(ok => { if (!ok) item.beep(); });
}
function applyVolumeMuteUI(){
  const muted = getMuted();
  const vol = getVolume();
  muteToggle.setAttribute("aria-pressed", muted ? "true" : "false");
  muteToggle.textContent = muted ? "🔇" : "🔊";
  volumeRange.value = String(vol);
  [soundStrike,soundBall,soundOut,soundHomerun,soundHint].forEach(a=>{
    if (!a) return;
    a.muted = muted;
    a.volume = vol;
  });
}

// ============ Game State & Stats ============
let answerArray = [];
let tries = [];
let maxTurns = 10;

const DIFF = { easy: 12, normal: 10, hard: 8 };
function applyDifficultyUI(){
  const diff = localStorage.getItem("nb-diff") || "normal";
  difficultySel.value = diff;
  maxTurns = DIFF[diff] ?? 10;
  setRing(maxTurns - tries.length);
  message.textContent = t("turnsLeft", Math.max(0, maxTurns - tries.length));
}

let stats = { wins:0, losses:0, totalTurns:0, bestScore:0 };
function readStats(){
  const s = localStorage.getItem("nbStats");
  if (s) stats = JSON.parse(s);
}
function writeStats(){ localStorage.setItem("nbStats", JSON.stringify(stats)); }
function updateStatsUIFromStats(){
  winsEl.textContent   = stats.wins;
  lossesEl.textContent = stats.losses;
  avgTurnsEl.textContent = stats.wins ? (stats.totalTurns / stats.wins).toFixed(1) : 0;
  bestScoreEl.textContent = stats.bestScore;
}
function resetStatsUIToZero(){
  winsEl.textContent = 0; lossesEl.textContent = 0; avgTurnsEl.textContent = 0; bestScoreEl.textContent = 0;
}

function setRing(turnsLeft){
  const full = 339.292;
  const ratio = Math.max(0, Math.min(1, turnsLeft / maxTurns));
  ringFg.style.strokeDashoffset = String(full * (1 - ratio));
  ringText.textContent = String(turnsLeft);
}

// ============ Dev Reveal ============
function isDevReveal(){
  if (localStorage.getItem("nb-dev")==="1") return true;
  if (new URLSearchParams(location.search).get("dev")==="1") return true;
  return false;
}
function toggleDevReveal(){
  const cur = localStorage.getItem("nb-dev")==="1";
  localStorage.setItem("nb-dev", cur ? "0":"1");
  showPopup("ball", cur ? "Dev reveal OFF" : "Dev reveal ON");
  if (!cur) console.log("Dev reveal enabled. Answer will be shown on new game.");
}

// ============ Answer ============
function generateAnswer(){
  const pool = [1,2,3,4,5,6,7,8,9];
  answerArray = [];
  while(answerArray.length < 4){
    const i = Math.floor(Math.random()*pool.length);
    answerArray.push(pool.splice(i,1)[0]);
  }
  if (isDevReveal()) console.log("ANSWER:", answerArray.join(""));
}

// ============ Reset / End ============
function resetGame(){
  generateAnswer();
  tries = [];
  input.disabled = false; input.value = "";
  applyDifficultyUI();
  logsTable.innerHTML = "";
  logCards.innerHTML = "";
  newGameBtn.style.display = "none";
  message.style.color = "";
}

function endGame(result, score=0){
  readStats();

  input.disabled = true;
  newGameBtn.style.display = "inline-block";

  if (result === "win"){
    stats.wins++; stats.totalTurns += tries.length;
    if (score > stats.bestScore) stats.bestScore = score;
    message.style.color = "green";
    showPopup("homerun", "🎉 Home Run!");
    confetti(); playSound("homerun");
  } else {
    stats.losses++; message.style.color = "red";
  }

  writeStats();
  updateStatsUIFromStats();
}

// ============ Effects ============
function showPopup(type, text){
  const p = document.createElement("div");
  p.className = "popup " + type; p.textContent = text;
  document.body.appendChild(p);
  setTimeout(()=>p.remove(), 1050);
  playSound(type);
  if (navigator.vibrate) {
    if (type==="homerun") navigator.vibrate([50,70,50]);
    else if (type==="strike") navigator.vibrate(40);
    else if (type==="ball") navigator.vibrate(25);
    else if (type==="out") navigator.vibrate([15,50,15]);
  }
}

function confetti(){
  const N = Math.min(60, window.innerWidth < 560 ? 28 : 60);
  const colors = ["#e74c3c","#f1c40f","#2ecc71","#3498db","#9b59b6"];
  const layer = effect;
  let shots = 0;
  const tick = ()=>{
    for(let i=0;i<4 && shots<N;i++,shots++){
      const c = document.createElement("div");
      c.style.position="absolute";
      c.style.width="10px"; c.style.height="10px";
      c.style.borderRadius="50%";
      c.style.left = (Math.random()*100)+"vw";
      c.style.top  = "-10px";
      c.style.background = colors[Math.floor(Math.random()*colors.length)];
      const dur = 1200 + Math.random()*1600;
      c.style.transition = `transform ${dur}ms linear, opacity ${dur}ms linear`;
      layer.appendChild(c);
      requestAnimationFrame(()=>{
        c.style.transform = `translate(${(Math.random()*2-1)*200}px, ${window.innerHeight+40}px) rotate(${Math.random()*720}deg)`;
        c.style.opacity = "0";
      });
      setTimeout(()=>c.remove(), dur+50);
    }
    if (shots < N) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
}

function shakeInput(){
  input.classList.add("shake");
  setTimeout(()=> input.classList.remove("shake"), 450);
}

function animateCount(el, target, duration=350){
  const start = 0;
  const startTime = performance.now();
  function step(now){
    const p = Math.min(1, (now - startTime)/duration);
    const val = Math.round(start + (target - start)*p);
    el.textContent = val;
    if (p < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}

// ============ Validation & Input Mask ============
function checkInput(v){
  if (v.length !== 4){ showPopup("out", t("invalidLen")); shakeInput(); return false; }
  if (!/^[1-9]{4}$/.test(v)){ showPopup("out", t("invalidDigits")); shakeInput(); return false; }
  if (new Set(v).size !== 4){ showPopup("out", t("invalidDup")); shakeInput(); return false; }
  if (tries.includes(v)){ showPopup("out", t("invalidRepeat")); shakeInput(); return false; }
  return true;
}
input.addEventListener("input", (e)=>{
  let v = e.target.value.replace(/[^1-9]/g,"");
  let out = "";
  for (const ch of v) if (!out.includes(ch)) out += ch;
  e.target.value = out.slice(0,4);
});

// ============ Submit Guess ============
form.addEventListener("submit",(e)=>{
  e.preventDefault();
  const value = input.value;

  if (!checkInput(value)){ input.focus(); return; }
  tries.push(value);

  if (value === answerArray.join("")){
    const score = (maxTurns - tries.length) * 10;
    message.textContent = t("winMsg", tries.length, score);
    setRing(maxTurns - tries.length);
    addLogRow(value, 4, 0, true);
    endGame("win", score);
    return;
  }

  if (tries.length >= maxTurns){
    message.textContent = t("loseMsg", answerArray.join(""));
    setRing(0);
    addLogRow(value, 0, 0, false, true);
    endGame("lose");
    return;
  }

  let strike=0, ball=0;
  for (let i=0;i<4;i++){
    const ch = String(answerArray[i]);
    const idx = value.indexOf(ch);
    if (idx > -1){ if (idx === i) strike++; else ball++; }
  }

  addLogRow(value, strike, ball);
  setRing(maxTurns - tries.length);

  if (strike > 0) showPopup("strike", `⚡ ${strike} ${t("strike")}`);
  if (ball   > 0) showPopup("ball",   `🎯 ${ball} ${t("ball")}`);
  if (strike === 0 && ball === 0) showPopup("out", "⚫ Out!");

  message.textContent = t("turnsLeft", maxTurns - tries.length);
  input.value = ""; input.focus();
});

function addLogRow(value, strike, ball, isWin=false, isOut=false){
  const tr = document.createElement("tr");
  tr.classList.add("row-slide");
  const tdIdx = document.createElement("td"); tdIdx.textContent = tries.length;
  const tdVal = document.createElement("td"); tdVal.textContent = value;
  const tdS = document.createElement("td");
  const tdB = document.createElement("td");
  animateCount(tdS, strike);
  animateCount(tdB, ball);
  tr.append(tdIdx, tdVal, tdS, tdB);

  if (isOut || (strike===0 && ball===0)) tr.classList.add("out-row");
  else if (strike >= 3) tr.classList.add("highlight-strike");
  else if (ball >= 3) tr.classList.add("highlight-ball");

  logsTable.appendChild(tr);

  const card = document.createElement("div");
  card.className = "log-card";
  card.innerHTML = `
    <div><strong>#${tries.length}</strong> • ${value}</div>
    <div class="log-tags">
      ${strike>0?`<span class="tag strike">⚡ ${strike} ${t("strike")}</span>`:""}
      ${ball>0?`<span class="tag ball">🎯 ${ball} ${t("ball")}</span>`:""}
      ${(strike===0&&ball===0)?`<span class="tag out">OUT</span>`:""}
    </div>
  `;
  logCards.prepend(card);
}

// ============ Hint Flow (multi-option) ============
hintBtn.addEventListener("click", ()=>{
  hintResult.textContent = "";
  // reset UI state
  document.querySelector('input[name="hintOpt"][value="reveal_pos"]').checked = true;
  existDigit.value = "";
  hintUse.style.display    = "inline-block";
  hintCancel.style.display = "inline-block";
  hintClose.style.display  = "none";
  hintUse.disabled = false; hintCancel.disabled = false;
  hintModal.style.display = "flex";
  hintBox.focus();
});

hintCancel.addEventListener("click", ()=>{
  hintBox.classList.add("shake");
  setTimeout(()=>{
    hintBox.classList.remove("shake");
    hintModal.style.display = "none";
  }, 450);
});

hintUse.addEventListener("click", ()=>{
  const opt = document.querySelector('input[name="hintOpt"]:checked')?.value || "reveal_pos";

  const cost = (opt==="reveal_pos") ? 3 : (opt==="existence" ? 1 : 2);
  if (tries.length + cost > maxTurns){
    hintResult.textContent = t("hintLack");
    hintBox.classList.add("shake"); setTimeout(()=>hintBox.classList.remove("shake"), 450);
    return;
  }

  if (opt === "reveal_pos"){
    const pos = Math.floor(Math.random()*4);
    const digit = answerArray[pos];
    tries.push("HINT","HINT","HINT");
    hintResult.textContent = t("hintReveal", pos+1, digit);
    showPopup("ball", `💡 ${pos+1} = ${digit}`);
    playSound("hint");
  }
  else if (opt === "existence"){
    const d = existDigit.value.trim();
    if (!/^[1-9]$/.test(d)){
      hintResult.textContent = t("need_digit");
      hintBox.classList.add("shake"); setTimeout(()=>hintBox.classList.remove("shake"), 450);
      return;
    }
    tries.push("HINT");
    const exists = answerArray.includes(Number(d));
    hintResult.textContent = exists ? t("existence_yes", d) : t("existence_no", d);
    showPopup("ball", exists ? `✅ ${d}` : `❌ ${d}`);
    playSound("hint");
  }
  else if (opt === "exclude_two"){
    const notIn = [1,2,3,4,5,6,7,8,9].filter(n => !answerArray.includes(n));
    // lấy 2 số ngẫu nhiên (hoặc ít hơn nếu không đủ)
    const picks = [];
    while (picks.length < Math.min(2, notIn.length)){
      const i = Math.floor(Math.random()*notIn.length);
      const val = notIn.splice(i,1)[0];
      if (!picks.includes(val)) picks.push(val);
    }
    tries.push("HINT","HINT");
    hintResult.textContent = t("exclude_two_msg", picks);
    showPopup("ball", `🚫 ${picks.join(", ")}`);
    playSound("hint");
  }

  // thua ngay nếu hết lượt
  if (tries.length >= maxTurns){
    message.textContent = t("loseMsg", answerArray.join(""));
    hintUse.style.display = "none";
    hintCancel.style.display = "none";
    hintClose.style.display = "inline-block";
    hintClose.onclick = () => { hintModal.style.display = "none"; endGame("lose"); };
    return;
  }

  message.textContent = t("turnsLeft", maxTurns - tries.length);
  hintUse.style.display = "none"; hintCancel.style.display = "none";
  hintClose.style.display = "inline-block";
});

hintClose.addEventListener("click", ()=>{ hintModal.style.display = "none"; });

// ============ New Game ============
newGameBtn.addEventListener("click", resetGame);

// ============ Settings handlers ============
muteToggle.addEventListener("click", ()=>{
  const muted = !(localStorage.getItem("nb-muted")==="1");
  localStorage.setItem("nb-muted", muted ? "1":"0");
  applyVolumeMuteUI();
});
volumeRange.addEventListener("input",(e)=>{
  const v = parseFloat(e.target.value||"1");
  localStorage.setItem("nb-vol", String(v));
  applyVolumeMuteUI();
});
themeToggle.addEventListener("click", toggleTheme);
langSelect.addEventListener("change",(e)=>{
  localStorage.setItem("nb-lang", e.target.value);
  applyI18N();
  message.textContent = t("turnsLeft", Math.max(0, maxTurns - tries.length));
});
difficultySel.addEventListener("change",(e)=>{
  const diff = e.target.value;
  localStorage.setItem("nb-diff", diff);
  maxTurns = DIFF[diff] ?? 10;
  setRing(Math.max(0, maxTurns - tries.length));
  message.textContent = t("turnsLeft", Math.max(0, maxTurns - tries.length));
});

// ============ Init ============
(function init(){
  const lang = localStorage.getItem("nb-lang") || "ko";
  langSelect.value = lang;
  applyI18N();

  setTheme(localStorage.getItem("nb-theme") || "light");
  applyVolumeMuteUI();

  resetStatsUIToZero();

  if (!localStorage.getItem("nb-diff")) localStorage.setItem("nb-diff","normal");
  applyDifficultyUI();

  setRing(maxTurns);

  hintModal.style.display = "none";
  welcomeModal.style.display = "flex";
  welcomeStart.addEventListener("click", ()=>{
    welcomeModal.style.display = "none";
    resetGame();
  });

  window.addEventListener("keydown",(e)=>{
    if (e.ctrlKey && e.shiftKey && e.code === "KeyD"){ toggleDevReveal(); }
    if (e.key === "Escape"){
      if (hintModal.style.display === "flex") hintModal.style.display = "none";
    }
  });
})();
