

# EVOCHEF Embedded UI — High-Fidelity Simulator

## Overview
Build a pixel-accurate, interactive simulator of the EVOCHEF appliance LCD UI (128×160px portrait) rendered in the browser. The simulator will display the actual-size screen centered on a dark background, with keyboard controls simulating the rotary encoder and capacitive buttons.

## Design System
- **Background:** #0A0A0A deep black
- **Primary text:** #FFFFFF white, bold sans-serif (Inter/Roboto)
- **Accent - Heat:** #FF3B30 (orange-red)
- **Accent - Active:** #FFD60A (yellow glow)
- **Accent - Success:** #34C759 (green)
- **Typography:** Two sizes only — large (20px equiv) for values, small (12px equiv) for labels
- **Icons:** Monoline SVG, 1-bit style, minimal

## Screens (6 total)

### 1. Boot Screen
- EVOCHEF logo centered (styled text)
- "Initializing..." subtext
- Minimal progress bar animation
- Auto-transitions to Mode Select after ~3 seconds

### 2. Mode Select Screen
- **Top 30%:** Large cooking mode icon + mode name (DOSA, CREPE, WAFFLE, SANDWICH, GRILL, SAUTÉ, SOUP)
- **Middle 40%:** Live temperature, default time, crispness level (dimmed, not editable yet)
- **Bottom 20%:** Status text ("Ready" / "Preheating...") with temperature readout
- **Side indicators:** ◀ ▶ arrows for left/right navigation
- Horizontal carousel wraps around (7 modes)

### 3. Parameter Adjust Screen
- Same layout as Mode Select
- One parameter highlighted with yellow glow border (Temp / Time / Crispness)
- Rotary encoder (Up/Down keys) adjusts value with step animation
- Tab key cycles active parameter
- Enter confirms and shows "START?" prompt

### 4. Active Cooking Screen
- Large state label: "PREHEATING" → "COOKING" → "FLIPPING" (animated transitions)
- Live temperature display (large, with heat color coding)
- Countdown timer (MM:SS, large)
- Progress bar at bottom
- Simulated temperature ramp and countdown

### 5. Completion Screen
- Large green checkmark icon
- "DONE" text
- Cooking summary (mode, time elapsed, final temp)
- "Press to restart" subtext
- Auto-returns to Mode Select after 10s

### 6. Error Screen
- Warning triangle icon in #FF3B30
- Error code (e.g., "E-K04")
- Short description ("Sensor Fault")
- "Press to reset" instruction

## Interaction Model (Keyboard-simulated)
- **← → Arrow keys:** Left/Right capacitive buttons (cycle modes, navigate)
- **↑ ↓ Arrow keys:** Rotary encoder rotation (adjust values)
- **Enter:** Rotary encoder push (confirm/start)
- **Escape:** Long-press left (cancel/back to mode select)
- On-screen legend showing controls

## Micro-interactions
- Fade/slide transitions between screens
- Pulse animation on active parameter highlight
- Smooth temperature number animation (counting up/down)
- Progress bar smooth fill
- Status text scroll if overflow

## Screen Structure
- `src/pages/Index.tsx` — Main simulator wrapper (dark surround + centered LCD viewport)
- `src/components/evochef/EvochefSimulator.tsx` — State machine & screen router
- `src/components/evochef/screens/` — BootScreen, ModeSelectScreen, ParameterScreen, CookingScreen, CompletionScreen, ErrorScreen
- `src/components/evochef/icons/` — SVG cooking mode icons (monoline style)
- `src/components/evochef/constants.ts` — Mode definitions, FSM profiles, colors

## Constraints Honored
- 128×160px viewport (scaled 3× for browser visibility but pixel-accurate proportions)
- Max 3 navigation levels
- No tiny text — minimum readable sizes
- High contrast for kitchen visibility
- All 7 cooking modes with per-mode temp/time defaults from PRD

