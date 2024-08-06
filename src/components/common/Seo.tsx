import Head from "next/head";

interface SeoProps {
    title: string;
    description: string;
    url: string;
    ogTitle: string;
    ogDescription: string;
    ogImage: string;
}

const Seo = ({title, description, url, ogTitle, ogDescription, ogImage}: SeoProps) => {

    function addProductJsonLd() {
        return {
            __html: `{
                 "@context": "https://schema.org/",
                  "@type": "Blog",
                  "name": "예시 웹사이트",
                  "headline":${title},
                  "url": ${url},
                  "logo": ${ogImage},
                  "description": ${description},
                  "address": {
                    "@type": "PostalAddress",
                    "streetAddress": "123 Main St.",
                    "addressLocality": "도시명",
                    "addressRegion": "지역명",
                    "postalCode": "12345",
                    "addressCountry": "국가명"
                  },
                  "contactPoint": {
                    "@type": "ContactPoint",
                    "telephone": "+1-123-456-7890",
                    "contactType": "고객 지원",
                    "email": "contact@example.com"
                  }
            }`,
        }
    }

    return (
        <Head>
            <title>{title}</title>
            <meta name="robots" content="all"/>
            <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
            <meta charSet="utf-8"/>

            <meta property="og:type" content="website"/>
            <meta property="og:locale" content="ko_KR"/>
            <meta name="keywords" content="PHP, Laravel, JavaScript, Vue"/>
            <meta property="og:site_name" content="사이트 이름"/>
            <meta name="description" content={description}/>
            <meta property="og:url" content={url}/>
            <meta property="og:title" content={ogTitle}/>
            <meta property="og:description" content={ogDescription}/>
            <meta property="og:image" content={ogImage}/>
            <meta property="og:image:alt" content={`${ogTitle}_image`}/>
            <meta property="og:image:type" content="image/png"/>
            <meta property="og:image:width" content="800"/>
            <meta property="og:image:height" content="600"/>

            <link rel="canonical" href="https://memocode.dev" key="canonical"/>
            <link rel="alternate" href="https://memocode.dev" hrefLang="ko_KR"/>
            {/*/!*<link rel="icon" href="아이콘 url" type="image/x-icon"/>*!/ 파비콘*/}
            {/*<link href="path/to/image.svg" rel="mask-icon" type="image/svg" sizes="693x693"/> 파비콘*/}
            {/*/!*<link rel="apple-touch-icon" href="아이콘 url"/>*!/ 애플기기에서 보이는 아이콘*/}
            {/*<link rel="manifest" href="manifest url"/> 정보를 제공하는 JSON 텍스트 파일입니다. 이 파일을 다운로드하여 사이트를 기본 앱으로 표시하는 데 사용*/}


            {/*웹사이트 소개 정보를 구조화*/}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={addProductJsonLd()}
                key="product-jsonld"
            />

        </Head>
    )
}

export default Seo;