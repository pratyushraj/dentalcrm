import React from 'react';
import { Link } from 'react-router-dom';
import { BLOGS } from '@/data/blogs';
import { SEOHead } from '@/components/seo/SEOHead';
import { Calendar, Clock, ArrowRight, Shield } from 'lucide-react';

export default function BlogHub() {
  const localBusinessSchema = {
    '@context': 'https://schema.org',
    '@type': 'Dentist',
    'name': 'YOUR DENTIST Patna',
    'image': 'https://dental-crm-gray.vercel.app/assets/yourdentist/clinic_in_action.jpg',
    'telePhone': '+91 6201478033',
    'email': 'yourdentistpatna@gmail.com',
    'address': {
      '@type': 'PostalAddress',
      'streetAddress': 'Patliputra Colony',
      'addressLocality': 'Patna',
      'addressRegion': 'Bihar',
      'postalCode': '800013',
      'addressCountry': 'IN'
    },
    'geo': {
      '@type': 'GeoCoordinates',
      'latitude': '25.6200',
      'longitude': '85.1100'
    },
    'url': 'https://dental-crm-gray.vercel.app/yourdentist/blog',
    'priceRange': '$$',
    'openingHoursSpecification': [
      {
        '@type': 'OpeningHoursSpecification',
        'dayOfWeek': ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
        'opens': '10:00',
        'closes': '20:00'
      }
    ],
    'sameAs': [
      'https://www.instagram.com/your.dentist.patna'
    ]
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-white font-sora antialiased selection:bg-white selection:text-neutral-950">
      <SEOHead
        title="YOUR DENTIST Patna | Oral Health Guides & Patient Resources"
        description="Read patient guides on braces, clear aligner costs, and dental treatments in Patna by Dr. Aryan Parmar. 0% interest EMI options available."
        keywords={['best dentist in patna', 'braces cost patna', 'clear aligners patna', 'dental clinic patna', 'teeth gap treatment']}
        canonicalUrl="https://dental-crm-gray.vercel.app/yourdentist/blog"
        jsonLd={localBusinessSchema}
      />

      {/* Header */}
      <header className="border-b border-white/5 bg-neutral-950/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-6 h-20 flex justify-between items-center">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#5b72ff] to-indigo-600 flex items-center justify-center shadow-lg shadow-[#5b72ff]/20">
              <Shield className="h-5 w-5 text-white" />
            </div>
            <div>
              <span className="text-xs font-black uppercase tracking-widest leading-none block">YOUR DENTIST</span>
              <span className="text-[8px] text-neutral-500 font-bold uppercase tracking-wider mt-0.5 block">Patient Resource Hub</span>
            </div>
          </Link>

          <Link
            to="/reactivation/login"
            className="px-4 py-2 border border-white/10 hover:border-white/20 text-white hover:bg-white/5 text-xs font-black uppercase tracking-wider rounded-xl transition-all"
          >
            CRM Portal
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-16 px-6 max-w-4xl mx-auto text-center space-y-4">
        <h1 className="text-3xl sm:text-5xl font-black uppercase tracking-tight leading-tight">
          Oral Health <span className="bg-gradient-to-r from-[#5b72ff] to-emerald-400 bg-clip-text text-transparent">Guides & Resources</span>
        </h1>
        <p className="text-xs sm:text-sm text-neutral-400 max-w-xl mx-auto leading-relaxed">
          Get transparent, expert-written articles on dental treatments, braces options, clear aligner price charts, and routine care at YOUR DENTIST Patna.
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
              <div className="relative aspect-[16/9] overflow-hidden bg-neutral-800">
                <img 
                  src={blog.featuredImage} 
                  alt={blog.title} 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  onError={(e) => {
                    e.currentTarget.src = "https://images.unsplash.com/photo-1629909613654-28e377c37b09?q=80&w=600&auto=format&fit=crop";
                  }}
                />
                <span className="absolute top-4 left-4 px-2.5 py-1 bg-neutral-950/80 backdrop-blur-md rounded-lg text-[9px] font-bold uppercase tracking-wider text-[#5b72ff]">
                  {blog.category}
                </span>
              </div>

              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-4 text-[10px] text-neutral-500 font-bold uppercase tracking-wider">
                    <span className="flex items-center gap-1"><Calendar size={12} /> {blog.publishDate}</span>
                    <span className="flex items-center gap-1"><Clock size={12} /> {blog.readTime}</span>
                  </div>
                  <h2 className="text-base sm:text-lg font-black text-white leading-snug group-hover:text-[#5b72ff] transition-colors">
                    <Link to={`/yourdentist/blog/${blog.slug}`}>{blog.title}</Link>
                  </h2>
                  <p className="text-xs text-neutral-400 leading-relaxed line-clamp-2">
                    {blog.summary}
                  </p>
                </div>

                <Link
                  to={`/yourdentist/blog/${blog.slug}`}
                  className="inline-flex items-center gap-1.5 text-xs font-black uppercase text-[#5b72ff] group-hover:text-white transition-colors"
                >
                  Read Article <ArrowRight size={14} />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/5 py-12 text-center text-[10px] text-neutral-600 font-bold uppercase tracking-widest space-y-2">
        <p>© 2026 YOUR DENTIST Patliputra Patna. All Rights Reserved.</p>
        <p className="text-[#5b72ff]/60">Orthodontic & Dental Care Specialist</p>
      </footer>
    </div>
  );
}
