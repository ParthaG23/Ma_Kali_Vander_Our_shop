import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { RiArrowLeftLine, RiLeafLine } from 'react-icons/ri';

const NotFound = () => (
  <div className="min-h-screen bg-parchment flex items-center justify-center p-5">
    <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }} className="text-center w-full max-w-xs mx-auto">
      <div className="inline-flex items-center gap-2 mb-8">
        <div className="w-8 h-8 bg-sage-700 rounded-lg flex items-center justify-center">
          <RiLeafLine className="text-white text-sm" />
        </div>
        <span className="font-display text-lg font-bold text-stone-900">GroceryShop</span>
      </div>
      <div className="font-display text-8xl sm:text-9xl font-bold text-stone-100 leading-none mb-3 select-none">404</div>
      <h2 className="font-display text-xl sm:text-2xl font-bold text-stone-800 mb-2">Page not found</h2>
      <p className="text-stone-400 text-sm mb-8">The page you're looking for doesn't exist.</p>
      <Link to="/" className="inline-flex items-center gap-2 px-6 py-3 bg-sage-700 hover:bg-sage-800 text-white text-sm font-semibold rounded-xl transition-colors">
        <RiArrowLeftLine /> Back to Home
      </Link>
    </motion.div>
  </div>
);

export default NotFound;
