import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { RiGroupLine, RiMoneyDollarCircleLine, RiShoppingBasket2Line, RiArrowRightLine, RiTimeLine } from 'react-icons/ri';
import { fetchAllKhata } from '../../services/khataService';
import { fetchProducts }  from '../../services/productService';
import useAuth from '../../hooks/useAuth';
import Loader from '../../components/common/Loader';
import StatCard from '../../components/ui/StatCard';
import { PageWrapper, FadeItem } from '../../components/common/PageWrapper';

const UserDashboard = () => {
  const { user }               = useAuth();
  const [khatas,   setKhatas]  = useState([]);
  const [products, setProducts]= useState([]);
  const [loading,  setLoading] = useState(true);

  useEffect(() => {
    Promise.all([fetchAllKhata(), fetchProducts()])
      .then(([k, p]) => { setKhatas(k.data.data); setProducts(p.data.data); })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loader fullPage />;

  const totalBaki = khatas.reduce((s, k) => s + k.totalBaki, 0);

  return (
    <PageWrapper>
      <FadeItem>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
          <div>
            <div className="text-sm text-stone-400 mb-0.5 font-medium">
              Good {new Date().getHours() < 12 ? 'morning' : new Date().getHours() < 17 ? 'afternoon' : 'evening'}
            </div>
            <h1 className="page-title">{user?.name} 👋</h1>
          </div>
          <div className="flex items-center gap-2 text-xs text-stone-400 bg-white rounded-xl px-3.5 py-2 border border-stone-100 shadow-sm self-start sm:self-auto">
            <RiTimeLine />
            <span>{new Date().toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' })}</span>
          </div>
        </div>
      </FadeItem>

      <FadeItem className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
        <StatCard label="Customers" value={khatas.length} sub="Active" icon={RiGroupLine} accent="sage" />
        <StatCard
          label="Total Baki"
          value={`₹${Math.abs(totalBaki).toLocaleString('en-IN')}`}
          sub="Outstanding"
          icon={RiMoneyDollarCircleLine}
          accent={totalBaki > 0 ? 'red' : 'sage'}
        />
        <div className="col-span-2 sm:col-span-1">
          <StatCard label="Products" value={products.length} sub="In catalog" icon={RiShoppingBasket2Line} accent="blue" />
        </div>
      </FadeItem>

      <FadeItem>
        <div className="card">
          <div className="flex items-center justify-between px-4 sm:px-5 pt-4 sm:pt-5 pb-3 sm:pb-4 border-b border-stone-50">
            <h2 className="font-semibold text-stone-800 text-sm sm:text-base">Customer Baki</h2>
            <Link to="/khata" className="flex items-center gap-1 text-xs font-medium text-sage-700 hover:text-sage-900">
              View all <RiArrowRightLine />
            </Link>
          </div>
          <div className="divide-y divide-stone-50">
            {khatas.slice(0, 7).map((k, i) => (
              <motion.div key={k._id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}>
                <Link to={`/khata/${k._id}`}
                  className="flex items-center gap-3 px-4 sm:px-5 py-3 hover:bg-stone-50/80 transition-colors group">
                  <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-sage-50 text-sage-700 flex items-center justify-center font-semibold text-sm flex-shrink-0">
                    {k.customerName[0].toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-stone-800 truncate">{k.customerName}</div>
                    <div className="text-xs text-stone-400 hidden sm:block">{k.phone || 'No phone'}</div>
                  </div>
                  <div className={`text-sm font-bold ${k.totalBaki > 0 ? 'text-red-600' : 'text-sage-600'}`}>
                    ₹{Math.abs(k.totalBaki).toLocaleString('en-IN')}
                  </div>
                  <RiArrowRightLine className="text-stone-300 flex-shrink-0 hidden sm:block" />
                </Link>
              </motion.div>
            ))}
            {khatas.length === 0 && <div className="py-10 text-center text-sm text-stone-400">No customers yet</div>}
          </div>
        </div>
      </FadeItem>
    </PageWrapper>
  );
};

export default UserDashboard;