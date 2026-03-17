import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { RiShoppingBasketLine, RiArrowLeftLine, RiPriceTag3Line } from 'react-icons/ri';
import { createProduct, updateProduct, fetchProductById } from '../../services/productService';
import FormField from '../../components/ui/FormField';
import toast from 'react-hot-toast';

const CATEGORIES = ['Grains', 'Vegetables', 'Fruits', 'Dairy', 'Spices', 'Beverages', 'Snacks', 'General'];
const UNITS = ['kg', 'g', 'litre', 'ml', 'piece', 'dozen', 'packet'];

const AddProduct = () => {
  const { id }           = useParams();
  const isEdit           = Boolean(id);
  const navigate         = useNavigate();
  const [form, setForm]  = useState({ name: '', category: 'General', price: '', stock: '', unit: 'kg' });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors]   = useState({});

  useEffect(() => {
    if (!isEdit) return;
    fetchProductById(id).then((r) => {
      const p = r.data.data;
      setForm({ name: p.name, category: p.category, price: p.price, stock: p.stock, unit: p.unit });
    }).catch(() => toast.error('Failed to load product'));
  }, [id]);

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Product name is required';
    if (!form.price || Number(form.price) < 0) e.price = 'Valid price is required';
    if (form.stock === '' || Number(form.stock) < 0) e.stock = 'Valid stock is required';
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const e2 = validate();
    if (Object.keys(e2).length) return setErrors(e2);
    setLoading(true);
    try {
      if (isEdit) { await updateProduct(id, form); toast.success('Product updated'); }
      else        { await createProduct(form);     toast.success('Product added'); }
      navigate('/products');
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
          <div className="text-xs text-stone-400 uppercase tracking-widest font-medium mb-0.5">Products</div>
          <h1 className="page-title">{isEdit ? 'Edit Product' : 'Add Product'}</h1>
        </div>
      </div>

      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="card p-5 sm:p-6">
        <form onSubmit={handleSubmit} className="space-y-4">

          <FormField label="Product Name" required error={errors.name}>
            <div className="relative">
              <RiShoppingBasketLine className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" />
              <input type="text" placeholder="Basmati Rice"
                className={`input-base pl-11 text-base ${errors.name ? 'border-red-300' : ''}`}
                value={form.name} onChange={set('name')} required />
            </div>
          </FormField>

          <FormField label="Category">
            <select className="input-base appearance-none cursor-pointer text-base"
              value={form.category} onChange={set('category')}>
              {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
            </select>
          </FormField>

          <div className="grid grid-cols-2 gap-3">
            <FormField label="Price (₹)" required error={errors.price}>
              <div className="relative">
                <RiPriceTag3Line className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" />
                <input type="number" min="0" step="0.01" placeholder="0.00"
                  className={`input-base pl-11 text-base ${errors.price ? 'border-red-300' : ''}`}
                  value={form.price} onChange={set('price')} required />
              </div>
            </FormField>
            <FormField label="Stock" required error={errors.stock}>
              <input type="number" min="0" placeholder="0"
                className={`input-base text-base ${errors.stock ? 'border-red-300' : ''}`}
                value={form.stock} onChange={set('stock')} required />
            </FormField>
          </div>

          <FormField label="Unit">
            <select className="input-base appearance-none cursor-pointer text-base"
              value={form.unit} onChange={set('unit')}>
              {UNITS.map((u) => <option key={u}>{u}</option>)}
            </select>
          </FormField>

          {/* Buttons — stacked on mobile, side by side on desktop */}
          <div className="flex flex-col-reverse sm:flex-row gap-3 pt-3">
            <button type="button" onClick={() => navigate(-1)}
              className="btn-secondary w-full sm:w-auto px-6 py-3 justify-center">
              Cancel
            </button>
            <motion.button type="submit" disabled={loading} whileTap={{ scale: 0.97 }}
              className="btn-primary flex-1 justify-center py-3">
              {loading
                ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                : isEdit ? 'Update Product' : 'Add Product'}
            </motion.button>
          </div>

        </form>
      </motion.div>
    </div>
  );
};

export default AddProduct;