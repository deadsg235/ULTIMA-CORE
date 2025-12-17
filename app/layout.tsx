export const metadata = {
  title: 'ULTIMA - Self-Referencing Terminal',
  description: 'Advanced self-referencing AI with DQN reasoning capabilities',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}