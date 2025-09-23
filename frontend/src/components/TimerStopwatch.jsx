import { useEffect, useMemo, useRef, useState } from 'react';

const STORAGE_KEY_PREFIX = 'nexus_timer_state:'; // key per problem

function formatTime(totalSeconds) {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = Math.floor(totalSeconds % 60);
  const pad = (n) => String(n).padStart(2, '0');
  return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
}

export default function TimerStopwatch({ problemId }) {
  const storageKey = useMemo(() => `${STORAGE_KEY_PREFIX}${problemId}`, [problemId]);

  const [mode, setMode] = useState('stopwatch'); // 'stopwatch' | 'timer'
  const [isOpen, setIsOpen] = useState(false);

  // Stopwatch state
  const [stopwatchRunning, setStopwatchRunning] = useState(false);
  const [stopwatchSeconds, setStopwatchSeconds] = useState(0);
  const stopwatchStartRef = useRef(null); // timestamp in ms when started

  // Timer state
  const [timerRunning, setTimerRunning] = useState(false);
  const [timerTotalSeconds, setTimerTotalSeconds] = useState(300); // default 5m
  const [timerRemainingSeconds, setTimerRemainingSeconds] = useState(300);
  const timerDeadlineRef = useRef(null); // timestamp in ms when it ends

  // Load persisted state
  useEffect(() => {
    try {
      const raw = localStorage.getItem(storageKey);
      if (!raw) return;
      const saved = JSON.parse(raw);
      if (saved.mode) setMode(saved.mode);

      // Stopwatch
      if (typeof saved.stopwatchSeconds === 'number') {
        setStopwatchSeconds(saved.stopwatchSeconds);
      }
      if (saved.stopwatchRunning && typeof saved.stopwatchStart === 'number') {
        const elapsed = Math.floor((Date.now() - saved.stopwatchStart) / 1000);
        const nextSeconds = Math.max(0, saved.stopwatchSeconds + elapsed);
        setStopwatchSeconds(nextSeconds);
        stopwatchStartRef.current = Date.now() - nextSeconds * 1000;
        setStopwatchRunning(true);
      }

      // Timer
      if (typeof saved.timerTotalSeconds === 'number') setTimerTotalSeconds(saved.timerTotalSeconds);
      if (typeof saved.timerRemainingSeconds === 'number') setTimerRemainingSeconds(saved.timerRemainingSeconds);
      if (saved.timerRunning && typeof saved.timerDeadline === 'number') {
        const remaining = Math.max(0, Math.ceil((saved.timerDeadline - Date.now()) / 1000));
        setTimerRemainingSeconds(remaining);
        timerDeadlineRef.current = Date.now() + remaining * 1000;
        if (remaining > 0) setTimerRunning(true);
      }
    } catch {}
  }, [storageKey]);

  // Persist state
  useEffect(() => {
    const state = {
      mode,
      // Stopwatch
      stopwatchRunning,
      stopwatchSeconds,
      stopwatchStart: stopwatchStartRef.current ?? null,
      // Timer
      timerRunning,
      timerTotalSeconds,
      timerRemainingSeconds,
      timerDeadline: timerDeadlineRef.current ?? null,
    };
    try {
      localStorage.setItem(storageKey, JSON.stringify(state));
    } catch {}
  }, [mode, stopwatchRunning, stopwatchSeconds, timerRunning, timerTotalSeconds, timerRemainingSeconds, storageKey]);

  // Stopwatch ticker
  useEffect(() => {
    if (!stopwatchRunning) return;
    if (!stopwatchStartRef.current) stopwatchStartRef.current = Date.now() - stopwatchSeconds * 1000;
    const id = setInterval(() => {
      const elapsed = Math.floor((Date.now() - stopwatchStartRef.current) / 1000);
      setStopwatchSeconds(elapsed);
    }, 1000);
    return () => clearInterval(id);
  }, [stopwatchRunning]);

  // Timer ticker
  useEffect(() => {
    if (!timerRunning) return;
    if (!timerDeadlineRef.current) timerDeadlineRef.current = Date.now() + timerRemainingSeconds * 1000;
    const id = setInterval(() => {
      const remaining = Math.max(0, Math.ceil((timerDeadlineRef.current - Date.now()) / 1000));
      setTimerRemainingSeconds(remaining);
      if (remaining <= 0) {
        setTimerRunning(false);
        // Optional: play a short beep using Web Audio API to avoid intrusive UI
        try {
          const ctx = new (window.AudioContext || window.webkitAudioContext)();
          const o = ctx.createOscillator();
          const g = ctx.createGain();
          o.connect(g); g.connect(ctx.destination);
          o.type = 'sine'; o.frequency.value = 880; g.gain.value = 0.1;
          o.start(); setTimeout(() => { o.stop(); ctx.close(); }, 400);
        } catch {}
      }
    }, 1000);
    return () => clearInterval(id);
  }, [timerRunning]);

  // Actions: Stopwatch
  const startStopwatch = () => {
    if (stopwatchRunning) return;
    stopwatchStartRef.current = Date.now() - stopwatchSeconds * 1000;
    setStopwatchRunning(true);
  };
  const pauseStopwatch = () => {
    if (!stopwatchRunning) return;
    const elapsed = Math.floor((Date.now() - stopwatchStartRef.current) / 1000);
    setStopwatchSeconds(elapsed);
    setStopwatchRunning(false);
  };
  const resetStopwatch = () => {
    setStopwatchRunning(false);
    setStopwatchSeconds(0);
    stopwatchStartRef.current = null;
  };

  // Actions: Timer
  const startTimer = () => {
    if (timerRunning) return;
    if (timerRemainingSeconds <= 0) setTimerRemainingSeconds(timerTotalSeconds);
    timerDeadlineRef.current = Date.now() + (timerRemainingSeconds > 0 ? timerRemainingSeconds : timerTotalSeconds) * 1000;
    setTimerRunning(true);
  };
  const pauseTimer = () => {
    if (!timerRunning) return;
    const remain = Math.max(0, Math.ceil((timerDeadlineRef.current - Date.now()) / 1000));
    setTimerRemainingSeconds(remain);
    setTimerRunning(false);
  };
  const resetTimer = () => {
    setTimerRunning(false);
    setTimerRemainingSeconds(timerTotalSeconds);
    timerDeadlineRef.current = null;
  };

  // UI helpers
  const ToggleButton = ({ active, onClick, children, title }) => (
    <button
      type="button"
      className={`px-3 py-1 rounded-full text-sm font-semibold border ${active ? 'bg-blue-100 text-blue-800 border-blue-200' : 'bg-base-100 text-gray-700 border-base-300 hover:bg-blue-50'}`}
      onClick={onClick}
      title={title}
    >
      {children}
    </button>
  );

  return (
    <div className="relative">
      <div className="dropdown dropdown-end">
        <label tabIndex={0} className="btn btn-ghost btn-sm">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 8V4m0 0H9m3 0h3M7 21h10a2 2 0 002-2v-5a7 7 0 10-14 0v5a2 2 0 002 2z" />
          </svg>
          <span className="ml-1 hidden sm:inline">Timer</span>
        </label>
        <div tabIndex={0} className="dropdown-content z-50 w-80 p-4 shadow-xl bg-base-100 border border-base-300 rounded-xl">
          <div className="flex items-center justify-between mb-3">
            <div className="font-semibold">Time Tools</div>
            <div className="flex gap-2">
              <ToggleButton active={mode === 'stopwatch'} onClick={() => setMode('stopwatch')} title="Stopwatch">Stopwatch</ToggleButton>
              <ToggleButton active={mode === 'timer'} onClick={() => setMode('timer')} title="Timer">Timer</ToggleButton>
            </div>
          </div>

          {mode === 'stopwatch' ? (
            <div>
              <div className="text-center text-2xl font-mono mb-2">{formatTime(stopwatchSeconds)}</div>
              <div className="flex justify-center gap-2">
                {!stopwatchRunning ? (
                  <button className="btn btn-primary btn-sm" onClick={startStopwatch}>Start</button>
                ) : (
                  <button className="btn btn-warning btn-sm" onClick={pauseStopwatch}>Pause</button>
                )}
                <button className="btn btn-ghost btn-sm" onClick={resetStopwatch}>Reset</button>
              </div>
            </div>
          ) : (
            <div>
              <div className="flex items-center gap-2 mb-2">
                <label className="text-sm">Set:</label>
                <input
                  type="number"
                  min="0"
                  className="input input-bordered input-xs w-16"
                  value={Math.floor(timerTotalSeconds / 60)}
                  onChange={(e) => {
                    const m = Math.max(0, parseInt(e.target.value || '0', 10));
                    const newTotal = m * 60 + (timerTotalSeconds % 60);
                    setTimerTotalSeconds(newTotal);
                    if (!timerRunning) setTimerRemainingSeconds(newTotal);
                  }}
                />
                <span>min</span>
                <input
                  type="number"
                  min="0"
                  max="59"
                  className="input input-bordered input-xs w-16"
                  value={timerTotalSeconds % 60}
                  onChange={(e) => {
                    const s = Math.max(0, Math.min(59, parseInt(e.target.value || '0', 10)));
                    const newTotal = Math.floor(timerTotalSeconds / 60) * 60 + s;
                    setTimerTotalSeconds(newTotal);
                    if (!timerRunning) setTimerRemainingSeconds(newTotal);
                  }}
                />
                <span>sec</span>
              </div>
              <div className="text-center text-2xl font-mono mb-2">{formatTime(timerRemainingSeconds)}</div>
              <div className="flex justify-center gap-2">
                {!timerRunning ? (
                  <button className="btn btn-primary btn-sm" onClick={startTimer}>Start</button>
                ) : (
                  <button className="btn btn-warning btn-sm" onClick={pauseTimer}>Pause</button>
                )}
                <button className="btn btn-ghost btn-sm" onClick={resetTimer}>Reset</button>
              </div>
            </div>
          )}

          <div className="mt-3 text-[11px] text-gray-500 text-center">Persists per problem. Closing the menu keeps it running.</div>
        </div>
      </div>
    </div>
  );
}