import { describe, it, expect } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { useForm, FormProvider } from 'react-hook-form';
import { ThemeProvider } from '@mui/material/styles';
import { theme } from '@/theme';
import { EstimateStepper } from './EstimateStepper';
import { stepFormDefaults, type StepFormValues } from './flow-form-values';
import { STEP_META } from './step-state';

function Harness({ defaultValues }: { defaultValues: StepFormValues }) {
  const methods = useForm<StepFormValues>({ defaultValues });
  return (
    <ThemeProvider theme={theme}>
      <FormProvider {...methods}>
        <EstimateStepper />
      </FormProvider>
    </ThemeProvider>
  );
}

function render(defaultValues: StepFormValues): string {
  return renderToStaticMarkup(<Harness defaultValues={defaultValues} />);
}

const countOccurrences = (haystack: string, needle: string): number =>
  haystack.split(needle).length - 1;

describe('EstimateStepper (node-only structural)', () => {
  const emptyHtml = render(stepFormDefaults());

  it('renders all three step titles', () => {
    expect(emptyHtml).toContain(STEP_META.type.title);
    expect(emptyHtml).toContain(STEP_META.items.title);
    expect(emptyHtml).toContain(STEP_META.details.title);
  });

  it('renders each header as a button exposing aria-expanded', () => {
    expect(emptyHtml).toContain('aria-expanded');
    // Three accordion headers → three aria-expanded attributes.
    expect(countOccurrences(emptyHtml, 'aria-expanded')).toBe(3);
  });

  it('keeps exactly one step expanded (one-expanded invariant)', () => {
    expect(countOccurrences(emptyHtml, 'aria-expanded="true"')).toBe(1);
  });

  it('renders the screen-reader aria-live region', () => {
    expect(emptyHtml).toContain('aria-live="polite"');
    expect(emptyHtml).toContain(
      `Step 1 of 3: ${STEP_META.type.title}`,
    );
  });

  it('shows a summary line + completion indicator for a seeded, collapsed complete step', () => {
    // Seed Step 2 ('items') complete. The default expanded step is 'type', so
    // 'items' is collapsed and must render its completed summary + indicator.
    const html = render({
      ...stepFormDefaults(),
      selectedItemIds: ['kitchen'],
    });
    expect(html).toContain('Completed');
    // The inline check indicator is an SVG path drawn with currentColor.
    expect(html).toContain('<svg');
    expect(html).toContain('currentColor');
  });
});
