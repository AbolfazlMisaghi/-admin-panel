import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import {
  MdAdd,
  MdEdit,
  MdDelete,
  MdArticle,
  MdCheckCircle,
  MdEditNote,
} from "react-icons/md";
import { getArticles, deleteArticle } from "../services/articleService";
import Spinner from "../../../common/components/Spinner";
import DataTable from "../../../common/components/DataTable";
import ConfirmDialog from "../../../common/components/ConfirmDialog";

// Renders published/draft status as a styled badge
const StatusBadge = ({ status }) => {
  const isPublished = status === "published";
  return (
    <span
      className={[
        "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium",
        isPublished
          ? "bg-accent-50 text-accent-400"
          : "bg-primary-50 text-primary-400",
      ].join(" ")}
    >
      {isPublished ? <MdCheckCircle size={13} /> : <MdEditNote size={13} />}
      {isPublished ? "منتشر شده" : "پیش‌نویس"}
    </span>
  );
};

// Formats ISO date string to Persian locale
const PersianDate = ({ date }) => (
  <span className="text-primary-400 text-sm">
    {new Date(date).toLocaleDateString("fa-IR")}
  </span>
);

// Edit and delete action buttons for each row
const RowActions = ({ record, onEdit, onDelete }) => (
  <div className="flex items-center gap-2 w-full">
    <button
      onClick={() => onEdit(record.id)}
      className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium text-primary-600 bg-primary-50 hover:bg-primary-100 transition-colors flex-1 md:flex-none"
    >
      <MdEdit size={15} />
      ویرایش
    </button>
    <button
      onClick={() => onDelete(record.id)}
      className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium text-red-500 bg-red-50 hover:bg-red-100 transition-colors flex-1 md:flex-none"
    >
      <MdDelete size={15} />
      حذف
    </button>
  </div>
);

const ArticleList = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [deleteId, setDeleteId] = useState(null);

  const {
    data: articles,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["articles"],
    queryFn: getArticles,
  });

  const deleteMutation = useMutation({
    mutationFn: deleteArticle,
    onSuccess: () => {
      toast.success("مقاله با موفقیت حذف شد");
      queryClient.invalidateQueries({ queryKey: ["articles"] });
      setDeleteId(null);
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || "خطا در حذف");
      setDeleteId(null);
    },
  });

  const handleEdit = (id) => navigate("/admin/articles/" + id + "/edit");
  const handleDelete = (id) => setDeleteId(id);

  const columns = [
    {
      key: "title",
      title: "عنوان مقاله",
      render: (record) => (
        <div className="flex items-center gap-3">
          {/* Article thumbnail or fallback icon */}
          {record.image ? (
            <img
              src={record.image}
              alt={record.title}
              className="w-9 h-9 rounded-xl object-cover border border-primary-100 shrink-0"
            />
          ) : (
            <div className="w-9 h-9 rounded-xl bg-primary-50 border border-primary-100 flex items-center justify-center shrink-0">
              <MdArticle size={18} className="text-primary-300" />
            </div>
          )}
          <div className="flex flex-col gap-0.5">
            <span className="text-primary-900 font-medium text-sm">
              {record.title}
            </span>
            {/* Slug shown as subtitle on desktop */}
            {record.slug && (
              <span className="text-primary-300 text-xs hidden md:block">
                {"/" + record.slug}
              </span>
            )}
          </div>
        </div>
      ),
    },
    {
      key: "status",
      title: "وضعیت",
      render: (record) => <StatusBadge status={record.status} />,
    },
    {
      key: "createdAt",
      title: "تاریخ ایجاد",
      render: (record) => <PersianDate date={record.createdAt} />,
    },
    {
      key: "actions",
      title: "عملیات",
      render: (record) => (
        <RowActions
          record={record}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      ),
    },
  ];

  if (isLoading) return <Spinner />;

  if (isError)
    return (
      <div className="rounded-xl bg-red-50 border border-red-200 px-5 py-4 text-red-700 text-sm">
        {"خطا در دریافت مقالات: " + error.message}
      </div>
    );

  // Counts for the header subtitle
  const publishedCount = articles.filter(
    (a) => a.status === "published"
  ).length;
  const draftCount = articles.filter((a) => a.status === "draft").length;

  return (
    <div className="flex flex-col gap-6" dir="rtl">
      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-primary-900 text-xl font-semibold">مقالات</h1>
          {/* Summary counts */}
          <div className="flex items-center gap-3 mt-0.5">
            <p className="text-primary-400 text-sm">
              {articles.length + " مقاله"}
            </p>
            <span className="text-primary-200 text-xs">|</span>
            <p className="text-accent-400 text-sm flex items-center gap-1">
              <MdCheckCircle size={13} />
              {publishedCount + " منتشر شده"}
            </p>
            <span className="text-primary-200 text-xs">|</span>
            <p className="text-primary-400 text-sm flex items-center gap-1">
              <MdEditNote size={13} />
              {draftCount + " پیش‌نویس"}
            </p>
          </div>
        </div>
        <button
          onClick={() => navigate("/admin/articles/new")}
          className="flex items-center justify-center gap-2 w-full sm:w-auto px-4 py-2.5 rounded-xl text-sm font-medium bg-primary-600 text-primary-50 hover:bg-primary-800 transition-colors"
        >
          <MdAdd size={18} />
          مقاله جدید
        </button>
      </div>

      {/* Empty state */}
      {articles.length === 0 ? (
        <div className="rounded-2xl bg-white border border-primary-100 py-16 flex flex-col items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-primary-50 flex items-center justify-center">
            <MdArticle size={28} className="text-primary-300" />
          </div>
          <div className="text-center">
            <p className="text-primary-800 font-medium text-sm">
              هیچ مقاله‌ای وجود ندارد
            </p>
            <p className="text-primary-400 text-xs mt-1">
              اولین مقاله را بنویسید
            </p>
          </div>
          <button
            onClick={() => navigate("/admin/articles/new")}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium bg-primary-600 text-primary-50 hover:bg-primary-800 transition-colors"
          >
            <MdAdd size={16} />
            مقاله جدید
          </button>
        </div>
      ) : (
        <DataTable columns={columns} data={articles} />
      )}

      {/* Confirm delete dialog */}
      <ConfirmDialog
        isOpen={deleteId !== null}
        message="آیا از حذف این مقاله مطمئن هستید؟ این عمل قابل بازگشت نیست."
        onCancel={() => setDeleteId(null)}
        onConfirm={() => deleteMutation.mutate(deleteId)}
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
};

export default ArticleList;
