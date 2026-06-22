import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { MdPersonAdd, MdEdit, MdDelete, MdGroup } from "react-icons/md";
import { getTeam, deleteTeamMember } from "../services/teamService";
import Spinner from "../../../common/components/Spinner";
import DataTable from "../../../common/components/DataTable";
import ConfirmDialog from "../../../common/components/ConfirmDialog";

const TeamList = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [deleteId, setDeleteId] = useState(null);

  const {
    data: team,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["team"],
    queryFn: getTeam,
  });

  const deleteMutation = useMutation({
    mutationFn: deleteTeamMember,
    onSuccess: () => {
      toast.success("عضو با موفقیت حذف شد");
      queryClient.invalidateQueries({ queryKey: ["team"] });
      setDeleteId(null);
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || "خطا در حذف");
      setDeleteId(null);
    },
  });

  const columns = [
    {
      key: "name",
      title: "نام",
      dataIndex: "name",
    },
    {
      key: "role",
      title: "سمت",
      render: (record) => (
        <span className="inline-flex items-center px-2.5 py-1 rounded-lg bg-primary-50 text-primary-600 text-xs font-medium">
          {record.role}
        </span>
      ),
    },
    {
      key: "email",
      title: "ایمیل",
      render: (record) => (
        <span className="text-primary-400 text-sm">{record.email || "—"}</span>
      ),
    },
    {
      key: "actions",
      title: "عملیات",
      render: (record) => (
        // On mobile these buttons fill the full width side by side
        <div className="flex items-center gap-2 w-full">
          <button
            onClick={() => navigate(`/admin/team/${record.id}/edit`)}
            className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs
                       font-medium text-primary-600 bg-primary-50 hover:bg-primary-100
                       transition-colors flex-1 md:flex-none"
          >
            <MdEdit size={15} />
            ویرایش
          </button>
          <button
            onClick={() => setDeleteId(record.id)}
            className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs
                       font-medium text-red-500 bg-red-50 hover:bg-red-100
                       transition-colors flex-1 md:flex-none"
          >
            <MdDelete size={15} />
            حذف
          </button>
        </div>
      ),
    },
  ];

  if (isLoading) return <Spinner />;

  if (isError)
    return (
      <div className="rounded-xl bg-red-50 border border-red-200 px-5 py-4 text-red-700 text-sm">
        خطا در دریافت اطلاعات: {error.message}
      </div>
    );

  return (
    <div className="flex flex-col gap-6" dir="rtl">
      {/* ── Page header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-primary-900 text-xl font-semibold">اعضای تیم</h1>
          <p className="text-primary-400 text-sm mt-0.5">
            {team.length} عضو در سیستم ثبت شده
          </p>
        </div>
        {/* On mobile button fills full width, sm+ auto width */}
        <button
          onClick={() => navigate("/admin/team/new")}
          className="flex items-center justify-center gap-2 w-full sm:w-auto
                     px-4 py-2.5 rounded-xl text-sm font-medium
                     bg-primary-600 text-primary-50 hover:bg-primary-800 transition-colors"
        >
          <MdPersonAdd size={18} />
          افزودن عضو جدید
        </button>
      </div>

      {/* ── Empty state ── */}
      {team.length === 0 ? (
        <div
          className="rounded-2xl bg-white border border-primary-100 py-16
                        flex flex-col items-center gap-4"
        >
          <div className="w-14 h-14 rounded-full bg-primary-50 flex items-center justify-center">
            <MdGroup size={28} className="text-primary-300" />
          </div>
          <div className="text-center">
            <p className="text-primary-800 font-medium text-sm">
              هیچ عضوی وجود ندارد
            </p>
            <p className="text-primary-400 text-xs mt-1">
              اولین عضو تیم را اضافه کنید
            </p>
          </div>
          <button
            onClick={() => navigate("/admin/team/new")}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium
                       bg-primary-600 text-primary-50 hover:bg-primary-800 transition-colors"
          >
            <MdPersonAdd size={16} />
            افزودن عضو
          </button>
        </div>
      ) : (
        <DataTable columns={columns} data={team} />
      )}

      {/* ── Confirm delete dialog ── */}
      <ConfirmDialog
        isOpen={deleteId !== null}
        message="آیا از حذف این عضو مطمئن هستید؟ این عمل قابل بازگشت نیست."
        onCancel={() => setDeleteId(null)}
        onConfirm={() => deleteMutation.mutate(deleteId)}
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
};

export default TeamList;
