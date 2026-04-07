import { COLORS } from './constants';

interface Props {
  connected?: boolean;
}

const WifiIndicator = ({ connected = true }: Props) => {
  return (
    <div style={{
      position: 'absolute',
      top: 2,
      right: 3,
      fontSize: 7,
      color: connected ? COLORS.wifi : COLORS.wifiOff,
      lineHeight: 1,
      opacity: 0.8,
    }}>
      {connected ? '⚡' : '✕'}
    </div>
  );
};

export default WifiIndicator;
