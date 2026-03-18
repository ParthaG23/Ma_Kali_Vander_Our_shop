import { motion, AnimatePresence } from 'framer-motion';
import { RiAlertLine } from 'react-icons/ri';

const ConfirmModal = ({ open, title, message, onConfirm, onCancel, danger = true }) => (
  <AnimatePresence>
    {open && (
      <motion.div
        className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      >
        <motion.div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={onCancel} />
        <motion.div
          className="relative bg-white rounded-2xl sm:rounded-2xl shadow-2xl p-5 sm:p-6 w-full max-w-sm"
          initial={{ y: 60, scale: 0.95 }}
          animate={{ y: 0,  scale: 1 }}
          exit={{ y: 60, scale: 0.95 }}
          transition={{ type: 'spring', stiffness: 400, damping: 30 }}
        >
          <div className={`w-10 h-10 sm:w-11 sm:h-11 rounded-xl flex items-center justify-center mb-4 ${danger ? 'bg-red-50' : 'bg-amber-50'}`}>
            <RiAlertLine className={`text-lg sm:text-xl ${danger ? 'text-red-500' : 'text-amber-500'}`} />
          </div>
          <h3 className="text-sm sm:text-base font-semibold text-stone-900 mb-1">{title}</h3>
          <p className="text-xs sm:text-sm text-stone-500 mb-5">{message}</p>
          <div className="flex gap-2">
            <button onClick={onCancel} className="flex-1 py-2.5 border border-stone-200 bg-white hover:bg-stone-50 text-stone-700 text-sm font-medium rounded-xl transition-colors">Cancel</button>
            <button onClick={onConfirm}
              className={`flex-1 py-2.5 text-sm font-semibold text-white rounded-xl transition-colors ${danger ? 'bg-red-600 hover:bg-red-700' : 'bg-amber-600 hover:bg-amber-700'}`}>
              Confirm
            </button>
          </div>
        </motion.div>
      </motion.div>
    )}
  </AnimatePresence>
);

export default ConfirmModal;
