import React from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { BLOGS } from '@/data/blogs';
import { SEOHead } from '@/components/seo/SEOHead';
import { Calendar, Clock, ChevronLeft, Shield, User, Heart } from 'lucide-react';

export default function BlogArticlePage() {
  const { slug } = useParams<{ slug: string }>();
  const article = BLOGS.find((b) => b.slug === slug);

  if (!article) {
    return <Navigate to="/blog" replace />;
  }

  // Helper: convert "June 24, 2026" → "2026-06-24"
  const toIsoDate = (dateStr: string): string => {
    try {
      return new Date(dateStr).toISOString().split('T')[0];
    } catch {
      return new Date().toISOString().split('T')[0];
    }
  };

  const isoDate = toIsoDate(article.publishDate);

  // Article schema — powers Google rich results & date signals
  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    'headline': article.title,
    'description': article.metaDescription,
    'image': article.featuredImage || 'https://clinaza.in/og-preview.png',
    'author': {
      '@type': 'Person',
      'name': article.author,
      'url': 'https://clinaza.in/blog'
    },
    'publisher': {
      '@type': 'Organization',
      'name': 'Clinaza',
      'url': 'https://clinaza.in',
      'logo': {
        '@type': 'ImageObject',
        'url': 'https://clinaza.in/assets/clinaza-logo.jpg'
      },
      'sameAs': [
        'https://instagram.com/clinaza.in',
        'https://linkedin.com/company/clinaza'
      ]
    },
    'datePublished': isoDate,
    'dateModified': isoDate,
    'mainEntityOfPage': {
      '@type': 'WebPage',
      '@id': `https://clinaza.in/blog/${article.slug}`
    }
  };

  // Breadcrumb schema for rich breadcrumb trail in Google search results
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    'itemListElement': [
      {
        '@type': 'ListItem',
        'position': 1,
        'name': 'Home',
        'item': 'https://clinaza.in/'
      },
      {
        '@type': 'ListItem',
        'position': 2,
        'name': 'Patient Guides',
        'item': 'https://clinaza.in/blog'
      },
      {
        '@type': 'ListItem',
        'position': 3,
        'name': article.title,
        'item': `https://clinaza.in/blog/${article.slug}`
      }
    ]
  };

  // Generate Google-compliant FAQ Schema dynamically
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    'mainEntity': article.faqs.map((faq) => ({
      '@type': 'Question',
      'name': faq.question,
      'acceptedAnswer': {
        '@type': 'Answer',
        'text': faq.answer
      }
    }))
  };

  return (
    <div className="min-h-screen bg-[#fafafa] text-neutral-900 font-sora antialiased selection:bg-[#5b72ff] selection:text-white">
      <SEOHead
        title={`${article.title} | Clinaza Patient Guides`}
        description={article.metaDescription}
        keywords={[article.category.toLowerCase(), 'clinaza financing', 'dental care emi india']}
        canonicalUrl={`https://clinaza.in/blog/${article.slug}`}
        type="article"
        publishedTime={isoDate}
        modifiedTime={isoDate}
        author={article.author}
        jsonLd={[articleSchema, faqSchema, breadcrumbSchema]}
        image={article.featuredImage}
      />

      {/* Clean Light Header */}
      <header className="border-b border-neutral-200/60 bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-6 h-20 flex justify-between items-center">
          <Link to="/blog" className="flex items-center gap-2">
            <ChevronLeft size={16} className="text-neutral-500" />
            <span className="text-xs font-bold uppercase tracking-wider text-neutral-600 hover:text-[#5b72ff] transition-colors">All Articles</span>
          </Link>

          <Link to="/" className="flex items-center gap-2">
            <img src="/assets/clinaza-logo.jpg" alt="Clinaza" className="h-8 w-8 rounded-lg border border-slate-200" />
            <span className="text-[10px] font-black uppercase tracking-wider text-neutral-800">CLINAZA</span>
          </Link>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-3xl mx-auto px-6 py-12 space-y-8">
        
        {/* Article Meta */}
        <div className="space-y-4 text-center sm:text-left">
          <span className="inline-block px-3 py-1 bg-[#5b72ff]/10 rounded-full text-[10px] font-bold uppercase tracking-wider text-[#5b72ff]">
            {article.category}
          </span>
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-neutral-950 leading-tight">
            {article.title}
          </h1>

          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 text-xs text-neutral-500 font-medium">
            <span className="flex items-center gap-1"><User size={14} /> By {article.author}</span>
            <span className="flex items-center gap-1"><Calendar size={14} /> {article.publishDate}</span>
            <span className="flex items-center gap-1"><Clock size={14} /> {article.readTime}</span>
          </div>
        </div>

        {/* Featured Image */}
        <div className="aspect-[16/9] w-full rounded-2xl overflow-hidden bg-neutral-200 shadow-sm">
          <img 
            src={article.featuredImage} 
            alt={article.title} 
            className="w-full h-full object-cover"
            onError={(e) => {
              e.currentTarget.src = "https://images.unsplash.com/photo-1629909613654-28e377c37b09?q=80&w=1200&auto=format&fit=crop";
            }}
          />
        </div>

        {/* Article Content Rendered Safely */}
        <article className="prose prose-neutral max-w-none prose-p:text-neutral-700 prose-p:leading-relaxed prose-headings:text-neutral-950 prose-a:text-[#5b72ff] py-4">
          {article.content}
        </article>

        {/* FAQ Section */}
        <section className="bg-white border border-neutral-200/80 rounded-2xl p-6 sm:p-8 space-y-6">
          <h2 className="text-xl font-bold text-neutral-950 flex items-center gap-2">
            <span className="text-[#5b72ff]">❓</span> Frequently Asked Questions
          </h2>
          <div className="space-y-4 divide-y divide-neutral-100">
            {article.faqs.map((faq, idx) => (
              <div key={idx} className={`${idx > 0 ? 'pt-4' : ''} space-y-1.5`}>
                <h3 className="text-sm font-bold text-neutral-950 leading-snug">{faq.question}</h3>
                <p className="text-xs text-neutral-600 leading-relaxed">{faq.answer}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Related Articles Interlinking Block */}
        <section className="bg-white border border-neutral-200/80 rounded-2xl p-6 space-y-4">
          <h3 className="text-sm font-bold text-neutral-900 uppercase tracking-wider">Related Dental Growth & Patient Guides</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            {BLOGS.filter(b => b.slug !== article.slug).slice(0, 4).map((b) => (
              <Link 
                key={b.slug}
                to={`/blog/${b.slug}`}
                className="p-3 bg-neutral-50 hover:bg-[#5b72ff]/5 border border-neutral-100 hover:border-[#5b72ff]/30 rounded-xl transition-all block group"
              >
                <span className="text-[10px] font-bold text-[#5b72ff] uppercase block mb-1">{b.category}</span>
                <span className="font-bold text-neutral-800 group-hover:text-[#5b72ff] transition-colors line-clamp-2">{b.title}</span>
              </Link>
            ))}
          </div>

          <div className="pt-3 border-t border-neutral-100 flex flex-wrap gap-2 text-[11px] text-neutral-500">
            <span className="font-semibold text-neutral-700">Dental EMI Cities:</span>
            <Link to="/cities/patna" className="hover:text-[#5b72ff] underline">Patna</Link> •
            <Link to="/cities/delhi" className="hover:text-[#5b72ff] underline">Delhi NCR</Link> •
            <Link to="/cities/mumbai" className="hover:text-[#5b72ff] underline">Mumbai</Link> •
            <Link to="/cities/bengaluru" className="hover:text-[#5b72ff] underline">Bengaluru</Link> •
            <Link to="/cities/kolkata" className="hover:text-[#5b72ff] underline">Kolkata</Link>
          </div>
        </section>

        {/* Bottom CTA Block */}
        <section className="bg-gradient-to-br from-[#0B2450] to-[#0867E8] text-white rounded-2xl p-6 sm:p-8 text-center space-y-4 shadow-xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/10 rounded-full text-[10px] font-bold tracking-wider uppercase text-blue-100">
            <Shield size={12} /> Point-of-Care Patient Financing
          </div>
          <h3 className="text-xl sm:text-2xl font-black tracking-tight">Need Treatment Financing on 0% EMI?</h3>
          <p className="text-xs text-blue-100/90 max-w-md mx-auto leading-relaxed">
            Check your instant pre-eligibility (₹30,000 to ₹3,00,000) in under 2 minutes with zero impact on your credit score.
          </p>
          <div className="flex flex-col sm:flex-row justify-center items-center gap-3 pt-2">
            <Link 
              to="/#check-eligibility"
              className="w-full sm:w-auto px-6 py-3 bg-white hover:bg-slate-50 text-[#0867E8] rounded-xl text-xs font-black uppercase tracking-wider transition-all shadow-md active:scale-95 flex items-center justify-center gap-2"
            >
              <Shield size={14} /> Check EMI Eligibility
            </Link>
            <a 
              href="https://wa.me/917292984244?text=Hi%20Clinaza%20team%2C%20I%20have%20a%20question%20about%20dental%20treatment%20EMI%20financing." 
              target="_blank" 
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-5 py-3 bg-[#128C7E] hover:bg-[#075E54] text-white rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center justify-center gap-2"
            >
              💬 WhatsApp Us
            </a>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-neutral-200 bg-white py-12 text-center text-[10px] text-neutral-400 font-bold uppercase tracking-widest space-y-2">
        <p>© 2026 CLINAZA Technologies. All Rights Reserved.</p>
        <p className="text-[#0867E8]">Connecting Clinics & Patients With Regulated Financing Partners</p>
      </footer>
    </div>
  );
}
