import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  RiArrowLeftLine, RiEditLine, RiDeleteBinLine,
  RiArrowUpLine, RiArrowDownLine, RiPhoneLine,
  RiMapPinLine, RiAddLine, RiSubtractLine, RiCalendarLine,
} from 'react-icons/ri';
import { fetchKhataById, addTransaction, deleteTransaction, deleteKhata } from '../../services/khataService';
import useAuth from '../../hooks/useAuth';
import Loader from '../../components/common/Loader';
import ConfirmModal from '../../components/common/ConfirmModal';
import { PageWrapper, FadeItem } from '../../components/common/PageWrapper';
import toast from 'react-hot-toast';

// ── Inline transaction entry form ─────────────────────────────────────────────
const TxForm = ({ onAdd }) => {
  const [type,    setType]    = useState('debit');
  const [amount,  setAmount]  = useState('');
  const [note,    setNote]    = useState('');
  const [date,    setDate]    = useState(new Date().toISOString().split('T')[0]);
  const [loading, setLoading] = useState(false);
  const [open,    setOpen]    = useState(false);

  const reset = () => { setAmount(''); setNote(''); setDate(new Date().toISOString().split('T')[0]); setOpen(false); };

  const submit = async (e) => {
    e.preventDefault();
    if (!amount || Number(amount) <= 0) return toast.error('Enter a valid amount');
    setLoading(true);
    try {
      await onAdd({ type, amount: Number(amount), note, date });
      toast.success(type === 'debit' ? 'Baki added ✓' : 'Payment recorded ✓');
      reset();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add entry');
    } finally { setLoading(false); }
  };

  return (
    <div>
      {!open ? (
        <motion.button onClick={() => setOpen(true)} whileTap={{ scale: 0.97 }}
          className="w-full flex items-center justify-center gap-2 py-3.5 border-2 border-dashed border-stone-200 rounded-xl text-sm text-stone-500 hover:border-sage-400 hover:text-sage-700 hover:bg-sage-50/40 transition-all font-medium">
          <RiAddLine className="text-base" /> Add New Entry
        </motion.button>
      ) : (
        <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
          className="border border-stone-200 rounded-2xl overflow-hidden shadow-sm">

          {/* Type selector */}
          <div className="grid grid-cols-2">
            <button type="button" onClick={() => setType('debit')}
              className={`flex items-center justify-center gap-1.5 py-3.5 text-xs sm:text-sm font-semibold transition-all
                ${type === 'debit' ? 'bg-red-600 text-white' : 'bg-stone-50 text-stone-500 hover:bg-stone-100'}`}>
              <RiAddLine className="text-base flex-shrink-0" />
              <span className="truncate">Debit (Baki badha)</span>
            </button>
            <button type="button" onClick={() => setType('credit')}
              className={`flex items-center justify-center gap-1.5 py-3.5 text-xs sm:text-sm font-semibold transition-all border-l border-stone-200
                ${type === 'credit' ? 'bg-sage-700 text-white' : 'bg-stone-50 text-stone-500 hover:bg-stone-100'}`}>
              <RiSubtractLine className="text-base flex-shrink-0" />
              <span className="truncate">Credit (Payment mila)</span>
            </button>
          </div>

          {/* Explanation banner */}
          <div className={`px-4 py-2 text-xs font-medium ${type === 'debit' ? 'bg-red-50 text-red-700' : 'bg-sage-50 text-sage-700'}`}>
            {type === 'debit'
              ? '📦 Customer bought goods — baki will INCREASE'
              : '💵 Customer paid money — baki will DECREASE'}
          </div>

          {/* Form fields */}
          <form onSubmit={submit} className="bg-white p-4 space-y-3">
            {/* Amount */}
            <div>
              <label className="text-xs font-semibold text-stone-500 uppercase tracking-wider mb-1.5 block">Amount (₹) *</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400 font-semibold text-sm">₹</span>
                <input
                  type="number" min="1" step="0.01" required
                  placeholder="0.00"
                  className="input-base pl-8 text-lg font-bold font-mono"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  autoFocus
                />
              </div>
              {amount && Number(amount) > 0 && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  className={`mt-2 text-center py-2 rounded-lg text-sm font-semibold
                    ${type === 'debit' ? 'bg-red-50 text-red-700' : 'bg-sage-50 text-sage-700'}`}>
                  {type === 'debit' ? '+ Baki' : '− Baki'}: ₹{Number(amount).toLocaleString('en-IN')}
                </motion.div>
              )}
            </div>

            {/* Note */}
            <div>
              <label className="text-xs font-semibold text-stone-500 uppercase tracking-wider mb-1.5 block">
                Item / Note {type === 'debit' ? '(e.g. Rice 5kg, Oil 2L)' : '(e.g. Cash payment)'}
              </label>
              <input
                placeholder={type === 'debit' ? 'Rice, Wheat, Oil…' : 'Cash, UPI, Cheque…'}
                className="input-base text-base"
                value={note}
                onChange={(e) => setNote(e.target.value)}
              />
            </div>

            {/* Date */}
            <div>
              <label className="text-xs font-semibold text-stone-500 uppercase tracking-wider mb-1.5 block">Date</label>
              <div className="relative">
                <RiCalendarLine className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" />
                <input type="date" className="input-base pl-11 text-base"
                  value={date} onChange={(e) => setDate(e.target.value)} />
              </div>
            </div>

            {/* Buttons */}
            <div className="flex gap-2 pt-1">
              <button type="button" onClick={reset} className="btn-secondary flex-1 py-3">Cancel</button>
              <motion.button type="submit" disabled={loading} whileTap={{ scale: 0.97 }}
                className={`flex-1 btn-base py-3 text-sm font-semibold text-white justify-center
                  ${type === 'debit' ? 'bg-red-600 hover:bg-red-700' : 'bg-sage-700 hover:bg-sage-800'}`}>
                {loading
                  ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  : type === 'debit' ? 'Add Baki Entry' : 'Record Payment'}
              </motion.button>
            </div>
          </form>
        </motion.div>
      )}
    </div>
  );
};

// ── Main Page ─────────────────────────────────────────────────────────────────
const KhataDetails = () => {
  const { id }            = useParams();
  const { isAdmin }       = useAuth();
  const navigate          = useNavigate();
  const [khata, setKhata] = useState(null);
  const [loading, setLoading] = useState(true);
  const [confirm, setConfirm] = useState({ open: false, type: null, id: null });

  const load = () =>
    fetchKhataById(id)
      .then((r) => setKhata(r.data.data))
      .finally(() => setLoading(false));

  useEffect(() => { load(); }, [id]);

  const handleAddTx = async (form) => {
    await addTransaction(id, form);
    load();
  };

  const handleDeleteTx = async () => {
    try {
      await deleteTransaction(id, confirm.txId);
      toast.success('Entry deleted');
      setConfirm({ open: false });
      load();
    } catch { toast.error('Failed to delete'); }
  };

  const handleDeleteKhata = async () => {
    try {
      await deleteKhata(id);
      toast.success('Khata deleted');
      navigate('/khata');
    } catch { toast.error('Failed to delete'); }
  };

  if (loading) return <Loader fullPage />;
  if (!khata)  return <div className="flex items-center justify-center h-64 text-stone-400">Khata not found</div>;

  const sorted  = [...khata.transactions].sort((a, b) => new Date(b.date) - new Date(a.date));
  const debits  = khata.transactions.filter((t) => t.type === 'debit').reduce((s, t) => s + t.amount, 0);
  const credits = khata.transactions.filter((t) => t.type === 'credit').reduce((s, t) => s + t.amount, 0);

  return (
    <PageWrapper>
      {/* ── Header ── */}
      <FadeItem>
        <div className="flex items-start justify-between gap-3 mb-7">
          <div className="flex items-start gap-3 min-w-0">
            <motion.button onClick={() => navigate(-1)} whileTap={{ scale: 0.9 }}
              className="btn-icon p-2.5 border border-stone-200 rounded-xl flex-shrink-0 mt-0.5">
              <RiArrowLeftLine />
            </motion.button>
            <div className="min-w-0">
              <h1 className="page-title truncate">{khata.customerName}</h1>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1">
                {khata.phone   && (
                  <span className="flex items-center gap-1 text-xs text-stone-400">
                    <RiPhoneLine className="flex-shrink-0" />{khata.phone}
                  </span>
                )}
                {khata.address && (
                  <span className="flex items-center gap-1 text-xs text-stone-400 truncate">
                    <RiMapPinLine className="flex-shrink-0" />{khata.address}
                  </span>
                )}
              </div>
            </div>
          </div>

          {isAdmin && (
            <div className="flex gap-2 flex-shrink-0">
              <Link to={`/admin/khata/edit/${id}`}
                className="btn-secondary gap-1.5 text-xs sm:text-sm px-2.5 sm:px-4 py-2 sm:py-2.5">
                <RiEditLine />
                <span className="hidden sm:inline">Edit Info</span>
              </Link>
              <button
                onClick={() => setConfirm({ open: true, type: 'khata' })}
                className="p-2.5 rounded-xl border border-red-100 text-red-400 hover:text-red-600 hover:bg-red-50 hover:border-red-200 transition-all">
                <RiDeleteBinLine />
              </button>
            </div>
          )}
        </div>
      </FadeItem>

      {/* ── Balance card ── */}
      <FadeItem>
        <div className={`rounded-2xl p-5 sm:p-6 mb-5 ${khata.totalBaki > 0 ? 'bg-red-600' : khata.totalBaki < 0 ? 'bg-sage-700' : 'bg-stone-700'}`}>
          <div className="text-sm font-medium text-white/70 mb-1">
            {khata.totalBaki > 0 ? 'Customer Owes You' : khata.totalBaki < 0 ? 'You Owe Customer (Advance)' : 'Account Settled ✓'}
          </div>
          <div className="text-4xl sm:text-5xl font-display font-bold text-white tracking-tight mb-4">
            ₹{Math.abs(khata.totalBaki).toLocaleString('en-IN')}
          </div>

          {/* Mini summary */}
          <div className="grid grid-cols-3 gap-2 sm:gap-3">
            <div className="bg-white/10 rounded-xl px-2 sm:px-3 py-2.5 text-center">
              <div className="text-xs text-white/60 mb-0.5">Total Baki</div>
              <div className="text-xs sm:text-sm font-bold font-mono text-white">
                ₹{debits.toLocaleString('en-IN')}
              </div>
            </div>
            <div className="bg-white/10 rounded-xl px-2 sm:px-3 py-2.5 text-center">
              <div className="text-xs text-white/60 mb-0.5">Total Paid</div>
              <div className="text-xs sm:text-sm font-bold font-mono text-white">
                ₹{credits.toLocaleString('en-IN')}
              </div>
            </div>
            <div className="bg-white/10 rounded-xl px-2 sm:px-3 py-2.5 text-center">
              <div className="text-xs text-white/60 mb-0.5">Entries</div>
              <div className="text-xs sm:text-sm font-bold text-white">{sorted.length}</div>
            </div>
          </div>
        </div>
      </FadeItem>

      {/* ── Add entry (admin only) ── */}
      {isAdmin && (
        <FadeItem className="mb-5">
          <TxForm onAdd={handleAddTx} />
        </FadeItem>
      )}

      {/* ── Transaction history ── */}
      <FadeItem>
        <div className="card overflow-hidden">
          <div className="px-4 sm:px-5 py-4 border-b border-stone-100 flex items-center justify-between">
            <h3 className="font-semibold text-stone-800 text-sm sm:text-base">Transaction History</h3>
            <span className="text-xs text-stone-400">{sorted.length} entries</span>
          </div>

          {sorted.length === 0 ? (
            <div className="py-14 text-center">
              <div className="text-3xl mb-2">📋</div>
              <div className="text-sm font-medium text-stone-600 mb-1">No entries yet</div>
              <div className="text-xs text-stone-400">Add a debit entry when customer buys something</div>
            </div>
          ) : (
            <div className="divide-y divide-stone-50">
              <AnimatePresence>
                {sorted.map((t, i) => (
                  <motion.div key={t._id}
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, x: -20 }}
                    transition={{ delay: i * 0.03 }}
                    className="flex items-center gap-2.5 sm:gap-3.5 px-4 sm:px-5 py-3.5 hover:bg-stone-50/80 group transition-colors"
                  >
                    {/* Icon */}
                    <div className={`w-8 h-8 sm:w-9 sm:h-9 rounded-xl flex items-center justify-center flex-shrink-0
                      ${t.type === 'debit' ? 'bg-red-50 text-red-500' : 'bg-sage-50 text-sage-600'}`}>
                      {t.type === 'debit'
                        ? <RiArrowUpLine className="text-sm" />
                        : <RiArrowDownLine className="text-sm" />}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-semibold text-stone-800 truncate">
                        {t.note || (t.type === 'debit' ? 'Purchase / Baki' : 'Payment received')}
                      </div>
                      <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 mt-0.5">
                        <span className={`text-xs font-medium px-1.5 py-0.5 rounded
                          ${t.type === 'debit' ? 'bg-red-50 text-red-600' : 'bg-sage-50 text-sage-600'}`}>
                          {t.type === 'debit' ? 'Debit' : 'Credit'}
                        </span>
                        <span className="text-xs text-stone-400">
                          {new Date(t.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </span>
                        {t.createdBy?.name && (
                          <span className="text-xs text-stone-400 hidden sm:inline">· {t.createdBy.name}</span>
                        )}
                      </div>
                    </div>

                    {/* Amount */}
                    <div className={`text-sm sm:text-base font-bold font-mono flex-shrink-0
                      ${t.type === 'debit' ? 'text-red-600' : 'text-sage-600'}`}>
                      {t.type === 'debit' ? '+' : '−'}₹{t.amount.toLocaleString('en-IN')}
                    </div>

                    {/* Delete — always visible on mobile, hover on desktop */}
                    {isAdmin && (
                      <motion.button
                        className="opacity-100 sm:opacity-0 sm:group-hover:opacity-100 p-1.5 sm:p-2 rounded-lg text-stone-300 hover:text-red-500 hover:bg-red-50 transition-all flex-shrink-0"
                        onClick={() => setConfirm({ open: true, type: 'tx', txId: t._id })}
                        title="Delete entry"
                      >
                        <RiDeleteBinLine className="text-sm" />
                      </motion.button>
                    )}
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>
      </FadeItem>

      {/* ── Confirm modals ── */}
      <ConfirmModal
        open={confirm.open && confirm.type === 'tx'}
        title="Delete this entry?"
        message="This transaction will be removed and the balance will be recalculated automatically."
        onConfirm={handleDeleteTx}
        onCancel={() => setConfirm({ open: false })}
      />
      <ConfirmModal
        open={confirm.open && confirm.type === 'khata'}
        title={`Delete ${khata.customerName}'s khata?`}
        message="All transactions will be permanently deleted. This cannot be undone."
        onConfirm={handleDeleteKhata}
        onCancel={() => setConfirm({ open: false })}
      />
    </PageWrapper>
  );
};

export default KhataDetails;