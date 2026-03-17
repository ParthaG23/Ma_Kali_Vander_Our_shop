import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { RiGroupLine, RiMoneyDollarCircleLine, RiAlertLine, RiShoppingBasket2Line,
         RiUserLine, RiArrowRightLine, RiAddLine, RiStockLine } from 'react-icons/ri';
import { fetchAllKhata } from '../../services/khataService';
import { fetchProducts }  from '../../services/productService';
import api from '../../services/api';
import Loader from '../../components/common/Loader';
import StatCard from '../../components/ui/StatCard';
import { PageWrapper, FadeItem } from '../../components/common/PageWrapper';

const AdminDashboard = () => {
  const [khatas,   setKhatas]  = useState([]);
  const [products, setProducts]= useState([]);
  const [users,    setUsers]   = useState([]);
  const [loading,  setLoading] = useState(true);

  useEffect(() => {
    Promise.all([fetchAllKhata(), fetchProducts(), api.get('/users')])
      .then(([k, p, u]) => { setKhatas(k.data.data); setProducts(p.data.data); setUsers(u.data.data); })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loader fullPage />;

  const totalBaki = khatas.reduce((s, k) => s + k.totalBaki, 0);
  const highBaki  = khatas.filter((k) => k.totalBaki > 500);
  const lowStock  = products.filter((p) => p.stock < 5);

  return (
    <PageWrapper  >
      <FadeItem >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
          <div>
            <div className="text-xs text-stone-400 uppercase tracking-widest font-medium mb-0.5">Admin</div>
            <h1 className="page-title">Dashboard</h1>
          </div>
          <div className="flex gap-2 flex-wrap">
            <Link to="/admin/khata/add" className="btn-primary gap-1.5 text-xs sm:text-sm px-3 sm:px-5 py-2 sm:py-2.5">
              <RiAddLine /> Add Customer
            </Link>
            <Link to="/admin/products/add" className="btn-secondary gap-1.5 text-xs sm:text-sm px-3 sm:px-5 py-2 sm:py-2.5">
              <RiAddLine /> Add Product
            </Link>
          </div>
        </div>
      </FadeItem>

      <FadeItem className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
        <StatCard label="Customers"  value={khatas.length}  sub="Active"        icon={RiGroupLine}           accent="sage" />
        <StatCard label="Total Baki" value={`₹${Math.abs(totalBaki).toLocaleString('en-IN')}`} sub="Outstanding"
                  icon={RiMoneyDollarCircleLine} accent={totalBaki > 0 ? 'red' : 'sage'} />
        <StatCard label="High Baki"  value={highBaki.length} sub="Above ₹500"   icon={RiAlertLine}           accent="amber" />
        <StatCard label="Products"   value={products.length} sub="In catalog"   icon={RiShoppingBasket2Line} accent="blue" />
        <StatCard label="Low Stock"  value={lowStock.length} sub="Below 5 units" icon={RiStockLine}           accent={lowStock.length > 0 ? 'red' : 'stone'} />
        <StatCard label="Users"      value={users.length}    sub="Registered"   icon={RiUserLine}            accent="stone" />
      </FadeItem>

      {(highBaki.length > 0 || lowStock.length > 0) && (
        <FadeItem className="mb-5">
          <div className="bg-amber-50 border border-amber-100 rounded-2xl p-4">
            <div className="flex items-center gap-2 mb-3 text-amber-700 font-semibold text-sm">
              <RiAlertLine /> Attention needed
            </div>
            <div className="flex flex-wrap gap-2">
              {highBaki.length > 0 && (
                <Link to="/khata" className="flex items-center gap-1.5 text-xs bg-white border border-amber-200 text-amber-700 px-3 py-1.5 rounded-lg font-medium">
                  {highBaki.length} high baki customer{highBaki.length > 1 ? 's' : ''} <RiArrowRightLine />
                </Link>
              )}
              {lowStock.length > 0 && (
                <Link to="/products" className="flex items-center gap-1.5 text-xs bg-white border border-red-200 text-red-600 px-3 py-1.5 rounded-lg font-medium">
                  {lowStock.length} low stock product{lowStock.length > 1 ? 's' : ''} <RiArrowRightLine />
                </Link>
              )}
            </div>
          </div>
        </FadeItem>
      )}

      <FadeItem className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="card">
          <div className="flex items-center justify-between px-4 sm:px-5 pt-4 sm:pt-5 pb-3 border-b border-stone-50">
            <h2 className="font-semibold text-stone-800 text-sm sm:text-base">Recent Khata</h2>
            <Link to="/khata" className="text-xs font-medium text-sage-700 flex items-center gap-1">View all <RiArrowRightLine /></Link>
          </div>
          <div className="divide-y divide-stone-50">
            {khatas.slice(0, 6).map((k) => (
              <Link key={k._id} to={`/khata/${k._id}`}
                className="flex items-center gap-3 px-4 sm:px-5 py-3 hover:bg-stone-50 transition-colors">
                <div className="w-8 h-8 rounded-xl bg-sage-50 text-sage-700 text-sm font-semibold flex items-center justify-center flex-shrink-0">
                  {k.customerName[0].toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-stone-800 truncate">{k.customerName}</div>
                  <div className="text-xs text-stone-400 hidden sm:block">{k.phone || '—'}</div>
                </div>
                <div className={`text-sm font-bold flex-shrink-0 ${k.totalBaki > 0 ? 'text-red-600' : 'text-sage-600'}`}>
                  ₹{Math.abs(k.totalBaki).toLocaleString('en-IN')}
                </div>
              </Link>
            ))}
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between px-4 sm:px-5 pt-4 sm:pt-5 pb-3 border-b border-stone-50">
            <h2 className="font-semibold text-stone-800 text-sm sm:text-base">Low Stock</h2>
            <Link to="/products" className="text-xs font-medium text-sage-700 flex items-center gap-1">View all <RiArrowRightLine /></Link>
          </div>
          <div className="divide-y divide-stone-50">
            {lowStock.length === 0
              ? <div className="py-10 text-center text-sm text-stone-400">All stocked ✓</div>
              : lowStock.map((p) => (
                <div key={p._id} className="flex items-center gap-3 px-4 sm:px-5 py-3">
                  <div className="w-8 h-8 rounded-xl bg-red-50 text-red-500 text-sm font-semibold flex items-center justify-center flex-shrink-0">
                    {p.name[0].toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-stone-800 truncate">{p.name}</div>
                    <div className="text-xs text-stone-400">₹{p.price}/{p.unit}</div>
                  </div>
                  <span className="badge-red text-xs flex-shrink-0">{p.stock} left</span>
                </div>
              ))
            }
          </div>
        </div>
      </FadeItem>
    </PageWrapper>
  );
};

export default AdminDashboard;