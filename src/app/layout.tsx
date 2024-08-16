import {Inter as FontSans} from 'next/font/google';
import '../css/globals.css';
import {cn} from '@/lib/utils';
import ClientProviders from "@/provider/ClientProviders";
import Layout from "@/components/page_components/Layout";
import GoogleAnalytics from "@/lib/GoogleAnalytics";

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
        <head>
            <script async
                    src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3145121507926045"
                    crossOrigin="anonymous"></script>
        </head>
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
        {process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS && process.env.NODE_ENV === 'production' ?
            <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS}/> : null}
        </html>
    );
}