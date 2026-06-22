import { useQuery } from "@tanstack/react-query";
import { MdGroup, MdInventory2, MdArticle, MdTrendingUp } from "react-icons/md";
import { getStats } from "../services/statsService";

// --- Stat card config — easy to extend with new cards in the future ---
// Each card has a label, data key, icon, and accent colors
const statCards = [
  {
    key: "teamCount",
    label: "اعضای تیم",
    icon: MdGroup,
    bg: "bg-primary-600",
    iconBg: "bg-primary-800",
    textColor: "text-primary-50",
    subColor: "text-primary-200",
  },
  {
    key: "productCount",
    label: "محصولات",
    icon: MdInventory2,
    bg: "bg-accent-400",
    iconBg: "bg-accent-600",
    textColor: "text-white",
    subColor: "text-green-100",
  },
  {
    key: "articleCount",
    label: "مقالات",
    icon: MdArticle,
    bg: "bg-white",
    iconBg: "bg-primary-50",
    textColor: "text-primary-900",
    subColor: "text-primary-400",
    border: "border border-primary-100",
  },
];

// --- Loading skeleton for a single card ---
const CardSkeleton = () => (
  <div className="rounded-2xl bg-white border border-primary-100 p-6 animate-pulse flex flex-col gap-4">
    <div className="w-10 h-10 rounded-xl bg-primary-100" />
    <div className="h-8 w-16 rounded-lg bg-primary-100" />
    <div className="h-4 w-24 rounded bg-primary-50" />
  </div>
);

const Dashboard = () => {
  const { data: stats, isLoading, isError, error } = useQuery({
    queryKey: ["stats"],
    queryFn: getStats,
  });

  return (
    <div className="flex flex-col gap-8" dir="rtl">

      {/* ── Page header ── */}
      <div className="flex flex-col gap-1">
        <h1 className="text-primary-900 text-xl font-semibold">داشبورد</h1>
        <p className="text-primary-400 text-sm">
          خلاصه‌ای از وضعیت فعلی سایت
        </p>
      </div>

      {/* ── Error state ── */}
      {isError && (
        <div className="rounded-xl bg-red-50 border border-red-200 px-5 py-4 text-red-700 text-sm flex items-center gap-2">
          <MdTrendingUp className="text-red-400" size={18} />
          خطا در دریافت اطلاعات: {error.message}
        </div>
      )}

      {/* ── Stat cards grid ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {isLoading
          ? // Show 3 skeletons while loading
            Array.from({ length: 3 }).map((_, i) => <CardSkeleton key={i} />)
          : statCards.map(({ key, label, icon: Icon, bg, iconBg, textColor, subColor, border }) => (
              <div
                key={key}
                className={`rounded-2xl ${bg} ${border ?? ""} p-6 flex flex-col gap-4
                            shadow-sm hover:shadow-md transition-shadow`}
              >
                {/* Icon badge */}
                <div className={`w-11 h-11 ${iconBg} rounded-xl flex items-center justify-center`}>
                  <Icon size={22} className={textColor} />
                </div>

                {/* Count */}
                <p className={`text-4xl font-bold ${textColor} leading-none`}>
                  {stats?.[key] ?? 0}
                </p>

                {/* Label + subtle trending icon */}
                <div className="flex items-center justify-between">
                  <p className={`text-sm font-medium ${subColor}`}>{label}</p>
                  <MdTrendingUp size={16} className={`${subColor} opacity-60`} />
                </div>
              </div>
            ))}
      </div>

      {/* ── Placeholder for future charts / content ── */}
      <div className="rounded-2xl bg-white border border-primary-100 p-6 flex flex-col items-center justify-center gap-3 min-h-[180px]">
        <div className="w-12 h-12 rounded-full bg-primary-50 flex items-center justify-center">
          <MdTrendingUp size={24} className="text-primary-400" />
        </div>
        <p className="text-primary-400 text-sm">
          نمودارها و آمار تفصیلی در نسخه‌های بعدی اضافه خواهند شد
        </p>
      </div>

    </div>
  );
};

export default Dashboard;