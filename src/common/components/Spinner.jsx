// Reusable loading spinner — used across all list pages
const Spinner = () => (
  <div className="flex items-center justify-center py-20">
    <div className="w-10 h-10 rounded-full border-4 border-primary-100 border-t-primary-600 animate-spin" />
  </div>
);

export default Spinner;
