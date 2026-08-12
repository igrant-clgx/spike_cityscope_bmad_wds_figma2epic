import { Roboto } from 'next/font/google';
import { Providers } from './providers';
import { AppShell } from '@/components/shell';

const roboto = Roboto({
  weight: ['400', '500', '600', '700'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-roboto',
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
    <html lang="en-AU" className={roboto.variable}>
      <body>
        <Providers>
          <AppShell>{children}</AppShell>
        </Providers>
      </body>
    </html>
  );
}
