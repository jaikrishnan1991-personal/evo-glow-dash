export const COLORS = {
  bg: '#0A0A0A',
  text: '#FFFFFF',
  textDim: '#666666',
  heat: '#FF3B30',
  active: '#FFD60A',
  success: '#34C759',
  border: '#1A1A1A',
  surface: '#111111',
} as const;

export type CookingMode = {
  id: string;
  name: string;
  icon: string;
  defaultTemp: number;
  defaultTime: number; // seconds
  crispness: 'Soft' | 'Medium' | 'Crisp';
  hasFlip: boolean;
};

export const COOKING_MODES: CookingMode[] = [
  { id: 'dosa', name: 'DOSA', icon: '◎', defaultTemp: 180, defaultTime: 180, crispness: 'Crisp', hasFlip: true },
  { id: 'crepe', name: 'CREPE', icon: '◉', defaultTemp: 170, defaultTime: 150, crispness: 'Soft', hasFlip: true },
  { id: 'waffle', name: 'WAFFLE', icon: '▦', defaultTemp: 190, defaultTime: 240, crispness: 'Crisp', hasFlip: false },
  { id: 'sandwich', name: 'SANDWICH', icon: '▤', defaultTemp: 160, defaultTime: 180, crispness: 'Medium', hasFlip: true },
  { id: 'grill', name: 'GRILL', icon: '▥', defaultTemp: 220, defaultTime: 300, crispness: 'Crisp', hasFlip: true },
  { id: 'saute', name: 'SAUTÉ', icon: '◌', defaultTemp: 200, defaultTime: 120, crispness: 'Medium', hasFlip: false },
  { id: 'soup', name: 'SOUP', icon: '◔', defaultTemp: 95, defaultTime: 600, crispness: 'Soft', hasFlip: false },
];

export const CRISPNESS_LEVELS = ['Soft', 'Medium', 'Crisp'] as const;

export type Screen = 'boot' | 'modeSelect' | 'paramAdjust' | 'cooking' | 'completion' | 'error';
export type CookingPhase = 'PREHEATING' | 'COOKING' | 'FLIPPING' | 'DONE';
export type ParamField = 'temp' | 'time' | 'crispness';

export const SCALE = 3;
export const LCD_W = 128;
export const LCD_H = 160;
