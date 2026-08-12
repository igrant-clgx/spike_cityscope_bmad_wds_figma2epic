'use client';

import { useForm, Controller } from 'react-hook-form';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormHelperText from '@mui/material/FormHelperText';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import RadioGroup from '@mui/material/RadioGroup';
import Radio from '@mui/material/Radio';
import Checkbox from '@mui/material/Checkbox';
import { FormTextField } from '@/components/feedback';
import {
  type LeadFormValues,
  type LeadRequestFields,
  leadFormDefaults,
  leadFormFieldErrors,
  isLeadFormSubmittable,
  toLeadRequestFields,
} from './lead-form-values';
import {
  LEAD_FORM_HEADING,
  LEAD_FORM_DESCRIPTION,
  FIRST_NAME_LABEL,
  LAST_NAME_LABEL,
  EMAIL_LABEL,
  PHONE_LABEL,
  CONTACT_METHOD_LABEL,
  BEST_TIME_LABEL,
  BEST_TIME_PLACEHOLDER,
  CONTACT_METHOD_OPTIONS,
  BEST_TIME_OPTIONS,
  CONSENT_LABEL,
  SUBMIT_LABEL,
} from './lead-form-copy';
import { LEAD_DISABLED_SUBMIT_HELP } from './lead-panel-copy';

/** Stable ids so each control's error node links via `aria-describedby`. */
const FIELD_IDS = {
  firstName: 'lead-first-name',
  lastName: 'lead-last-name',
  email: 'lead-email',
  phone: 'lead-phone',
  contactMethod: 'lead-contact-method',
  bestTime: 'lead-best-time',
  consent: 'lead-consent',
} as const;

const CONTACT_METHOD_LABEL_ID = 'lead-contact-method-label';
const CONTACT_METHOD_ERROR_ID = 'lead-contact-method-error';
const BEST_TIME_LABEL_ID = 'lead-best-time-label';
const BEST_TIME_ERROR_ID = 'lead-best-time-error';
const CONSENT_ERROR_ID = 'lead-consent-error';
const DISABLED_SUBMIT_HELP_ID = 'lead-disabled-submit-help';

export interface LeadFormProps {
  /**
   * Supplied by Story 5.4 — fires with the SCHEMA-READY lead fields (the
   * `bestTime: ''` sentinel already normalized to omitted) on a valid submit.
   * Only ever called when the pure gate passes, so the payload is guaranteed to
   * satisfy `leadCaptureRequestSchema` once Story 5.4 joins the `estimateId`.
   */
  onSubmit?: (fields: LeadRequestFields) => void;
  /**
   * Story 5.4 submit-in-flight flag. While `true` the form is inert — the submit
   * shows a loading spinner and is disabled so a duplicate submission is
   * impossible (UX-DR16 lead). The rhf state is untouched, so entered data is
   * preserved across submitting↔error.
   */
  submitting?: boolean;
}

/**
 * Presentational lead-capture form (Story 5.3, FR-27/28/30, UX-DR12/20). Owns
 * its OWN react-hook-form instance (separate from the estimate flow's form) and
 * derives EVERY error/enable decision from the PURE `leadFormFieldErrors` /
 * `isLeadFormSubmittable` over the live `watch()`ed values — react-hook-form is
 * used only for control binding and the `handleSubmit` wiring, not the
 * validation logic. Errors are shown only AFTER a field is touched (no errors on
 * a pristine form); the submit stays disabled until the pure gate passes.
 *
 * NO submit-to-network, no `estimateId`, no view-states — those are Story 5.4,
 * which supplies `onSubmit`. Every field is programmatically labelled and links
 * its error node via `aria-describedby`; consent is a real MUI `Checkbox` with
 * correct semantics and its own error wiring (UX-DR20). Targets are ≥44px.
 */
export function LeadForm({ onSubmit, submitting = false }: LeadFormProps) {
  const { control, handleSubmit, watch } = useForm<LeadFormValues>({
    defaultValues: leadFormDefaults(),
    mode: 'onTouched',
  });

  const values = watch();
  const errors = leadFormFieldErrors(values);
  const submittable = isLeadFormSubmittable(values);

  const submit = handleSubmit((formValues) => {
    // Re-guard the pure gate in the submit PATH (not just the disabled button)
    // and normalize the `bestTime` sentinel so the emitted payload is
    // schema-valid — defense in depth against a forced/implicit submit.
    const fields = toLeadRequestFields(formValues);
    if (fields) onSubmit?.(fields);
  });

  return (
    <Box
      component="form"
      onSubmit={submit}
      noValidate
      sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
    >
      <Box>
        <Typography variant="h6" component="h2" gutterBottom>
          {LEAD_FORM_HEADING}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {LEAD_FORM_DESCRIPTION}
        </Typography>
      </Box>

      <Controller
        name="firstName"
        control={control}
        render={({ field, fieldState }) => {
          const show = fieldState.isTouched && Boolean(errors.firstName);
          return (
            <FormTextField
              id={FIELD_IDS.firstName}
              label={FIRST_NAME_LABEL}
              value={field.value}
              onChange={field.onChange}
              onBlur={field.onBlur}
              fullWidth
              autoComplete="given-name"
              {...(show
                ? { error: true, helperText: errors.firstName as string }
                : { error: false })}
            />
          );
        }}
      />

      <Controller
        name="lastName"
        control={control}
        render={({ field, fieldState }) => {
          const show = fieldState.isTouched && Boolean(errors.lastName);
          return (
            <FormTextField
              id={FIELD_IDS.lastName}
              label={LAST_NAME_LABEL}
              value={field.value}
              onChange={field.onChange}
              onBlur={field.onBlur}
              fullWidth
              autoComplete="family-name"
              {...(show
                ? { error: true, helperText: errors.lastName as string }
                : { error: false })}
            />
          );
        }}
      />

      <Controller
        name="email"
        control={control}
        render={({ field, fieldState }) => {
          const show = fieldState.isTouched && Boolean(errors.email);
          return (
            <FormTextField
              id={FIELD_IDS.email}
              label={EMAIL_LABEL}
              type="email"
              value={field.value}
              onChange={field.onChange}
              onBlur={field.onBlur}
              fullWidth
              autoComplete="email"
              {...(show
                ? { error: true, helperText: errors.email as string }
                : { error: false })}
            />
          );
        }}
      />

      <Controller
        name="phone"
        control={control}
        render={({ field, fieldState }) => {
          const show = fieldState.isTouched && Boolean(errors.phone);
          return (
            <FormTextField
              id={FIELD_IDS.phone}
              label={PHONE_LABEL}
              type="tel"
              value={field.value}
              onChange={field.onChange}
              onBlur={field.onBlur}
              fullWidth
              autoComplete="tel"
              inputMode="tel"
              {...(show
                ? { error: true, helperText: errors.phone as string }
                : { error: false })}
            />
          );
        }}
      />

      <Controller
        name="contactMethod"
        control={control}
        render={({ field, fieldState }) => {
          const show = fieldState.isTouched && Boolean(errors.contactMethod);
          return (
            <FormControl error={show} component="fieldset">
              <FormLabel id={CONTACT_METHOD_LABEL_ID} component="legend">
                {CONTACT_METHOD_LABEL}
              </FormLabel>
              <RadioGroup
                aria-labelledby={CONTACT_METHOD_LABEL_ID}
                aria-describedby={show ? CONTACT_METHOD_ERROR_ID : undefined}
                value={field.value}
                onChange={(event) => field.onChange(event.target.value)}
                onBlur={field.onBlur}
              >
                {CONTACT_METHOD_OPTIONS.map((option) => (
                  <FormControlLabel
                    key={option.value}
                    value={option.value}
                    control={<Radio />}
                    label={option.label}
                  />
                ))}
              </RadioGroup>
              {show ? (
                <FormHelperText id={CONTACT_METHOD_ERROR_ID}>
                  {errors.contactMethod}
                </FormHelperText>
              ) : null}
            </FormControl>
          );
        }}
      />

      <Controller
        name="bestTime"
        control={control}
        render={({ field, fieldState }) => {
          const show = fieldState.isTouched && Boolean(errors.bestTime);
          return (
            <FormControl fullWidth error={show}>
              <InputLabel id={BEST_TIME_LABEL_ID}>{BEST_TIME_LABEL}</InputLabel>
              <Select
                labelId={BEST_TIME_LABEL_ID}
                id={FIELD_IDS.bestTime}
                label={BEST_TIME_LABEL}
                aria-describedby={show ? BEST_TIME_ERROR_ID : undefined}
                value={field.value}
                onChange={(event) => field.onChange(event.target.value)}
                onBlur={field.onBlur}
              >
                <MenuItem value="">{BEST_TIME_PLACEHOLDER}</MenuItem>
                {BEST_TIME_OPTIONS.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
              {show ? (
                <FormHelperText id={BEST_TIME_ERROR_ID}>
                  {errors.bestTime}
                </FormHelperText>
              ) : null}
            </FormControl>
          );
        }}
      />

      <Controller
        name="consent"
        control={control}
        render={({ field, fieldState }) => {
          const show = fieldState.isTouched && Boolean(errors.consent);
          return (
            <FormControl error={show} component="fieldset" variant="standard">
              <FormControlLabel
                control={
                  <Checkbox
                    id={FIELD_IDS.consent}
                    checked={field.value === true}
                    onChange={(event) => field.onChange(event.target.checked)}
                    onBlur={field.onBlur}
                    aria-describedby={show ? CONSENT_ERROR_ID : undefined}
                  />
                }
                label={CONSENT_LABEL}
              />
              {show ? (
                <FormHelperText id={CONSENT_ERROR_ID}>
                  {errors.consent}
                </FormHelperText>
              ) : null}
            </FormControl>
          );
        }}
      />

      <Stack direction="row">
        <Button
          type="submit"
          variant="contained"
          disabled={!submittable || submitting}
          sx={{ minHeight: 44 }}
          aria-describedby={!submittable ? DISABLED_SUBMIT_HELP_ID : undefined}
          startIcon={
            submitting ? <CircularProgress size={16} aria-hidden /> : undefined
          }
        >
          {SUBMIT_LABEL}
        </Button>
      </Stack>
      {!submittable ? (
        <FormHelperText id={DISABLED_SUBMIT_HELP_ID}>
          {LEAD_DISABLED_SUBMIT_HELP}
        </FormHelperText>
      ) : null}
    </Box>
  );
}
