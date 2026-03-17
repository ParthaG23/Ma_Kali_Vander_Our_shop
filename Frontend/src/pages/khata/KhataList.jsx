import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { RiSearchLine, RiAddLine, RiArrowRightLine, RiBookOpenLine, RiSortAsc } from 'react-icons/ri';
import { fetchAllKhata } from '../../services/khataService';
import useAuth from '../../hooks/useAuth';
import Loader from '../../components/common/Loader';
import EmptyState from '../../components/common/EmptyState';
import { PageWrapper, FadeItem } from '../../components/common/PageWrapper';

const KhataCard = ({ k, index }) => (
  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.04 }} whileHover={{ y: -2 }}>
    <Link to={`/khata/${k._id}`} className="card-hover flex items-center gap-3 p-3.5 sm:p-4 group">
      <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-sage-50 text-sage-700 flex items-center justify-center text-base font-bold flex-shrink-0 group-hover:bg-sage-100 transition-colors">
        {k.customerName[0].toUpperCase()}
      </div>
      <div className="flex-1 min-w-0">
        <div className="font-semibold text-stone-800 truncate text-sm">{k.customerName}</div>
        <div className="text-xs text-stone-400 mt-0.5 truncate">{k.phone || 'No phone'}</div>
      </div>
      <div className="text-right flex-shrink-0">
        <div className={`text-base font-extrabold font-mono ${k.totalBaki > 0 ? 'text-red-600' : 'text-sage-600'}`}>
          ₹{Math.abs(k.totalBaki).toLocaleString('en-IN')}
        </div>
        <div className={`text-[11px] font-medium mt-0.5 ${k.totalBaki > 0 ? 'text-red-400' : 'text-stone-400'}`}>
          {k.totalBaki > 0 ? '● due' : '✓ clear'}
        </div>
      </div>
      <RiArrowRightLine className="text-stone-200 group-hover:text-stone-400 transition-colors flex-shrink-0 hidden sm:block" />
    </Link>
  </motion.div>
);

const KhataList = () => {
  const { isAdmin }              = useAuth();
  const [khatas,    setKhatas]   = useState([]);
  const [filtered,  setFiltered] = useState([]);
  const [search,    setSearch]   = useState('');
  const [sort,      setSort]     = useState('name');
  const [loading,   setLoading]  = useState(true);

  useEffect(() => {
    fetchAllKhata().then((r) => { setKhatas(r.data.data); setFiltered(r.data.data); }).finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    let res = khatas.filter((k) =>
      k.customerName.toLowerCase().includes(search.toLowerCase()) ||
      (k.phone || '').includes(search)
    );
    if (sort === 'baki-high')     res = [...res].sort((a, b) => b.totalBaki - a.totalBaki);
    else if (sort === 'baki-low') res = [...res].sort((a, b) => a.totalBaki - b.totalBaki);
    else                          res = [...res].sort((a, b) => a.customerName.localeCompare(b.customerName));
    setFiltered(res);
  }, [search, sort, khatas]);

  if (loading) return <Loader fullPage />;

  const totalBaki = filtered.reduce((s, k) => s + k.totalBaki, 0);

  return (
    <PageWrapper>
      <FadeItem>
        <div className="flex items-center justify-between mb-5">
          <div>
            <div className="text-xs text-stone-400 uppercase tracking-widest font-medium mb-0.5">Ledger</div>
            <h1 className="page-title">Khata Book</h1>
          </div>
          {isAdmin && (
            <Link to="/admin/khata/add" className="btn-primary gap-1.5 text-xs sm:text-sm px-3 sm:px-5 py-2 sm:py-2.5">
              <RiAddLine /> <span className="hidden sm:inline">Add Customer</span><span className="sm:hidden">Add</span>
            </Link>
          )}
        </div>
      </FadeItem>

      {/* Stats strip */}
      <FadeItem>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 mb-5">
          {[
            { label: 'Customers',  val: filtered.length,                                           cls: 'text-stone-900' },
            { label: 'Total Baki', val: `₹${Math.abs(totalBaki).toLocaleString('en-IN')}`,         cls: totalBaki > 0 ? 'text-red-600' : 'text-sage-600' },
            { label: 'Pending',    val: filtered.filter((k) => k.totalBaki > 0).length,            cls: 'text-amber-600' },
            { label: 'Cleared',    val: filtered.filter((k) => k.totalBaki <= 0).length,           cls: 'text-sage-600' },
          ].map(({ label, val, cls }) => (
            <div key={label} className="card p-3 sm:p-4 text-center">
              <div className="text-[10px] sm:text-xs text-stone-400 uppercase tracking-wider font-medium">{label}</div>
              <div className={`text-lg sm:text-xl font-bold font-display mt-0.5 ${cls}`}>{val}</div>
            </div>
          ))}
        </div>
      </FadeItem>

      {/* Search + Sort */}
      <FadeItem>
        <div className="flex gap-2 mb-4">
          <div className="relative flex-1">
            <RiSearchLine className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400 text-sm" />
            <input className="input-base pl-10 text-sm" placeholder="Search name or phone…"
              value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <select value={sort} onChange={(e) => setSort(e.target.value)}
            className="input-base w-auto px-3 text-sm appearance-none cursor-pointer">
            <option value="name">A–Z</option>
            <option value="baki-high">High Baki</option>
            <option value="baki-low">Low Baki</option>
          </select>
        </div>
      </FadeItem>

      {/* Grid */}
      <FadeItem>
        {filtered.length === 0 ? (
          <EmptyState icon={RiBookOpenLine} title="No customers found"
            description={search ? 'Try a different search' : 'Add your first customer'}
            action={isAdmin && <Link to="/admin/khata/add" className="btn-primary text-sm">Add Customer</Link>} />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-2 sm:gap-3">
            <AnimatePresence>
              {filtered.map((k, i) => <KhataCard key={k._id} k={k} index={i} />)}
            </AnimatePresence>
          </div>
        )}
      </FadeItem>
    </PageWrapper>
  );
};

export default KhataList;