import { motion } from 'framer-motion';

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07 } },
};

const item = {
  hidden: { opacity: 0, y: 16 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.35, ease: 'easeOut' } },
};

export const PageWrapper = ({ children }) => (
  <motion.div variants={container} initial="hidden" animate="show">
    {children}
  </motion.div>
);

export const FadeItem = ({ children, className = '' }) => (
  <motion.div variants={item} className={className}>
    {children}
  </motion.div>
);

export default PageWrapper;
