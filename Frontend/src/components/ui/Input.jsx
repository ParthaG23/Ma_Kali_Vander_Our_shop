const Input = ({ label, error, className = '', ...props }) => (
  <div className={`flex flex-col gap-1 ${className}`}>
    {label && <label className="text-sm font-medium text-gray-700">{label}</label>}
    <input
      className={`w-full px-3 py-2.5 rounded-lg border text-sm text-gray-800 outline-none transition-colors bg-white
        ${error ? 'border-red-400 focus:border-red-500' : 'border-gray-200 focus:border-primary-500'}`}
      {...props}
    />
    {error && <span className="text-xs text-red-500">{error}</span>}
  </div>
);

export default Input;
