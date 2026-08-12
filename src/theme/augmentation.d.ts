import type * as React from 'react';

/**
 * MUI module augmentation for the brand theme extensions:
 *  - the custom `cost-display` typography variant (types + `<Typography>` prop)
 *  - the `theme.layout` named-token extension (contentMax / headerH / stepGap / cardPad)
 */

declare module '@mui/material/styles' {
  interface TypographyVariants {
    'cost-display': React.CSSProperties;
  }

  interface TypographyVariantsOptions {
    'cost-display'?: React.CSSProperties;
  }

  interface Theme {
    layout: {
      contentMax: number;
      headerH: number;
      stepGap: number;
      cardPad: number;
    };
  }

  interface ThemeOptions {
    layout?: Partial<Theme['layout']>;
  }
}

declare module '@mui/material/Typography' {
  interface TypographyPropsVariantOverrides {
    'cost-display': true;
  }
}
