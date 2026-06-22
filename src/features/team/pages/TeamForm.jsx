import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  MdPerson,
  MdWork,
  MdEmail,
  MdImage,
  MdArrowForward,
  MdSave,
} from "react-icons/md";
import { teamSchema } from "../schemas/teamSchema";
import {
  getTeamMember,
  createTeamMember,
  updateTeamMember,
} from "../services/teamService";
import Spinner from "../../../common/components/Spinner";

// ── Reusable field wrapper — label + input slot + optional hint + error ──────
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

    {/* Hint shown only when there is no error */}
    {hint && !error && <p className="text-primary-300 text-xs">{hint}</p>}

    {/* Inline validation error */}
    {error && (
      <p className="text-red-500 text-xs flex items-center gap-1.5">
        <span className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0" />
        {error}
      </p>
    )}
  </div>
);

// ── Returns input className based on error state ─────────────────────────────
const inputCls = (hasError) =>
  [
    "w-full border rounded-xl px-4 py-2.5 text-sm text-primary-900",
    "placeholder-primary-200 focus:outline-none transition-colors",
    hasError
      ? "border-red-300 bg-red-50/40 focus:border-red-400"
      : "border-primary-100 bg-primary-50 focus:border-primary-600",
  ].join(" ");

// ────────────────────────────────────────────────────────────────────────────
const TeamForm = () => {
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
    resolver: zodResolver(teamSchema),
    defaultValues: { name: "", role: "", email: "", image: "" },
  });

  // Fetch member data only in edit mode
  const {
    data: member,
    isLoading: isLoadingMember,
    isError: isErrorMember,
  } = useQuery({
    queryKey: ["team", id],
    queryFn: () => getTeamMember(id),
    enabled: isEditMode,
  });

  // Populate form fields once member data is ready
  useEffect(() => {
    if (member) reset(member);
  }, [member, reset]);

  // Create mutation
  const createMutation = useMutation({
    mutationFn: createTeamMember,
    onSuccess: () => {
      toast.success("عضو جدید با موفقیت اضافه شد");
      queryClient.invalidateQueries({ queryKey: ["team"] });
      navigate("/admin/team");
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || "خطا در ذخیره");
    },
  });

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: (data) => updateTeamMember(id, data),
    onSuccess: () => {
      toast.success("اطلاعات عضو با موفقیت ویرایش شد");
      queryClient.invalidateQueries({ queryKey: ["team"] });
      navigate("/admin/team");
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || "خطا در ذخیره");
    },
  });

  // True while any async operation is in progress — disables the submit button
  const isBusy =
    isSubmitting || createMutation.isPending || updateMutation.isPending;

  const onSubmit = (data) => {
    const payload = { ...data };
    // Remove optional empty fields before sending to API
    if (!payload.email) delete payload.email;
    if (!payload.image) delete payload.image;
    isEditMode
      ? updateMutation.mutate(payload)
      : createMutation.mutate(payload);
  };

  // Cancel — go back to team list
  const handleCancel = () => navigate("/admin/team");

  // ── Loading state (edit mode only) ──
  if (isEditMode && isLoadingMember) return <Spinner />;

  // ── Error state (edit mode only) ──
  if (isEditMode && isErrorMember)
    return (
      <div className="rounded-xl bg-red-50 border border-red-200 px-5 py-4 text-red-700 text-sm">
        خطا در دریافت اطلاعات عضو. لطفاً دوباره تلاش کنید.
      </div>
    );

  // ────────────────────────────────────────────────────────────────────────────
  return (
    <div className="flex flex-col gap-6 max-w-2xl" dir="rtl">
      {/* ── Page header ── */}
      <div className="flex items-center gap-3">
        {/* Back button */}
        <button
          onClick={handleCancel}
          className="w-9 h-9 flex items-center justify-center rounded-xl
                     bg-white border border-primary-100 text-primary-400
                     hover:text-primary-700 hover:border-primary-300 transition-colors shrink-0"
          aria-label="بازگشت به لیست"
        >
          <MdArrowForward size={20} />
        </button>
        <div>
          <h1 className="text-primary-900 text-xl font-semibold">
            {isEditMode ? "ویرایش عضو" : "افزودن عضو جدید"}
          </h1>
          <p className="text-primary-400 text-sm mt-0.5">
            {isEditMode
              ? "اطلاعات عضو را ویرایش کنید"
              : "اطلاعات عضو جدید را وارد کنید"}
          </p>
        </div>
      </div>

      {/* ── Form card ── */}
      <div className="bg-white rounded-2xl border border-primary-100 p-5 sm:p-8">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-5"
          noValidate
        >
          {/* Required fields section label */}
          <p className="text-primary-400 text-xs font-medium uppercase tracking-wider">
            اطلاعات اصلی
          </p>

          {/* Name */}
          <FormField
            label="نام"
            required
            icon={MdPerson}
            error={errors.name?.message}
          >
            <input
              {...register("name")}
              placeholder="مثال: علی رضایی"
              className={inputCls(!!errors.name)}
            />
          </FormField>

          {/* Role */}
          <FormField
            label="سمت"
            required
            icon={MdWork}
            error={errors.role?.message}
          >
            <input
              {...register("role")}
              placeholder="مثال: توسعه‌دهنده فرانت‌اند"
              className={inputCls(!!errors.role)}
            />
          </FormField>

          {/* Divider */}
          <div className="border-t border-primary-50 pt-1">
            <p className="text-primary-400 text-xs font-medium uppercase tracking-wider">
              اطلاعات تکمیلی
            </p>
          </div>

          {/* Email — optional */}
          <FormField
            label="ایمیل"
            icon={MdEmail}
            error={errors.email?.message}
            hint="در صورت وارد کردن، باید فرمت معتبر داشته باشد"
          >
            <input
              {...register("email")}
              type="email"
              placeholder="example@domain.com"
              className={inputCls(!!errors.email)}
              dir="ltr"
            />
          </FormField>

          {/* Image URL — optional */}
          <FormField
            label="آدرس تصویر"
            icon={MdImage}
            error={errors.image?.message}
            hint="آدرس URL تصویر پروفایل عضو"
          >
            <input
              {...register("image")}
              placeholder="https://example.com/avatar.jpg"
              className={inputCls(!!errors.image)}
              dir="ltr"
            />
          </FormField>

          {/* ── Action buttons ── */}
          {/* Stack on mobile, side by side on sm+ */}
          <div className="flex flex-col-reverse sm:flex-row gap-3 pt-2">
            {/* Cancel button */}
            <button
              type="button"
              onClick={handleCancel}
              disabled={isBusy}
              className="flex-1 sm:flex-none sm:w-32 flex items-center justify-center
                         gap-2 px-4 py-2.5 rounded-xl text-sm font-medium
                         text-primary-600 bg-primary-50 hover:bg-primary-100
                         transition-colors disabled:opacity-50"
            >
              انصراف
            </button>

            {/* Submit button */}
            <button
              type="submit"
              disabled={isBusy}
              className="flex-1 sm:flex-none sm:w-40 flex items-center justify-center
                         gap-2 px-4 py-2.5 rounded-xl text-sm font-medium
                         bg-primary-600 text-primary-50 hover:bg-primary-800
                         transition-colors disabled:bg-primary-200 disabled:cursor-not-allowed"
            >
              {isBusy ? (
                // Mini spinner inside button
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

export default TeamForm;
