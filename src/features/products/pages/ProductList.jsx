import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import {
  MdAdd,
  MdEdit,
  MdDelete,
  MdInventory2,
  MdOpenInNew,
} from "react-icons/md";
import { getProducts, deleteProduct } from "../services/productService";
import Spinner from "../../../common/components/Spinner";
import DataTable from "../../../common/components/DataTable";
import ConfirmDialog from "../../../common/components/ConfirmDialog";

// Renders product image thumbnail or fallback icon
const ProductThumb = ({ image, name }) => {
  if (image) {
    return (
      <img
        src={image}
        alt={name}
        className="w-9 h-9 rounded-xl object-cover border border-primary-100 shrink-0"
      />
    );
  }
  return (
    <div className="w-9 h-9 rounded-xl bg-primary-50 border border-primary-100 flex items-center justify-center shrink-0">
      <MdInventory2 size={18} className="text-primary-300" />
    </div>
  );
};

// Renders external link or dash if no link exists
const ProductLink = ({ link }) => {
  if (!link) {
    return <span className="text-primary-300 text-sm">-</span>;
  }
  return (
    <a
      href={link}
      target="_blank"
      rel="noopener noreferrer"
      onClick={(e) => e.stopPropagation()}
      className="inline-flex items-center gap-1.5 text-primary-600 hover:text-primary-800 text-xs transition-colors"
    >
      <MdOpenInNew size={14} />
      مشاهده لینک
    </a>
  );
};

// Row action buttons — edit and delete
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

const ProductList = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [deleteId, setDeleteId] = useState(null);

  const {
    data: products,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["products"],
    queryFn: getProducts,
  });

  const deleteMutation = useMutation({
    mutationFn: deleteProduct,
    onSuccess: () => {
      toast.success("محصول با موفقیت حذف شد");
      queryClient.invalidateQueries({ queryKey: ["products"] });
      setDeleteId(null);
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || "خطا در حذف");
      setDeleteId(null);
    },
  });

  const handleEdit = (id) => navigate("/admin/products/" + id + "/edit");
  const handleDelete = (id) => setDeleteId(id);
  const handleConfirmDelete = () => deleteMutation.mutate(deleteId);
  const handleCancelDelete = () => setDeleteId(null);

  const columns = [
    {
      key: "name",
      title: "نام محصول",
      render: (record) => (
        <div className="flex items-center gap-3">
          <ProductThumb image={record.image} name={record.name} />
          <span className="text-primary-900 font-medium text-sm">
            {record.name}
          </span>
        </div>
      ),
    },
    {
      key: "description",
      title: "توضیحات",
      render: (record) => (
        <p className="text-primary-500 text-sm max-w-xs truncate">
          {record.description || "-"}
        </p>
      ),
    },
    {
      key: "link",
      title: "لینک",
      render: (record) => <ProductLink link={record.link} />,
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
        {"خطا در دریافت محصولات: " + error.message}
      </div>
    );

  return (
    <div className="flex flex-col gap-6" dir="rtl">
      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-primary-900 text-xl font-semibold">محصولات</h1>
          <p className="text-primary-400 text-sm mt-0.5">
            {products.length + " محصول در سیستم ثبت شده"}
          </p>
        </div>
        <button
          onClick={() => navigate("/admin/products/new")}
          className="flex items-center justify-center gap-2 w-full sm:w-auto px-4 py-2.5 rounded-xl text-sm font-medium bg-primary-600 text-primary-50 hover:bg-primary-800 transition-colors"
        >
          <MdAdd size={18} />
          افزودن محصول جدید
        </button>
      </div>

      {/* Empty state */}
      {products.length === 0 ? (
        <div className="rounded-2xl bg-white border border-primary-100 py-16 flex flex-col items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-primary-50 flex items-center justify-center">
            <MdInventory2 size={28} className="text-primary-300" />
          </div>
          <div className="text-center">
            <p className="text-primary-800 font-medium text-sm">
              هیچ محصولی وجود ندارد
            </p>
            <p className="text-primary-400 text-xs mt-1">
              اولین محصول را اضافه کنید
            </p>
          </div>
          <button
            onClick={() => navigate("/admin/products/new")}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium bg-primary-600 text-primary-50 hover:bg-primary-800 transition-colors"
          >
            <MdAdd size={16} />
            افزودن محصول
          </button>
        </div>
      ) : (
        <DataTable columns={columns} data={products} />
      )}

      {/* Confirm delete dialog */}
      <ConfirmDialog
        isOpen={deleteId !== null}
        message="آیا از حذف این محصول مطمئن هستید؟ این عمل قابل بازگشت نیست."
        onCancel={handleCancelDelete}
        onConfirm={handleConfirmDelete}
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
};

export default ProductList;
