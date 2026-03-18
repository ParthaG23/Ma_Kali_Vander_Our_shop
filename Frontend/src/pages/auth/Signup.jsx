import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { RiMailLine, RiLockPasswordLine, RiUserLine, RiLeafLine, RiEyeLine, RiEyeOffLine } from 'react-icons/ri';
import { registerUser } from '../../services/authService';
import useAuth from '../../hooks/useAuth';
import toast from 'react-hot-toast';

const PasswordStrength = ({ password }) => {
  const score = [/.{6,}/, /[A-Z]/, /[0-9]/, /[^A-Za-z0-9]/].filter((r) => r.test(password)).length;
  const colors = ['bg-stone-200', 'bg-red-400', 'bg-amber-400', 'bg-sage-400', 'bg-sage-600'];
  const labels = ['', 'Weak', 'Fair', 'Good', 'Strong'];
  if (!password) return null;
  return (
    <div className="mt-2">
      <div className="flex gap-1 mb-1">
        {[1,2,3,4].map((i) => (
          <div key={i} className={`h-1 flex-1 rounded-full transition-all duration-300 ${i <= score ? colors[score] : 'bg-stone-200'}`} />
        ))}
      </div>
      <div className={`text-xs ${score < 2 ? 'text-red-500' : score < 4 ? 'text-amber-600' : 'text-sage-600'}`}>{labels[score]}</div>
    </div>
  );
};

const Signup = () => {
  const { login } = useAuth();
  const navigate  = useNavigate();
  const [form, setForm]       = useState({ name: '', email: '', password: '', confirm: '' });
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState('');

  const set = (k) => (e) => { setForm({ ...form, [k]: e.target.value }); setError(''); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirm) return setError('Passwords do not match');
    if (form.password.length < 6)      return setError('Password must be at least 6 characters');
    setLoading(true);
    try {
      const { data } = await registerUser({ name: form.name, email: form.email, password: form.password });
      login(data.data); toast.success('Account created!'); navigate('/dashboard', { replace: true });
    } catch (err) { setError(err.response?.data?.message || 'Registration failed'); }
    finally { setLoading(false); }
  };

  const inputCls = 'w-full pl-11 pr-4 py-3.5 rounded-xl border border-stone-200 bg-white text-sm text-stone-800 placeholder-stone-400 outline-none transition-all focus:border-sage-400 focus:ring-2 focus:ring-sage-100';

  return (
    <div className="min-h-screen bg-parchment flex items-start sm:items-center justify-center p-5 pt-10 sm:pt-5">
      <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}
        className="w-full max-w-sm">
        <div className="text-center mb-7">
          <div className="inline-flex items-center gap-2 mb-4">
            <div className="w-9 h-9 bg-sage-700 rounded-xl flex items-center justify-center">
              <RiLeafLine className="text-white" />
            </div>
            <span className="font-display text-xl font-bold text-stone-900">Ma Kali Vander</span>
          </div>
          <h2 className="font-display text-2xl font-bold text-stone-900 mb-1">Create account</h2>
          <p className="text-sm text-stone-500">Join to manage your shop</p>
        </div>

        <div className="card p-5 sm:p-7">
          {error && (
            <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
              className="flex items-start gap-2 bg-red-50 border border-red-100 rounded-xl px-4 py-3 mb-5 text-sm text-red-600">
              <span className="flex-shrink-0">⚠</span><span>{error}</span>
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3.5">
            <div className="relative">
              <RiUserLine className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none" />
              <input type="text" placeholder="Full name" required className={inputCls}
                value={form.name} onChange={set('name')} />
            </div>
            <div className="relative">
              <RiMailLine className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none" />
              <input type="email" placeholder="Email address" required className={inputCls}
                value={form.email} onChange={set('email')} />
            </div>
            <div>
              <div className="relative">
                <RiLockPasswordLine className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none" />
                <input type={showPwd ? 'text' : 'password'} placeholder="Password (min 6 chars)" required
                  className="w-full pl-11 pr-11 py-3.5 rounded-xl border border-stone-200 bg-white text-sm text-stone-800 placeholder-stone-400 outline-none transition-all focus:border-sage-400 focus:ring-2 focus:ring-sage-100"
                  value={form.password} onChange={set('password')} />
                <button type="button" onClick={() => setShowPwd(!showPwd)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600">
                  {showPwd ? <RiEyeOffLine /> : <RiEyeLine />}
                </button>
              </div>
              <PasswordStrength password={form.password} />
            </div>
            <div className="relative">
              <RiLockPasswordLine className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none" />
              <input type="password" placeholder="Confirm password" required className={inputCls}
                value={form.confirm} onChange={set('confirm')} />
            </div>
            <motion.button type="submit" disabled={loading} whileTap={{ scale: 0.98 }}
              className="w-full flex items-center justify-center gap-2 py-3.5 bg-sage-700 hover:bg-sage-800 text-white text-sm font-semibold rounded-xl transition-colors disabled:opacity-50 mt-1">
              {loading && <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
              {loading ? 'Creating…' : 'Create Account'}
            </motion.button>
          </form>
        </div>

        <p className="text-center text-sm text-stone-500 mt-5">
          Already have an account?{' '}
          <Link to="/login" className="font-medium text-sage-700 hover:text-sage-900 underline underline-offset-2">Sign in</Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Signup;
