import { describe, it, expect } from 'vitest';
import { theme } from './theme';
import { tokens } from './tokens';

describe('theme wiring', () => {
  it('maps palette tokens exactly', () => {
    expect(theme.palette.primary.main).toBe('#0066CC');
    expect(theme.palette.primary.dark).toBe('#0052A3');
    expect(theme.palette.primary.contrastText).toBe('#FFFFFF');
    expect(theme.palette.text.primary).toBe('#333333');
    expect(theme.palette.text.secondary).toBe('#666666');
    expect(theme.palette.text.disabled).toBe('#999999');
    expect(theme.palette.background.default).toBe('#F5F5F5');
    expect(theme.palette.background.paper).toBe('#FFFFFF');
    expect(theme.palette.success.main).toBe('#28A745');
    expect(theme.palette.error.main).toBe('#DC3545');
    expect(theme.palette.warning.main).toBe('#FFC107');
    expect(theme.palette.info.main).toBe('#17A2B8');
    expect(theme.palette.divider).toBe('#E0E0E0');
  });

  it('defines the cost-display typography variant', () => {
    const cd = theme.typography['cost-display'];
    expect(cd.fontSize).toBe(56);
    expect(cd.fontWeight).toBe(700);
    expect(cd.lineHeight).toBe(1.2);
    expect(cd.letterSpacing).toBe(-1);
  });

  it('uses the Roboto family and the full ramp', () => {
    expect(theme.typography.fontFamily).toContain('Roboto');
    expect(theme.typography.h1.fontSize).toBe(48);
    expect(theme.typography.h6.fontSize).toBe(16);
    expect(theme.typography.body1.fontSize).toBe(14);
    expect(theme.typography.caption.fontSize).toBe(12);
  });

  it('sets shape radius to the md token and 8px spacing base', () => {
    expect(theme.shape.borderRadius).toBe(8);
    expect(theme.spacing(1)).toBe('8px');
    expect(theme.spacing(3)).toBe('24px');
  });

  it('exposes named layout tokens', () => {
    expect(theme.layout.contentMax).toBe(840);
    expect(theme.layout.headerH).toBe(68);
    expect(theme.layout.stepGap).toBe(24);
    expect(theme.layout.cardPad).toBe(24);
  });

  it('wires the brand elevation shadows', () => {
    expect(theme.shadows).toContain(tokens.shadows.accordion);
    expect(theme.shadows).toContain(tokens.shadows.result);
    expect(theme.shadows).toContain(tokens.shadows.snackbar);
    // Result-card shadow present specifically.
    expect(theme.shadows[2]).toBe('0px 4px 8px rgba(0,0,0,0.10)');
  });

  it('never uses a shadow above 0.15 opacity', () => {
    const opacityRe = /rgba\([^)]*,\s*([0-9]*\.?[0-9]+)\s*\)/g;
    for (const shadow of theme.shadows) {
      if (typeof shadow !== 'string') continue;
      let match: RegExpExecArray | null;
      opacityRe.lastIndex = 0;
      while ((match = opacityRe.exec(shadow)) !== null) {
        expect(Number(match[1])).toBeLessThanOrEqual(0.15);
      }
    }
  });
});
