import React from 'react';
import { Link } from 'react-router-dom';
import { BLOGS } from '@/data/blogs';
import { SEOHead } from '@/components/seo/SEOHead';
import { Calendar, Clock, ArrowRight, Shield, CreditCard, Sparkles } from 'lucide-react';

export default function BlogHub() {
  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    'name': 'Clinaza',
    'url': 'https://clinaza.in',
    'logo': {
      '@type': 'ImageObject',
      'url': 'https://clinaza.in/assets/clinaza-logo.jpg'
    },
    'description': 'Embedded healthcare patient financing infrastructure and dental care guides across India.',
    'sameAs': [
      'https://instagram.com/clinaza.in',
      'https://linkedin.com/company/clinaza'
    ]
  };

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
        'name': 'Patient Guides & Dental Financing',
        'item': 'https://clinaza.in/blog'
      }
    ]
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-white font-sora antialiased selection:bg-white selection:text-neutral-950">
      <SEOHead
        title="Clinaza Patient Guides | Medical & Dental Treatments, Costs & Easy EMI Financing"
        description="Read comprehensive patient guides on dental implants, braces, clear aligners, LASIK, and surgery costs in India, with flexible monthly EMI financing options."
        keywords={['patient guides', 'treatment costs india', 'medical emi financing', 'dental emi financing', 'implants cost guide', 'braces on emi', 'clinaza financing']}
        canonicalUrl="https://clinaza.in/blog"
        jsonLd={[organizationSchema, breadcrumbSchema]}
      />

      {/* Header */}
      <header className="border-b border-white/10 bg-neutral-950/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 sm:h-20 flex justify-between items-center">
          <Link to="/" className="flex items-center gap-2.5">
            <img src="/assets/clinaza-logo.jpg" alt="Clinaza" className="h-8 w-8 rounded-lg border border-slate-700" />
            <div>
              <span className="text-xs font-black uppercase tracking-widest leading-none block">CLINAZA</span>
              <span className="text-[8px] text-neutral-400 font-bold uppercase tracking-wider mt-0.5 block">Patient Resource Hub</span>
            </div>
          </Link>

          <div className="flex items-center gap-3">
            <Link
              to="/#check-eligibility"
              className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-[#0867E8] hover:bg-[#0756C7] text-white text-xs font-black uppercase tracking-wider rounded-xl transition-all shadow-sm"
            >
              <CreditCard size={13} /> Check EMI
            </Link>
            <Link
              to="/reactivation/login"
              className="px-3.5 py-1.5 border border-white/10 hover:border-white/20 text-white hover:bg-white/5 text-xs font-black uppercase tracking-wider rounded-xl transition-all"
            >
              Clinic Portal
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-14 sm:py-20 px-6 max-w-4xl mx-auto text-center space-y-4">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#0867E8]/10 border border-[#0867E8]/30 text-[#0867E8] text-[10px] font-black uppercase tracking-widest">
          <Sparkles size={12} /> Expert Guides & Cost Calculators
        </div>
        <h1 className="text-3xl sm:text-5xl font-black uppercase tracking-tight leading-tight">
          Medical &amp; Dental <span className="bg-gradient-to-r from-[#5b72ff] via-blue-400 to-emerald-400 bg-clip-text text-transparent">Guides &amp; EMI Costs</span>
        </h1>
        <p className="text-xs sm:text-sm text-neutral-400 max-w-xl mx-auto leading-relaxed">
          Transparent, doctor-verified articles on dental implant costs, clear aligner price charts, LASIK, hair transplants, and flexible monthly EMI financing options across India.
        </p>
      </section>

      {/* Grid Section */}
      <main className="max-w-5xl mx-auto px-6 pb-24">
        <div className="grid gap-8 sm:grid-cols-2">
          {BLOGS.map((blog) => (
            <article 
              key={blog.slug} 
              className="group bg-neutral-900/40 border border-white/5 hover:border-white/10 rounded-2xl overflow-hidden flex flex-col transition-all hover:shadow-xl hover:shadow-[#5b72ff]/5"
            >
              <div className="relative aspect-video overflow-hidden bg-neutral-900">
                <img 
                  src={blog.featuredImage} 
                  alt={blog.title}
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  onError={(e) => {
                    e.currentTarget.src = "https://images.unsplash.com/photo-1629909613654-28e377c37b09?q=80&w=1200&auto=format&fit=crop";
                  }}
                />
                <div className="absolute top-3 left-3">
                  <span className="px-2.5 py-1 bg-black/60 backdrop-blur-md rounded-full text-[9px] font-black uppercase tracking-wider text-white border border-white/10">
                    {blog.category}
                  </span>
                </div>
              </div>

              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-4 text-[10px] text-neutral-500 font-bold uppercase tracking-wider">
                    <span className="flex items-center gap-1"><Calendar size={12} /> {blog.publishDate}</span>
                    <span className="flex items-center gap-1"><Clock size={12} /> {blog.readTime}</span>
                  </div>
                  <h2 className="text-base sm:text-lg font-black text-white leading-snug group-hover:text-[#5b72ff] transition-colors">
                    <Link to={`/blog/${blog.slug}`}>{blog.title}</Link>
                  </h2>
                  <p className="text-xs text-neutral-400 leading-relaxed line-clamp-2">
                    {blog.summary}
                  </p>
                </div>

                <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                  <span className="text-[10px] text-neutral-500 font-bold">By {blog.author}</span>
                  <Link 
                    to={`/blog/${blog.slug}`} 
                    className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-[#5b72ff] group-hover:translate-x-1 transition-all"
                  >
                    Read Guide <ArrowRight size={14} />
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/10 py-12 px-6 max-w-5xl mx-auto text-center space-y-4">
        <div className="flex flex-col sm:flex-row justify-center items-center gap-6 text-xs text-neutral-400 font-medium">
          <a href="tel:+917292984244" className="hover:text-white transition-colors flex items-center gap-1.5">
            📞 +91 7292984244
          </a>
          <span className="hidden sm:inline text-neutral-700" aria-hidden="true">&middot;</span>
          <a href="https://wa.me/917292984244" target="_blank" rel="noopener noreferrer" className="hover:text-emerald-400 transition-colors flex items-center gap-1.5">
            💬 WhatsApp Support
          </a>
          <span className="hidden sm:inline text-neutral-700" aria-hidden="true">&middot;</span>
          <a href="mailto:contact@clinaza.in" className="hover:text-white transition-colors">contact@clinaza.in</a>
        </div>
        <div className="text-[10px] text-neutral-500 font-mono uppercase tracking-widest space-y-1">
          <p>© 2026 CLINAZA Technologies. All Rights Reserved.</p>
          <p className="text-[#5b72ff]">Connecting Clinics &amp; Patients With Regulated Financing Partners</p>
        </div>
      </footer>
    </div>
  );
}
