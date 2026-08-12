'use client';

import { Controller, type Control } from 'react-hook-form';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import InputLabel from '@mui/material/InputLabel';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Radio from '@mui/material/Radio';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Slider from '@mui/material/Slider';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { FormTextField } from '@/components/feedback';
import { validateAnswer } from './validate-answer';
import type { PropertyQuestion } from '@shared/schemas';
import type { StepFormValues } from './flow-form-values';

export interface DynamicFieldProps {
  question: PropertyQuestion;
  control: Control<StepFormValues>;
}

/**
 * Dynamic Step 3 field renderer (UX-DR8, FR-17, UX-DR15/16/20). Binds a single
 * config question to `propertyDetails.<id>` through a react-hook-form
 * `Controller` whose `validate` rule delegates to the pure `validateAnswer`, so
 * react-hook-form owns the error state. The `kind` switch is type-exhaustive
 * over the discriminated union (a `never` default).
 *
 * Every field is programmatically labelled; on error, the message lives in an
 * element whose `id` is `<question.id>-error` and the control links it via
 * `aria-describedby`. For text-like inputs the error text vehicle is
 * `FormTextField` (UX-DR15, colour-plus-text); for radio/select/slider/budget an
 * explicit labelled `Typography role="alert"` carries the message (theme
 * `color="error"`, never ad-hoc hex).
 */
export function DynamicField({ question, control }: DynamicFieldProps) {
  const errorId = `${question.id}-error`;
  const labelId = `${question.id}-label`;

  return (
    <Controller
      name={`propertyDetails.${question.id}`}
      control={control}
      defaultValue={question.kind === 'slider' ? question.min : undefined}
      rules={{ validate: (v) => validateAnswer(question, v) ?? true }}
      render={({ field, fieldState }) => {
        const invalid = Boolean(fieldState.error);
        const message = fieldState.error?.message ?? '';
        const describedBy = invalid ? errorId : undefined;

        const errorNode = invalid ? (
          <Typography role="alert" id={errorId} color="error" variant="body2">
            {message}
          </Typography>
        ) : null;

        switch (question.kind) {
          case 'radio': {
            const value = typeof field.value === 'string' ? field.value : '';
            return (
              <FormControl error={invalid}>
                <FormLabel id={labelId}>{question.label}</FormLabel>
                <RadioGroup
                  aria-labelledby={labelId}
                  aria-describedby={describedBy}
                  value={value}
                  onChange={(e) => field.onChange(e.target.value)}
                >
                  {question.options.map((option) => (
                    <FormControlLabel
                      key={option.value}
                      value={option.value}
                      control={<Radio />}
                      label={option.label}
                    />
                  ))}
                </RadioGroup>
                {errorNode}
              </FormControl>
            );
          }
          case 'select': {
            const selectValue = question.options.some(
              (o) => o.value === field.value,
            )
              ? (field.value as string)
              : '';
            return (
              <FormControl fullWidth error={invalid}>
                <InputLabel id={labelId}>{question.label}</InputLabel>
                <Select
                  labelId={labelId}
                  label={question.label}
                  aria-describedby={describedBy}
                  value={selectValue}
                  onChange={(e) => field.onChange(e.target.value)}
                >
                  {question.options.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
                {errorNode}
              </FormControl>
            );
          }
          case 'text': {
            const value = typeof field.value === 'string' ? field.value : '';
            return (
              <FormTextField
                label={question.label}
                value={value}
                onChange={(e) => field.onChange(e.target.value)}
                onBlur={field.onBlur}
                fullWidth
                slotProps={{
                  htmlInput: {
                    maxLength: question.maxLength,
                  },
                }}
                {...(invalid
                  ? { error: true, helperText: message }
                  : { error: false })}
              />
            );
          }
          case 'numeric': {
            const value =
              typeof field.value === 'number' ? String(field.value) : '';
            return (
              <FormTextField
                type="number"
                label={question.label}
                value={value}
                onChange={(e) =>
                  field.onChange(
                    e.target.value === '' ? undefined : Number(e.target.value),
                  )
                }
                onBlur={field.onBlur}
                fullWidth
                slotProps={{
                  htmlInput: {
                    min: question.min,
                    max: question.max,
                    step: question.step,
                  },
                }}
                {...(invalid
                  ? { error: true, helperText: message }
                  : { error: false })}
              />
            );
          }
          case 'date': {
            const value = typeof field.value === 'string' ? field.value : '';
            return (
              <FormTextField
                type="date"
                label={question.label}
                value={value}
                onChange={(e) => field.onChange(e.target.value)}
                onBlur={field.onBlur}
                fullWidth
                slotProps={{
                  inputLabel: { shrink: true },
                  htmlInput: {
                    min: question.minIso,
                    max: question.maxIso,
                  },
                }}
                {...(invalid
                  ? { error: true, helperText: message }
                  : { error: false })}
              />
            );
          }
          case 'slider': {
            const value =
              typeof field.value === 'number' ? field.value : question.min;
            return (
              <FormControl error={invalid} fullWidth>
                <FormLabel id={labelId}>{question.label}</FormLabel>
                <Slider
                  aria-labelledby={labelId}
                  aria-describedby={describedBy}
                  min={question.min}
                  max={question.max}
                  step={question.step}
                  value={value}
                  valueLabelDisplay="auto"
                  onChange={(_e, next) =>
                    field.onChange(Array.isArray(next) ? next[0] : next)
                  }
                />
                {errorNode}
              </FormControl>
            );
          }
          case 'budget': {
            const budget =
              typeof field.value === 'object' &&
              field.value !== null &&
              'min' in field.value &&
              'max' in field.value
                ? (field.value as { min: number; max: number })
                : undefined;
            const minValue =
              budget && typeof budget.min === 'number' ? String(budget.min) : '';
            const maxValue =
              budget && typeof budget.max === 'number' ? String(budget.max) : '';
            const emitMin = (raw: string) => {
              const nextMin = raw === '' ? undefined : Number(raw);
              field.onChange({ min: nextMin, max: budget?.max });
            };
            const emitMax = (raw: string) => {
              const nextMax = raw === '' ? undefined : Number(raw);
              field.onChange({ min: budget?.min, max: nextMax });
            };
            return (
              <FormControl error={invalid} fullWidth component="fieldset">
                <FormLabel id={labelId} component="legend">
                  {question.label}
                </FormLabel>
                <Stack direction="row" spacing={2}>
                  <FormTextField
                    type="number"
                    label={`${question.label} minimum`}
                    value={minValue}
                    onChange={(e) => emitMin(e.target.value)}
                    onBlur={field.onBlur}
                    slotProps={{
                      htmlInput: {
                        min: question.min,
                        max: question.max,
                        step: question.step,
                        'aria-describedby': describedBy,
                      },
                    }}
                    {...(invalid
                      ? { error: true, helperText: message }
                      : { error: false })}
                  />
                  <FormTextField
                    type="number"
                    label={`${question.label} maximum`}
                    value={maxValue}
                    onChange={(e) => emitMax(e.target.value)}
                    onBlur={field.onBlur}
                    slotProps={{
                      htmlInput: {
                        min: question.min,
                        max: question.max,
                        step: question.step,
                        'aria-describedby': describedBy,
                      },
                    }}
                    {...(invalid
                      ? { error: true, helperText: message }
                      : { error: false })}
                  />
                </Stack>
                {errorNode}
              </FormControl>
            );
          }
          default: {
            const _exhaustive: never = question;
            return _exhaustive;
          }
        }
      }}
    />
  );
}
