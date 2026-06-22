import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { MdBusiness, MdImage, MdDescription, MdSave } from "react-icons/md";
import { RiInstagramLine, RiTelegramLine } from "react-icons/ri";
import { settingsSchema } from "../‫schemas/‫settingsSchema";
import { getSettings, updateSettings } from "../services/settingsService";
import Spinner from "../../../common/components/Spinner";

// Reusable field wrapper — consistent with other forms
const FormField = ({ label, error, required, hint, icon: Icon, children }) => (
  <div className="flex flex-col gap-1.5">
    <div className="flex items-center justify-between">
      <label className="text-primary-800 text-sm font-medium flex items-center gap-1.5">
        {Icon && <Icon size={15} className="text-primary-400" />}
        {label}
        {required && <span className="text-red-400 text-xs">*</span>}
      </label>
      {!required && (
        <span className="text-primary-300 text-xs bg-primary-50 px-2 py-0.5 rounded-md">
          اختیاری
        </span>
      )}
    </div>

    {children}

    {hint && !error && <p className="text-primary-300 text-xs">{hint}</p>}
    {error && (
      <p className="text-red-500 text-xs flex items-center gap-1.5">
        <span className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0" />
        {error}
      </p>
    )}
  </div>
);

// Returns input/textarea className based on error state
const inputCls = (hasError) =>
  [
    "w-full border rounded-xl px-4 py-2.5 text-sm text-primary-900",
    "placeholder-primary-200 focus:outline-none transition-colors",
    hasError
      ? "border-red-300 bg-red-50/40 focus:border-red-400"
      : "border-primary-100 bg-primary-50 focus:border-primary-600",
  ].join(" ");

// Social input with branded prefix badge
const SocialInput = ({
  icon: Icon,
  prefix,
  placeholder,
  registration,
  error,
  iconColor,
}) => (
  <div className="flex flex-col gap-1.5">
    <div
      className={[
        "flex items-center border rounded-xl overflow-hidden transition-colors",
        error
          ? "border-red-300 bg-red-50/40"
          : "border-primary-100 bg-primary-50 focus-within:border-primary-600",
      ].join(" ")}
    >
      {/* Branded prefix badge */}
      <div className="flex items-center gap-2 px-3 py-2.5 border-l border-primary-100 bg-white shrink-0">
        <Icon size={16} className={iconColor} />
        <span className="text-primary-400 text-xs hidden sm:block">
          {prefix}
        </span>
      </div>
      {/* URL input — LTR for URLs */}
      <input
        {...registration}
        placeholder={placeholder}
        dir="ltr"
        className="flex-1 px-3 py-2.5 text-sm text-primary-900 placeholder-primary-200 bg-transparent focus:outline-none"
      />
    </div>
    {error && (
      <p className="text-red-500 text-xs flex items-center gap-1.5">
        <span className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0" />
        {error}
      </p>
    )}
  </div>
);

// Live logo preview — shows image when a valid URL is typed
const LogoPreview = () => {
  const handleInput = (e) => {
    const preview = document.getElementById("logo-preview");
    if (!preview) return;
    const val = e.target.value.trim();
    if (val) {
      preview.src = val;
      preview.classList.remove("hidden");
    } else {
      preview.classList.add("hidden");
    }
  };

  return (
    <img
      id="logo-preview"
      src=""
      alt="پیش‌نمایش لوگو"
      onInput={handleInput}
      onError={(e) => e.currentTarget.classList.add("hidden")}
      className="hidden h-14 w-auto object-contain rounded-xl border border-primary-100 p-2 bg-primary-50"
    />
  );
};

const Settings = () => {
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    resolver: zodResolver(settingsSchema),
    defaultValues: {
      siteName: "",
      logo: "",
      description: "",
      socials: {
        telegram: "",
        instagram: "",
      },
    },
  });

  // Fetch current settings
  const {
    data: settings,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["settings"],
    queryFn: getSettings,
  });

  // Populate form once settings data is ready
  useEffect(() => {
    if (settings) {
      reset({
        ...settings,
        socials: {
          telegram: settings.socials?.telegram || "",
          instagram: settings.socials?.instagram || "",
        },
      });
    }
  }, [settings, reset]);

  const mutation = useMutation({
    mutationFn: updateSettings,
    onSuccess: () => {
      toast.success("تنظیمات با موفقیت ذخیره شد");
      queryClient.invalidateQueries({ queryKey: ["settings"] });
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || "خطا در ذخیره تنظیمات");
    },
  });

  const onSubmit = (data) => mutation.mutate(data);

  const isBusy = isSubmitting || mutation.isPending;

  if (isLoading) return <Spinner />;

  if (isError)
    return (
      <div className="rounded-xl bg-red-50 border border-red-200 px-5 py-4 text-red-700 text-sm">
        {"خطا در دریافت تنظیمات: " + error.message}
      </div>
    );

  return (
    <div className="flex flex-col gap-6 max-w-2xl" dir="rtl">
      {/* Page header */}
      <div>
        <h1 className="text-primary-900 text-xl font-semibold">تنظیمات سایت</h1>
        <p className="text-primary-400 text-sm mt-0.5">
          اطلاعات عمومی و شبکه‌های اجتماعی سایت را مدیریت کنید
        </p>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-5"
        noValidate
      >
        {/* ── Card 1: General info ── */}
        <div className="bg-white rounded-2xl border border-primary-100 p-5 sm:p-8 flex flex-col gap-5">
          <p className="text-primary-400 text-xs font-medium uppercase tracking-wider">
            اطلاعات عمومی
          </p>

          {/* Site name */}
          <FormField
            label="نام سایت"
            required
            icon={MdBusiness}
            error={errors.siteName?.message}
          >
            <input
              {...register("siteName")}
              placeholder="مثال: آکادمی آموزشی من"
              className={inputCls(!!errors.siteName)}
            />
          </FormField>

          {/* Logo URL */}
          <FormField
            label="آدرس لوگو"
            icon={MdImage}
            error={errors.logo?.message}
            hint="آدرس URL تصویر لوگوی سایت"
          >
            <input
              {...register("logo")}
              placeholder="https://example.com/logo.png"
              className={inputCls(!!errors.logo)}
              dir="ltr"
            />
          </FormField>

          {/* Logo live preview */}
          <LogoPreview />

          {/* Description */}
          <FormField
            label="توضیحات کوتاه"
            icon={MdDescription}
            error={errors.description?.message}
            hint="یک جمله کوتاه درباره سایت — در هدر یا فوتر نمایش داده می‌شود"
          >
            <textarea
              {...register("description")}
              placeholder="توضیح مختصری درباره سایت..."
              rows={3}
              className={inputCls(!!errors.description) + " resize-none"}
            />
          </FormField>
        </div>

        {/* ── Card 2: Social networks ── */}
        <div className="bg-white rounded-2xl border border-primary-100 p-5 sm:p-8 flex flex-col gap-5">
          <div>
            <p className="text-primary-400 text-xs font-medium uppercase tracking-wider">
              شبکه‌های اجتماعی
            </p>
            <p className="text-primary-300 text-xs mt-1">
              لینک‌های شبکه‌های اجتماعی سایت — همه اختیاری هستند
            </p>
          </div>

          {/* Telegram */}
          <div className="flex flex-col gap-1.5">
            <label className="text-primary-800 text-sm font-medium flex items-center gap-1.5">
              <RiTelegramLine size={15} className="text-primary-400" />
              تلگرام
              <span className="text-primary-300 text-xs bg-primary-50 px-2 py-0.5 rounded-md mr-auto">
                اختیاری
              </span>
            </label>
            <SocialInput
              icon={RiTelegramLine}
              prefix="t.me/"
              placeholder="https://t.me/yourchannel"
              registration={register("socials.telegram")}
              error={errors.socials?.telegram?.message}
              iconColor="text-sky-500"
            />
          </div>

          {/* Instagram */}
          <div className="flex flex-col gap-1.5">
            <label className="text-primary-800 text-sm font-medium flex items-center gap-1.5">
              <RiInstagramLine size={15} className="text-primary-400" />
              اینستاگرام
              <span className="text-primary-300 text-xs bg-primary-50 px-2 py-0.5 rounded-md mr-auto">
                اختیاری
              </span>
            </label>
            <SocialInput
              icon={RiInstagramLine}
              prefix="instagram.com/"
              placeholder="https://instagram.com/yourpage"
              registration={register("socials.instagram")}
              error={errors.socials?.instagram?.message}
              iconColor="text-pink-500"
            />
          </div>
        </div>

        {/* ── Save button ── */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isBusy}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl text-sm font-medium bg-primary-600 text-primary-50 hover:bg-primary-800 transition-colors disabled:bg-primary-200 disabled:cursor-not-allowed"
          >
            {isBusy ? (
              <span className="w-4 h-4 rounded-full border-2 border-primary-200 border-t-white animate-spin" />
            ) : (
              <MdSave size={17} />
            )}
            {isBusy ? "در حال ذخیره..." : "ذخیره تغییرات"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Settings;
