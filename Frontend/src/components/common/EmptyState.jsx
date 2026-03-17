import { motion } from 'framer-motion';

const EmptyState = ({ icon: Icon, title, description, action }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.96 }}
    animate={{ opacity: 1, scale: 1 }}
    className="flex flex-col items-center justify-center py-20 text-center px-4"
  >
    {Icon && (
      <div className="w-14 h-14 rounded-2xl bg-stone-100 flex items-center justify-center mb-4">
        <Icon className="text-2xl text-stone-400" />
      </div>
    )}
    <div className="text-base font-semibold text-stone-700 mb-1">{title}</div>
    {description && (
      <div className="text-sm text-stone-400 mb-5 max-w-[280px] sm:max-w-xs">
        {description}
      </div>
    )}
    {action}
  </motion.div>
);

export default EmptyState;