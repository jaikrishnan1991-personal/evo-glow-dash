import { COLORS, COOKING_MODES } from '../constants';
import WifiIndicator from '../WifiIndicator';

interface Props {
  modeIndex: number;
  currentTempA: number;
  currentTempB: number;
  wifiConnected: boolean;
}

const ModeSelectScreen = ({ modeIndex, currentTempA, currentTempB, wifiConnected }: Props) => {
  const mode = COOKING_MODES[modeIndex];
  const totalModes = COOKING_MODES.length;

  // Show prev/current/next for scrollable feel
  const prevIdx = (modeIndex - 1 + totalModes) % totalModes;
  const nextIdx = (modeIndex + 1) % totalModes;

  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', background: COLORS.bg, position: 'relative' }}>
      <WifiIndicator connected={wifiConnected} />

      {/* Top - Mode carousel (scrollable list view) */}
      <div style={{ height: '35%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
        {/* Previous mode (dimmed) */}
        <div style={{ fontSize: 6, color: COLORS.textDim, opacity: 0.4, marginBottom: 2, display: 'flex', alignItems: 'center', gap: 3 }}>
          <span style={{ fontSize: 8 }}>▲</span>
          <span>{COOKING_MODES[prevIdx].icon} {COOKING_MODES[prevIdx].name}</span>
        </div>
        {/* Current mode */}
        <div style={{ fontSize: 22, color: COLORS.text, lineHeight: 1 }}>{mode.icon}</div>
        <div style={{ fontSize: 12, fontWeight: 700, color: COLORS.text, letterSpacing: 2, marginTop: 1 }}>{mode.name}</div>
        <div style={{ fontSize: 5, color: COLORS.active, marginTop: 1, letterSpacing: 0.5 }}>{mode.baseFSM.replace(/_/g, ' ')}</div>
        {/* Next mode (dimmed) */}
        <div style={{ fontSize: 6, color: COLORS.textDim, opacity: 0.4, marginTop: 2, display: 'flex', alignItems: 'center', gap: 3 }}>
          <span>{COOKING_MODES[nextIdx].icon} {COOKING_MODES[nextIdx].name}</span>
          <span style={{ fontSize: 8 }}>▼</span>
        </div>
      </div>

      {/* Middle - Parameters with Zone A/B */}
      <div style={{ height: '35%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 3, padding: '0 8px' }}>
        {mode.dualZone ? (
          <>
            <ParamRow label="ZONE A" value={`${mode.defaultTemp}°C`} />
            <ParamRow label="ZONE B" value={`${mode.defaultTempB}°C`} />
          </>
        ) : (
          <ParamRow label="TEMP" value={`${mode.defaultTemp}°C`} />
        )}
        <ParamRow label="TIME" value={formatTime(mode.defaultTime)} />
        <ParamRow label="CRISP" value={mode.crispness} />
        {mode.hasConveyor && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 3, marginTop: 1 }}>
            <span style={{ fontSize: 6, color: COLORS.active }}>⟳</span>
            <span style={{ fontSize: 6, color: COLORS.textDim }}>CONVEYOR</span>
          </div>
        )}
      </div>

      {/* Bottom - Live Zone temps */}
      <div style={{ height: '20%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', borderTop: `1px solid ${COLORS.border}` }}>
        <div style={{ fontSize: 7, color: COLORS.textDim, letterSpacing: 1 }}>
          {currentTempA > 40 ? 'Preheating...' : 'Ready'}
        </div>
        {mode.dualZone ? (
          <div style={{ display: 'flex', gap: 8, marginTop: 1 }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 5, color: COLORS.textDim }}>A</div>
              <div style={{ fontSize: 9, color: currentTempA > 40 ? COLORS.heat : COLORS.textDim, fontWeight: 600 }}>{currentTempA}°</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 5, color: COLORS.textDim }}>B</div>
              <div style={{ fontSize: 9, color: currentTempB > 40 ? COLORS.heat : COLORS.textDim, fontWeight: 600 }}>{currentTempB}°</div>
            </div>
          </div>
        ) : (
          <div style={{ fontSize: 9, color: currentTempA > 40 ? COLORS.heat : COLORS.textDim, fontWeight: 600, marginTop: 1 }}>
            {currentTempA}°C
          </div>
        )}
      </div>

      {/* Scroll hint */}
      <div style={{ position: 'absolute', bottom: 2, width: '100%', textAlign: 'center', fontSize: 5, color: COLORS.textDim }}>
        ↑↓ scroll · ENTER to adjust
      </div>

      {/* Mode counter */}
      <div style={{ position: 'absolute', top: 2, left: 3, fontSize: 5, color: COLORS.textDim }}>
        {modeIndex + 1}/{totalModes}
      </div>
    </div>
  );
};

const ParamRow = ({ label, value }: { label: string; value: string }) => (
  <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
    <span style={{ fontSize: 7, color: COLORS.textDim, fontWeight: 600 }}>{label}</span>
    <span style={{ fontSize: 9, color: COLORS.text, fontWeight: 700 }}>{value}</span>
  </div>
);

const formatTime = (s: number) => {
  const m = Math.floor(s / 60);
  const sec = s % 60;
  return `${m.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
};

export default ModeSelectScreen;
