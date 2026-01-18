import type { Metadata } from 'next';
import { Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';
import { EntryModalProvider } from '../components/EntryModal';
import { defaultMetadata } from '../lib/seo';

const plusJakartaSans = Plus_Jakarta_Sans({ subsets: ['latin'], weight: ['300', '400', '600', '700', '800'] });

export const metadata: Metadata = {
  ...defaultMetadata,
  title: {
    default: defaultMetadata.title ?? 'Book-A-Yute | Curated Talent Roster',
    template: '%s | Book-A-Yute',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${plusJakartaSans.className} bg-black text-white antialiased`}>
        <EntryModalProvider>
          <div className="min-h-screen flex flex-col">
            <Navigation />
            <main className="flex-grow">{children}</main>
            <Footer />
          </div>
        </EntryModalProvider>
      </body>
    </html>
  );
}
