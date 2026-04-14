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
  tempA: number;
  tempB: number;
  time: number;
  crispnessIndex: number;
  cookingPhase: CookingPhase;
  currentTempA: number;
  currentTempB: number;
  timeRemaining: number;
  totalTime: number;
  errorTriggered: boolean;
  wifiConnected: boolean;
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

const getParamFields = (modeIndex: number): ParamField[] => {
  const mode = COOKING_MODES[modeIndex];
  const fields: ParamField[] = [];
  if (mode.id !== 'dosa' && mode.id !== 'crepe') {
    fields.push('tempA');
    if (mode.dualZone) fields.push('tempB');
  }
  fields.push('time', 'crispness');
  return fields;
};

const initialState = (modeIndex = 0): State => {
  const mode = COOKING_MODES[modeIndex];
  return {
    screen: 'boot',
    modeIndex,
    activeParam: getParamFields(modeIndex)[0],
    tempA: mode.defaultTemp,
    tempB: mode.defaultTempB,
    time: mode.defaultTime,
    crispnessIndex: CRISPNESS_LEVELS.indexOf(mode.crispness),
    cookingPhase: 'PREHEATING',
    currentTempA: 25,
    currentTempB: 25,
    timeRemaining: mode.defaultTime,
    totalTime: mode.defaultTime,
    errorTriggered: false,
    wifiConnected: true,
  };
};

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'BOOT_DONE':
      return { ...state, screen: 'modeSelect' };
    case 'CHANGE_MODE': {
      const idx = (state.modeIndex + action.dir + COOKING_MODES.length) % COOKING_MODES.length;
      const mode = COOKING_MODES[idx];
      return {
        ...state,
        modeIndex: idx,
        tempA: mode.defaultTemp,
        tempB: mode.defaultTempB,
        time: mode.defaultTime,
        crispnessIndex: CRISPNESS_LEVELS.indexOf(mode.crispness),
        activeParam: getParamFields(idx)[0],
      };
    }
    case 'ENTER_PARAMS':
      return { ...state, screen: 'paramAdjust', activeParam: getParamFields(state.modeIndex)[0] };
    case 'CYCLE_PARAM': {
      const params = getParamFields(state.modeIndex);
      const ci = (params.indexOf(state.activeParam) + action.dir + params.length) % params.length;
      return { ...state, activeParam: params[ci] };
    }
    case 'ADJUST': {
      if (state.activeParam === 'tempA') return { ...state, tempA: Math.max(50, Math.min(300, state.tempA + action.dir * 5)) };
      if (state.activeParam === 'tempB') return { ...state, tempB: Math.max(50, Math.min(300, state.tempB + action.dir * 5)) };
      if (state.activeParam === 'time') return { ...state, time: Math.max(30, Math.min(3600, state.time + action.dir * 30)) };
      return { ...state, crispnessIndex: Math.max(0, Math.min(2, state.crispnessIndex + action.dir)) };
    }
    case 'START_COOKING':
      return {
        ...state,
        screen: 'cooking',
        cookingPhase: COOKING_MODES[state.modeIndex].hasConveyor ? 'DISPENSING' : 'PREHEATING',
        currentTempA: 25,
        currentTempB: 25,
        timeRemaining: state.time,
        totalTime: state.time,
      };
    case 'TICK': {
      const mode = COOKING_MODES[state.modeIndex];
      if (state.cookingPhase === 'DISPENSING') {
        // Simulate dispense for 3 ticks then move to conveying
        return { ...state, cookingPhase: 'CONVEYING' };
      }
      if (state.cookingPhase === 'CONVEYING') {
        return { ...state, cookingPhase: 'PREHEATING' };
      }
      if (state.cookingPhase === 'PREHEATING') {
        const newTempA = Math.min(state.tempA, state.currentTempA + 8);
        const newTempB = mode.dualZone ? Math.min(state.tempB, state.currentTempB + 6) : newTempA;
        if (newTempA >= state.tempA) return { ...state, currentTempA: newTempA, currentTempB: newTempB, cookingPhase: 'COOKING' };
        return { ...state, currentTempA: newTempA, currentTempB: newTempB };
      }
      if (state.cookingPhase === 'COOKING') {
        const tr = Math.max(0, state.timeRemaining - 1);
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
      return { ...initialState(state.modeIndex), screen: 'modeSelect', currentTempA: 25, currentTempB: 25 };
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

  useEffect(() => {
    if (state.screen === 'cooking') {
      tickRef.current = setInterval(() => dispatch({ type: 'TICK' }), 500);
      return () => { if (tickRef.current) clearInterval(tickRef.current); };
    }
    if (tickRef.current) clearInterval(tickRef.current);
  }, [state.screen, state.cookingPhase]);

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
        if (e.key === 'ArrowUp') dispatch({ type: 'CHANGE_MODE', dir: -1 });
        else if (e.key === 'ArrowDown') dispatch({ type: 'CHANGE_MODE', dir: 1 });
        else if (e.key === 'Enter') dispatch({ type: 'ENTER_PARAMS' });
        else if (e.key === 'e') dispatch({ type: 'ERROR' });
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
        return <ModeSelectScreen modeIndex={state.modeIndex} currentTempA={state.currentTempA} currentTempB={state.currentTempB} wifiConnected={state.wifiConnected} />;
      case 'paramAdjust':
        return <ParameterScreen modeIndex={state.modeIndex} activeParam={state.activeParam} tempA={state.tempA} tempB={state.tempB} time={state.time} crispnessIndex={state.crispnessIndex} wifiConnected={state.wifiConnected} />;
      case 'cooking':
        return <CookingScreen modeIndex={state.modeIndex} phase={state.cookingPhase} currentTempA={state.currentTempA} currentTempB={state.currentTempB} targetTempA={state.tempA} targetTempB={state.tempB} timeRemaining={state.timeRemaining} totalTime={state.totalTime} wifiConnected={state.wifiConnected} />;
      case 'completion':
        return <CompletionScreen modeIndex={state.modeIndex} totalTime={state.totalTime} finalTempA={state.tempA} finalTempB={state.tempB} onDismiss={() => dispatch({ type: 'RESET' })} wifiConnected={state.wifiConnected} />;
      case 'error':
        return <ErrorScreen code="E-K04" description="Sensor Fault" />;
    }
  };

  return (
    <div style={{ width: LCD_W * SCALE, height: LCD_H * SCALE, border: '2px solid #222', borderRadius: 8, overflow: 'hidden', boxShadow: '0 0 40px rgba(0,0,0,0.8)', position: 'relative' }}>
      <div style={{ width: LCD_W, height: LCD_H, transform: `scale(${SCALE})`, transformOrigin: 'top left', fontFamily: "'Inter', 'Roboto', sans-serif'" }}>
        {renderScreen()}
      </div>
    </div>
  );
};

export default EvochefSimulator;
