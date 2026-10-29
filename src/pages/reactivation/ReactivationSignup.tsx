import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useNavigate, Link } from 'react-router-dom';
import { useSession } from '@/contexts/SessionContext';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { SEOHead } from '@/components/seo/SEOHead';
import {
  Stethoscope,
  ShieldCheck,
  Lock,
  Mail,
  Eye,
  EyeOff,
  User,
  Building2,
  Phone,
  ArrowRight,
  ArrowLeft,
} from 'lucide-react';

const generateUUID = () => {
  if (typeof window !== 'undefined' && window.crypto && window.crypto.randomUUID) {
    return window.crypto.randomUUID();
  }
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
};

const ReactivationSignup: React.FC = () => {
  const navigate = useNavigate();
  const { session, loading, profile } = useSession();
  const [fullName, setFullName] = useState('');
  const [clinicName, setClinicName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // If session exists, redirect to appropriate page based on role
  useEffect(() => {
    if (session && !loading && !isLoading) {
      const userRole = profile?.role;
      if (userRole === 'dentist' || userRole === 'receptionist') {
        navigate('/reactivation/customers', { replace: true });
      } else if (userRole) {
        const target = userRole === 'brand' ? '/brand-dashboard' : '/creator-dashboard';
        navigate(target, { replace: true });
      }
    }
  }, [session, loading, profile, navigate, isLoading]);

  useEffect(() => {
    document.title = 'Clinic Registration | Dental CRM';
  }, []);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const nameVal = fullName.trim();
    const clinicVal = clinicName.trim();
    const emailVal = email.trim();
    const phoneVal = phone.trim();
    const passVal = password;

    if (!nameVal || !clinicVal || !emailVal || !phoneVal || !passVal) {
      toast.error('Please fill in all fields');
      return;
    }

    if (passVal !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (passVal.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    setIsLoading(true);
    try {
      // 1. Sign up the user via Supabase Auth
      const { data, error } = await supabase.auth.signUp({
        email: emailVal,
        password: passVal,
        options: {
          data: {
            first_name: nameVal,
            business_name: clinicVal,
            role: 'dentist',
          }
        }
      });

      if (error) throw error;
      if (!data.user) throw new Error('Signup failed to register user.');

      // 2. Perform profile update to ensure fields are populated in the database table
      const orgId = generateUUID();
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          first_name: nameVal,
          business_name: clinicVal,
          role: 'dentist',
          onboarding_complete: true,
          phone: phoneVal,
          organization_id: orgId
        })
        .eq('id', data.user.id);

      if (profileError) {
        console.warn('Profile DB sync warning:', profileError);
      }

      toast.success('Clinic registered successfully! Welcome to Dental CRM.');
      navigate('/reactivation/customers', { replace: true });
    } catch (err: any) {
      console.error('Registration error:', err);
      toast.error(err.message || 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      <SEOHead 
        title="Register Your Clinic — Clinaza Doctor Portal"
        description="Doctor and clinic staff management dashboard registration for dental patient records, recalls, and treatment financing."
        canonicalUrl="https://www.clinaza.in/reactivation/signup"
        robots="noindex, nofollow"
      />
      
      {/* Decorative gradients */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] bg-teal-500/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-[350px] h-[350px] bg-indigo-500/10 rounded-full blur-[100px] pointer-events-none" />

      {/* Top Navigation - Back to Homepage */}
      <div className="absolute top-5 left-5 sm:top-8 sm:left-8 z-20">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-all bg-slate-900/80 hover:bg-slate-800 px-3.5 py-2 rounded-full border border-slate-800/80 backdrop-blur-md shadow-lg group"
        >
          <ArrowLeft size={14} className="text-teal-400 group-hover:-translate-x-0.5 transition-transform" />
          <span>Back to Clinaza Home</span>
        </Link>
      </div>

      <div className="sm:mx-auto w-full max-w-md z-10 px-4">
        {/* Top Logo */}
        <div className="text-center">
          <Link to="/" className="inline-block group mb-3 focus:outline-none">
            <div className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-r from-teal-500 to-emerald-500 text-slate-950 rounded-2xl shadow-xl shadow-teal-500/15 group-hover:scale-105 transition-transform">
              <Stethoscope size={28} />
            </div>
            <div className="mt-2 text-[11px] font-black tracking-widest text-teal-400/90 uppercase flex items-center justify-center gap-1 group-hover:text-teal-300 transition-colors">
              <span>CLINAZA.IN</span>
            </div>
          </Link>
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Register Your Clinic
          </h2>
          <p className="mt-2 text-sm text-slate-400">
            Set up your dashboard to automate follow ups, schedules, and reviews
          </p>
        </div>

        {/* Signup Card */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="mt-8 bg-slate-900/80 backdrop-blur-md border border-slate-800/90 py-8 px-6 shadow-2xl rounded-2xl sm:px-10"
        >
          <form className="space-y-4" onSubmit={handleSignup}>
            
            {/* Full Name */}
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Doctor's Full Name
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-500">
                  <User size={15} />
                </span>
                <input
                  type="text"
                  placeholder="Dr. Priya Sharma"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500 transition-all text-sm"
                  required
                />
              </div>
            </div>

            {/* Clinic Name */}
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Clinic Name
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-500">
                  <Building2 size={15} />
                </span>
                <input
                  type="text"
                  placeholder="Sharma Dental Clinic"
                  value={clinicName}
                  onChange={(e) => setClinicName(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500 transition-all text-sm"
                  required
                />
              </div>
            </div>

            {/* Email Field */}
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Email Address
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-500">
                  <Mail size={15} />
                </span>
                <input
                  type="email"
                  placeholder="doctor@clinic.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500 transition-all text-sm"
                  required
                />
              </div>
            </div>

            {/* Phone Number */}
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Contact Phone
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-500">
                  <Phone size={15} />
                </span>
                <input
                  type="tel"
                  placeholder="+91 98765 43210"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500 transition-all text-sm"
                  required
                />
              </div>
            </div>

            {/* Passwords grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Password */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Password
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-500">
                    <Lock size={15} />
                  </span>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500 transition-all text-sm"
                    required
                  />
                </div>
              </div>

              {/* Confirm Password */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Confirm
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-500">
                    <Lock size={15} />
                  </span>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full pl-10 pr-10 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500 transition-all text-sm"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-500 hover:text-slate-300"
                  >
                    {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 mt-2 bg-gradient-to-r from-teal-400 to-emerald-500 hover:opacity-90 active:scale-[0.98] text-slate-950 font-bold rounded-xl text-sm transition-all duration-150 flex items-center justify-center gap-2 shadow-lg shadow-teal-500/15"
            >
              {isLoading ? (
                <span>Setting up clinic...</span>
              ) : (
                <>
                  Register Clinic <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>

          {/* Login redirection */}
          <div className="mt-4 text-center">
            <span className="text-xs text-slate-500">Already have a clinic registered? </span>
            <Link to="/reactivation/login" className="text-xs text-teal-400 hover:text-teal-300 font-bold underline">
              Login here
            </Link>
          </div>

          {/* Bottom security assurance */}
          <div className="mt-6 flex items-center justify-center gap-1.5 text-xs text-slate-500 border-t border-slate-800/60 pt-4">
            <ShieldCheck size={14} className="text-teal-500" />
            <span>Secure 256-bit HIPAA compliant clinic portal</span>
          </div>

        </motion.div>

        {/* Footer home link */}
        <div className="mt-8 text-center">
          <Link
            to="/"
            className="text-xs text-slate-500 hover:text-slate-300 transition-colors inline-flex items-center gap-1.5"
          >
            <span>← Return to Clinaza.in homepage</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ReactivationSignup;
