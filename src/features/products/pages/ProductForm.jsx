import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  MdInventory2,
  MdDescription,
  MdLink,
  MdImage,
  MdArrowForward,
  MdSave,
} from "react-icons/md";
import { productSchema } from "../schemas/productSchema";
import {
  getProduct,
  createProduct,
  updateProduct,
} from "../services/productService";
import Spinner from "../../../common/components/Spinner";

// Reusable field wrapper — same pattern as TeamForm for consistency
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

// Returns input className based on error state
const inputCls = (hasError) =>
  [
    "w-full border rounded-xl px-4 py-2.5 text-sm text-primary-900",
    "placeholder-primary-200 focus:outline-none transition-colors",
    hasError
      ? "border-red-300 bg-red-50/40 focus:border-red-400"
      : "border-primary-100 bg-primary-50 focus:border-primary-600",
  ].join(" ");

const ProductForm = () => {
  const { id } = useParams();
  const isEditMode = Boolean(id);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    resolver: zodResolver(productSchema),
    defaultValues: { name: "", description: "", link: "", image: "" },
  });

  // Fetch product data only in edit mode
  const {
    data: product,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["products", id],
    queryFn: () => getProduct(id),
    enabled: isEditMode,
  });

  // Populate form once product data is ready
  useEffect(() => {
    if (product) reset(product);
  }, [product, reset]);

  const createMutation = useMutation({
    mutationFn: createProduct,
    onSuccess: () => {
      toast.success("محصول جدید با موفقیت اضافه شد");
      queryClient.invalidateQueries({ queryKey: ["products"] });
      navigate("/admin/products");
    },
    onError: (err) =>
      toast.error(err.response?.data?.message || "خطا در ذخیره"),
  });

  const updateMutation = useMutation({
    mutationFn: (data) => updateProduct(id, data),
    onSuccess: () => {
      toast.success("محصول با موفقیت ویرایش شد");
      queryClient.invalidateQueries({ queryKey: ["products"] });
      navigate("/admin/products");
    },
    onError: (err) =>
      toast.error(err.response?.data?.message || "خطا در ذخیره"),
  });

  // True while any async operation is running
  const isBusy =
    isSubmitting || createMutation.isPending || updateMutation.isPending;

  const onSubmit = (data) => {
    const payload = { ...data };
    // Remove optional empty fields before sending to API
    if (!payload.link) delete payload.link;
    if (!payload.image) delete payload.image;
    isEditMode
      ? updateMutation.mutate(payload)
      : createMutation.mutate(payload);
  };

  const handleCancel = () => navigate("/admin/products");

  // Loading state — edit mode only
  if (isEditMode && isLoading) return <Spinner />;

  // Error state — edit mode only
  if (isEditMode && isError)
    return (
      <div className="rounded-xl bg-red-50 border border-red-200 px-5 py-4 text-red-700 text-sm">
        خطا در دریافت اطلاعات محصول. لطفاً دوباره تلاش کنید.
      </div>
    );

  return (
    <div className="flex flex-col gap-6 max-w-2xl" dir="rtl">
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
            {isEditMode ? "ویرایش محصول" : "افزودن محصول جدید"}
          </h1>
          <p className="text-primary-400 text-sm mt-0.5">
            {isEditMode
              ? "اطلاعات محصول را ویرایش کنید"
              : "اطلاعات محصول جدید را وارد کنید"}
          </p>
        </div>
      </div>

      {/* Form card */}
      <div className="bg-white rounded-2xl border border-primary-100 p-5 sm:p-8">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-5"
          noValidate
        >
          {/* Section: required fields */}
          <p className="text-primary-400 text-xs font-medium uppercase tracking-wider">
            اطلاعات اصلی
          </p>

          {/* Name */}
          <FormField
            label="نام محصول"
            required
            icon={MdInventory2}
            error={errors.name?.message}
          >
            <input
              {...register("name")}
              placeholder="مثال: اپلیکیشن آموزش ریاضی"
              className={inputCls(!!errors.name)}
            />
          </FormField>

          {/* Description — textarea for longer text */}
          <FormField
            label="توضیحات"
            required
            icon={MdDescription}
            error={errors.description?.message}
            hint="توضیح کوتاهی درباره محصول و ویژگی‌های آن"
          >
            <textarea
              {...register("description")}
              placeholder="این محصول برای..."
              rows={4}
              className={inputCls(!!errors.description) + " resize-none"}
            />
          </FormField>

          {/* Section: optional fields */}
          <div className="border-t border-primary-50 pt-1">
            <p className="text-primary-400 text-xs font-medium uppercase tracking-wider">
              اطلاعات تکمیلی
            </p>
          </div>

          {/* Link — optional */}
          <FormField
            label="لینک محصول"
            icon={MdLink}
            error={errors.link?.message}
            hint="آدرس وب‌سایت یا لینک دانلود محصول"
          >
            <input
              {...register("link")}
              placeholder="https://example.com"
              className={inputCls(!!errors.link)}
              dir="ltr"
            />
          </FormField>

          {/* Image URL — optional */}
          <FormField
            label="آدرس تصویر"
            icon={MdImage}
            error={errors.image?.message}
            hint="آدرس URL تصویر شاخص محصول"
          >
            <input
              {...register("image")}
              placeholder="https://example.com/image.jpg"
              className={inputCls(!!errors.image)}
              dir="ltr"
            />
          </FormField>

          {/* Image preview — shown when image field has a value */}
          <ImagePreview register={register} />

          {/* Action buttons — stacked on mobile, side by side on sm+ */}
          <div className="flex flex-col-reverse sm:flex-row gap-3 pt-2">
            <button
              type="button"
              onClick={handleCancel}
              disabled={isBusy}
              className="flex-1 sm:flex-none sm:w-32 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium text-primary-600 bg-primary-50 hover:bg-primary-100 transition-colors disabled:opacity-50"
            >
              انصراف
            </button>
            <button
              type="submit"
              disabled={isBusy}
              className="flex-1 sm:flex-none sm:w-40 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium bg-primary-600 text-primary-50 hover:bg-primary-800 transition-colors disabled:bg-primary-200 disabled:cursor-not-allowed"
            >
              {isBusy ? (
                <span className="w-4 h-4 rounded-full border-2 border-primary-200 border-t-white animate-spin" />
              ) : (
                <MdSave size={17} />
              )}
              {isBusy ? "در حال ذخیره..." : "ذخیره"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Live image preview component — watches the image field and shows preview
// Extracted as separate component to avoid re-rendering the whole form
const ImagePreview = ({ register }) => {
  // We need to watch the image field value
  // Using a simple uncontrolled approach with onInput
  const handleInput = (e) => {
    const preview = document.getElementById("product-image-preview");
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
    <div className="flex flex-col gap-2">
      <img
        id="product-image-preview"
        src=""
        alt="پیش‌نمایش تصویر"
        className="hidden w-full max-h-48 object-cover rounded-xl border border-primary-100"
        onError={(e) => e.currentTarget.classList.add("hidden")}
      />
    </div>
  );
};

export default ProductForm;
