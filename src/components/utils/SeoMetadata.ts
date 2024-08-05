import { Metadata } from "next";

interface SeoMetadataProps {
    title: string;
    description: string;
    url: string;
    ogTitle: string;
    ogDescription: string;
    ogImage: string;
}

export const getSeoMetadata = ({
                                   title,
                                   description,
                                   url,
                                   ogTitle,
                                   ogDescription,
                                   ogImage,
                               }: SeoMetadataProps): Metadata => {
    return {
        title,
        description,
        openGraph: {
            type: 'website',
            url,
            title: ogTitle,
            description: ogDescription,
            images: [
                {
                    url: ogImage,
                    width: 800,
                    height: 600,
                    alt: `${ogTitle} Image`,
                },
            ],
        },
    };
};
