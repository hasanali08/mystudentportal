import './globals.css';
import Navbar from '../components/Navbar';
import { AuthProvider } from '../contexts/AuthContext';

export const metadata = {
  title: 'Student Command Center',
  description: 'Productivity dashboard for university students',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="min-h-screen">
        <AuthProvider>
          <Navbar />
          <main className="container mx-auto px-6 py-12 max-w-7xl">
            {children}
          </main>
        </AuthProvider>
      </body>
    </html>
  );
}

