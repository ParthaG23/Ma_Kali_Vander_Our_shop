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

const FloatingLabel = ({ label, icon: Icon, type = 'text', value, onChange, error, ...props }) => {
  const [show, setShow] = useState(false);
  const isPassword = type === 'password';
  return (
    <div className="relative">
      <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
        <Icon className={`text-base transition-colors ${value ? 'text-sage-500' : 'text-stone-400'}`} />
      </div>
      <input
        type={isPassword ? (show ? 'text' : 'password') : type}
        value={value}
        onChange={onChange}
        placeholder={label}
        className={`w-full pl-11 pr-${isPassword ? '11' : '4'} py-3.5 rounded-xl border text-sm text-stone-800 bg-white outline-none transition-all duration-200 placeholder-stone-400
          ${error ? 'border-red-300 bg-red-50/30' : 'border-stone-200 focus:border-sage-400 focus:ring-2 focus:ring-sage-100'}`}
        {...props}
      />
      {isPassword && (
        <button type="button" onClick={() => setShow(!show)}
          className="absolute inset-y-0 right-4 flex items-center text-stone-400 hover:text-stone-600 transition-colors">
          {show ? <RiEyeOffLine /> : <RiEyeLine />}
        </button>
      )}
    </div>
  );
};

const Login = () => {
  const { login } = useAuth();
  const navigate  = useNavigate();
  const [form, setForm]       = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [gLoading, setGLoading] = useState(false);
  const [error, setError]     = useState('');

  const set = (k) => (e) => { setForm({ ...form, [k]: e.target.value }); setError(''); };
  const redirect = (role) => navigate(role === 'admin' ? '/admin' : '/dashboard', { replace: true });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); setLoading(true);
    try {
      const { data } = await loginUser(form);
      login(data.data);
      toast.success(`Welcome back, ${data.data.name}!`);
      redirect(data.data.role);
    } catch (err) {
      const msg = err.response?.data?.message || 'Login failed. Check your connection.';
      setError(msg);
    } finally { setLoading(false); }
  };

  const handleGoogle = async () => {
    setError(''); setGLoading(true);
    try {
      const result  = await signInWithPopup(auth, googleProvider);
      const token   = await result.user.getIdToken();
      const { data } = await firebaseLogin(token);
      login(data.data);
      toast.success(`Welcome, ${data.data.name}!`);
      redirect(data.data.role);
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Google sign-in failed.';
      setError(msg);
    } finally { setGLoading(false); }
  };

  return (
    <div className="min-h-screen bg-parchment flex">
      {/* Left panel */}
      <motion.div
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="hidden lg:flex w-[45%] bg-sage-800 flex-col justify-between p-12 relative overflow-hidden"
      >
        {/* Background texture */}
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
            Track every baki, manage inventory, and keep our customers happy — all in one place.
          </p>
        </div>

        <div className="relative space-y-3">
          {[
            { label: 'Khata Book', desc: 'Track customer dues instantly' },
            { label: 'Smart Inventory', desc: 'Low stock alerts & catalog' },
            { label: 'Role-based Access', desc: 'Admin & staff permissions' },
          ].map(({ label, desc }) => (
            <div key={label} className="flex items-center gap-3 bg-white/10 rounded-xl px-4 py-3">
              <div className="w-2 h-2 rounded-full bg-sage-300 flex-shrink-0" />
              <div>
                <div className="text-sm font-semibold text-white">{label}</div>
                <div className="text-xs text-sage-300">{desc}</div>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="w-full max-w-sm"
        >
          <div className="lg:hidden flex items-center gap-2 mb-8">
            <div className="w-8 h-8 bg-sage-700 rounded-lg flex items-center justify-center">
              <RiLeafLine className="text-white text-sm" />
            </div>
            <span className="font-display text-lg font-bold text-stone-900">Ma Kali Vandar</span>
          </div>

          <h2 className="font-display text-2xl font-bold text-stone-900 mb-1">Sign in</h2>
          <p className="text-sm text-stone-500 mb-7">Enter your credentials to continue</p>

          {/* Error */}
          {error && (
            <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
              className="flex items-start gap-2.5 bg-red-50 border border-red-100 rounded-xl px-4 py-3 mb-5 text-sm text-red-600">
              <span className="mt-0.5 flex-shrink-0">⚠</span>
              <span>{error}</span>
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3.5 mb-5">
            <FloatingLabel label="Email address" icon={RiMailLine} type="email"
              value={form.email} onChange={set('email')} required />
            <FloatingLabel label="Password" icon={RiLockPasswordLine} type="password"
              value={form.password} onChange={set('password')} required />

            <motion.button type="submit" disabled={loading}
              whileTap={{ scale: 0.98 }}
              className="w-full btn-primary py-3.5 mt-1 justify-center text-sm font-semibold"
            >
              {loading
                ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                : 'Sign In'}
            </motion.button>
          </form>

          <div className="divider mb-5">or</div>

          <motion.button onClick={handleGoogle} disabled={gLoading}
            whileTap={{ scale: 0.98 }}
            className="w-full btn-secondary py-3 justify-center gap-3"
          >
            {gLoading
              ? <span className="w-4 h-4 border-2 border-stone-300 border-t-stone-600 rounded-full animate-spin" />
              : <FcGoogle className="text-lg" />}
            <span className="text-sm font-medium">Continue with Google</span>
          </motion.button>

          <p className="text-center text-sm text-stone-500 mt-6">
            No account?{' '}
            <Link to="/register" className="font-medium text-sage-700 hover:text-sage-900 underline underline-offset-2">
              Create one
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;
