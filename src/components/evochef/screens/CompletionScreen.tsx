import { COLORS, COOKING_MODES } from '../constants';

interface Props {
  modeIndex: number;
  totalTime: number;
  finalTemp: number;
  onDismiss: () => void;
}

const CompletionScreen = ({ modeIndex, totalTime, finalTemp }: Props) => {
  const mode = COOKING_MODES[modeIndex];

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}m ${sec}s`;
  };

  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: COLORS.bg, gap: 6 }}>
      <div style={{ fontSize: 36, color: COLORS.success, lineHeight: 1 }}>✓</div>
      <div style={{ fontSize: 18, fontWeight: 800, color: COLORS.success, letterSpacing: 3 }}>DONE</div>
      <div style={{ fontSize: 8, color: COLORS.textDim, textAlign: 'center', lineHeight: 1.6, marginTop: 4 }}>
        {mode.name}<br />
        {formatTime(totalTime)} · {finalTemp}°C
      </div>
      <div style={{ fontSize: 7, color: COLORS.textDim, marginTop: 8 }}>Press to restart</div>
    </div>
  );
};

export default CompletionScreen;
