import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import ThemeProvider from '@/components/dashboard/ThemeProvider';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: {
    default: 'Girl Up UI — When Girls Rise, We All Rise',
    template: '%s',
  },
  description:
    'Girl Up Universitas Indonesia — gerakan kepemimpinan perempuan muda untuk kesetaraan gender. Bagian dari jaringan global Girl Up.',
  openGraph: {
    title: 'Girl Up UI — When Girls Rise, We All Rise',
    description:
      'Gerakan kepemimpinan perempuan muda di Universitas Indonesia yang mendorong kesetaraan gender, kepemimpinan, dan dampak sosial.',
    type: 'website',
    locale: 'id_ID',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" suppressHydrationWarning>
      <head>
        {/* Prevent flash of wrong theme */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('theme');if(t==='dark'||(!t&&window.matchMedia('(prefers-color-scheme:dark)').matches)){document.documentElement.classList.add('dark')}}catch(e){}})();`,
          }}
        />
      </head>
      <body className={inter.className}>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
