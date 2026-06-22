import axios from "axios";

// یک نمونه axios با تنظیمات پایه می‌سازیم
const api = axios.create({
  baseURL: "/api", // تمام درخواست‌ها با /api شروع می‌شوند
  headers: {
    "Content-Type": "application/json",
  },
});

// اینترسپتور درخواست: اگر توکن در localStorage وجود داشت، هدر Authorization را اضافه کن
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// اینترسپتور پاسخ: اگر خطای 401 (احراز هویت ناموفق) دریافت کردیم، کاربر را خارج کن
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // اگر store در دسترس نیست، مستقیم از localStorage پاک می‌کنیم
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      // ریدایرکت به صفحه لاگین (با reload یا استفاده از router)
      window.location.href = "/admin/login";
    }
    return Promise.reject(error);
  }
);

export default api;
