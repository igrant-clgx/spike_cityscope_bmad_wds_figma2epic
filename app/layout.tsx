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
    <html lang="en-AU">
      <body>{children}</body>
    </html>
  );
}
