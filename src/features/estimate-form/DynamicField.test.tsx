import { describe, it, expect } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { useForm } from 'react-hook-form';
import { ThemeProvider } from '@mui/material/styles';
import { theme } from '@/theme';
import { DynamicField } from './DynamicField';
import { stepFormDefaults, type StepFormValues } from './flow-form-values';
import type { PropertyQuestion } from '@shared/schemas';

function render(question: PropertyQuestion): string {
  function Harness() {
    const { control } = useForm<StepFormValues>({
      defaultValues: stepFormDefaults(),
      mode: 'onChange',
    });
    return (
      <ThemeProvider theme={theme}>
        <DynamicField question={question} control={control} />
      </ThemeProvider>
    );
  }
  return renderToStaticMarkup(<Harness />);
}

/**
 * Render a field with a forced react-hook-form error so the error surface is
 * exercised under node-only SSR (no interaction). Post-FIX-1 the text/numeric/
 * date branches carry the message via MUI's native `helperText`, so the input's
 * `aria-describedby` must resolve to a rendered element that CONTAINS the
 * message. For radio/select/slider/budget the explicit `<Typography id=..-error>`
 * carries it.
 */
const FORCED_MESSAGE = 'Forced error here';

function renderWithError(question: PropertyQuestion): string {
  function Harness() {
    const { control, setError } = useForm<StepFormValues>({
      defaultValues: stepFormDefaults(),
      mode: 'onChange',
    });
    setError(`propertyDetails.${question.id}`, {
      type: 'validate',
      message: FORCED_MESSAGE,
    });
    return (
      <ThemeProvider theme={theme}>
        <DynamicField question={question} control={control} />
      </ThemeProvider>
    );
  }
  return renderToStaticMarkup(<Harness />);
}

/** Assert every id referenced by aria-describedby resolves to an element that contains the message. */
function assertDescribedByResolvesToMessage(html: string): void {
  const match = html.match(/aria-describedby="([^"]+)"/);
  expect(match).not.toBeNull();
  const ids = match![1].split(/\s+/);
  const containing = ids.some((id) => {
    const re = new RegExp(
      `id="${id.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}"[^>]*>[^<]*${FORCED_MESSAGE}`,
    );
    return re.test(html);
  });
  expect(containing).toBe(true);
}

const base = { required: false, appliesToItemIds: undefined } as const;

describe('DynamicField (node-only structural)', () => {
  it('renders a radio group with its label and radio inputs', () => {
    const html = render({
      ...base,
      id: 'r',
      label: 'Pick one',
      kind: 'radio',
      options: [
        { value: 'a', label: 'Alpha' },
        { value: 'b', label: 'Beta' },
      ],
    });
    expect(html).toContain('Pick one');
    expect(html).toContain('type="radio"');
    expect(html).toContain('aria-labelledby="r-label"');
    expect(html).toContain('Alpha');
    expect(html).toContain('Beta');
  });

  it('renders a select with its label', () => {
    const html = render({
      ...base,
      id: 's',
      label: 'Choose',
      kind: 'select',
      options: [{ value: 'a', label: 'Alpha' }],
    });
    expect(html).toContain('Choose');
    // MUI Select emits a hidden native input plus the labelled combobox.
    expect(html).toContain('id="s-label"');
    expect(html).toContain('role="combobox"');
  });

  it('renders a text input with its label', () => {
    const html = render({ ...base, id: 't', label: 'Notes', kind: 'text' });
    expect(html).toContain('Notes');
    expect(html).toContain('type="text"');
  });

  it('renders a numeric input', () => {
    const html = render({ ...base, id: 'n', label: 'Count', kind: 'numeric' });
    expect(html).toContain('Count');
    expect(html).toContain('type="number"');
  });

  it('renders a date input', () => {
    const html = render({ ...base, id: 'd', label: 'When', kind: 'date' });
    expect(html).toContain('When');
    expect(html).toContain('type="date"');
  });

  it('renders a slider with its label and aria-labelledby wiring', () => {
    const html = render({
      ...base,
      id: 'sl',
      label: 'Range',
      kind: 'slider',
      min: 0,
      max: 100,
    });
    expect(html).toContain('Range');
    expect(html).toContain('id="sl-label"');
    expect(html).toContain('type="range"');
    expect(html).toContain('aria-labelledby="sl-label"');
  });

  it('renders a budget pair with min and max number inputs', () => {
    const html = render({
      ...base,
      id: 'b',
      label: 'Budget',
      kind: 'budget',
      min: 0,
      max: 1000,
    });
    expect(html).toContain('Budget minimum');
    expect(html).toContain('Budget maximum');
    expect((html.match(/type="number"/g) ?? []).length).toBe(2);
    expect(html).toContain('id="b-label"');
  });

  it('seeds a slider to its min so the displayed value equals the stored value', () => {
    const html = render({
      ...base,
      id: 'sl',
      label: 'Range',
      kind: 'slider',
      min: 10,
      max: 100,
    });
    // Write-through (FIX 3): the thumb reads aria-valuenow = question.min.
    expect(html).toContain('aria-valuenow="10"');
  });
});

describe('DynamicField error path (node-only SSR)', () => {
  it('wires text errors to a rendered element via aria-describedby (FIX 1)', () => {
    const html = renderWithError({
      ...base,
      id: 't',
      label: 'Notes',
      kind: 'text',
    });
    // Post-FIX-1: no dangling t-error; MUI native helper carries the message and
    // the input aria-describedby resolves to it.
    expect(html).not.toContain('aria-describedby="t-error"');
    expect(html).toContain(FORCED_MESSAGE);
    assertDescribedByResolvesToMessage(html);
  });

  it('wires numeric errors to a rendered element via aria-describedby', () => {
    const html = renderWithError({
      ...base,
      id: 'n',
      label: 'Count',
      kind: 'numeric',
    });
    expect(html).not.toContain('aria-describedby="n-error"');
    assertDescribedByResolvesToMessage(html);
  });

  it('wires date errors to a rendered element via aria-describedby', () => {
    const html = renderWithError({
      ...base,
      id: 'd',
      label: 'When',
      kind: 'date',
    });
    expect(html).not.toContain('aria-describedby="d-error"');
    assertDescribedByResolvesToMessage(html);
  });

  it('renders the labelled Typography error for radio and links it', () => {
    const html = renderWithError({
      ...base,
      id: 'r',
      label: 'Pick one',
      kind: 'radio',
      options: [{ value: 'a', label: 'Alpha' }],
    });
    expect(html).toMatch(/id="r-error"[^>]*>[^<]*Forced error here/);
    expect(html).toContain('aria-describedby="r-error"');
  });

  it('renders the labelled Typography error for select and links it', () => {
    const html = renderWithError({
      ...base,
      id: 's',
      label: 'Choose',
      kind: 'select',
      options: [{ value: 'a', label: 'Alpha' }],
    });
    expect(html).toMatch(/id="s-error"[^>]*>[^<]*Forced error here/);
    expect(html).toContain('aria-describedby="s-error"');
  });

  it('renders the labelled Typography error for slider and links it', () => {
    const html = renderWithError({
      ...base,
      id: 'sl',
      label: 'Range',
      kind: 'slider',
      min: 0,
      max: 100,
    });
    expect(html).toMatch(/id="sl-error"[^>]*>[^<]*Forced error here/);
    expect(html).toContain('aria-describedby="sl-error"');
  });

  it('renders the labelled Typography error for budget and links both inputs', () => {
    const html = renderWithError({
      ...base,
      id: 'b',
      label: 'Budget',
      kind: 'budget',
      min: 0,
      max: 1000,
    });
    expect(html).toMatch(/id="b-error"[^>]*>[^<]*Forced error here/);
    // Both budget inputs point at the existing b-error node (this id DOES exist).
    expect((html.match(/aria-describedby="b-error"/g) ?? []).length).toBe(2);
  });
});
