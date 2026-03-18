import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { signInWithPopup } from 'firebase/auth';
import { RiMailLine, RiLockPasswordLine, RiLeafLine, RiEyeLine, RiEyeOffLine } from 'react-icons/ri';
import { FcGoogle } from 'react-icons/fc';
import { auth, googleProvider } from '../../services/firebase';
import { loginUser, firebaseLogin } from '../../services/authService';
import useAuth from '../../hooks/useAuth';
import toast from 'react-hot-toast';

const FloatingInput = ({ label, icon: Icon, type = 'text', value, onChange, ...props }) => {
  const [show, setShow] = useState(false);
  const isPassword = type === 'password';
  return (
    <div className="relative">
      <Icon className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none z-10" />
      <input
        type={isPassword ? (show ? 'text' : 'password') : type}
        value={value} onChange={onChange} placeholder={label}
        className="w-full pl-11 pr-11 py-3.5 rounded-xl border border-stone-200 bg-white text-sm text-stone-800 placeholder-stone-400 outline-none transition-all focus:border-sage-400 focus:ring-2 focus:ring-sage-100"
        {...props}
      />
      {isPassword && (
        <button type="button" onClick={() => setShow(!show)}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600">
          {show ? <RiEyeOffLine /> : <RiEyeLine />}
        </button>
      )}
    </div>
  );
};

const Login = () => {
  const { login } = useAuth();
  const navigate  = useNavigate();
  const [form, setForm]         = useState({ email: '', password: '' });
  const [loading, setLoading]   = useState(false);
  const [gLoading, setGLoading] = useState(false);
  const [error, setError]       = useState('');

  const set = (k) => (e) => { setForm({ ...form, [k]: e.target.value }); setError(''); };
  const redirect = (role) => navigate(role === 'admin' ? '/admin' : '/dashboard', { replace: true });

  const handleSubmit = async (e) => {
    e.preventDefault(); setError(''); setLoading(true);
    try {
      const { data } = await loginUser(form);
      login(data.data); toast.success(`Welcome back, ${data.data.name}!`); redirect(data.data.role);
    } catch (err) { setError(err.response?.data?.message || 'Login failed. Check your connection.'); }
    finally { setLoading(false); }
  };

  const handleGoogle = async () => {
    setError(''); setGLoading(true);
    try {
      const result   = await signInWithPopup(auth, googleProvider);
      const token    = await result.user.getIdToken();
      const { data } = await firebaseLogin(token);
      login(data.data); toast.success(`Welcome, ${data.data.name}!`); redirect(data.data.role);
    } catch (err) { setError(err.response?.data?.message || err.message || 'Google sign-in failed.'); }
    finally { setGLoading(false); }
  };

  return (
    <div className="min-h-screen bg-parchment flex flex-col lg:flex-row">
      {/* Left panel — desktop only */}
      <motion.div
        initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}
        className="hidden lg:flex w-[45%] bg-sage-800 flex-col justify-between p-12 relative overflow-hidden"
      >
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '28px 28px' }} />
        <div className="relative">
          <div className="flex items-center gap-3 mb-16">
            <div className="w-9 h-9 bg-white/20 rounded-xl flex items-center justify-center">
              <RiLeafLine className="text-white text-lg" />
            </div>
            <span className="font-display text-xl font-bold text-white">Ma Kali Vandar</span>
          </div>
          <h1 className="font-display text-4xl font-bold text-white leading-tight mb-4">
           Everything you need for your shop,<br />in one place.
          </h1>
          <p className="text-sage-200 text-base leading-relaxed max-w-xs">
             Track every baki, manage inventory, and keep our customers happy — all
          </p>
        </div>
        <div className="relative space-y-3">
          {['Khata Book — Track customer dues instantly', 'Smart Inventory — Low stock alerts', 'Role-based Access — Admin & staff'].map((item) => (
            <div key={item} className="flex items-center gap-3 bg-white/10 rounded-xl px-4 py-3">
              <div className="w-2 h-2 rounded-full bg-sage-300 flex-shrink-0" />
              <span className="text-sm text-white/80">{item}</span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center p-5 sm:p-8 min-h-screen lg:min-h-0">
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.1 }}
          className="w-full max-w-sm"
        >
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center justify-center gap-2 mb-8">
            <div className="w-9 h-9 bg-sage-700 rounded-xl flex items-center justify-center">
              <RiLeafLine className="text-white" />
            </div>
            <span className="font-display text-xl font-bold text-stone-900">Ma Kali Vandar </span>
          </div>

          <h2 className="font-display text-2xl sm:text-3xl font-bold text-stone-900 mb-1">Sign in</h2>
          <p className="text-sm text-stone-500 mb-7">Enter your credentials to continue</p>

          {error && (
            <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
              className="flex items-start gap-2.5 bg-red-50 border border-red-100 rounded-xl px-4 py-3 mb-5 text-sm text-red-600">
              <span className="flex-shrink-0 mt-0.5">⚠</span><span>{error}</span>
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3.5 mb-5">
            <FloatingInput label="Email address" icon={RiMailLine} type="email"
              value={form.email} onChange={set('email')} required />
            <FloatingInput label="Password" icon={RiLockPasswordLine} type="password"
              value={form.password} onChange={set('password')} required />
            <motion.button type="submit" disabled={loading} whileTap={{ scale: 0.98 }}
              className="w-full flex items-center justify-center gap-2 py-3.5 bg-sage-700 hover:bg-sage-800 text-white text-sm font-semibold rounded-xl transition-colors disabled:opacity-50">
              {loading && <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
              {loading ? 'Signing in…' : 'Sign In'}
            </motion.button>
          </form>

          <div className="flex items-center gap-3 my-5">
            <div className="flex-1 h-px bg-stone-200" /><span className="text-xs text-stone-400">or</span><div className="flex-1 h-px bg-stone-200" />
          </div>

          <motion.button onClick={handleGoogle} disabled={gLoading} whileTap={{ scale: 0.98 }}
            className="w-full flex items-center justify-center gap-3 py-3.5 border border-stone-200 bg-white hover:bg-stone-50 rounded-xl text-sm font-medium text-stone-700 transition-colors disabled:opacity-50">
            {gLoading ? <span className="w-4 h-4 border-2 border-stone-300 border-t-stone-600 rounded-full animate-spin" /> : <FcGoogle className="text-lg" />}
            Continue with Google
          </motion.button>

          <p className="text-center text-sm text-stone-500 mt-6">
            No account?{' '}
            <Link to="/register" className="font-medium text-sage-700 hover:text-sage-900 underline underline-offset-2">Create one</Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;
