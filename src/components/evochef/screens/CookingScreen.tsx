import { COLORS, COOKING_MODES, type CookingPhase } from '../constants';
import WifiIndicator from '../WifiIndicator';

interface Props {
  modeIndex: number;
  phase: CookingPhase;
  currentTempA: number;
  currentTempB: number;
  targetTempA: number;
  targetTempB: number;
  timeRemaining: number;
  totalTime: number;
  wifiConnected: boolean;
}

const CookingScreen = ({ modeIndex, phase, currentTempA, currentTempB, targetTempA, targetTempB, timeRemaining, totalTime, wifiConnected }: Props) => {
  const mode = COOKING_MODES[modeIndex];
  const progress = totalTime > 0 ? ((totalTime - timeRemaining) / totalTime) * 100 : 0;

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
  };

  const phaseColor = phase === 'PREHEATING' ? COLORS.heat
    : phase === 'FLIPPING' ? COLORS.active
    : phase === 'DISPENSING' || phase === 'CONVEYING' ? COLORS.active
    : COLORS.text;

  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', background: COLORS.bg, position: 'relative' }}>
      <WifiIndicator connected={wifiConnected} />

      {/* Phase label */}
      <div style={{ height: '22%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ fontSize: 6, color: COLORS.textDim, letterSpacing: 1, marginBottom: 1 }}>{mode.name}</div>
        <div style={{
          fontSize: 12,
          fontWeight: 800,
          color: phaseColor,
          letterSpacing: 2,
          animation: phase === 'FLIPPING' || phase === 'DISPENSING' ? 'pulse 1.5s infinite' : undefined,
        }}>
          {phase}
        </div>
        {mode.hasConveyor && (phase === 'DISPENSING' || phase === 'CONVEYING') && (
          <div style={{ fontSize: 5, color: COLORS.active, marginTop: 1 }}>⟳ CONVEYOR</div>
        )}
      </div>

      {/* Temp + Timer */}
      <div style={{ height: '48%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 4 }}>
        {mode.dualZone ? (
          <div style={{ display: 'flex', gap: 12, width: '100%', justifyContent: 'center' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 6, color: COLORS.textDim }}>ZONE A</div>
              <div style={{
                fontSize: 18,
                fontWeight: 800,
                color: currentTempA >= targetTempA ? COLORS.heat : COLORS.text,
                lineHeight: 1,
              }}>
                {currentTempA}°
              </div>
              <div style={{ fontSize: 5, color: COLORS.textDim }}>/ {targetTempA}°C</div>
            </div>
            <div style={{ width: 1, background: COLORS.border, height: 30 }} />
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 6, color: COLORS.textDim }}>ZONE B</div>
              <div style={{
                fontSize: 18,
                fontWeight: 800,
                color: currentTempB >= targetTempB ? COLORS.heat : COLORS.text,
                lineHeight: 1,
              }}>
                {currentTempB}°
              </div>
              <div style={{ fontSize: 5, color: COLORS.textDim }}>/ {targetTempB}°C</div>
            </div>
          </div>
        ) : (
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 6, color: COLORS.textDim }}>TEMP</div>
            <div style={{
              fontSize: 22,
              fontWeight: 800,
              color: currentTempA >= targetTempA ? COLORS.heat : COLORS.text,
              lineHeight: 1,
            }}>
              {currentTempA}°
            </div>
            <div style={{ fontSize: 6, color: COLORS.textDim }}>/ {targetTempA}°C</div>
          </div>
        )}
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 6, color: COLORS.textDim }}>TIME</div>
          <div style={{ fontSize: 18, fontWeight: 700, color: COLORS.text, lineHeight: 1, fontVariantNumeric: 'tabular-nums' }}>
            {formatTime(timeRemaining)}
          </div>
        </div>
      </div>

      {/* Progress bar */}
      <div style={{ height: '15%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '0 10px' }}>
        <div style={{ width: '100%', height: 3, background: COLORS.border, borderRadius: 2, overflow: 'hidden' }}>
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
        <div style={{ fontSize: 5, color: COLORS.textDim }}>ESC to cancel</div>
      </div>
    </div>
  );
};

export default CookingScreen;
