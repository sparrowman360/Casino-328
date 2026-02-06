const faces = ['\u2680','\u2681','\u2682','\u2683','\u2684','\u2685'];

const die1El = document.getElementById('die1');
const die2El = document.getElementById('die2');
const rollBtn = document.getElementById('rollBtn');
const resultEl = document.getElementById('result');
const moneyEl = document.getElementById('money');

function randFace(){
  return Math.floor(Math.random()*6);
}

function setFaces(i,j){
  die1El.textContent = faces[i];
  die2El.textContent = faces[j];
}

// Game state (persisted)
const STORAGE_KEY = 'two-dice-state-v1';
let state = { money: 0, lowStreak: 0 };

function loadState(){
  try{
    const raw = localStorage.getItem(STORAGE_KEY);
    if(raw) state = JSON.parse(raw);
  }catch(e){/* ignore */}
  updateMoneyUI();
}

function saveState(){
  try{ localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); }catch(e){}
}

function updateMoneyUI(){
  moneyEl.textContent = `Balance: $${state.money}`;
}

// Rules and payouts
const WIN_THRESHOLD = 10; // original win by sum
const WIN_AMOUNT = 10;
const LOW_THRESHOLD = 4;
const LOSS_AMOUNT = 5;

// Extra win chances
const DOUBLES_AMOUNT = 5;     // any double
const JACKPOT_AMOUNT = 50;    // double sixes
const LUCKY7_AMOUNT = 7;      // sum exactly 7

function applyRollOutcome(sum, a, b){
  // Highest-priority: jackpot (double sixes)
  if(a === 6 && b === 6){
    state.money += JACKPOT_AMOUNT;
    state.lowStreak = 0;
    resultEl.textContent = `You rolled ${sum} (${a} + ${b}) — JACKPOT! You win $${JACKPOT_AMOUNT}!`;

  // Doubles (except handled above) give a small bonus
  } else if(a === b){
    state.money += DOUBLES_AMOUNT;
    state.lowStreak = 0;
    resultEl.textContent = `You rolled ${sum} (${a} + ${b}) — doubles! You win $${DOUBLES_AMOUNT}.`;

  // Lucky seven
  } else if(sum === 7){
    state.money += LUCKY7_AMOUNT;
    state.lowStreak = 0;
    resultEl.textContent = `You rolled ${sum} (${a} + ${b}) — lucky 7! You win $${LUCKY7_AMOUNT}.`;

  // Original win-by-sum rule
  } else if(sum >= WIN_THRESHOLD){
    state.money += WIN_AMOUNT;
    state.lowStreak = 0;
    resultEl.textContent = `You rolled ${sum} (${a} + ${b}) — you win $${WIN_AMOUNT}!`;

  // Low rolls: track streaks and apply penalty on two consecutive lows
  } else if(sum <= LOW_THRESHOLD){
    state.lowStreak += 1;
    resultEl.textContent = `You rolled ${sum} (${a} + ${b}) — low roll (${state.lowStreak} low).`;
    if(state.lowStreak >= 2){
      state.money = Math.max(0, state.money - LOSS_AMOUNT);
      resultEl.textContent += ` Two lows — you lose $${LOSS_AMOUNT}.`;
      state.lowStreak = 0;
    }

  } else {
    state.lowStreak = 0;
    resultEl.textContent = `You rolled ${sum} (${a} + ${b}).`;
  }

  updateMoneyUI();
  saveState();
}

function roll(){
  rollBtn.disabled = true;
  die1El.classList.add('rolling');
  die2El.classList.add('rolling');

  const start = Date.now();
  const duration = 700;
  const tick = 50;

  const interval = setInterval(()=>{
    setFaces(randFace(), randFace());
    if(Date.now() - start > duration){
      clearInterval(interval);
      const aIdx = randFace();
      const bIdx = randFace();
      setFaces(aIdx,bIdx);
      die1El.classList.remove('rolling');
      die2El.classList.remove('rolling');
      const a = aIdx + 1;
      const b = bIdx + 1;
      const sum = a + b;
      applyRollOutcome(sum, a, b);
      rollBtn.disabled = false;
    }
  }, tick);
}

rollBtn.addEventListener('click', roll);
document.addEventListener('keydown', (e)=>{
  if(e.code === 'Space'){
    e.preventDefault();
    if(!rollBtn.disabled) roll();
  }
});

loadState();
