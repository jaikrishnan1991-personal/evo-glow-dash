import { COLORS, COOKING_MODES } from '../constants';

interface Props {
  modeIndex: number;
  currentTemp: number;
}

const ModeSelectScreen = ({ modeIndex, currentTemp }: Props) => {
  const mode = COOKING_MODES[modeIndex];

  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', background: COLORS.bg, position: 'relative' }}>
      {/* Side arrows */}
      <div style={{ position: 'absolute', left: 3, top: '50%', transform: 'translateY(-50%)', color: COLORS.textDim, fontSize: 10 }}>◀</div>
      <div style={{ position: 'absolute', right: 3, top: '50%', transform: 'translateY(-50%)', color: COLORS.textDim, fontSize: 10 }}>▶</div>

      {/* Top 30% - Mode icon & name */}
      <div style={{ height: '30%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ fontSize: 28, color: COLORS.text, lineHeight: 1 }}>{mode.icon}</div>
        <div style={{ fontSize: 14, fontWeight: 700, color: COLORS.text, letterSpacing: 2, marginTop: 2 }}>{mode.name}</div>
      </div>

      {/* Middle 40% - Parameters */}
      <div style={{ height: '40%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 6, padding: '0 12px' }}>
        <ParamRow label="TEMP" value={`${mode.defaultTemp}°C`} />
        <ParamRow label="TIME" value={formatTime(mode.defaultTime)} />
        <ParamRow label="CRISP" value={mode.crispness} />
      </div>

      {/* Bottom 20% - Status */}
      <div style={{ height: '20%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', borderTop: `1px solid ${COLORS.border}` }}>
        <div style={{ fontSize: 8, color: COLORS.textDim, letterSpacing: 1 }}>
          {currentTemp > 40 ? 'Preheating...' : 'Ready'}
        </div>
        <div style={{ fontSize: 10, color: currentTemp > 40 ? COLORS.heat : COLORS.textDim, fontWeight: 600, marginTop: 1 }}>
          {currentTemp}°C
        </div>
      </div>

      {/* Bottom hint */}
      <div style={{ position: 'absolute', bottom: 2, width: '100%', textAlign: 'center', fontSize: 6, color: COLORS.textDim }}>
        ENTER to adjust
      </div>
    </div>
  );
};

const ParamRow = ({ label, value }: { label: string; value: string }) => (
  <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
    <span style={{ fontSize: 8, color: COLORS.textDim, fontWeight: 600 }}>{label}</span>
    <span style={{ fontSize: 10, color: COLORS.text, fontWeight: 700 }}>{value}</span>
  </div>
);

const formatTime = (s: number) => {
  const m = Math.floor(s / 60);
  const sec = s % 60;
  return `${m.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
};

export default ModeSelectScreen;
