import {Metadata} from "next";

interface SeoMetadataProps {
    title: string;
    description: string;
    keywords: string[];
    ogUrl: string;
    ogTitle: string;
    ogDescription: string;
    ogImage: string;
    canonicalUrl: string;
    alternateUrl: string;
    hrefLang: string;
}

export const getSeoMetadata = ({
                                   title,
                                   description,
                                   keywords,
                                   ogUrl,
                                   ogTitle,
                                   ogDescription,
                                   ogImage,
                                   canonicalUrl,
                                   alternateUrl,
                                   hrefLang,
                               }: SeoMetadataProps): Metadata => {
    return {
        title,
        description,
        keywords,
        openGraph: {
            type: 'website',
            url: ogUrl,
            siteName: ogTitle,
            title: ogTitle,
            description: ogDescription,
            locale: 'ko_KR',
            images: [
                {
                    url: ogImage, // 수정해야함
                    width: 800,
                    height: 600,
                    alt: `${ogTitle}Image`,
                },
            ],
        },
        alternates: {
            canonical: canonicalUrl,
            languages: {
                [hrefLang]: alternateUrl,
            },
        },
        icons: {
            icon: [
                { url: '/favicon.ico', type: 'image/x-icon' },
                { url: '/memocode_png.png', sizes: '32x32', type: 'image/png' },
                { url: '/memocode_png.png', sizes: '16x16', type: 'image/png' }
            ]
        }
    };
};
