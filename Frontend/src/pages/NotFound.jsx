import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { RiArrowLeftLine, RiLeafLine } from 'react-icons/ri';

const NotFound = () => (
  <div className="min-h-screen bg-parchment flex items-center justify-center p-6">
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="text-center"
    >
      <div className="inline-flex items-center gap-2 mb-10">
        <div className="w-8 h-8 bg-sage-700 rounded-lg flex items-center justify-center">
          <RiLeafLine className="text-white text-sm" />
        </div>
        <span className="font-display text-lg font-bold text-stone-900">GroceryShop</span>
      </div>

      <div className="font-display text-[80px] sm:text-[120px] font-bold text-stone-100 leading-none mb-2 select-none">
        404
      </div>
      <h2 className="font-display text-2xl font-bold text-stone-800 mb-2">Page not found</h2>
      <p className="text-stone-400 text-sm mb-8 max-w-xs mx-auto">
        The page you're looking for doesn't exist or has been moved.
      </p>
      <Link to="/" className="btn-primary gap-2 inline-flex">
        <RiArrowLeftLine /> Back to Home
      </Link>
    </motion.div>
  </div>
);

export default NotFound;
