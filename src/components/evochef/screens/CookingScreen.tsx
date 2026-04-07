import { COLORS, COOKING_MODES, type CookingPhase } from '../constants';

interface Props {
  modeIndex: number;
  phase: CookingPhase;
  currentTemp: number;
  targetTemp: number;
  timeRemaining: number;
  totalTime: number;
}

const CookingScreen = ({ modeIndex, phase, currentTemp, targetTemp, timeRemaining, totalTime }: Props) => {
  const mode = COOKING_MODES[modeIndex];
  const progress = totalTime > 0 ? ((totalTime - timeRemaining) / totalTime) * 100 : 0;

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
  };

  const phaseColor = phase === 'PREHEATING' ? COLORS.heat : phase === 'FLIPPING' ? COLORS.active : COLORS.text;

  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', background: COLORS.bg }}>
      {/* Phase label */}
      <div style={{ height: '25%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ fontSize: 7, color: COLORS.textDim, letterSpacing: 1, marginBottom: 2 }}>{mode.name}</div>
        <div style={{
          fontSize: 14,
          fontWeight: 800,
          color: phaseColor,
          letterSpacing: 2,
          animation: phase === 'FLIPPING' ? 'pulse 1.5s infinite' : undefined,
        }}>
          {phase}
        </div>
      </div>

      {/* Temp + Timer */}
      <div style={{ height: '45%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 7, color: COLORS.textDim }}>TEMP</div>
          <div style={{
            fontSize: 24,
            fontWeight: 800,
            color: currentTemp >= targetTemp ? COLORS.heat : COLORS.text,
            lineHeight: 1,
          }}>
            {currentTemp}°
          </div>
          <div style={{ fontSize: 7, color: COLORS.textDim }}>/ {targetTemp}°C</div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 7, color: COLORS.textDim }}>TIME</div>
          <div style={{ fontSize: 20, fontWeight: 700, color: COLORS.text, lineHeight: 1, fontVariantNumeric: 'tabular-nums' }}>
            {formatTime(timeRemaining)}
          </div>
        </div>
      </div>

      {/* Progress bar */}
      <div style={{ height: '15%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '0 12px' }}>
        <div style={{ width: '100%', height: 4, background: COLORS.border, borderRadius: 2, overflow: 'hidden' }}>
          <div style={{
            width: `${progress}%`,
            height: '100%',
            background: phase === 'PREHEATING' ? COLORS.heat : COLORS.active,
            borderRadius: 2,
            transition: 'width 0.5s linear',
          }} />
        </div>
      </div>

      {/* Bottom */}
      <div style={{ height: '15%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ fontSize: 6, color: COLORS.textDim }}>ESC to cancel</div>
      </div>
    </div>
  );
};

export default CookingScreen;
