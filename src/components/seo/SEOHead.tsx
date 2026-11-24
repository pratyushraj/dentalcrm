import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';
import { FINANCING_IS_LIVE, FINANCING_STATUS, isPublicFinancingPath } from '@/lib/financingAvailability';

interface SEOHeadProps {
  title: string; // 55-60 characters
  description: string; // 150-160 characters
  keywords?: string[];
  image?: string;
  type?: 'website' | 'article';
  publishedTime?: string; // ISO format
  modifiedTime?: string; // ISO format
  author?: string;
  canonicalUrl?: string;
  robots?: string;
  imageAlt?: string;
  locale?: string;
  jsonLd?: Record<string, unknown> | Record<string, unknown>[]; // JSON-LD structured data
  video?: string; // Video URL
  videoType?: string; // Video MIME type (e.g. video/mp4)
  videoWidth?: string;
  videoHeight?: string;
  videoThumbnail?: string;
}

/**
 * SEO Head Component
 * The same tags are used in prerendered documents and after client-side navigation.
 */
export const SEOHead: React.FC<SEOHeadProps> = ({
  title,
  description,
  keywords = [],
  image = 'https://www.clinaza.in/og-clinaza.png',
  type = 'website',
  publishedTime,
  modifiedTime,
  author = 'Clinaza',
  canonicalUrl,
  robots = 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1',
  imageAlt,
  locale = 'en_IN',
  jsonLd,
  video,
  videoType = 'video/mp4',
  videoWidth = '720',
  videoHeight = '1280',
}) => {
  const location = useLocation();
  if (!FINANCING_IS_LIVE && isPublicFinancingPath(location.pathname) && !robots.includes('noindex')) {
    description = `${FINANCING_STATUS} ${description}`;
  }
  const baseUrl = 'https://www.clinaza.in';
  // Ensure canonical URL is always normalized to www.clinaza.in to prevent canonical domain split in search engines
  const canonical = new URL(canonicalUrl || location.pathname, baseUrl);
  canonical.hostname = canonical.hostname === 'clinaza.in' ? 'www.clinaza.in' : canonical.hostname;
  canonical.pathname = canonical.pathname.replace(/\/+$/, '') || '/';
  const currentUrl = canonical.href;
  const imageUrl = new URL(image, baseUrl).href;

  const twitterCard = video ? 'player' : 'summary_large_image';

  return (
    <Helmet>
      {/* Basic */}
      <meta charSet="utf-8" />
      <title>{title}</title>
      <meta name="description" content={description} />
      {keywords.length > 0 && (
        <meta name="keywords" content={keywords.join(', ')} />
      )}
      <link rel="canonical" href={currentUrl} />
      <meta name="robots" content={robots} />

      {/* Open Graph */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={imageUrl} />
      {imageAlt && <meta property="og:image:alt" content={imageAlt} />}
      <meta property="og:url" content={currentUrl} />
      <meta property="og:site_name" content="Clinaza" />
      <meta property="og:locale" content={locale} />

      {/* Article-specific OG */}
      {type === 'article' && publishedTime && (
        <meta property="article:published_time" content={publishedTime} />
      )}
      {type === 'article' && modifiedTime && (
        <meta property="article:modified_time" content={modifiedTime} />
      )}
      {type === 'article' && author && (
        <meta property="article:author" content={author} />
      )}

      {/* Video OG */}
      {video && <meta property="og:video" content={video} />}
      {video && <meta property="og:video:secure_url" content={video} />}
      {video && <meta property="og:video:type" content={videoType} />}
      {video && videoWidth && <meta property="og:video:width" content={videoWidth} />}
      {video && videoHeight && <meta property="og:video:height" content={videoHeight} />}

      {/* Twitter Card */}
      <meta name="twitter:card" content={twitterCard} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={imageUrl} />
      <meta name="twitter:url" content={currentUrl} />
      {video && <meta name="twitter:player" content={video} />}
      {video && videoWidth && <meta name="twitter:player:width" content={videoWidth} />}
      {video && videoHeight && <meta name="twitter:player:height" content={videoHeight} />}

      {/* JSON-LD structured data */}
      {jsonLd && (
        <script type="application/ld+json">
          {JSON.stringify(jsonLd).replace(/</g, '\\u003c')}
        </script>
      )}
    </Helmet>
  );
};
