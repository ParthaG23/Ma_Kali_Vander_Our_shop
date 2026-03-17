import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { RiSearchLine, RiAddLine, RiEditLine, RiDeleteBinLine, RiShoppingBasket2Line } from 'react-icons/ri';
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
            <Link to="/admin/products/add" className="btn-primary gap-1.5 text-xs sm:text-sm px-3 sm:px-5 py-2 sm:py-2.5">
              <RiAddLine /> <span className="hidden sm:inline">Add Product</span><span className="sm:hidden">Add</span>
            </Link>
          )}
        </div>
      </FadeItem>

      {/* Filters */}
      <FadeItem className="space-y-3 mb-4">
        <div className="relative">
          <RiSearchLine className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400 text-sm" />
          <input className="input-base pl-10 text-sm" placeholder="Search products…"
            value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        {/* Category pills — horizontally scrollable on mobile */}
        <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-thin">
          {categories.map((c) => (
            <button key={c} onClick={() => setCat(c)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium border whitespace-nowrap transition-all flex-shrink-0
                ${cat === c ? 'bg-sage-700 text-white border-sage-700' : 'bg-white text-stone-600 border-stone-200 hover:border-stone-300'}`}>
              {c}
            </button>
          ))}
        </div>
      </FadeItem>

      {/* Mobile card view + Desktop table */}
      <FadeItem>
        {filtered.length === 0 ? (
          <EmptyState icon={RiShoppingBasket2Line} title="No products found"
            description={search || cat !== 'All' ? 'Try changing filters' : 'Add your first product'}
            action={isAdmin && <Link to="/admin/products/add" className="btn-primary text-sm">Add Product</Link>} />
        ) : (
          <>
            {/* Mobile: card list */}
            <div className="sm:hidden space-y-2">
              <AnimatePresence>
                {filtered.map((p) => {
                  const stock = stockLevel(p.stock);
                  return (
                    <motion.div key={p._id} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                      className="card p-4 flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-stone-100 text-stone-500 flex items-center justify-center text-sm font-semibold flex-shrink-0">
                        {p.name[0].toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-stone-800 text-sm truncate">{p.name}</div>
                        <div className="flex items-center gap-2 mt-1 flex-wrap">
                          <span className="badge-stone text-[10px]">{p.category}</span>
                          <span className={`${stock.cls} text-[10px]`}>{stock.label}</span>
                        </div>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <div className="font-bold text-sm font-mono text-stone-800">₹{p.price}</div>
                        <div className="text-xs text-stone-400">/{p.unit}</div>
                      </div>
                      {isAdmin && (
                        <div className="flex flex-col gap-1 flex-shrink-0">
                          <Link to={`/admin/products/edit/${p._id}`}
                            className="p-1.5 rounded-lg text-stone-400 hover:text-sage-700 hover:bg-sage-50 transition-colors">
                            <RiEditLine className="text-sm" />
                          </Link>
                          <button onClick={() => setConfirm({ open: true, id: p._id, name: p.name })}
                            className="p-1.5 rounded-lg text-stone-400 hover:text-red-600 hover:bg-red-50 transition-colors">
                            <RiDeleteBinLine className="text-sm" />
                          </button>
                        </div>
                      )}
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>

            {/* Desktop: table */}
            <div className="hidden sm:block card overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-stone-100 bg-stone-50/50">
                      <th className="table-th">Product</th>
                      <th className="table-th">Category</th>
                      <th className="table-th">Price</th>
                      <th className="table-th">Stock</th>
                      {isAdmin && <th className="table-th text-right">Actions</th>}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-50">
                    {filtered.map((p, i) => {
                      const stock = stockLevel(p.stock);
                      return (
                        <motion.tr key={p._id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }}
                          className="hover:bg-stone-50/80 transition-colors group">
                          <td className="table-td">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-xl bg-stone-100 text-stone-500 flex items-center justify-center text-sm font-semibold flex-shrink-0">
                                {p.name[0].toUpperCase()}
                              </div>
                              <span className="font-medium text-stone-800">{p.name}</span>
                            </div>
                          </td>
                          <td className="table-td"><span className="badge-stone">{p.category}</span></td>
                          <td className="table-td font-mono font-medium">₹{p.price}<span className="text-stone-400 font-sans text-xs">/{p.unit}</span></td>
                          <td className="table-td"><span className={stock.cls}>{stock.label}</span></td>
                          {isAdmin && (
                            <td className="table-td">
                              <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                <Link to={`/admin/products/edit/${p._id}`}
                                  className="p-2 rounded-lg text-stone-400 hover:text-sage-700 hover:bg-sage-50 transition-colors">
                                  <RiEditLine className="text-sm" />
                                </Link>
                                <button onClick={() => setConfirm({ open: true, id: p._id, name: p.name })}
                                  className="p-2 rounded-lg text-stone-400 hover:text-red-600 hover:bg-red-50 transition-colors">
                                  <RiDeleteBinLine className="text-sm" />
                                </button>
                              </div>
                            </td>
                          )}
                        </motion.tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              <div className="px-5 py-3 border-t border-stone-100 text-xs text-stone-400">
                {filtered.length} of {products.length} products
              </div>
            </div>
          </>
        )}
      </FadeItem>

      <ConfirmModal open={confirm.open} title={`Remove "${confirm.name}"?`}
        message="This product will be removed from your catalog."
        onConfirm={handleDelete} onCancel={() => setConfirm({ open: false })} />
    </PageWrapper>
  );
};

export default ProductList;