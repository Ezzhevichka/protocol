import type { Metadata } from 'next';
import { Manrope } from 'next/font/google';
import './globals.css';
import { Header } from 'widgets/Header';
import { Providers } from './providers';
import { ReactNode } from 'react';

const manrope = Manrope({
    subsets: ['latin', 'cyrillic'],
    weight: ['200', '300', '400', '500', '600', '700', '800'],
    variable: '--font-manrope',
});

export const metadata: Metadata = {
    title: 'PROTOCOL',
    description: 'Squad Server Protocol - Official site',
};

export default function RootLayout({
    children,
}: Readonly<{
    children: ReactNode;
}>) {
    return (
        <html lang="ru">
            <body
                className={`${manrope.variable} ${manrope.variable} antialiased`}
            >
                <Providers>
                    <Header />
                    {children}
                </Providers>
            </body>
        </html>
    );
}
