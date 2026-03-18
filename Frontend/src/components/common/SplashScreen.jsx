import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RiBookOpenLine, RiShoppingBasket2Line, RiStarLine } from 'react-icons/ri';

const features = [
  { icon: RiBookOpenLine,        label: 'Khata Book' },
  { icon: RiShoppingBasket2Line, label: 'Inventory' },
  { icon: RiStarLine,            label: 'Est. 1980' },
];

const SplashScreen = ({ onComplete }) => {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const t1 = setTimeout(() => setPhase(1), 800);
    const t2 = setTimeout(() => setPhase(2), 3000);
    const t3 = setTimeout(() => onComplete(), 3600);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, []);

  // Hide the HTML splash once React takes over
  useEffect(() => {
    const el = document.getElementById('splash');
    if (el) el.classList.add('hidden');
  }, []);

  return (
    <AnimatePresence>
      {phase < 2 && (
        <motion.div
          style={{
            position: 'fixed', inset: 0, zIndex: 9999,
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
            overflow: 'hidden',
            background: 'linear-gradient(160deg,#2a3d1e 0%,#1e2d16 45%,#141e0d 100%)',
          }}
          exit={{ opacity: 0, scale: 1.04, transition: { duration: 0.55, ease: 'easeInOut' } }}
        >
          {/* Dot grid */}
          <div style={{
            position: 'absolute', inset: 0, opacity: 0.05, pointerEvents: 'none',
            backgroundImage: 'radial-gradient(circle at 2px 2px,white 1px,transparent 0)',
            backgroundSize: '26px 26px',
          }} />

          {/* Warm glow behind bag */}
          <motion.div
            style={{
              position: 'absolute', width: '400px', height: '400px',
              borderRadius: '50%', pointerEvents: 'none',
              background: 'radial-gradient(circle,rgba(180,130,60,0.2) 0%,transparent 68%)',
            }}
            animate={{ scale: [1, 1.16, 1], opacity: [0.55, 0.9, 0.55] }}
            transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
          />

          {/* Bag image */}
          <motion.div
            style={{ position: 'relative', zIndex: 10 }}
            initial={{ scale: 0.55, opacity: 0, y: 32 }}
            animate={{ scale: 1,    opacity: 1, y: 0 }}
            transition={{ type: 'spring', stiffness: 200, damping: 18 }}
          >
            <motion.img
              src="/bag-logo.png"
              alt="Ma Kali Vandar"
              style={{
                width: '215px', height: '215px',
                objectFit: 'contain',
                filter: 'drop-shadow(0 22px 48px rgba(0,0,0,0.55))',
              }}
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            />

            {/* Golden sparkles */}
            {[
              { top: '8px',    right: '-14px', delay: 0,    size: 10 },
              { top: '28px',   left:  '-14px', delay: 0.65, size: 7  },
              { bottom: '48px',right: '-16px', delay: 1.2,  size: 8  },
            ].map((sp, i) => (
              <motion.div key={i} style={{
                position: 'absolute',
                width: sp.size, height: sp.size, borderRadius: '50%',
                background: 'rgba(255,215,80,0.9)',
                top: sp.top, right: sp.right, left: sp.left, bottom: sp.bottom,
              }}
                animate={{ scale: [0, 1, 0], opacity: [0, 1, 0] }}
                transition={{ duration: 2, repeat: Infinity, delay: sp.delay }}
              />
            ))}
          </motion.div>

          {/* Shop name */}
          <motion.div
            style={{ textAlign: 'center', marginTop: '16px', zIndex: 10, position: 'relative' }}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div style={{
              fontFamily: "'Playfair Display',Georgia,serif",
              fontSize: '28px', fontWeight: 700,
              color: '#f5e6c8', letterSpacing: '0.02em',
              lineHeight: 1.2,
              textShadow: '0 2px 14px rgba(0,0,0,0.4)',
            }}>
              Ma Kali Vandar
            </div>
            <div style={{
              fontFamily: "'DM Sans',sans-serif",
              fontSize: '11px', color: 'rgba(245,230,200,0.42)',
              letterSpacing: '0.22em', textTransform: 'uppercase',
              marginTop: '6px',
            }}>
              Khata &amp; Inventory
            </div>
          </motion.div>

          {/* Feature pills */}
          <AnimatePresence>
            {phase >= 1 && (
              <motion.div style={{
                position: 'relative', zIndex: 10,
                display: 'flex', gap: '10px', marginTop: '26px',
                flexWrap: 'wrap', justifyContent: 'center', padding: '0 24px',
              }}>
                {features.map(({ icon: Icon, label }, i) => (
                  <motion.div key={label}
                    initial={{ opacity: 0, y: 14, scale: 0.88 }}
                    animate={{ opacity: 1, y: 0,  scale: 1 }}
                    transition={{ delay: i*0.1+0.05, type: 'spring', stiffness: 300, damping: 22 }}
                    style={{
                      display: 'flex', alignItems: 'center', gap: '7px',
                      padding: '7px 14px', borderRadius: '12px',
                      background: 'rgba(245,230,200,0.09)',
                      border: '1px solid rgba(245,230,200,0.15)',
                    }}
                  >
                    <Icon style={{ color: 'rgba(245,215,130,0.75)', fontSize: '13px' }} />
                    <span style={{
                      fontFamily: "'DM Sans',sans-serif",
                      fontSize: '12px', fontWeight: 500,
                      color: 'rgba(245,230,200,0.85)',
                    }}>
                      {label}
                    </span>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Progress bar */}
          <div style={{
            position: 'absolute', bottom: '48px',
            left: '50%', transform: 'translateX(-50%)',
            width: '110px',
          }}>
            <div style={{
              height: '2px', borderRadius: '99px',
              background: 'rgba(245,230,200,0.1)', overflow: 'hidden',
            }}>
              <motion.div
                style={{ height: '100%', borderRadius: '99px', background: 'rgba(245,215,100,0.5)' }}
                initial={{ width: '0%' }}
                animate={{ width: '100%' }}
                transition={{ duration: 2.6, ease: 'easeInOut' }}
              />
            </div>
          </div>

          {/* Tagline */}
          <AnimatePresence>
            {phase >= 1 && (
              <motion.div
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                style={{
                  position: 'absolute', bottom: '20px',
                  fontFamily: "'DM Sans',sans-serif",
                  fontSize: '11px', color: 'rgba(245,230,200,0.2)',
                  letterSpacing: '0.07em',
                }}
              >
                Premium Groceries since 1980
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SplashScreen;