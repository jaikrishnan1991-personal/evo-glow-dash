# Evo Glow Dash

Appliance simulator with connectivity state — the device UI as it behaves once it is online.

`EvochefSimulator` drives the device screens in `src/components/evochef/screens/`, with
`WifiIndicator` reflecting connection state and `constants.ts` holding the device
configuration the screens read from.

Useful for reviewing screen flow and connected-state behaviour without flashing firmware onto
real hardware.

## Running it

```bash
npm install
npm run dev
```

Playwright covers the screen flows:

```bash
npx playwright test
```

## Related

- `retro-cook-panel` — the front-panel simulator this builds on
- `v3-rc-and-ir-version2` — V3 board panel (RC + IR)
- `smart-kitchen-mvp` — the owner-facing connected app
