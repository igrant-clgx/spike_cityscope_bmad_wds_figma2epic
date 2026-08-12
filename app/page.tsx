import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

export default function HomePage() {
  return (
    <Container component="main" maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h1" gutterBottom>
        Reno Calculator
      </Typography>
      <Typography variant="cost-display" component="p">
        $32,700 - $40,000
      </Typography>
      <Typography variant="body1">
        Themed walking skeleton (Story 1.2). The MUI theme, Roboto font, and
        design tokens are now live; branded shell and features arrive in later
        stories.
      </Typography>
    </Container>
  );
}
