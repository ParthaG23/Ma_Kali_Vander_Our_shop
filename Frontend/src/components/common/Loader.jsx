import { motion } from 'framer-motion';

const Loader = ({ fullPage = false }) => {
  const dots = [0, 1, 2];

  return (
    <div
      className={`flex items-center justify-center ${
        fullPage
          ? 'h-screen bg-cream safe-area-inset'
          : 'py-14'
      }`}
    >
      <motion.div
        className="flex flex-col items-center gap-4"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: [0.25, 0.1, 0.25, 1] }}
      >
        {fullPage && (
          <motion.div
            className="flex items-center gap-2 mb-1"
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05, duration: 0.3 }}
          >
            {/* brand icon */}
            <svg
              width="20" height="20" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2" strokeLinecap="round"
              strokeLinejoin="round" className="text-sage-600"
            >
              <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
              <line x1="3" y1="6" x2="21" y2="6"/>
              <path d="M16 10a4 4 0 01-8 0"/>
            </svg>
            <span className="font-display text-[19px] font-semibold text-sage-800 tracking-tight">
              GroceryShop
            </span>
          </motion.div>
        )}

        <div className="flex items-center gap-[7px]">
          {dots.map((i) => (
            <motion.div
              key={i}
              className="w-[9px] h-[9px] rounded-full bg-sage-500"
              animate={{ y: [0, -10, 0], opacity: [0.45, 1, 0.45] }}
              transition={{
                duration: 0.72,
                repeat: Infinity,
                delay: i * 0.14,
                ease: 'easeInOut',
              }}
            />
          ))}
        </div>

        {fullPage && (
          <motion.p
            className="text-[13px] text-sage-400 mt-1"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.4 }}
          >
            Loading your groceries…
          </motion.p>
        )}
      </motion.div>
    </div>
  );
};

export default Loader;