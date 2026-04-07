import { COLORS, COOKING_MODES, CRISPNESS_LEVELS, type ParamField } from '../constants';
import WifiIndicator from '../WifiIndicator';

interface Props {
  modeIndex: number;
  activeParam: ParamField;
  tempA: number;
  tempB: number;
  time: number;
  crispnessIndex: number;
  wifiConnected: boolean;
}

const ParameterScreen = ({ modeIndex, activeParam, tempA, tempB, time, crispnessIndex, wifiConnected }: Props) => {
  const mode = COOKING_MODES[modeIndex];

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
  };

  const paramStyle = (field: ParamField): React.CSSProperties => ({
    display: 'flex',
    justifyContent: 'space-between',
    width: '100%',
    padding: '2px 4px',
    borderRadius: 3,
    border: activeParam === field ? `1px solid ${COLORS.active}` : '1px solid transparent',
    boxShadow: activeParam === field ? `0 0 6px ${COLORS.active}40` : 'none',
    transition: 'all 0.15s ease',
  });

  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', background: COLORS.bg, position: 'relative' }}>
      <WifiIndicator connected={wifiConnected} />

      {/* Top - Mode */}
      <div style={{ height: '18%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ fontSize: 18, color: COLORS.text }}>{mode.icon}</div>
        <div style={{ fontSize: 10, fontWeight: 700, color: COLORS.text, letterSpacing: 2, marginTop: 1 }}>{mode.name}</div>
      </div>

      {/* Middle - Editable params */}
      <div style={{ height: '55%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 3, padding: '0 8px' }}>
        {mode.dualZone ? (
          <>
            <div style={paramStyle('tempA')}>
              <span style={{ fontSize: 7, color: COLORS.textDim, fontWeight: 600 }}>ZONE A</span>
              <span style={{ fontSize: 10, color: activeParam === 'tempA' ? COLORS.active : COLORS.text, fontWeight: 700 }}>{tempA}°C</span>
            </div>
            <div style={paramStyle('tempB')}>
              <span style={{ fontSize: 7, color: COLORS.textDim, fontWeight: 600 }}>ZONE B</span>
              <span style={{ fontSize: 10, color: activeParam === 'tempB' ? COLORS.active : COLORS.text, fontWeight: 700 }}>{tempB}°C</span>
            </div>
          </>
        ) : (
          <div style={paramStyle('tempA')}>
            <span style={{ fontSize: 7, color: COLORS.textDim, fontWeight: 600 }}>TEMP</span>
            <span style={{ fontSize: 10, color: activeParam === 'tempA' ? COLORS.active : COLORS.text, fontWeight: 700 }}>{tempA}°C</span>
          </div>
        )}
        <div style={paramStyle('time')}>
          <span style={{ fontSize: 7, color: COLORS.textDim, fontWeight: 600 }}>TIME</span>
          <span style={{ fontSize: 10, color: activeParam === 'time' ? COLORS.active : COLORS.text, fontWeight: 700 }}>{formatTime(time)}</span>
        </div>
        <div style={paramStyle('crispness')}>
          <span style={{ fontSize: 7, color: COLORS.textDim, fontWeight: 600 }}>CRISP</span>
          <span style={{ fontSize: 10, color: activeParam === 'crispness' ? COLORS.active : COLORS.text, fontWeight: 700 }}>{CRISPNESS_LEVELS[crispnessIndex]}</span>
        </div>
        {mode.hasConveyor && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 3, marginTop: 1 }}>
            <span style={{ fontSize: 6, color: COLORS.active }}>⟳</span>
            <span style={{ fontSize: 6, color: COLORS.textDim }}>CONVEYOR ACTIVE</span>
          </div>
        )}
      </div>

      {/* Bottom hints */}
      <div style={{ height: '27%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 2 }}>
        <div style={{ fontSize: 6, color: COLORS.textDim }}>↑↓ adjust · ←→ param</div>
        <div style={{ fontSize: 7, color: COLORS.active, fontWeight: 700 }}>ENTER to START</div>
      </div>
    </div>
  );
};

export default ParameterScreen;
