import {Inter as FontSans} from 'next/font/google';
import '../css/globals.css';
import {cn} from '@/lib/utils';
import ClientProviders from "@/provider/ClientProviders";
import Layout from "@/components/page_components/Layout";

const fontSans = FontSans({
    subsets: ['latin'],
    variable: '--font-sans',
});

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
        <body
            className={cn(
                'h-screen flex flex-col mx-auto bg-background font-sans overflow-x-hidden',
                fontSans.variable
            )}
        >
        <ClientProviders>
            <Layout>{children}</Layout>
        </ClientProviders>
        </body>
        </html>
    );
}