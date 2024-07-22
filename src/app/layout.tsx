import type {Metadata} from "next";
import {Inter as FontSans} from 'next/font/google';
import '../css/globals.css';
import {cn} from '@/lib/utils';
import dynamic from 'next/dynamic';

const ClientProviders = dynamic(() => import('@/provider/ClientProviders'), {
    ssr: false
});

const fontSans = FontSans({
    subsets: ['latin'],
    variable: '--font-sans',
});

export const metadata: Metadata = {
    title: '메모코드',
    description: '메모코드',
};

export default function MainLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
        <body
            className={cn(
                'h-screen flex flex-col mx-auto bg-background font-sans',
                fontSans.variable
            )}
        >
        <ClientProviders>
            <div className="flex-1 flex">
                {children}
            </div>
        </ClientProviders>
        </body>
        </html>
    );
}