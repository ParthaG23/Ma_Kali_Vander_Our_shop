import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  RiDownloadLine, RiCloseLine, RiSmartphoneLine,
  RiShareLine, RiAddBoxLine, RiCheckLine,
} from 'react-icons/ri';
import usePWA from '../../hooks/usePWA';

/* Shopping bag — same as app icon */
const BagIcon = ({ size = 26 }) => (
  <svg width={size} height={size} viewBox="0 0 52 52" fill="none">
    <path d="M18 20 C18 13 34 13 34 20"
      stroke="white" strokeWidth="3.5" strokeLinecap="round" fill="none" opacity="0.95"/>
    <rect x="11" y="20" width="30" height="24" rx="5" fill="white" opacity="0.95"/>
    <rect x="11" y="20" width="30" height="6"  rx="5" fill="white" opacity="0.6"/>
    <ellipse cx="26" cy="33" rx="5" ry="6.5"
      fill="#4a8c4a" opacity="0.75" transform="rotate(-10 26 33)"/>
    <ellipse cx="28" cy="31" rx="3.5" ry="5"
      fill="#5aa05a" opacity="0.5"  transform="rotate(15 28 31)"/>
    <rect x="24.5" y="37" width="3" height="4" rx="1.5" fill="#4a8c4a" opacity="0.75"/>
  </svg>
);

/* ─── All styles as plain JS objects — zero Tailwind dependency ─── */
const S = {
  /* Banner card */
  card: {
    position: 'fixed',
    bottom: '20px',
    right: '20px',
    left: 'auto',
    width: '300px',
    zIndex: 9999,
    borderRadius: '20px',
    overflow: 'hidden',
    background: 'linear-gradient(140deg,#253825 0%,#2d4d2d 55%,#1e321e 100%)',
    border: '1px solid rgba(255,255,255,0.12)',
    boxShadow: '0 24px 60px rgba(0,0,0,0.4), 0 4px 16px rgba(0,0,0,0.25)',
  },
  dotsBg: {
    position: 'absolute', inset: 0, opacity: 0.04, pointerEvents: 'none',
    backgroundImage: 'radial-gradient(circle at 2px 2px,white 1px,transparent 0)',
    backgroundSize: '18px 18px',
  },
  glow: {
    position: 'absolute', top: '-30px', right: '-30px',
    width: '120px', height: '120px', borderRadius: '50%', pointerEvents: 'none',
    background: 'radial-gradient(circle,rgba(110,168,110,0.3) 0%,transparent 70%)',
  },
  closeBtn: {
    position: 'absolute', top: '10px', right: '10px', zIndex: 10,
    width: '26px', height: '26px', borderRadius: '7px',
    background: 'rgba(255,255,255,0.08)', border: 'none',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    cursor: 'pointer', color: 'rgba(255,255,255,0.45)',
  },
  body: { position: 'relative', padding: '14px' },
  headerRow: { display: 'flex', alignItems: 'center', gap: '12px', paddingRight: '24px' },
  iconBox: {
    width: '46px', height: '46px', borderRadius: '13px', flexShrink: 0,
    background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.16)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
  },
  title: {
    fontFamily: "'Playfair Display',Georgia,serif",
    fontSize: '15px', fontWeight: 700,
    color: '#ffffff', lineHeight: 1.25, margin: 0,
  },
  subtitle: {
    fontSize: '11px', color: 'rgba(255,255,255,0.48)',
    marginTop: '3px',
  },
  divider: { height: '1px', background: 'rgba(255,255,255,0.08)', margin: '13px 0' },
  btnRow: { display: 'flex', gap: '8px' },
  btnInstall: {
    flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
    gap: '7px', padding: '9px 14px', borderRadius: '11px', border: 'none',
    background: '#ffffff', color: '#253825',
    fontSize: '13px', fontWeight: 700, cursor: 'pointer',
  },
  btnIOS: {
    flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
    gap: '7px', padding: '9px 14px', borderRadius: '11px', border: 'none',
    background: 'rgba(255,255,255,0.14)', color: '#ffffff',
    fontSize: '13px', fontWeight: 600, cursor: 'pointer',
  },
  btnLater: {
    padding: '9px 13px', borderRadius: '11px', border: 'none',
    background: 'rgba(255,255,255,0.07)', color: 'rgba(255,255,255,0.4)',
    fontSize: '12px', fontWeight: 500, cursor: 'pointer',
  },
  doneBox: {
    flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
    gap: '7px', padding: '9px', borderRadius: '11px',
    background: 'rgba(100,220,100,0.12)',
  },

  /* iOS sheet */
  backdrop: {
    position: 'fixed', inset: 0, zIndex: 99998,
    background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(4px)',
  },
  sheet: {
    position: 'fixed', bottom: 0, left: 0, right: 0,
    zIndex: 99999,
    background: '#ffffff',
    borderRadius: '28px 28px 0 0',
    overflow: 'hidden',
    boxShadow: '0 -8px 40px rgba(0,0,0,0.18)',
    maxWidth: '480px',
    margin: '0 auto',
  },
  handle: {
    display: 'flex', justifyContent: 'center', padding: '12px 0 2px',
  },
  handleBar: { width: '36px', height: '4px', borderRadius: '2px', background: '#e5e7eb' },
  sheetHeader: {
    textAlign: 'center', padding: '14px 24px 18px',
    borderBottom: '1px solid #f3f4f6',
  },
  sheetIconBox: {
    width: '62px', height: '62px', borderRadius: '18px',
    margin: '0 auto 12px',
    background: 'linear-gradient(135deg,#253825 0%,#2d4d2d 100%)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
  },
  sheetTitle: {
    fontFamily: "'Playfair Display',Georgia,serif",
    fontSize: '20px', fontWeight: 700,
    color: '#111827',           /* ← explicit dark — always visible */
    margin: '0 0 4px',
  },
  sheetSub: { fontSize: '13px', color: '#6b7280', margin: 0 },
  steps: { padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: '16px' },
  stepRow: { display: 'flex', alignItems: 'center', gap: '14px' },
  stepText: { fontSize: '14px', fontWeight: 600, color: '#111827', margin: 0 },  /* ← explicit */
  stepSub:  { fontSize: '12px', color: '#9ca3af', marginTop: '2px' },
  stepNum: {
    width: '22px', height: '22px', borderRadius: '50%',
    background: '#f3f4f6', flexShrink: 0,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: '11px', fontWeight: 700, color: '#6b7280',
  },
  sheetBtn: {
    display: 'block', width: '100%', padding: '14px',
    margin: '0 0 0',
    borderRadius: '16px', border: 'none',
    background: 'linear-gradient(135deg,#2d5230 0%,#253825 100%)',
    color: '#ffffff', fontSize: '14px', fontWeight: 700,
    cursor: 'pointer', letterSpacing: '0.01em',
  },
};

const STEPS = [
  { Icon: RiShareLine,  bg: '#eff6ff', iconColor: '#2563eb', text: 'Tap the Share button',   sub: 'Bottom of Safari browser bar' },
  { Icon: RiAddBoxLine, bg: '#f0fdf4', iconColor: '#16a34a', text: '"Add to Home Screen"',   sub: 'Scroll down in the share sheet' },
  { Icon: RiCheckLine,  bg: '#f0fdf4', iconColor: '#15803d', text: 'Tap "Add" to confirm',   sub: 'Top right corner of the dialog' },
];

const Spinner = () => (
  <>
    <span style={{
      display: 'inline-block', width: '14px', height: '14px',
      borderRadius: '50%', border: '2px solid rgba(37,56,37,0.2)',
      borderTopColor: '#253825', animation: 'bspin 0.6s linear infinite',
    }} />
    <style>{`@keyframes bspin{to{transform:rotate(360deg)}}`}</style>
  </>
);

const InstallBanner = () => {
  const { installPrompt, isInstalled, isIOS, install } = usePWA();
  const [dismissed,    setDismissed]    = useState(() => localStorage.getItem('pwa-dismissed') === 'true');
  const [showIOSGuide, setShowIOSGuide] = useState(false);
  const [installing,   setInstalling]   = useState(false);
  const [done,         setDone]         = useState(false);

  const dismiss = () => { setDismissed(true); localStorage.setItem('pwa-dismissed', 'true'); };

  const handleInstall = async () => {
    setInstalling(true);
    await install();
    setInstalling(false);
    setDone(true);
    setTimeout(() => dismiss(), 1500);
  };

  const showBanner = !isInstalled && !dismissed && (installPrompt || isIOS);

  return (
    <>
      {/* ── Install banner ──────────────────────────────────── */}
      <AnimatePresence>
        {showBanner && (
          <motion.div
            style={S.card}
            initial={{ opacity: 0, y: 18, scale: 0.95 }}
            animate={{ opacity: 1, y: 0,  scale: 1 }}
            exit={{   opacity: 0, y: 18,  scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 320, damping: 28 }}
          >
            <div style={S.dotsBg} />
            <div style={S.glow} />

            <button style={S.closeBtn} onClick={dismiss}>
              <RiCloseLine style={{ fontSize: '13px' }} />
            </button>

            <div style={S.body}>
              <div style={S.headerRow}>
                <div style={S.iconBox}><BagIcon size={26} /></div>
                <div>
                  <p style={S.title}>Install Ma Kali Vandar </p>
                  <p style={S.subtitle}>Add to home screen · works offline</p>
                </div>
              </div>

              <div style={S.divider} />

              <div style={S.btnRow}>
                {done ? (
                  <div style={S.doneBox}>
                    <RiCheckLine style={{ color: '#6ee66e', fontSize: '16px' }} />
                    <span style={{ color: '#6ee66e', fontSize: '13px', fontWeight: 600 }}>Installed!</span>
                  </div>
                ) : isIOS ? (
                  <button style={S.btnIOS} onClick={() => setShowIOSGuide(true)}>
                    <RiSmartphoneLine style={{ fontSize: '15px' }} />
                    How to install
                  </button>
                ) : (
                  <button style={S.btnInstall} onClick={handleInstall} disabled={installing}>
                    {installing ? <Spinner /> : <RiDownloadLine style={{ fontSize: '15px' }} />}
                    {installing ? 'Installing…' : 'Install App'}
                  </button>
                )}
                <button style={S.btnLater} onClick={dismiss}>Later</button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── iOS guide sheet ─────────────────────────────────── */}
      <AnimatePresence>
        {showIOSGuide && (
          <>
            <motion.div
              style={S.backdrop}
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setShowIOSGuide(false)}
            />
            <motion.div
              style={S.sheet}
              initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
              transition={{ type: 'spring', stiffness: 340, damping: 32 }}
            >
              <div style={S.handle}><div style={S.handleBar} /></div>

              <div style={S.sheetHeader}>
                <div style={S.sheetIconBox}><BagIcon size={34} /></div>
                <p style={S.sheetTitle}>Add to Home Screen</p>
                <p style={S.sheetSub}>Install Ma Kali Vandar  on your iPhone</p>
              </div>

              <div style={S.steps}>
                {STEPS.map(({ Icon, bg, iconColor, text, sub }, i) => (
                  <div key={i} style={S.stepRow}>
                    <div style={{ width: '44px', height: '44px', borderRadius: '14px', flexShrink: 0, background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Icon style={{ fontSize: '20px', color: iconColor }} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <p style={S.stepText}>{text}</p>
                      <p style={S.stepSub}>{sub}</p>
                    </div>
                    <div style={S.stepNum}>{i + 1}</div>
                  </div>
                ))}
              </div>

              <div style={{ padding: '0 24px 36px' }}>
                <button style={S.sheetBtn} onClick={() => { setShowIOSGuide(false); dismiss(); }}>
                  Got it, thanks!
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default InstallBanner;