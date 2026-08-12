import { Poppins, Source_Sans_3 } from 'next/font/google';
import { Providers } from './providers';
import { AppShell } from '@/components/shell';

// Figma frame 9:2 uses Poppins (display/headings) + Source Sans Pro (body/UI).
const poppins = Poppins({
  weight: ['400', '500', '600', '700'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-poppins',
});

const sourceSans = Source_Sans_3({
  weight: ['400', '600', '700'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-source-sans',
});

export const metadata = {
  title: "Reno Calculator — Walking Skeleton",
  description: "Greenfield scaffold for the renovation cost calculator.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en-AU" className={`${poppins.variable} ${sourceSans.variable}`}>
      <body>
        <Providers>
          <AppShell>{children}</AppShell>
        </Providers>
      </body>
    </html>
  );
}
