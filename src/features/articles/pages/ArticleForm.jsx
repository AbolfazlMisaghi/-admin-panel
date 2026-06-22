import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  MdTitle,
  MdLink,
  MdShortText,
  MdArticle,
  MdImage,
  MdTravelExplore,
  MdDescription,
  MdPublish,
  MdArrowForward,
  MdSave,
} from "react-icons/md";
import { articleSchema } from "../schemas/articleSchema";
import {
  getArticle,
  createArticle,
  updateArticle,
} from "../services/articleService";
import Spinner from "../../../common/components/Spinner";

// Converts Persian/English title to a valid URL slug
const slugify = (text) =>
  text
    .toString()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]+/g, "")
    .replace(/--+/g, "-")
    .replace(/^-+/, "")
    .replace(/-+$/, "");

// Reusable field wrapper — consistent with TeamForm and ProductForm
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

// Section divider with label
const SectionLabel = ({ children }) => (
  <div className="border-t border-primary-50 pt-1">
    <p className="text-primary-400 text-xs font-medium uppercase tracking-wider">
      {children}
    </p>
  </div>
);

const ArticleForm = () => {
  const { id } = useParams();
  const isEditMode = Boolean(id);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    watch,
    setValue,
  } = useForm({
    resolver: zodResolver(articleSchema),
    defaultValues: {
      title: "",
      slug: "",
      summary: "",
      content: "",
      image: "",
      metaTitle: "",
      metaDescription: "",
      status: "draft",
    },
  });

  // Auto-generate slug from title in create mode only
  const titleValue = watch("title");
  const slugValue = watch("slug");
  useEffect(() => {
    if (!isEditMode && !slugValue && titleValue) {
      setValue("slug", slugify(titleValue), { shouldValidate: true });
    }
  }, [titleValue, slugValue, isEditMode, setValue]);

  // Fetch article data in edit mode
  const {
    data: article,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["articles", id],
    queryFn: () => getArticle(id),
    enabled: isEditMode,
  });

  // Populate form once article data is ready
  useEffect(() => {
    if (article) reset(article);
  }, [article, reset]);

  const createMutation = useMutation({
    mutationFn: createArticle,
    onSuccess: () => {
      toast.success("مقاله با موفقیت ایجاد شد");
      queryClient.invalidateQueries({ queryKey: ["articles"] });
      navigate("/admin/articles");
    },
    onError: (err) =>
      toast.error(err.response?.data?.message || "خطا در ذخیره"),
  });

  const updateMutation = useMutation({
    mutationFn: (data) => updateArticle(id, data),
    onSuccess: () => {
      toast.success("مقاله با موفقیت ویرایش شد");
      queryClient.invalidateQueries({ queryKey: ["articles"] });
      navigate("/admin/articles");
    },
    onError: (err) =>
      toast.error(err.response?.data?.message || "خطا در ذخیره"),
  });

  const isBusy =
    isSubmitting || createMutation.isPending || updateMutation.isPending;

  const onSubmit = (data) => {
    isEditMode ? updateMutation.mutate(data) : createMutation.mutate(data);
  };

  const handleCancel = () => navigate("/admin/articles");

  if (isEditMode && isLoading) return <Spinner />;

  if (isEditMode && isError)
    return (
      <div className="rounded-xl bg-red-50 border border-red-200 px-5 py-4 text-red-700 text-sm">
        خطا در دریافت اطلاعات مقاله. لطفاً دوباره تلاش کنید.
      </div>
    );

  return (
    <div className="flex flex-col gap-6 max-w-3xl" dir="rtl">
      {/* Page header */}
      <div className="flex items-center gap-3">
        <button
          onClick={handleCancel}
          className="w-9 h-9 flex items-center justify-center rounded-xl bg-white border border-primary-100 text-primary-400 hover:text-primary-700 hover:border-primary-300 transition-colors shrink-0"
          aria-label="بازگشت به لیست"
        >
          <MdArrowForward size={20} />
        </button>
        <div>
          <h1 className="text-primary-900 text-xl font-semibold">
            {isEditMode ? "ویرایش مقاله" : "مقاله جدید"}
          </h1>
          <p className="text-primary-400 text-sm mt-0.5">
            {isEditMode
              ? "محتوای مقاله را ویرایش کنید"
              : "محتوای مقاله جدید را وارد کنید"}
          </p>
        </div>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-6"
        noValidate
      >
        {/* ── Card 1: Main content ── */}
        <div className="bg-white rounded-2xl border border-primary-100 p-5 sm:p-8 flex flex-col gap-5">
          <p className="text-primary-400 text-xs font-medium uppercase tracking-wider">
            محتوای اصلی
          </p>

          {/* Title */}
          <FormField
            label="عنوان مقاله"
            required
            icon={MdTitle}
            error={errors.title?.message}
          >
            <input
              {...register("title")}
              placeholder="عنوان مقاله را وارد کنید"
              className={inputCls(!!errors.title)}
            />
          </FormField>

          {/* Slug — auto-filled from title, editable */}
          <FormField
            label="اسلاگ (Slug)"
            required
            icon={MdLink}
            error={errors.slug?.message}
            hint="به صورت خودکار از عنوان تولید می‌شود — قابل ویرایش است"
          >
            <input
              {...register("slug")}
              placeholder="article-slug-here"
              className={inputCls(!!errors.slug)}
              dir="ltr"
            />
          </FormField>

          {/* Summary */}
          <FormField
            label="خلاصه"
            required
            icon={MdShortText}
            error={errors.summary?.message}
            hint="یک پاراگراف کوتاه برای نمایش در لیست مقالات"
          >
            <textarea
              {...register("summary")}
              placeholder="خلاصه‌ای از محتوای مقاله..."
              rows={3}
              className={inputCls(!!errors.summary) + " resize-none"}
            />
          </FormField>

          {/* Content — large textarea */}
          <FormField
            label="محتوا"
            required
            icon={MdArticle}
            error={errors.content?.message}
          >
            <textarea
              {...register("content")}
              placeholder="محتوای کامل مقاله را اینجا بنویسید..."
              rows={10}
              className={inputCls(!!errors.content) + " resize-y"}
            />
          </FormField>
        </div>

        {/* ── Card 2: Media + SEO ── */}
        <div className="bg-white rounded-2xl border border-primary-100 p-5 sm:p-8 flex flex-col gap-5">
          <p className="text-primary-400 text-xs font-medium uppercase tracking-wider">
            تصویر و سئو
          </p>

          {/* Featured image */}
          <FormField
            label="تصویر شاخص"
            icon={MdImage}
            error={errors.image?.message}
            hint="آدرس URL تصویر اصلی مقاله"
          >
            <input
              {...register("image")}
              placeholder="https://example.com/image.jpg"
              className={inputCls(!!errors.image)}
              dir="ltr"
            />
          </FormField>

          <SectionLabel>اطلاعات سئو</SectionLabel>

          {/* Meta title */}
          <FormField
            label="عنوان متا"
            required
            icon={MdTravelExplore}
            error={errors.metaTitle?.message}
            hint="عنوانی که در نتایج موتور جستجو نمایش داده می‌شود"
          >
            <input
              {...register("metaTitle")}
              placeholder="عنوان برای موتور جستجو"
              className={inputCls(!!errors.metaTitle)}
            />
          </FormField>

          {/* Meta description */}
          <FormField
            label="توضیحات متا"
            required
            icon={MdDescription}
            error={errors.metaDescription?.message}
            hint="توضیحات کوتاه برای نمایش در نتایج جستجو (حداکثر ۱۶۰ کاراکتر)"
          >
            <textarea
              {...register("metaDescription")}
              placeholder="توضیح کوتاه برای موتورهای جستجو..."
              rows={3}
              className={inputCls(!!errors.metaDescription) + " resize-none"}
            />
          </FormField>
        </div>

        {/* ── Card 3: Publish settings ── */}
        <div className="bg-white rounded-2xl border border-primary-100 p-5 sm:p-8 flex flex-col gap-5">
          <p className="text-primary-400 text-xs font-medium uppercase tracking-wider">
            تنظیمات انتشار
          </p>

          {/* Status selector — styled radio-like buttons */}
          <FormField
            label="وضعیت انتشار"
            required
            icon={MdPublish}
            error={errors.status?.message}
          >
            <div className="flex gap-3">
              {/* Draft option */}
              <label className="flex-1 cursor-pointer">
                <input
                  {...register("status")}
                  type="radio"
                  value="draft"
                  className="sr-only peer"
                />
                <div className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl border text-sm font-medium transition-colors border-primary-100 bg-primary-50 text-primary-400 peer-checked:border-primary-600 peer-checked:bg-primary-600 peer-checked:text-primary-50">
                  پیش‌نویس
                </div>
              </label>

              {/* Published option */}
              <label className="flex-1 cursor-pointer">
                <input
                  {...register("status")}
                  type="radio"
                  value="published"
                  className="sr-only peer"
                />
                <div className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl border text-sm font-medium transition-colors border-primary-100 bg-primary-50 text-primary-400 peer-checked:border-accent-400 peer-checked:bg-accent-400 peer-checked:text-white">
                  منتشر شده
                </div>
              </label>
            </div>
          </FormField>
        </div>

        {/* ── Action buttons ── */}
        <div className="flex flex-col-reverse sm:flex-row gap-3">
          <button
            type="button"
            onClick={handleCancel}
            disabled={isBusy}
            className="flex-1 sm:flex-none sm:w-32 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium text-primary-600 bg-white border border-primary-100 hover:bg-primary-50 transition-colors disabled:opacity-50"
          >
            انصراف
          </button>
          <button
            type="submit"
            disabled={isBusy}
            className="flex-1 sm:flex-none sm:w-44 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium bg-primary-600 text-primary-50 hover:bg-primary-800 transition-colors disabled:bg-primary-200 disabled:cursor-not-allowed"
          >
            {isBusy ? (
              <span className="w-4 h-4 rounded-full border-2 border-primary-200 border-t-white animate-spin" />
            ) : (
              <MdSave size={17} />
            )}
            {isBusy ? "در حال ذخیره..." : "ذخیره مقاله"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ArticleForm;
