import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  RiSearchLine, RiAddLine, RiEditLine, RiDeleteBinLine,
  RiShoppingBasket2Line, RiShoppingCartLine,
} from 'react-icons/ri';
import { fetchProducts, deleteProduct } from '../../services/productService';
import useAuth from '../../hooks/useAuth';
import Loader from '../../components/common/Loader';
import EmptyState from '../../components/common/EmptyState';
import ConfirmModal from '../../components/common/ConfirmModal';
import { PageWrapper, FadeItem } from '../../components/common/PageWrapper';
import toast from 'react-hot-toast';

const stockLevel = (stock) => {
  if (stock === 0) return { label: 'Out of stock', cls: 'badge-red' };
  if (stock < 5)   return { label: `${stock} left`,  cls: 'badge-red' };
  if (stock < 20)  return { label: `${stock} left`,  cls: 'badge-amber' };
  return               { label: `${stock} in stock`, cls: 'badge-green' };
};

// ── Product card (like the screenshot) ────────────────────────────────────────
const ProductCard = ({ p, isAdmin, onDelete, index }) => {
  const stock = stockLevel(p.stock);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ delay: index * 0.04 }}
      className="card overflow-hidden flex flex-col"
    >
      {/* Image */}
      <div className="relative bg-stone-50 aspect-square overflow-hidden">
        {p.image?.url ? (
          <img src={p.image.url} alt={p.name}
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-5xl font-bold text-stone-200">{p.name[0].toUpperCase()}</span>
          </div>
        )}

        {/* Discount badge — show if stock is low */}
        {p.stock < 5 && p.stock > 0 && (
          <div className="absolute top-2.5 left-2.5 bg-sage-700 text-white text-[10px] font-bold px-2 py-1 rounded-lg">
            LOW STOCK
          </div>
        )}

        {/* Admin actions overlay */}
        {isAdmin && (
          <div className="absolute top-2.5 right-2.5 flex flex-col gap-1.5">
            <Link to={`/admin/products/edit/${p._id}`}
              className="w-7 h-7 rounded-full bg-white/90 shadow flex items-center justify-center text-stone-500 hover:text-sage-700 transition-colors">
              <RiEditLine className="text-xs" />
            </Link>
            <button onClick={() => onDelete(p)}
              className="w-7 h-7 rounded-full bg-white/90 shadow flex items-center justify-center text-stone-500 hover:text-red-600 transition-colors">
              <RiDeleteBinLine className="text-xs" />
            </button>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-3 flex flex-col gap-2 flex-1">
        <div>
          <p className="text-[10px] text-stone-400 font-medium uppercase tracking-wider">{p.category}</p>
          <p className="text-sm font-semibold text-stone-800 leading-snug mt-0.5 line-clamp-2">{p.name}</p>
        </div>

        <div className="flex items-center justify-between mt-auto">
          <div>
            <span className="text-base font-bold text-stone-900 font-mono">₹{p.price}</span>
            <span className="text-xs text-stone-400 ml-1">/{p.unit}</span>
          </div>
          <span className={`${stock.cls} text-[10px]`}>{stock.label}</span>
        </div>

        <button
          disabled={p.stock === 0}
          className={`w-full py-2 rounded-xl text-sm font-semibold border transition-all
            ${p.stock === 0
              ? 'border-stone-200 text-stone-300 cursor-not-allowed'
              : 'border-sage-600 text-sage-700 hover:bg-sage-700 hover:text-white active:scale-[0.98]'}`}
        >
          {p.stock === 0 ? 'Out of Stock' : 'Add'}
        </button>
      </div>
    </motion.div>
  );
};

// ── Main page ─────────────────────────────────────────────────────────────────
const ProductList = () => {
  const { isAdmin }             = useAuth();
  const [products, setProducts] = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [search,   setSearch]   = useState('');
  const [cat,      setCat]      = useState('All');
  const [confirm,  setConfirm]  = useState({ open: false, id: null, name: '' });

  const load = () => fetchProducts().then((r) => setProducts(r.data.data)).finally(() => setLoading(false));
  useEffect(() => { load(); }, []);

  const categories = ['All', ...new Set(products.map((p) => p.category))].sort();
  const filtered   = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()) && (cat === 'All' || p.category === cat)
  );

  const handleDelete = async () => {
    try {
      await deleteProduct(confirm.id);
      toast.success(`"${confirm.name}" removed`);
      setProducts((prev) => prev.filter((p) => p._id !== confirm.id));
      setConfirm({ open: false });
    } catch { toast.error('Failed to delete'); }
  };

  if (loading) return <Loader fullPage />;

  return (
    <PageWrapper>
      <FadeItem>
        <div className="flex items-center justify-between mb-5">
          <div>
            <div className="text-xs text-stone-400 uppercase tracking-widest font-medium mb-0.5">Catalog</div>
            <h1 className="page-title">Products</h1>
          </div>
          {isAdmin && (
            <Link to="/admin/products/add"
              className="btn-primary gap-1.5 text-xs sm:text-sm px-3 sm:px-5 py-2 sm:py-2.5">
              <RiAddLine />
              <span className="hidden sm:inline">Add Product</span>
              <span className="sm:hidden">Add</span>
            </Link>
          )}
        </div>
      </FadeItem>

      {/* Filters */}
      <FadeItem className="space-y-3 mb-5">
        <div className="relative">
          <RiSearchLine className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400 text-sm" />
          <input className="input-base pl-10 text-sm" placeholder="Search products…"
            value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-thin">
          {categories.map((c) => (
            <button key={c} onClick={() => setCat(c)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium border whitespace-nowrap transition-all flex-shrink-0
                ${cat === c
                  ? 'bg-sage-700 text-white border-sage-700'
                  : 'bg-white text-stone-600 border-stone-200 hover:border-stone-300'}`}>
              {c}
            </button>
          ))}
        </div>
      </FadeItem>

      {/* Product grid */}
      <FadeItem>
        {filtered.length === 0 ? (
          <EmptyState icon={RiShoppingBasket2Line} title="No products found"
            description={search || cat !== 'All' ? 'Try changing filters' : 'Add your first product'}
            action={isAdmin && (
              <Link to="/admin/products/add" className="btn-primary text-sm">Add Product</Link>
            )} />
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
            <AnimatePresence>
              {filtered.map((p, i) => (
                <ProductCard
                  key={p._id}
                  p={p}
                  index={i}
                  isAdmin={isAdmin}
                  onDelete={(p) => setConfirm({ open: true, id: p._id, name: p.name })}
                />
              ))}
            </AnimatePresence>
          </div>
        )}
      </FadeItem>

      <ConfirmModal
        open={confirm.open}
        title={`Remove "${confirm.name}"?`}
        message="This product will be removed from your catalog."
        onConfirm={handleDelete}
        onCancel={() => setConfirm({ open: false })}
      />
    </PageWrapper>
  );
};

export default ProductList;