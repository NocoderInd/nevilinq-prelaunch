export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body style={{background:'#F7F8FA',color:'#0E1324',margin:0}}>{children}</body>
    </html>
  );
}
