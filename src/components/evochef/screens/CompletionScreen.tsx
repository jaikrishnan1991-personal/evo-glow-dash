import { COLORS, COOKING_MODES } from '../constants';
import WifiIndicator from '../WifiIndicator';

interface Props {
  modeIndex: number;
  totalTime: number;
  finalTempA: number;
  finalTempB: number;
  onDismiss: () => void;
  wifiConnected: boolean;
}

const CompletionScreen = ({ modeIndex, totalTime, finalTempA, finalTempB, wifiConnected }: Props) => {
  const mode = COOKING_MODES[modeIndex];

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}m ${sec}s`;
  };

  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: COLORS.bg, gap: 4, position: 'relative' }}>
      <WifiIndicator connected={wifiConnected} />
      <div style={{ fontSize: 30, color: COLORS.success, lineHeight: 1 }}>✓</div>
      <div style={{ fontSize: 16, fontWeight: 800, color: COLORS.success, letterSpacing: 3 }}>DONE</div>
      <div style={{ fontSize: 7, color: COLORS.textDim, textAlign: 'center', lineHeight: 1.6, marginTop: 2 }}>
        {mode.name}<br />
        {formatTime(totalTime)} · {mode.dualZone ? `A:${finalTempA}° B:${finalTempB}°` : `${finalTempA}°C`}
      </div>
      <div style={{ fontSize: 6, color: COLORS.textDim, marginTop: 6 }}>Press to restart</div>
    </div>
  );
};

export default CompletionScreen;
