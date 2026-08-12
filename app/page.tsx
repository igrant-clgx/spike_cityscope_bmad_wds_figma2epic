import Typography from '@mui/material/Typography';
import { AddressBlock } from '@/features/address';

/**
 * Walking-skeleton home page. The address block (Story 2.2) renders above the
 * form region. No property is selected yet — the flow aggregate is wired to
 * live state in later stories — so the block shows its honest empty/initial
 * prompt. The autocomplete change modal (Story 2.3) will supply the resolved
 * address and `onChangeAddress`.
 */
export default function HomePage() {
  return (
    <>
      <Typography variant="h1" gutterBottom>
        Reno Calculator
      </Typography>

      <AddressBlock address={null} />

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
