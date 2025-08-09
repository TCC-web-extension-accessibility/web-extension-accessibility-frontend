import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Admin',
  description: 'Plataforma para administrar o widget de acessibilidade',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className={'antialiased'}>
        {children}
        <script
          src="http://127.0.0.1:8081/dist/widget/widget.js"
          defer
        ></script>
      </body>
    </html>
  );
}
