import { useCallback, useEffect, useReducer, useRef } from 'react';
import { COOKING_MODES, CRISPNESS_LEVELS, SCALE, LCD_W, LCD_H, type Screen, type ParamField, type CookingPhase } from './constants';
import BootScreen from './screens/BootScreen';
import ModeSelectScreen from './screens/ModeSelectScreen';
import ParameterScreen from './screens/ParameterScreen';
import CookingScreen from './screens/CookingScreen';
import CompletionScreen from './screens/CompletionScreen';
import ErrorScreen from './screens/ErrorScreen';

type State = {
  screen: Screen;
  modeIndex: number;
  activeParam: ParamField;
  temp: number;
  time: number;
  crispnessIndex: number;
  cookingPhase: CookingPhase;
  currentTemp: number;
  timeRemaining: number;
  totalTime: number;
  errorTriggered: boolean;
};

type Action =
  | { type: 'BOOT_DONE' }
  | { type: 'CHANGE_MODE'; dir: number }
  | { type: 'ENTER_PARAMS' }
  | { type: 'CYCLE_PARAM'; dir: number }
  | { type: 'ADJUST'; dir: number }
  | { type: 'START_COOKING' }
  | { type: 'TICK' }
  | { type: 'PHASE'; phase: CookingPhase }
  | { type: 'COMPLETE' }
  | { type: 'RESET' }
  | { type: 'ERROR' }
  | { type: 'DISMISS_ERROR' };

const initialState = (modeIndex = 0): State => {
  const mode = COOKING_MODES[modeIndex];
  return {
    screen: 'boot',
    modeIndex,
    activeParam: 'temp',
    temp: mode.defaultTemp,
    time: mode.defaultTime,
    crispnessIndex: CRISPNESS_LEVELS.indexOf(mode.crispness),
    cookingPhase: 'PREHEATING',
    currentTemp: 25,
    timeRemaining: mode.defaultTime,
    totalTime: mode.defaultTime,
    errorTriggered: false,
  };
};

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'BOOT_DONE':
      return { ...state, screen: 'modeSelect' };
    case 'CHANGE_MODE': {
      const idx = (state.modeIndex + action.dir + COOKING_MODES.length) % COOKING_MODES.length;
      const mode = COOKING_MODES[idx];
      return { ...state, modeIndex: idx, temp: mode.defaultTemp, time: mode.defaultTime, crispnessIndex: CRISPNESS_LEVELS.indexOf(mode.crispness) };
    }
    case 'ENTER_PARAMS':
      return { ...state, screen: 'paramAdjust', activeParam: 'temp' };
    case 'CYCLE_PARAM': {
      const params: ParamField[] = ['temp', 'time', 'crispness'];
      const ci = (params.indexOf(state.activeParam) + action.dir + 3) % 3;
      return { ...state, activeParam: params[ci] };
    }
    case 'ADJUST': {
      if (state.activeParam === 'temp') return { ...state, temp: Math.max(50, Math.min(250, state.temp + action.dir * 5)) };
      if (state.activeParam === 'time') return { ...state, time: Math.max(30, Math.min(3600, state.time + action.dir * 30)) };
      return { ...state, crispnessIndex: Math.max(0, Math.min(2, state.crispnessIndex + action.dir)) };
    }
    case 'START_COOKING':
      return { ...state, screen: 'cooking', cookingPhase: 'PREHEATING', currentTemp: 25, timeRemaining: state.time, totalTime: state.time };
    case 'TICK': {
      if (state.cookingPhase === 'PREHEATING') {
        const newTemp = Math.min(state.temp, state.currentTemp + 8);
        if (newTemp >= state.temp) return { ...state, currentTemp: newTemp, cookingPhase: 'COOKING' };
        return { ...state, currentTemp: newTemp };
      }
      if (state.cookingPhase === 'COOKING') {
        const tr = Math.max(0, state.timeRemaining - 1);
        const mode = COOKING_MODES[state.modeIndex];
        // Flip at 50%
        if (mode.hasFlip && tr === Math.floor(state.totalTime / 2)) {
          return { ...state, timeRemaining: tr, cookingPhase: 'FLIPPING' };
        }
        if (tr <= 0) return { ...state, timeRemaining: 0, screen: 'completion' };
        return { ...state, timeRemaining: tr };
      }
      if (state.cookingPhase === 'FLIPPING') {
        return { ...state, cookingPhase: 'COOKING' };
      }
      return state;
    }
    case 'COMPLETE':
      return { ...state, screen: 'completion' };
    case 'RESET':
      return { ...initialState(state.modeIndex), screen: 'modeSelect', currentTemp: 25 };
    case 'ERROR':
      return { ...state, screen: 'error', errorTriggered: true };
    case 'DISMISS_ERROR':
      return { ...state, screen: 'modeSelect', errorTriggered: false };
    default:
      return state;
  }
}

const EvochefSimulator = () => {
  const [state, dispatch] = useReducer(reducer, initialState());
  const tickRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Cooking ticker
  useEffect(() => {
    if (state.screen === 'cooking') {
      tickRef.current = setInterval(() => dispatch({ type: 'TICK' }), 500);
      return () => { if (tickRef.current) clearInterval(tickRef.current); };
    }
    if (tickRef.current) clearInterval(tickRef.current);
  }, [state.screen, state.cookingPhase]);

  // Auto-return from completion
  useEffect(() => {
    if (state.screen === 'completion') {
      const t = setTimeout(() => dispatch({ type: 'RESET' }), 10000);
      return () => clearTimeout(t);
    }
  }, [state.screen]);

  const handleKey = useCallback((e: KeyboardEvent) => {
    e.preventDefault();
    switch (state.screen) {
      case 'modeSelect':
        if (e.key === 'ArrowLeft') dispatch({ type: 'CHANGE_MODE', dir: -1 });
        else if (e.key === 'ArrowRight') dispatch({ type: 'CHANGE_MODE', dir: 1 });
        else if (e.key === 'Enter') dispatch({ type: 'ENTER_PARAMS' });
        else if (e.key === 'e') dispatch({ type: 'ERROR' }); // debug
        break;
      case 'paramAdjust':
        if (e.key === 'ArrowLeft') dispatch({ type: 'CYCLE_PARAM', dir: -1 });
        else if (e.key === 'ArrowRight') dispatch({ type: 'CYCLE_PARAM', dir: 1 });
        else if (e.key === 'ArrowUp') dispatch({ type: 'ADJUST', dir: 1 });
        else if (e.key === 'ArrowDown') dispatch({ type: 'ADJUST', dir: -1 });
        else if (e.key === 'Enter') dispatch({ type: 'START_COOKING' });
        else if (e.key === 'Escape') dispatch({ type: 'RESET' });
        break;
      case 'cooking':
        if (e.key === 'Escape') dispatch({ type: 'RESET' });
        break;
      case 'completion':
        if (e.key === 'Enter') dispatch({ type: 'RESET' });
        break;
      case 'error':
        if (e.key === 'Enter') dispatch({ type: 'DISMISS_ERROR' });
        break;
    }
  }, [state.screen]);

  useEffect(() => {
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [handleKey]);

  const renderScreen = () => {
    switch (state.screen) {
      case 'boot':
        return <BootScreen onComplete={() => dispatch({ type: 'BOOT_DONE' })} />;
      case 'modeSelect':
        return <ModeSelectScreen modeIndex={state.modeIndex} currentTemp={state.currentTemp} />;
      case 'paramAdjust':
        return <ParameterScreen modeIndex={state.modeIndex} activeParam={state.activeParam} temp={state.temp} time={state.time} crispnessIndex={state.crispnessIndex} />;
      case 'cooking':
        return <CookingScreen modeIndex={state.modeIndex} phase={state.cookingPhase} currentTemp={state.currentTemp} targetTemp={state.temp} timeRemaining={state.timeRemaining} totalTime={state.totalTime} />;
      case 'completion':
        return <CompletionScreen modeIndex={state.modeIndex} totalTime={state.totalTime} finalTemp={state.temp} onDismiss={() => dispatch({ type: 'RESET' })} />;
      case 'error':
        return <ErrorScreen code="E-K04" description="Sensor Fault" />;
    }
  };

  return (
    <div style={{ width: LCD_W * SCALE, height: LCD_H * SCALE, border: '2px solid #222', borderRadius: 8, overflow: 'hidden', boxShadow: '0 0 40px rgba(0,0,0,0.8)', position: 'relative' }}>
      <div style={{ width: LCD_W, height: LCD_H, transform: `scale(${SCALE})`, transformOrigin: 'top left', fontFamily: "'Inter', 'Roboto', sans-serif' " }}>
        {renderScreen()}
      </div>
    </div>
  );
};

export default EvochefSimulator;
