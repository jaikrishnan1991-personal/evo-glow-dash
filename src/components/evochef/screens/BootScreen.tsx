import { useEffect, useState } from 'react';
import { COLORS } from '../constants';

interface Props {
  onComplete: () => void;
}

const BootScreen = ({ onComplete }: Props) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(p => {
        if (p >= 100) {
          clearInterval(interval);
          setTimeout(onComplete, 300);
          return 100;
        }
        return p + 4;
      });
    }, 100);
    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: COLORS.bg }}>
      <div style={{ fontSize: 22, fontWeight: 800, letterSpacing: 4, color: COLORS.text, marginBottom: 4 }}>
        EVOCHEF
      </div>
      <div style={{ fontSize: 7, color: COLORS.textDim, marginBottom: 16, letterSpacing: 1 }}>
        Initializing...
      </div>
      <div style={{ width: 80, height: 3, background: COLORS.border, borderRadius: 2, overflow: 'hidden' }}>
        <div
          style={{
            width: `${progress}%`,
            height: '100%',
            background: COLORS.active,
            borderRadius: 2,
            transition: 'width 0.1s linear',
          }}
        />
      </div>
    </div>
  );
};

export default BootScreen;
