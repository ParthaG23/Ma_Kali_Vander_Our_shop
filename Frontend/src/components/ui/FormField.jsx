const FormField = ({ label, error, required, children, hint }) => (
  <div className="flex flex-col gap-1.5">
    {label && (
      <label className="text-sm font-medium text-stone-700">
        {label}
        {required && <span className="text-red-400 ml-0.5">*</span>}
      </label>
    )}
    {children}
    {hint && !error && <div className="text-xs text-stone-400">{hint}</div>}
    {error && <div className="text-xs text-red-500 flex items-center gap-1">⚠ {error}</div>}
  </div>
);

export default FormField;
