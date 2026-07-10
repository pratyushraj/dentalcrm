import React from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { BLOGS } from '@/data/blogs';
import { SEOHead } from '@/components/seo/SEOHead';
import { Calendar, Clock, ChevronLeft, Shield, User, Heart } from 'lucide-react';

export default function BlogArticlePage() {
  const { slug } = useParams<{ slug: string }>();
  const article = BLOGS.find((b) => b.slug === slug);

  if (!article) {
    return <Navigate to="/yourdentist/blog" replace />;
  }

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
        title={`${article.title} | YOUR DENTIST Patna`}
        description={article.metaDescription}
        keywords={[article.category.toLowerCase(), 'patna dentist', 'dental care patna', 'dr aryan parmar']}
        canonicalUrl={`https://dental-crm-gray.vercel.app/yourdentist/blog/${article.slug}`}
        type="article"
        publishedTime={article.publishDate}
        author={article.author}
        jsonLd={faqSchema}
        image={article.featuredImage}
      />

      {/* Clean Light Header */}
      <header className="border-b border-neutral-200/60 bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-6 h-20 flex justify-between items-center">
          <Link to="/yourdentist/blog" className="flex items-center gap-2">
            <ChevronLeft size={16} className="text-neutral-500" />
            <span className="text-xs font-bold uppercase tracking-wider text-neutral-600 hover:text-[#5b72ff] transition-colors">All Articles</span>
          </Link>

          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-neutral-900 flex items-center justify-center">
              <Shield className="h-4.5 w-4.5 text-white" />
            </div>
            <span className="text-[10px] font-black uppercase tracking-wider text-neutral-800">YOUR DENTIST</span>
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

        {/* Bottom CTA Block */}
        <section className="bg-neutral-900 text-white rounded-2xl p-6 sm:p-8 text-center space-y-4 shadow-lg shadow-neutral-900/10">
          <h3 className="text-lg font-black uppercase tracking-tight">Ready for a Consulting Session?</h3>
          <p className="text-xs text-neutral-400 max-w-md mx-auto leading-relaxed">
            Get examined under advanced 3D scanners at our Patliputra Colony clinic. 0% Interest EMI options are active.
          </p>
          <div className="flex flex-col sm:flex-row justify-center items-center gap-3 pt-2">
            <a 
              href="https://wa.me/916201478033?text=Hi%20Dr.%20Aryan,%20I%20read%20your%20patient%20guide%20and%20want%20to%20book%20a%20consultation." 
              target="_blank" 
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-5 py-2.5 bg-[#128C7E] hover:bg-[#075E54] text-white rounded-xl text-xs font-black uppercase tracking-wider transition-all"
            >
              💬 WhatsApp Booking
            </a>
            <Link 
              to="/reactivation/login"
              className="w-full sm:w-auto px-5 py-2.5 bg-white hover:bg-neutral-100 text-neutral-950 rounded-xl text-xs font-black uppercase tracking-wider transition-all"
            >
              Access CRM Portal
            </Link>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-neutral-200 bg-white py-12 text-center text-[10px] text-neutral-400 font-bold uppercase tracking-widest space-y-2">
        <p>© 2026 YOUR DENTIST Patliputra Patna. All Rights Reserved.</p>
        <p className="text-[#5b72ff]/80">Orthodontic & Dental Care Specialist</p>
      </footer>
    </div>
  );
}
