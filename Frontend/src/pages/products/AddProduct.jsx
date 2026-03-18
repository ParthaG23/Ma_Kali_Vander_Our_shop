import { useEffect, useState, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useDropzone } from 'react-dropzone';
import {
  RiShoppingBasketLine, RiArrowLeftLine, RiPriceTag3Line,
  RiImageAddLine, RiCloseLine, RiCheckLine,
} from 'react-icons/ri';
import { createProduct, updateProduct, fetchProductById } from '../../services/productService';
import { uploadImage } from '../../services/uploadService';
import FormField from '../../components/ui/FormField';
import toast from 'react-hot-toast';

const CATEGORIES = ['Grains', 'Vegetables', 'Fruits', 'Dairy', 'Spices', 'Beverages', 'Snacks', 'General'];
const UNITS = ['kg', 'g', 'litre', 'ml', 'piece', 'dozen', 'packet'];

const ImageUploader = ({ value, onChange }) => {
  const [uploading, setUploading] = useState(false);
  const [preview,   setPreview]   = useState(value?.url || '');

  const onDrop = useCallback(async (acceptedFiles) => {
    const file = acceptedFiles[0];
    if (!file) return;
    setPreview(URL.createObjectURL(file));
    setUploading(true);
    try {
      const result = await uploadImage(file);
      onChange(result);
      toast.success('Image uploaded');
    } catch {
      toast.error('Image upload failed');
      setPreview(value?.url || '');
    } finally { setUploading(false); }
  }, [value, onChange]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': ['.jpg', '.jpeg', '.png', '.webp'] },
    maxFiles: 1,
    maxSize: 5 * 1024 * 1024,
  });

  const remove = (e) => {
    e.stopPropagation();
    setPreview('');
    onChange(null);
  };

  return (
    <div>
      {preview ? (
        <div className="relative rounded-2xl overflow-hidden border border-stone-200 bg-stone-50">
          <img src={preview} alt="Product" className="w-full h-48 object-cover" />
          {uploading && (
            <div className="absolute inset-0 bg-white/70 flex items-center justify-center">
              <span className="w-6 h-6 border-2 border-sage-700/30 border-t-sage-700 rounded-full animate-spin" />
            </div>
          )}
          {!uploading && (
            <div className="absolute top-2 right-2 flex gap-1.5">
              <div className="w-7 h-7 rounded-full bg-sage-600 flex items-center justify-center">
                <RiCheckLine className="text-white text-sm" />
              </div>
              <button onClick={remove}
                className="w-7 h-7 rounded-full bg-red-500 flex items-center justify-center">
                <RiCloseLine className="text-white text-sm" />
              </button>
            </div>
          )}
        </div>
      ) : (
        <div {...getRootProps()}
          className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all
            ${isDragActive
              ? 'border-sage-400 bg-sage-50'
              : 'border-stone-200 hover:border-sage-300 hover:bg-stone-50'}`}>
          <input {...getInputProps()} />
          <RiImageAddLine className="text-3xl text-stone-300 mx-auto mb-2" />
          <p className="text-sm font-medium text-stone-600">
            {isDragActive ? 'Drop image here' : 'Drag & drop or tap to upload'}
          </p>
          <p className="text-xs text-stone-400 mt-1">JPG, PNG, WEBP · max 5MB</p>
        </div>
      )}
    </div>
  );
};

const AddProduct = () => {
  const { id }           = useParams();
  const isEdit           = Boolean(id);
  const navigate         = useNavigate();
  const [form, setForm]  = useState({ name: '', category: 'General', price: '', stock: '', unit: 'kg' });
  const [image,   setImage]   = useState(null);
  const [loading, setLoading] = useState(false);
  const [errors,  setErrors]  = useState({});

  useEffect(() => {
    if (!isEdit) return;
    fetchProductById(id).then((r) => {
      const p = r.data.data;
      setForm({ name: p.name, category: p.category, price: p.price, stock: p.stock, unit: p.unit });
      if (p.image?.url) setImage(p.image);
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
      const payload = { ...form, image: image || { url: '', publicId: '' } };
      if (isEdit) { await updateProduct(id, payload); toast.success('Product updated'); }
      else        { await createProduct(payload);     toast.success('Product added'); }
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

          {/* Image upload */}
          <FormField label="Product Photo">
            <ImageUploader value={image} onChange={setImage} />
          </FormField>

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