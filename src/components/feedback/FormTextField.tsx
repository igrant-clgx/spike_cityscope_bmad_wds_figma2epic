'use client';

import * as React from 'react';
import TextField, { type TextFieldProps } from '@mui/material/TextField';

/**
 * Input-error primitive (UX-DR15).
 *
 * Wraps MUI `TextField`, ENFORCING that the error treatment is never signalled
 * by colour alone: whenever `error` is `true`, a non-empty `helperText` is
 * required. This is enforced two ways:
 *  - at the type level via a discriminated props union (`error: true` requires
 *    `helperText: string`);
 *  - at runtime via a dev guard that warns if the pairing is violated.
 *
 * The themed 2px error border + soft focus glow come from the `MuiOutlinedInput`
 * `Mui-error` overrides, so this wrapper only enforces the pairing invariant.
 */

type BaseProps = Omit<TextFieldProps, 'error' | 'helperText'>;

type ErrorProps = BaseProps & {
  error: true;
  /** Required when `error` is true — the inline message shown to the user. */
  helperText: string;
};

type NonErrorProps = BaseProps & {
  error?: false;
  helperText?: React.ReactNode;
};

export type FormTextFieldProps = ErrorProps | NonErrorProps;

export function FormTextField(props: FormTextFieldProps) {
  const { error, helperText, ...rest } = props;

  const isEmptyHelper =
    helperText === undefined ||
    helperText === null ||
    helperText === '' ||
    (typeof helperText === 'string' && helperText.trim() === '');

  if (process.env.NODE_ENV !== 'production' && error && isEmptyHelper) {
    // eslint-disable-next-line no-console
    console.error(
      'FormTextField: `error` is true but `helperText` is empty. Error state must always be paired with an inline message (UX-DR15).',
    );
  }

  // Hard guarantee (belt-and-braces with the type-level union): an error is
  // NEVER signalled by colour alone — if a caller bypasses the types and passes
  // no message, substitute a generic accessible one so text always accompanies it.
  const effectiveHelperText =
    error && isEmptyHelper ? 'This field has an error.' : helperText;

  return <TextField error={error} helperText={effectiveHelperText} {...rest} />;
}
