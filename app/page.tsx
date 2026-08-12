import Typography from '@mui/material/Typography';
import { AddressSection } from '@/features/address';

/**
 * Walking-skeleton home page. The address section (Story 2.3) renders above the
 * form region — it owns the flow-form state and connects the display block to
 * the autocomplete change modal (debounced suggest → structured resolution →
 * `setAddress`). `AddressSection` is the client boundary; this page stays a
 * Server Component.
 */
export default function HomePage() {
  return (
    <>
      <Typography variant="h1" gutterBottom>
        Reno Calculator
      </Typography>

      <AddressSection />

      <Typography variant="cost-display" component="p">
        $32,700 - $40,000
      </Typography>
      <Typography variant="body1">
        Themed walking skeleton. The MUI theme, Roboto font, design tokens, and
        the address block are now live; the guided form and results arrive in
        later stories.
      </Typography>
    </>
  );
}
