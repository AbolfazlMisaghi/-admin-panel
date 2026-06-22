import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useAuthStore } from "../store/authStore";
import { loginUser } from "../services/authService";
import DashboardIcon from "../../../common/components/DashboardIcon";

// 1. Define validation schema with Zod
const loginSchema = z.object({
  email: z.string().min(1, "ایمیل الزامی است").email("فرمت ایمیل نادرست است"),
  password: z
    .string()
    .min(1, "رمز عبور الزامی است")
    .min(4, "رمز عبور باید حداقل ۴ کاراکتر باشد"),
});

const Login = () => {
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);

  // 2. Use React Hook Form
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(loginSchema), // Connect Zod
  });

  // 3. Submit handler
  const onSubmit = async (data) => {
    try {
      const result = await loginUser(data); // Call API
      login(result.token, result.user); // Save in Zustand
      toast.success("خوش آمدید!");
      navigate("/admin/dashboard"); // Redirect to dashboard
    } catch (error) {
      // 401 or network error
      const message =
        error.response?.data?.message || "مشکلی پیش آمد. دوباره تلاش کنید.";
      toast.error(message);
    }
  };

  return (
    <div className="min-h-screen bg-primary-50 flex items-center justify-center p-4">
      {/* Main card — split layout */}
      <div className="w-full max-w-3xl bg-white rounded-2xl overflow-hidden flex shadow-sm">
        {/* Left column — branding */}
        <div className="hidden md:flex w-2/5 bg-primary-600 flex-col items-center justify-center p-10 gap-6">
          {/* Logo */}
          <div className="w-20 h-20 flex items-center justify-center">
            <DashboardIcon />
          </div>
          {/* Brand text */}
          <h1 className="text-primary-50 text-xl font-medium text-center">
            پنل مدیریت
          </h1>
          <p className="text-primary-200 text-sm text-center leading-7 max-w-[200px]">
            مدیریت محتوا، تیم و محصولات در یک مکان
          </p>
          {/* Badges */}
          <div className="flex flex-wrap gap-2 justify-center">
            {["محصولات", "تیم", "مقالات"].map((item) => (
              <span
                key={item}
                className="bg-primary-800 text-primary-100 text-xs px-3 py-1 rounded-full"
              >
                {item}
              </span>
            ))}
          </div>
        </div>

        {/* Right column — form */}
        <div className="flex-1 p-8 md:p-10 flex flex-col justify-center">
          <h2 className="text-primary-900 text-xl font-medium mb-1">
            خوش آمدید
          </h2>
          <p className="text-gray-400 text-sm mb-8">
            برای ورود، اطلاعات خود را وارد کنید
          </p>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-5"
          >
            {/* Email field */}
            <div className="flex flex-col gap-1">
              <label className="text-primary-800 text-sm font-medium">
                ایمیل
              </label>
              <div className="relative">
                <input
                  type="text"
                  {...register("email")}
                  placeholder="example@domain.com"
                  className="w-full border border-primary-100 rounded-xl px-4 py-2.5 pr-10 text-sm bg-primary-50 text-primary-900 placeholder-primary-200 focus:outline-none focus:border-primary-600"
                />
                {/* Icon */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-4 h-4 text-primary-400 absolute right-3 top-1/2 -translate-y-1/2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75"
                  />
                </svg>
              </div>
              {errors.email && (
                <span className="text-red-600 text-xs mt-0.5">
                  {errors.email.message}
                </span>
              )}
            </div>

            {/* Password field */}
            <div className="flex flex-col gap-1">
              <label className="text-primary-800 text-sm font-medium">
                رمز عبور
              </label>
              <div className="relative">
                <input
                  type="password"
                  {...register("password")}
                  placeholder="••••••••"
                  className="w-full border border-primary-100 rounded-xl px-4 py-2.5 pr-10 text-sm bg-primary-50 text-primary-900 placeholder-primary-200 focus:outline-none focus:border-primary-600"
                />
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-4 h-4 text-primary-400 absolute right-3 top-1/2 -translate-y-1/2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z"
                  />
                </svg>
              </div>
              {errors.password && (
                <span className="text-red-600 text-xs mt-0.5">
                  {errors.password.message}
                </span>
              )}
            </div>

            {/* Submit button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-primary-600 hover:bg-primary-800 disabled:bg-primary-200 text-primary-50 font-medium py-2.5 rounded-xl text-sm transition-colors mt-2"
            >
              {isSubmitting ? "در حال ورود..." : "ورود به پنل"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
