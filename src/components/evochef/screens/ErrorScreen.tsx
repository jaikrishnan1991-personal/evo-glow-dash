import { COLORS } from '../constants';

interface Props {
  code: string;
  description: string;
}

const ErrorScreen = ({ code, description }: Props) => {
  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: COLORS.bg, gap: 6 }}>
      <div style={{ fontSize: 32, color: COLORS.heat, lineHeight: 1 }}>⚠</div>
      <div style={{ fontSize: 16, fontWeight: 800, color: COLORS.heat, letterSpacing: 2 }}>{code}</div>
      <div style={{ fontSize: 9, color: COLORS.textDim, textAlign: 'center' }}>{description}</div>
      <div style={{ fontSize: 7, color: COLORS.textDim, marginTop: 10 }}>Press to reset</div>
    </div>
  );
};

export default ErrorScreen;
