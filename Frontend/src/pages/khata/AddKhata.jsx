import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { RiUserLine, RiPhoneLine, RiMapPinLine, RiArrowLeftLine, RiMoneyDollarCircleLine } from 'react-icons/ri';
import { createKhata, fetchKhataById, updateKhata, addTransaction } from '../../services/khataService';
import FormField from '../../components/ui/FormField';
import toast from 'react-hot-toast';

const AddKhata = () => {
  const { id }            = useParams();
  const isEdit            = Boolean(id);
  const navigate          = useNavigate();
  const [form, setForm]   = useState({ customerName: '', phone: '', address: '' });
  const [openingBaki, setOpeningBaki] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors]   = useState({});

  useEffect(() => {
    if (!isEdit) return;
    fetchKhataById(id).then((r) => {
      const d = r.data.data;
      setForm({ customerName: d.customerName, phone: d.phone || '', address: d.address || '' });
    });
  }, [id]);

  const validate = () => {
    const e = {};
    if (!form.customerName.trim()) e.customerName = 'Customer name is required';
    if (openingBaki && Number(openingBaki) < 0) e.openingBaki = 'Amount cannot be negative';
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) return setErrors(errs);
    setLoading(true);
    try {
      if (isEdit) {
        await updateKhata(id, form);
        toast.success('Customer updated');
        navigate(`/khata/${id}`);
      } else {
        const { data } = await createKhata(form);
        const newId = data.data._id;
        if (openingBaki && Number(openingBaki) > 0) {
          await addTransaction(newId, {
            type: 'debit',
            amount: Number(openingBaki),
            note: 'Opening balance',
          });
        }
        toast.success('Customer added to khata book');
        navigate(`/khata/${newId}`);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save');
    } finally { setLoading(false); }
  };

  const set = (k) => (e) => { setForm({ ...form, [k]: e.target.value }); setErrors({ ...errors, [k]: '' }); };

  return (
    <div className="max-w-xl w-full">
      <div className="flex items-center gap-3 mb-7 pt-2">
        <motion.button onClick={() => navigate(-1)} whileTap={{ scale: 0.9 }}
          className="btn-icon p-2.5 border border-stone-200 rounded-xl flex-shrink-0">
          <RiArrowLeftLine />
        </motion.button>
        <div>
          <div className="text-xs text-stone-400 uppercase tracking-widest font-medium mb-0.5">Khata</div>
          <h1 className="page-title">{isEdit ? 'Edit Customer' : 'Add Customer'}</h1>
        </div>
      </div>

      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="card p-5 sm:p-6 space-y-5">
        <form onSubmit={handleSubmit} className="space-y-4">

          {/* Customer Name */}
          <FormField label="Customer Name" required error={errors.customerName}>
            <div className="relative">
              <RiUserLine className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none" />
              <input type="text" placeholder="e.g. Ramesh Kumar" required
                className={`input-base pl-11 text-base ${errors.customerName ? 'border-red-300' : ''}`}
                value={form.customerName}
                onChange={set('customerName')} />
            </div>
          </FormField>

          {/* Phone */}
          <FormField label="Phone Number" error={errors.phone}>
            <div className="relative">
              <RiPhoneLine className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none" />
              <input type="tel" placeholder="e.g. 9876543210"
                className="input-base pl-11 text-base"
                value={form.phone} onChange={set('phone')} />
            </div>
          </FormField>

          {/* Address */}
          <FormField label="Address" error={errors.address}>
            <div className="relative">
              <RiMapPinLine className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none" />
              <input type="text" placeholder="e.g. Street, Mohalla, Area"
                className="input-base pl-11 text-base"
                value={form.address} onChange={set('address')} />
            </div>
          </FormField>

          {/* Opening Baki — only on create */}
          {!isEdit && (
            <div className="pt-2 border-t border-stone-100">
              <FormField
                label="Opening Baki Amount (optional)"
                hint="How much does this customer already owe? Leave blank if starting fresh."
                error={errors.openingBaki}
              >
                <div className="relative">
                  <RiMoneyDollarCircleLine className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none" />
                  <input type="number" min="0" step="0.01" placeholder="₹ 0.00"
                    className={`input-base pl-11 text-base ${errors.openingBaki ? 'border-red-300' : ''}`}
                    value={openingBaki}
                    onChange={(e) => { setOpeningBaki(e.target.value); setErrors({ ...errors, openingBaki: '' }); }} />
                </div>
              </FormField>

              {openingBaki && Number(openingBaki) > 0 && (
                <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }}
                  className="mt-3 flex items-center justify-between bg-red-50 border border-red-100 rounded-xl px-4 py-3">
                  <div className="text-sm text-red-700 font-medium">Opening balance</div>
                  <div className="text-lg font-bold font-mono text-red-600">
                    ₹{Number(openingBaki).toLocaleString('en-IN')}
                  </div>
                </motion.div>
              )}
            </div>
          )}

          {/* Buttons */}
          <div className="flex flex-col-reverse sm:flex-row gap-3 pt-3">
            <button type="button" onClick={() => navigate(-1)}
              className="btn-secondary w-full sm:w-auto px-6 py-3 justify-center">
              Cancel
            </button>
            <motion.button type="submit" disabled={loading} whileTap={{ scale: 0.97 }}
              className="btn-primary flex-1 justify-center py-3">
              {loading
                ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                : isEdit ? 'Update Customer' : 'Add to Khata Book'}
            </motion.button>
          </div>

        </form>
      </motion.div>
    </div>
  );
};

export default AddKhata;