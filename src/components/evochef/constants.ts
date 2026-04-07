export const COLORS = {
  bg: '#0A0A0A',
  text: '#FFFFFF',
  textDim: '#666666',
  heat: '#FF3B30',
  active: '#FFD60A',
  success: '#34C759',
  border: '#1A1A1A',
  surface: '#111111',
  wifi: '#34C759',
  wifiOff: '#FF3B30',
} as const;

export type ZoneConfig = {
  zoneA: { tempCook: number; enabled: boolean };
  zoneB: { tempCook: number; enabled: boolean };
};

export type CookingMode = {
  id: string;
  name: string;
  icon: string;
  defaultTemp: number; // Zone A default
  defaultTempB: number; // Zone B default (0 = same as A or disabled)
  defaultTime: number; // seconds
  crispness: 'Soft' | 'Medium' | 'Crisp';
  hasFlip: boolean;
  hasConveyor: boolean;
  hasDispenser: boolean;
  dualZone: boolean; // true = independent Zone A/B control
  baseFSM: string;
};

export const COOKING_MODES: CookingMode[] = [
  { id: 'dosa', name: 'DOSA', icon: '◎', defaultTemp: 180, defaultTempB: 180, defaultTime: 180, crispness: 'Crisp', hasFlip: true, hasConveyor: true, hasDispenser: true, dualZone: false, baseFSM: 'AUTO_CONTINUOUS' },
  { id: 'crepe', name: 'CREPE', icon: '◉', defaultTemp: 170, defaultTempB: 170, defaultTime: 150, crispness: 'Soft', hasFlip: false, hasConveyor: true, hasDispenser: true, dualZone: false, baseFSM: 'AUTO_CONTINUOUS' },
  { id: 'waffle', name: 'WAFFLE', icon: '▦', defaultTemp: 190, defaultTempB: 190, defaultTime: 240, crispness: 'Crisp', hasFlip: false, hasConveyor: false, hasDispenser: false, dualZone: false, baseFSM: 'ENCLOSED_RAPID' },
  { id: 'sandwich', name: 'SANDWICH', icon: '▤', defaultTemp: 160, defaultTempB: 160, defaultTime: 180, crispness: 'Medium', hasFlip: false, hasConveyor: false, hasDispenser: false, dualZone: false, baseFSM: 'ENCLOSED_RAPID' },
  { id: 'grill', name: 'GRILL', icon: '▥', defaultTemp: 250, defaultTempB: 220, defaultTime: 300, crispness: 'Crisp', hasFlip: false, hasConveyor: false, hasDispenser: false, dualZone: true, baseFSM: 'STATIC_DUAL_ZONE' },
  { id: 'saute', name: 'SAUTÉ', icon: '◌', defaultTemp: 140, defaultTempB: 120, defaultTime: 120, crispness: 'Medium', hasFlip: false, hasConveyor: false, hasDispenser: false, dualZone: true, baseFSM: 'STATIC_DUAL_ZONE' },
  { id: 'soup', name: 'SOUP', icon: '◔', defaultTemp: 95, defaultTempB: 0, defaultTime: 600, crispness: 'Soft', hasFlip: false, hasConveyor: false, hasDispenser: false, dualZone: false, baseFSM: 'STATIC_SINGLE_ZONE' },
];

export const CRISPNESS_LEVELS = ['Soft', 'Medium', 'Crisp'] as const;

export type Screen = 'boot' | 'modeSelect' | 'paramAdjust' | 'cooking' | 'completion' | 'error';
export type CookingPhase = 'PREHEATING' | 'COOKING' | 'FLIPPING' | 'DISPENSING' | 'CONVEYING' | 'DONE';
export type ParamField = 'tempA' | 'tempB' | 'time' | 'crispness';

export const SCALE = 3;
export const LCD_W = 128;
export const LCD_H = 160;
