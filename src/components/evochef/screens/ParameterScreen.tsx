import { COLORS, COOKING_MODES, CRISPNESS_LEVELS, type ParamField } from '../constants';

interface Props {
  modeIndex: number;
  activeParam: ParamField;
  temp: number;
  time: number;
  crispnessIndex: number;
}

const ParameterScreen = ({ modeIndex, activeParam, temp, time, crispnessIndex }: Props) => {
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
    padding: '3px 4px',
    borderRadius: 3,
    border: activeParam === field ? `1px solid ${COLORS.active}` : '1px solid transparent',
    boxShadow: activeParam === field ? `0 0 6px ${COLORS.active}40` : 'none',
    transition: 'all 0.15s ease',
  });

  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', background: COLORS.bg }}>
      {/* Top - Mode */}
      <div style={{ height: '30%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ fontSize: 28, color: COLORS.text }}>{mode.icon}</div>
        <div style={{ fontSize: 14, fontWeight: 700, color: COLORS.text, letterSpacing: 2, marginTop: 2 }}>{mode.name}</div>
      </div>

      {/* Middle - Editable params */}
      <div style={{ height: '45%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 5, padding: '0 10px' }}>
        <div style={paramStyle('temp')}>
          <span style={{ fontSize: 8, color: COLORS.textDim, fontWeight: 600 }}>TEMP</span>
          <span style={{ fontSize: 11, color: activeParam === 'temp' ? COLORS.active : COLORS.text, fontWeight: 700 }}>{temp}°C</span>
        </div>
        <div style={paramStyle('time')}>
          <span style={{ fontSize: 8, color: COLORS.textDim, fontWeight: 600 }}>TIME</span>
          <span style={{ fontSize: 11, color: activeParam === 'time' ? COLORS.active : COLORS.text, fontWeight: 700 }}>{formatTime(time)}</span>
        </div>
        <div style={paramStyle('crispness')}>
          <span style={{ fontSize: 8, color: COLORS.textDim, fontWeight: 600 }}>CRISP</span>
          <span style={{ fontSize: 11, color: activeParam === 'crispness' ? COLORS.active : COLORS.text, fontWeight: 700 }}>{CRISPNESS_LEVELS[crispnessIndex]}</span>
        </div>
      </div>

      {/* Bottom hints */}
      <div style={{ height: '25%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 2 }}>
        <div style={{ fontSize: 7, color: COLORS.textDim }}>↑↓ adjust · ←→ param</div>
        <div style={{ fontSize: 8, color: COLORS.active, fontWeight: 700 }}>ENTER to START</div>
      </div>
    </div>
  );
};

export default ParameterScreen;
