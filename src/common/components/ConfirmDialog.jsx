import { MdWarningAmber, MdClose } from "react-icons/md";

// Reusable confirm dialog for delete actions
// Props: isOpen, message, onCancel, onConfirm, isLoading
const ConfirmDialog = ({ isOpen, message, onCancel, onConfirm, isLoading }) => {
  if (!isOpen) return null;

  return (
    // Dark backdrop — clicking it cancels the action
    <div
      className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
      onClick={onCancel}
      dir="rtl"
    >
      {/* Dialog box — stop click from bubbling to backdrop */}
      <div
        className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6 flex flex-col gap-5"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            {/* Warning icon badge */}
            <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center shrink-0">
              <MdWarningAmber size={22} className="text-red-500" />
            </div>
            <p className="text-primary-900 font-medium text-sm">تأیید حذف</p>
          </div>
          {/* Close button */}
          <button
            onClick={onCancel}
            className="text-primary-300 hover:text-primary-600 transition-colors"
          >
            <MdClose size={20} />
          </button>
        </div>

        {/* Message */}
        <p className="text-primary-600 text-sm leading-6">{message}</p>

        {/* Action buttons */}
        <div className="flex gap-3 justify-end">
          <button
            onClick={onCancel}
            disabled={isLoading}
            className="px-4 py-2 rounded-xl text-sm text-primary-600 bg-primary-50
                       hover:bg-primary-100 transition-colors disabled:opacity-50"
          >
            انصراف
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className="px-4 py-2 rounded-xl text-sm text-white bg-red-500
                       hover:bg-red-600 transition-colors disabled:opacity-50
                       flex items-center gap-2"
          >
            {isLoading ? (
              // Mini spinner inside button while deleting
              <span className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
            ) : null}
            تأیید حذف
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;
