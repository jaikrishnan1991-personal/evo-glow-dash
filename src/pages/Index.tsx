import EvochefSimulator from '@/components/evochef/EvochefSimulator';

const Index = () => {
  return (
    <div style={{
      width: '100vw',
      height: '100vh',
      background: '#050505',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 24,
      fontFamily: "'Inter', sans-serif",
    }}>
      <EvochefSimulator />
      <div style={{ color: '#444', fontSize: 12, textAlign: 'center', lineHeight: 1.8 }}>
        <span style={{ color: '#666' }}>←→</span> Navigate modes &nbsp;·&nbsp;
        <span style={{ color: '#666' }}>↑↓</span> Adjust values &nbsp;·&nbsp;
        <span style={{ color: '#666' }}>Enter</span> Confirm &nbsp;·&nbsp;
        <span style={{ color: '#666' }}>Esc</span> Back &nbsp;·&nbsp;
        <span style={{ color: '#666' }}>E</span> Error demo
      </div>
    </div>
  );
};

export default Index;
