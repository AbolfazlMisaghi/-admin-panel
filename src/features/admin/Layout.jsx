import { useState } from "react";
import { Outlet, Link, useNavigate, useLocation } from "react-router-dom";
import {
  MdDashboard,
  MdGroup,
  MdInventory2,
  MdArticle,
  MdSettings,
  MdLogout,
  MdMenu,
  MdClose,
} from "react-icons/md";
import { useAuthStore } from "../auth/store/authStore";

// --- Navigation items — add new pages here easily ---
const navItems = [
  { to: "/admin/dashboard", label: "داشبورد", icon: MdDashboard },
  { to: "/admin/team", label: "تیم", icon: MdGroup },
  { to: "/admin/products", label: "محصولات", icon: MdInventory2 },
  { to: "/admin/articles", label: "مقالات", icon: MdArticle },
  { to: "/admin/settings", label: "تنظیمات", icon: MdSettings },
];

const AdminLayout = () => {
  const logout = useAuthStore((state) => state.logout);
  const navigate = useNavigate();
  const location = useLocation();

  // Controls mobile sidebar open/close
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/admin/login");
  };

  // Close sidebar when a nav link is clicked on mobile
  const handleNavClick = () => {
    if (sidebarOpen) setSidebarOpen(false);
  };

  // Current page label for the topbar title
  const currentLabel =
    navItems.find((n) => n.to === location.pathname)?.label ?? "پنل مدیریت";

  // ─── Shared sidebar content (used in both desktop & mobile) ────────────────
  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Brand / Logo area */}
      <div className="flex items-center gap-3 px-5 py-5 border-b border-primary-800">
        <div className="w-9 h-9 bg-primary-600 rounded-xl flex items-center justify-center shrink-0">
          {/* Mini dashboard grid icon */}
          <svg width="20" height="20" viewBox="0 0 120 120" fill="none">
            <rect x="24" y="24" width="28" height="26" rx="5" fill="#7F77DD" />
            <rect x="68" y="24" width="28" height="26" rx="5" fill="#7F77DD" />
            <rect x="24" y="68" width="28" height="28" rx="5" fill="#7F77DD" />
            <rect
              x="68"
              y="68"
              width="28"
              height="28"
              rx="5"
              fill="#1D9E75"
              opacity="0.9"
            />
          </svg>
        </div>
        <div>
          <p className="text-primary-50 text-sm font-medium leading-tight">
            پنل مدیریت
          </p>
          <p className="text-primary-400 text-xs">نسخه ۱.۰</p>
        </div>
      </div>

      {/* Navigation links */}
      <nav className="flex-1 px-3 py-4 flex flex-col gap-1 overflow-y-auto">
        {navItems.map(({ to, label, icon: Icon }) => {
          const isActive = location.pathname === to;
          return (
            <Link
              key={to}
              to={to}
              onClick={handleNavClick}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors
                ${
                  isActive
                    ? "bg-primary-600 text-primary-50"
                    : "text-primary-200 hover:bg-primary-800 hover:text-primary-50"
                }`}
            >
              {/* Icon from react-icons */}
              <Icon
                size={20}
                className={isActive ? "text-primary-50" : "text-primary-400"}
              />
              {label}

              {/* Active indicator dot */}
              {isActive && (
                <span className="mr-auto w-1.5 h-1.5 rounded-full bg-accent-400" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Logout button at the bottom */}
      <div className="px-3 py-4 border-t border-primary-800">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-4 py-2.5 rounded-xl text-sm
                     text-primary-100 hover:bg-red-900/40 hover:text-red-400 transition-colors"
        >
          <MdLogout size={20} className="text-primary-400" />
          خروج از پنل
        </button>
      </div>
    </div>
  );

  // ─────────────────────────────────────────────────────────────────────────────
  return (
    <div className="flex min-h-screen bg-primary-50" dir="rtl">
      {/* ====== DESKTOP SIDEBAR — hidden on mobile, visible md+ ====== */}
      <aside className="hidden md:flex w-60 bg-primary-900 flex-col fixed top-0 right-0 h-full z-20">
        <SidebarContent />
      </aside>

      {/* ====== MOBILE OVERLAY — shown when sidebarOpen is true ====== */}
      {sidebarOpen && (
        // Dark backdrop — clicking it closes the sidebar
        <div
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ====== MOBILE SIDEBAR — slides in from right ====== */}
      <aside
        className={`fixed top-0 right-0 h-full w-64 bg-primary-900 z-40 flex flex-col
                    transition-transform duration-300 md:hidden
                    ${sidebarOpen ? "translate-x-0" : "translate-x-full"}`}
      >
        {/* Close button inside mobile sidebar */}
        <button
          onClick={() => setSidebarOpen(false)}
          className="absolute top-4 left-4 text-primary-300 hover:text-primary-50 transition-colors"
          aria-label="بستن منو"
        >
          <MdClose size={24} />
        </button>

        <SidebarContent />
      </aside>

      {/* ====== MAIN CONTENT AREA ====== */}
      {/* md:mr-60 offsets content for the fixed desktop sidebar */}
      <div className="flex-1 flex flex-col md:mr-60">
        {/* ── Topbar ── */}
        {/* ── Topbar ── */}
        <header
          className="bg-white border-b border-primary-100 px-4 md:px-6 py-3.5
                   flex items-center justify-between sticky top-0 z-10"
        >
          {/* Left side: hamburger (mobile only) + logo placeholder */}
          <div className="flex items-center gap-3">
            {/* Hamburger button — only visible on mobile */}
            <button
              onClick={() => setSidebarOpen(true)}
              className="md:hidden text-primary-600 hover:text-primary-800 transition-colors"
              aria-label="باز کردن منو"
            >
              <MdMenu size={26} />
            </button>

            {/* Logo area — replace src with real logo later */}
            {/* TODO: replace with actual logo after favicon is ready */}
            <div className="flex items-center gap-2.5">
              <img
                src="../../../public\Picture1.png"
                alt="لوگوی سایت"
                className="h-7 w-auto object-contain"
              />
              {/* Site name — replace with <img> tag when logo is ready */}
              <span className="text-primary-900 text-sm font-semibold hidden sm:block">
                پنل مدیریت
              </span>
            </div>
          </div>

          {/* Right side: user avatar + info */}
          <div className="flex items-center gap-3">
            <div className="text-left hidden sm:block">
              <p className="text-primary-900 text-xs font-medium">مدیر سیستم</p>
              <p className="text-primary-400 text-xs">admin@myapp.ir</p>
            </div>
            <div
              className="w-8 h-8 rounded-full bg-primary-600 flex items-center
                    justify-center text-primary-50 text-xs font-bold shrink-0"
            >
              م
            </div>
          </div>
        </header>

        {/* ── Page content rendered by child routes ── */}
        <main className="flex-1 p-4 md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
