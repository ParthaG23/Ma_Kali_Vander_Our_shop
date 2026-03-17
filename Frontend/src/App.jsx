import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute    from './routes/PrivateRoute';
import AdminRoute      from './routes/AdminRoute';
import Sidebar         from './components/common/Sidebar';

import Login           from './pages/auth/Login';
import Signup          from './pages/auth/Signup';
import UserDashboard   from './pages/dashboard/UserDashboard';
import AdminDashboard  from './pages/dashboard/AdminDashboard';
import KhataList       from './pages/khata/KhataList';
import KhataDetails    from './pages/khata/KhataDetails';
import AddKhata        from './pages/khata/AddKhata';
import ProductList     from './pages/products/ProductList';
import AddProduct      from './pages/products/AddProduct';
import NotFound        from './pages/NotFound';

const AppLayout = () => (
  <div className="flex min-h-screen bg-cream">
    <Sidebar />
    <main className="flex-1 pt-20 lg:pt-0 px-4 py-5 lg:p-8 overflow-y-auto min-w-0">
      <Outlet />
    </main>
  </div>
);

const App = () => (
  <AuthProvider>
    <BrowserRouter>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3500,
          style: {
            fontFamily: "'DM Sans', sans-serif",
            fontSize: '13px',
            borderRadius: '12px',
            border: '1px solid #e7e5e4',
            boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
            color: '#1c1917',
            background: '#ffffff',
          },
          success: { iconTheme: { primary: '#558055', secondary: '#fff' } },
          error:   { iconTheme: { primary: '#dc2626', secondary: '#fff' } },
        }}
      />
      <Routes>
        <Route path="/login"    element={<Login />} />
        <Route path="/register" element={<Signup />} />
        <Route path="/"         element={<Navigate to="/dashboard" replace />} />

        <Route element={<PrivateRoute />}>
          <Route element={<AppLayout />}>
            <Route path="/dashboard" element={<UserDashboard />} />
            <Route path="/khata"     element={<KhataList />} />
            <Route path="/khata/:id" element={<KhataDetails />} />
            <Route path="/products"  element={<ProductList />} />

            <Route element={<AdminRoute />}>
              <Route path="/admin"                   element={<AdminDashboard />} />
              <Route path="/admin/khata/add"         element={<AddKhata />} />
              <Route path="/admin/khata/edit/:id"    element={<AddKhata />} />
              <Route path="/admin/products/add"      element={<AddProduct />} />
              <Route path="/admin/products/edit/:id" element={<AddProduct />} />
            </Route>
          </Route>
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  </AuthProvider>
);

export default App;