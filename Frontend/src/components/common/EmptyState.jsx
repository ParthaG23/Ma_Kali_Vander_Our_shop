import { motion } from 'framer-motion';

const EmptyState = ({ icon: Icon, title, description, action }) => (
  <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }}
    className="flex flex-col items-center justify-center py-14 sm:py-20 text-center px-4">
    {Icon && (
      <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-stone-100 flex items-center justify-center mb-4">
        <Icon className="text-xl sm:text-2xl text-stone-400" />
      </div>
    )}
    <div className="text-sm sm:text-base font-semibold text-stone-700 mb-1">{title}</div>
    {description && <div className="text-xs sm:text-sm text-stone-400 mb-5 max-w-xs">{description}</div>}
    {action}
  </motion.div>
);

export default EmptyState;
