import React, { type ReactNode, useState, useEffect } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useSession } from '@/contexts/SessionContext';
import { usePwaInstall } from '@/hooks/usePwaInstall';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import {
  Bot,
  Users,
  Zap as ZapIcon,
  Star,
  Menu,
  X,
  CalendarDays,
  Settings,
  Download,
  Send,
  MessageSquare,
  Sparkles,
  Bell,
  CheckCircle,
  LogOut,
  BarChart3,
  Megaphone,
  Workflow,
  Filter,
} from 'lucide-react';

interface Appointment {
  id: string;
  name: string;
  phone: string;
  service: string;
  next_visit_date: string;
  appointmentTime?: string;
}

// ─── Types ────────────────────────────────────────────────────────────────────

interface NavItem {
  label: string;
  path: string;
  icon: React.ElementType;
  badge?: string;
  exact?: boolean;
}

interface ReactivationLayoutProps {
  children: ReactNode;
}

// ─── Bottom Nav Config (mobile/iPad) ──────────────────────────────────────────

const BOTTOM_NAV_ITEMS: NavItem[] = [
  { label: 'Patients',  path: '/reactivation/customers',     icon: Users },
  { label: 'Messages',  path: '/reactivation/sent-messages', icon: MessageSquare },
  { label: 'Gallery',   path: '/reactivation/transformations', icon: Sparkles },
  { label: 'Settings',  path: '/reactivation/settings',      icon: Settings },
];

// ─── Bottom Tab Bar ───────────────────────────────────────────────────────────

const BottomTabBar: React.FC = () => {
  const location = useLocation();
  return (
    <nav
      className="xl:hidden fixed bottom-0 inset-x-0 z-50 flex items-stretch bg-white border-t border-slate-200"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      {BOTTOM_NAV_ITEMS.map((item) => {
        const isActive = location.pathname === item.path || location.pathname.startsWith(item.path + '/');
        const Icon = item.icon;
        return (
          <NavLink
            key={item.path}
            to={item.path}
            className="flex-1"
          >
            {({ isActive: linkActive }) => (
              <motion.div
                whileTap={{ scale: 0.88 }}
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                className={`flex flex-col items-center justify-center gap-1 py-2.5 select-none cursor-pointer ${
                  isActive ? 'text-indigo-600' : 'text-slate-400'
                }`}
              >
                <div className="relative">
                  <Icon size={22} strokeWidth={isActive ? 2.2 : 1.8} />
                  {item.badge && (
                    <span className="absolute -top-1 -right-2 text-[7px] font-black bg-indigo-500 text-white px-1 rounded tracking-wider">
                      {item.badge}
                    </span>
                  )}
                  {isActive && (
                    <motion.div
                      layoutId="bottom-tab-indicator"
                      className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-indigo-500"
                      transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                    />
                  )}
                </div>
                <span className={`text-[10px] font-semibold leading-none ${
                  isActive ? 'text-indigo-600' : 'text-slate-400'
                }`}>
                  {item.label}
                </span>
              </motion.div>
            )}
          </NavLink>
        );
      })}
    </nav>
  );
};

// ─── Nav Config ───────────────────────────────────────────────────────────────

const NAV_ITEMS: NavItem[] = [
  {
    label: 'Patients',
    path: '/reactivation/customers',
    icon: Users,
  },
  {
    label: 'Sent Messages',
    path: '/reactivation/sent-messages',
    icon: MessageSquare,
  },
  {
    label: 'Smile Gallery',
    path: '/reactivation/transformations',
    icon: Sparkles,
  },
  {
    label: 'Google Reviews',
    path: '/reactivation/reviews',
    icon: Star,
  },
  {
    label: 'Clinic Settings',
    path: '/reactivation/settings',
    icon: Settings,
  },
];

// ─── Page title map ───────────────────────────────────────────────────────────

const PAGE_TITLES: Record<string, string> = {
  '/reactivation/receptionist': 'AI Receptionist',
  '/reactivation/customers': 'Patients',
  '/reactivation/campaigns': 'Campaigns',
  '/reactivation/analytics': 'Analytics',
  '/reactivation/segments': 'Patient Segments',
  '/reactivation/automations': 'Automations',
  '/reactivation/scheduler': 'Scheduler',
  '/reactivation/sent-messages': 'Sent Messages',
  '/reactivation/transformations': 'Smile Gallery',
  '/reactivation/reviews': 'Google Reviews',
  '/reactivation/settings': 'Clinic Settings',
  '/reactivation': 'Patients',
};

// ─── Sidebar Nav Item ─────────────────────────────────────────────────────────

const SidebarNavItem: React.FC<{ item: NavItem }> = ({ item }) => {
  const location = useLocation();
  const isActive = item.exact
    ? location.pathname === item.path
    : location.pathname === item.path || location.pathname.startsWith(item.path + '/');

  const Icon = item.icon;

  return (
    <NavLink
      to={item.path}
      end={item.exact}
      className="block"
    >
      <motion.div
        className="relative"
        whileHover={{ x: 2 }}
        transition={{ type: 'spring', stiffness: 400, damping: 30 }}
      >
        {/* Active left accent bar */}
        <AnimatePresence>
          {isActive && (
            <motion.div
              layoutId="nav-accent"
              className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 rounded-r-full bg-indigo-500"
              initial={{ opacity: 0, scaleY: 0 }}
              animate={{ opacity: 1, scaleY: 1 }}
              exit={{ opacity: 0, scaleY: 0 }}
              transition={{ type: 'spring', stiffness: 500, damping: 35 }}
            />
          )}
        </AnimatePresence>

        <div
          className={`
            flex items-center gap-3 mx-2 px-3 py-2.5 rounded-lg cursor-pointer select-none
            transition-all duration-150
            ${isActive
              ? 'bg-indigo-50 text-indigo-600'
              : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100'
            }
          `}
        >
          <Icon
            size={18}
            className={`flex-shrink-0 transition-colors duration-150 ${
              isActive ? 'text-indigo-600' : 'text-current'
            }`}
          />
          <span className="text-[13px] font-medium tracking-wide flex-1 leading-none">
            {item.label}
          </span>
          {item.badge && (
            <span
              className={`
                text-[9px] font-bold tracking-widest px-1.5 py-0.5 rounded
                ${isActive
                  ? 'bg-indigo-500/40 text-indigo-300 border border-indigo-500/30'
                  : 'bg-white/[0.06] text-white/30 border border-white/10'
                }
              `}
            >
              {item.badge}
            </span>
          )}
        </div>
      </motion.div>
    </NavLink>
  );
};

// ─── Main Layout ──────────────────────────────────────────────────────────────

const ReactivationLayout: React.FC<ReactivationLayoutProps> = ({ children }) => {
  const location = useLocation();
  const pageTitle = PAGE_TITLES[location.pathname] ?? 'AI Reactivation';
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const { session, profile, loading, organizationId } = useSession();
  const navigate = useNavigate();

  // Role Protection: Ensure only dentist/receptionist can access these pages
  useEffect(() => {
    if (!loading) {
      if (!session) {
        navigate('/reactivation/login', { replace: true });
      } else if (profile && profile.role !== 'dentist' && profile.role !== 'receptionist') {
        const target = profile.role === 'brand' ? '/brand-dashboard' : '/creator-dashboard';
        navigate(target, { replace: true });
      }
    }
  }, [session, profile, loading, navigate]);

  const { canInstall, promptInstall } = usePwaInstall();
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    const checkStandalone = window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone === true;
    setIsStandalone(checkStandalone);
  }, []);

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      toast.success('Signed out successfully.');
      navigate('/reactivation/login', { replace: true });
    } catch (err: any) {
      toast.error(err.message || 'Error signing out.');
    }
  };

  const handleInstallClick = async () => {
    if (canInstall) {
      const outcome = await promptInstall();
      if (outcome) {
        toast.success('Dental CRM web app installed successfully!');
      }
    } else {
      const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
      if (isIOS) {
        toast('To install: Tap the Share button in Safari and select "Add to Home Screen".', {
          duration: 6000,
        });
      } else {
        toast('To install: Tap the browser menu (three dots) and select "Install" or "Add to Home Screen".', {
          duration: 6000,
        });
      }
    }
  };

  const activeClinic = profile?.business_name || 'Dental Clinic';

  // Read clinic name from localStorage for sidebar display
  const orgId = organizationId || 'default';
  const [sidebarClinicName, setSidebarClinicName] = React.useState(() => {
    try {
      const raw = localStorage.getItem(`clinic_branding_${orgId}`);
      if (raw) {
        const parsed = JSON.parse(raw);
        return parsed.clinicName || profile?.business_name || 'Dental Clinic';
      }
    } catch {}
    return profile?.business_name || 'Dental Clinic';
  });

  // Refresh clinic name on every route change (user may have just saved settings)
  React.useEffect(() => {
    try {
      const raw = localStorage.getItem(`clinic_branding_${orgId}`);
      if (raw) {
        const parsed = JSON.parse(raw);
        setSidebarClinicName(parsed.clinicName || profile?.business_name || 'Dental Clinic');
      } else {
        setSidebarClinicName(profile?.business_name || 'Dental Clinic');
      }
    } catch {
      setSidebarClinicName(profile?.business_name || 'Dental Clinic');
    }
  }, [location.pathname, orgId, profile?.business_name]);

  React.useEffect(() => {
    document.title = `${pageTitle} | Dental CRM`;
  }, [pageTitle]);

  // Close sidebar on route change (for mobile)
  React.useEffect(() => {
    setIsSidebarOpen(false);
  }, [location.pathname]);

  // Today's Appointments Notifications logic
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isNotifOpen, setIsNotifOpen] = useState(false);

  useEffect(() => {
    if (!session || !orgId || orgId === 'default') return;

    const fetchTodaysAppointments = async () => {
      try {
        const todayStr = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
        const { data, error } = await supabase
          .from('dental_appointments')
          .select('id, patient_name, patient_phone, treatment_name, appointment_date, appointment_time')
          .eq('clinic_id', orgId)
          .eq('appointment_date', todayStr);

        if (error) throw error;
        if (data) {
          const mapped: Appointment[] = (data as any[]).map(appt => ({
            id: appt.id,
            name: appt.patient_name || 'Patient',
            phone: appt.patient_phone || '',
            service: appt.treatment_name || 'Dental Consultation',
            next_visit_date: appt.appointment_date,
            appointmentTime: appt.appointment_time
          }));
          setAppointments(mapped);
        }
      } catch (err) {
        console.error('Failed to fetch today\'s appointments:', err);
      }
    };

    fetchTodaysAppointments();
    // Refresh every 5 minutes
    const interval = setInterval(fetchTodaysAppointments, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [session, orgId]);

  if (loading || (session && !profile)) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center">
        <div className="w-10 h-10 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin" />
        <p className="mt-4 text-xs font-semibold text-slate-400 uppercase tracking-widest animate-pulse">Securing clinic session...</p>
      </div>
    );
  }

  return (
    <div className="flex h-dvh overflow-hidden bg-[#F8FAFC]">
      {/* Backdrop overlay for mobile */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsSidebarOpen(false)}
            className="fixed inset-0 bg-slate-900/40 z-40 lg:hidden backdrop-blur-sm"
          />
        )}
      </AnimatePresence>

      {/* ── Sidebar ──────────────────────────────────────────────── */}
      <aside
        className={`
          flex-shrink-0 flex flex-col h-full fixed inset-y-0 left-0 z-50 lg:static lg:translate-x-0
          transition-transform duration-300 ease-in-out bg-white border-r border-slate-200
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
        style={{
          width: 260,
        }}
      >
        {/* Logo area */}
        <div className="px-5 pt-5 pb-4 flex items-start justify-between lg:block">
          <div className="flex-1 min-w-0">
            {/* App label */}
            <div className="flex items-center gap-2 mb-3">
              <div className="w-6 h-6 rounded-md bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center flex-shrink-0">
                <ZapIcon size={12} className="text-indigo-400" />
              </div>
              <span className="text-[11px] font-semibold text-slate-400 tracking-widest uppercase leading-none">
                Dental CRM
              </span>
            </div>
            {/* Clinic name — prominent */}
            <div className="pl-0.5">
              <p className="text-[15px] font-bold text-slate-800 tracking-tight leading-snug truncate">
                {sidebarClinicName}
              </p>
              <p className="text-[10px] text-slate-400 mt-0.5">Patient records &amp; chairside notes</p>
            </div>
          </div>
          <button
            onClick={() => setIsSidebarOpen(false)}
            aria-label="Close Sidebar"
            className="p-1 rounded-md text-slate-500 hover:text-slate-800 hover:bg-slate-100 lg:hidden mt-1 ml-2 flex-shrink-0"
          >
            <X size={18} />
          </button>
        </div>

        {/* Separator */}
        <div className="mx-4 mb-3 h-px bg-slate-200" />

        {/* Navigation */}
        <nav className="flex-1 py-1 overflow-y-auto scrollbar-none flex flex-col justify-between">
          <div className="flex flex-col gap-0.5">
            {NAV_ITEMS.map((item) => (
              <SidebarNavItem key={item.path} item={item} />
            ))}
          </div>

          {/* Bottom Sidebar Action Container */}
          <div className="p-4 border-t border-slate-100 bg-slate-50/50 mt-auto flex flex-col gap-2">
            {!isStandalone && (
              <button
                type="button"
                onClick={handleInstallClick}
                className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg border border-indigo-200 bg-white hover:bg-indigo-50 text-[12.5px] font-bold text-indigo-600 shadow-sm transition-all duration-150 active:scale-95 cursor-pointer"
              >
                <Download size={15} />
                Add Webapp (App)
              </button>
            )}
            
            <button
              type="button"
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg border border-rose-200 bg-white hover:bg-rose-50 text-[12.5px] font-bold text-rose-600 shadow-sm transition-all duration-150 active:scale-95 cursor-pointer"
            >
              <LogOut size={15} />
              Sign Out
            </button>
          </div>
        </nav>


      </aside>

      {/* ── Main area ────────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top header */}
        <header
          className="flex-shrink-0 flex items-center justify-between px-4 sm:px-6 h-14 bg-white border-b border-slate-200"
        >
          <div className="flex items-center gap-2">
            {/* Hamburger button — only on lg screens where sidebar is off by default but no bottom nav */}
            <button
              onClick={() => setIsSidebarOpen(true)}
              aria-label="Open Sidebar"
              className="p-1 rounded-md text-slate-500 hover:text-slate-800 hover:bg-slate-100 hidden lg:flex xl:hidden"
            >
              <Menu size={20} />
            </button>

            {/* Page title */}
            <AnimatePresence mode="wait">
              <motion.h1
                key={location.pathname}
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 6 }}
                transition={{ duration: 0.18, ease: 'easeOut' }}
                className="text-[15px] font-semibold text-slate-800 tracking-tight"
              >
                {pageTitle}
              </motion.h1>
            </AnimatePresence>
          </div>

          {/* Right side chips */}
          <div className="flex items-center gap-2 sm:gap-3 relative">
            {/* Notifications Bell */}
            <div className="relative">
              <button
                onClick={() => setIsNotifOpen(!isNotifOpen)}
                className={`p-2 rounded-xl border transition-all duration-150 flex items-center justify-center cursor-pointer relative ${
                  isNotifOpen 
                    ? 'bg-indigo-50 border-indigo-200 text-indigo-600' 
                    : 'bg-white border-slate-200 text-slate-500 hover:text-slate-800 hover:bg-slate-50'
                }`}
              >
                <Bell size={16} />
                {appointments.length > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 min-w-4 h-4 bg-red-500 rounded-full text-[8.5px] font-bold text-white flex items-center justify-center px-1 shadow-sm">
                    {appointments.length}
                  </span>
                )}
              </button>

              {/* Notification Dropdown Box */}
              <AnimatePresence>
                {isNotifOpen && (
                  <>
                    {/* Click-outside transparent overlay */}
                    <div className="fixed inset-0 z-40" onClick={() => setIsNotifOpen(false)} />
                    
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                      className="fixed sm:absolute top-16 sm:top-auto sm:right-0 sm:mt-2 left-4 right-4 sm:left-auto sm:w-80 bg-white border border-slate-200 rounded-2xl shadow-xl z-50 overflow-hidden"
                    >
                      <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                        <span className="text-xs font-bold text-slate-800">Today's Appointments</span>
                        <span className="text-[10px] bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded-full font-bold border border-indigo-100">
                          {appointments.length} Visits
                        </span>
                      </div>
                      
                      <div className="max-h-64 overflow-y-auto divide-y divide-slate-100">
                        {appointments.length === 0 ? (
                          <div className="p-6 text-center">
                            <CheckCircle size={24} className="text-emerald-500 mx-auto mb-2" />
                            <p className="text-xs font-bold text-slate-700">All caught up!</p>
                            <p className="text-[10px] text-slate-400 mt-0.5">No appointments scheduled for today.</p>
                          </div>
                        ) : (
                          appointments.map((appt) => (
                            <div key={appt.id} className="p-3.5 hover:bg-slate-50 transition duration-150 flex items-start justify-between gap-3">
                              <div>
                                <h4 className="text-xs font-bold text-slate-800">{appt.name}</h4>
                                <p className="text-[10px] text-slate-500 mt-0.5">{appt.service}</p>
                                <p className="text-[9px] text-slate-400 mt-1">📞 {appt.phone}</p>
                              </div>
                              {appt.appointmentTime && (
                                <span className="text-[9px] font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded-md border border-indigo-100 shrink-0">
                                  {appt.appointmentTime}
                                </span>
                              )}
                            </div>
                          ))
                        )}
                      </div>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>

            {/* Locked Clinic Branding Chip */}
            <div className="flex items-center gap-1.5 bg-indigo-500/10 border border-indigo-500/20 px-2.5 py-1.2 rounded-lg">
              <span className="text-[9px] uppercase font-bold text-indigo-500 tracking-widest hidden sm:inline shrink-0">Clinic:</span>
              <span className="text-[11px] sm:text-[11.5px] font-bold text-slate-800 shrink-0 font-sans">
                {activeClinic}
              </span>
            </div>

            {/* Quick Sign Out Button in Header for Mobile/Tablet */}
            <button
              onClick={handleLogout}
              title="Sign Out"
              className="xl:hidden p-2 rounded-xl border border-rose-200 bg-rose-50/50 text-rose-600 hover:bg-rose-100/60 active:scale-95 flex items-center justify-center cursor-pointer transition-all duration-150"
            >
              <LogOut size={16} />
            </button>
          </div>
        </header>

        {/* Scrollable content area */}
        <main
          className="flex-1 overflow-y-auto bg-[#F1F5F9] p-4 sm:p-6 xl:pb-6 pb-24"
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.22, ease: 'easeOut' }}
              className="h-full"
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
      <BottomTabBar />
    </div>
  );
};

export default ReactivationLayout;
