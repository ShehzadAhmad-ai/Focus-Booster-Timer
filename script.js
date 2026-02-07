// ====== Grab elements from DOM ======
const workInput = document.getElementById('work-duration');
const breakInput = document.getElementById('break-duration');
const timerLabel = document.getElementById('timer-label');
const timerDisplay = document.getElementById('timer');
const progressBar = document.getElementById('progress');
const startBtn = document.getElementById('start');
const pauseBtn = document.getElementById('pause');
const resetBtn = document.getElementById('reset');
const toggleModeBtn = document.getElementById('toggle-mode');
const quoteDisplay = document.getElementById('quote');
const sessionCountDisplay = document.getElementById('session-count');

// ====== Timer variables ======
let workDuration = parseInt(workInput.value) * 60; // in seconds
let breakDuration = parseInt(breakInput.value) * 60; // in seconds
let timeLeft = workDuration;
let timerInterval = null;
let onBreak = false;
let sessionCount = localStorage.getItem('sessionCount') || 0;

// ====== Motivational quotes ======
const quotes = [
  "Focus on being productive instead of busy. – Tim Ferriss",
  "The key is not to prioritize what's on your schedule, but to schedule your priorities. – Stephen Covey",
  "Do something today that your future self will thank you for.",
  "Small steps every day lead to big results.",
  "Your mind will always believe everything you tell it. Feed it hope."
];

// ====== Functions ======

// Format time in MM:SS
function formatTime(seconds) {
  const m = Math.floor(seconds / 60).toString().padStart(2, '0');
  const s = (seconds % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
}

// Update timer display and progress bar
function updateDisplay() {
  timerDisplay.textContent = formatTime(timeLeft);
  const total = onBreak ? breakDuration : workDuration;
  const percent = ((total - timeLeft) / total) * 100;
  progressBar.style.width = `${percent}%`;
  progressBar.style.backgroundColor = onBreak ? '#1cc88a' : '#4e73df'; // green for break, blue for work
}

// Switch between work and break
function switchSession() {
  onBreak = !onBreak;
  timeLeft = onBreak ? breakDuration : workDuration;
  timerLabel.textContent = onBreak ? "Break" : "Work";

  // Display a random motivational quote on break
  if(onBreak) {
    quoteDisplay.textContent = quotes[Math.floor(Math.random() * quotes.length)];
  }

  // Play a sound (optional)
  const audio = new Audio('https://www.soundjay.com/buttons/sounds/button-3.mp3');
  audio.play();

  // If a work session just finished, increment session count
  if(!onBreak) {
    sessionCount++;
    localStorage.setItem('sessionCount', sessionCount);
    sessionCountDisplay.textContent = sessionCount;
  }
}

// Timer countdown
function startTimer() {
  if(timerInterval) return; // prevent multiple intervals
  timerInterval = setInterval(() => {
    timeLeft--;
    if(timeLeft < 0) {
      switchSession();
    }
    updateDisplay();
  }, 1000);
}

// Pause timer
function pauseTimer() {
  clearInterval(timerInterval);
  timerInterval = null;
}

// Reset timer
function resetTimer() {
  pauseTimer();
  workDuration = parseInt(workInput.value) * 60;
  breakDuration = parseInt(breakInput.value) * 60;
  onBreak = false;
  timeLeft = workDuration;
  timerLabel.textContent = "Work";
  updateDisplay();
}

// Toggle Dark/Light mode
function toggleMode() {
  document.body.classList.toggle('dark-mode');
}

// ====== Event Listeners ======
startBtn.addEventListener('click', startTimer);
pauseBtn.addEventListener('click', pauseTimer);
resetBtn.addEventListener('click', resetTimer);
toggleModeBtn.addEventListener('click', toggleMode);

// Initialize display on load
updateDisplay();
sessionCountDisplay.textContent = sessionCount;