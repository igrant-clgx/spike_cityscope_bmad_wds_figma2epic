import { EstimateFlow } from '@/features/estimate-form';

/**
 * Walking-skeleton home page. `EstimateFlow` (Story 3.2) is the single flow
 * aggregate owner (AD-6): it renders the controlled address section above the
 * accordion stepper shell, holds the one react-hook-form instance for Step 1–3
 * scope, and lifts the confirmed address so a real change resets dependent scope
 * (FR-9 / Story 2.5). `EstimateFlow` is the client boundary; this page stays a
 * Server Component.
 *
 * Per the Figma design, the flow leads directly with the address row + accordion
 * steps — there is no page-level product title above the form (the brand lives
 * in the header only).
 */
export default function HomePage() {
  return <EstimateFlow />;
}
