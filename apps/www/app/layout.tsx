export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body style={{margin:0, background:'#F7F8FA', color:'#0E1324'}}>{children}</body>
    </html>
  );
}
