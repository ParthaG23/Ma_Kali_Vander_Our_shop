import { motion } from 'framer-motion';

const StatCard = ({ label, value, sub, icon: Icon, accent = 'stone', trend }) => {
  const accents = {
    stone:  'bg-stone-50  text-stone-500',
    sage:   'bg-sage-50   text-sage-600',
    red:    'bg-red-50    text-red-500',
    amber:  'bg-amber-50  text-amber-600',
    blue:   'bg-blue-50   text-blue-500',
  };

  return (
    <motion.div
      className="stat-card"
      whileHover={{ y: -2 }}
      transition={{ duration: 0.15 }}
    >
      <div className="flex items-start justify-between">
        <div className="stat-label">{label}</div>
        {Icon && (
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${accents[accent]}`}>
            <Icon className="text-base" />
          </div>
        )}
      </div>
      <div className="stat-value mt-2">{value}</div>
      {sub && <div className="stat-sub">{sub}</div>}
      {trend !== undefined && (
        <div className={`text-xs font-medium mt-2 ${trend >= 0 ? 'text-sage-600' : 'text-red-500'}`}>
          {trend >= 0 ? '↑' : '↓'} {Math.abs(trend)}%
        </div>
      )}
    </motion.div>
  );
};

export default StatCard;
