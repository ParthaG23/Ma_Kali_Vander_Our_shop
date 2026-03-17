const variants = {
  primary: 'bg-primary-600 hover:bg-primary-700 text-white',
  danger:  'bg-red-600 hover:bg-red-700 text-white',
  outline: 'border border-gray-200 bg-white hover:bg-gray-50 text-gray-700',
  ghost:   'bg-transparent hover:bg-gray-100 text-gray-600',
  google:  'border border-gray-200 bg-white hover:bg-gray-50 text-gray-700',
};

const Button = ({ children, variant = 'primary', loading = false, className = '', ...props }) => (
  <button
    className={`inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed ${variants[variant]} ${className}`}
    disabled={loading || props.disabled}
    {...props}
  >
    {loading ? (
      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
    ) : children}
  </button>
);

export default Button;
