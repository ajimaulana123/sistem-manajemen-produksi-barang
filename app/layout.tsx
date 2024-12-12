import { Navbar } from './components/layout/Navbar';
import './globals.css';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-background">
        <Navbar />
        <main className="w-full">
          {children}
        </main>
      </body>
    </html>
  );
}