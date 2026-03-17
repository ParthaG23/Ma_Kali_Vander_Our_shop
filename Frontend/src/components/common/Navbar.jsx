import useAuth from '../../hooks/useAuth';

const Navbar = ({ title }) => {
  const { user, isAdmin } = useAuth();
  return (
    <header className="flex items-center justify-between pb-5 mb-6 border-b border-gray-100 px-4 sm:px-0">
      <h1 className="text-xl font-bold text-gray-900 truncate min-w-0 mr-3">
        {title}
      </h1>
      <div className="flex items-center gap-3 flex-shrink-0">
        {isAdmin && (
          <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-primary-100 text-primary-700">
            Admin
          </span>
        )}
        <span className="text-sm text-gray-400 truncate max-w-[140px] sm:max-w-none">
          {user?.email}
        </span>
      </div>
    </header>
  );
};

export default Navbar;