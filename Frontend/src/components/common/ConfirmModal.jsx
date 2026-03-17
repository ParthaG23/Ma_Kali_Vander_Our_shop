import { motion, AnimatePresence } from 'framer-motion';
import { RiAlertLine, RiErrorWarningLine } from 'react-icons/ri';

/* ─────────────────────────────────────────────
   Premium Mobile-First ConfirmModal
   Aesthetic: Luxury refined — deep navy base,
   warm gold accents, glass morphism surface,
   silky spring animations
───────────────────────────────────────────── */

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=DM+Sans:wght@300;400;500;600&display=swap');

  .cm-root * { box-sizing: border-box; }

  .cm-overlay {
    position: fixed;
    inset: 0;
    z-index: 9999;
    display: flex;
    align-items: flex-end;
    justify-content: center;
    padding: 0;
  }

  /* On larger screens → centered card */
  @media (min-width: 480px) {
    .cm-overlay {
      align-items: center;
      padding: 1.5rem;
    }
  }

  .cm-backdrop {
    position: absolute;
    inset: 0;
    background: rgba(4, 10, 28, 0.65);
    backdrop-filter: blur(12px) saturate(120%);
    -webkit-backdrop-filter: blur(12px) saturate(120%);
  }

  .cm-card {
    position: relative;
    width: 100%;
    max-width: 420px;
    background: linear-gradient(
      160deg,
      rgba(255,255,255,0.97) 0%,
      rgba(248,246,243,0.98) 100%
    );
    /* Mobile: bottom sheet */
    border-radius: 28px 28px 0 0;
    padding: 8px 24px 36px;
    box-shadow:
      0 -4px 60px rgba(4, 10, 28, 0.18),
      0 0 0 1px rgba(255,255,255,0.9) inset,
      0 2px 0 rgba(0,0,0,0.04) inset;
    overflow: hidden;
    font-family: 'DM Sans', sans-serif;
  }

  /* On larger screens → fully rounded card */
  @media (min-width: 480px) {
    .cm-card {
      border-radius: 24px;
      padding: 28px 28px 28px;
    }
    .cm-pill { display: none; }
  }

  /* Subtle noise texture overlay */
  .cm-card::before {
    content: '';
    position: absolute;
    inset: 0;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.03'/%3E%3C/svg%3E");
    pointer-events: none;
    border-radius: inherit;
    opacity: 0.4;
  }

  /* Top pill handle (mobile only) */
  .cm-pill {
    width: 36px;
    height: 4px;
    border-radius: 99px;
    background: rgba(0,0,0,0.12);
    margin: 4px auto 20px;
  }

  /* Icon container */
  .cm-icon-wrap {
    width: 52px;
    height: 52px;
    border-radius: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 16px;
    position: relative;
    flex-shrink: 0;
  }
  .cm-icon-wrap.danger {
    background: linear-gradient(135deg, #fff1f1 0%, #fde8e8 100%);
    box-shadow: 0 2px 12px rgba(220, 38, 38, 0.15), 0 0 0 1px rgba(220,38,38,0.08);
  }
  .cm-icon-wrap.warn {
    background: linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%);
    box-shadow: 0 2px 12px rgba(217, 119, 6, 0.15), 0 0 0 1px rgba(217,119,6,0.08);
  }
  .cm-icon-wrap svg {
    width: 22px;
    height: 22px;
    flex-shrink: 0;
  }
  .cm-icon-wrap.danger svg { color: #dc2626; }
  .cm-icon-wrap.warn svg { color: #d97706; }

  /* Glow ring behind icon */
  .cm-icon-wrap::after {
    content: '';
    position: absolute;
    inset: -6px;
    border-radius: 22px;
    opacity: 0.12;
  }
  .cm-icon-wrap.danger::after { box-shadow: 0 0 0 6px #dc2626; }
  .cm-icon-wrap.warn::after  { box-shadow: 0 0 0 6px #d97706; }

  /* Text */
  .cm-title {
    font-family: 'Instrument Serif', serif;
    font-size: 1.25rem;
    font-weight: 400;
    color: #0e1420;
    margin: 0 0 6px;
    letter-spacing: -0.01em;
    line-height: 1.3;
  }
  .cm-message {
    font-size: 0.875rem;
    font-weight: 400;
    color: #6b7280;
    margin: 0 0 24px;
    line-height: 1.6;
  }

  /* Buttons */
  .cm-actions {
    display: flex;
    gap: 10px;
  }

  .cm-btn {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    height: 50px;
    border-radius: 14px;
    font-family: 'DM Sans', sans-serif;
    font-size: 0.9rem;
    font-weight: 500;
    cursor: pointer;
    border: none;
    outline: none;
    transition: transform 0.15s ease, box-shadow 0.15s ease, filter 0.15s ease;
    letter-spacing: 0.01em;
    -webkit-tap-highlight-color: transparent;
    touch-action: manipulation;
  }
  .cm-btn:active { transform: scale(0.96); }

  .cm-btn-cancel {
    background: rgba(0,0,0,0.05);
    color: #374151;
    box-shadow: 0 0 0 1px rgba(0,0,0,0.06) inset;
  }
  .cm-btn-cancel:hover {
    background: rgba(0,0,0,0.08);
  }

  .cm-btn-confirm-danger {
    background: linear-gradient(135deg, #ef4444 0%, #dc2626 60%, #b91c1c 100%);
    color: #fff;
    box-shadow:
      0 4px 20px rgba(220, 38, 38, 0.35),
      0 1px 0 rgba(255,255,255,0.25) inset;
  }
  .cm-btn-confirm-danger:hover {
    filter: brightness(1.08);
    box-shadow:
      0 6px 28px rgba(220, 38, 38, 0.45),
      0 1px 0 rgba(255,255,255,0.25) inset;
  }

  .cm-btn-confirm-warn {
    background: linear-gradient(135deg, #f59e0b 0%, #d97706 60%, #b45309 100%);
    color: #fff;
    box-shadow:
      0 4px 20px rgba(217, 119, 6, 0.35),
      0 1px 0 rgba(255,255,255,0.25) inset;
  }
  .cm-btn-confirm-warn:hover {
    filter: brightness(1.08);
    box-shadow:
      0 6px 28px rgba(217, 119, 6, 0.45),
      0 1px 0 rgba(255,255,255,0.25) inset;
  }

  /* Divider line above actions (decorative) */
  .cm-divider {
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(0,0,0,0.07) 30%, rgba(0,0,0,0.07) 70%, transparent);
    margin-bottom: 20px;
  }
`;

const ConfirmModal = ({
  open,
  title,
  message,
  onConfirm,
  onCancel,
  danger = true,
}) => {
  const cardVariants = {
    hidden: {
      opacity: 0,
      y: 60,
      scale: 0.97,
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: 'spring',
        stiffness: 380,
        damping: 32,
        mass: 0.9,
      },
    },
    exit: {
      opacity: 0,
      y: 50,
      scale: 0.96,
      transition: { duration: 0.2, ease: 'easeIn' },
    },
  };

  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.25 } },
    exit: { opacity: 0, transition: { duration: 0.2 } },
  };

  const iconVariants = {
    hidden: { scale: 0, rotate: -15 },
    visible: {
      scale: 1,
      rotate: 0,
      transition: { type: 'spring', stiffness: 500, damping: 22, delay: 0.12 },
    },
  };

  const contentVariants = {
    hidden: { opacity: 0, y: 8 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { delay: 0.18, duration: 0.28, ease: 'easeOut' },
    },
  };

  return (
    <AnimatePresence>
      {open && (
        <div className="cm-root">
          <style>{styles}</style>
          <motion.div
            className="cm-overlay"
            variants={backdropVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            {/* Backdrop */}
            <motion.div className="cm-backdrop" onClick={onCancel} />

            {/* Card */}
            <motion.div
              className="cm-card"
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              {/* Mobile pull pill */}
              <div className="cm-pill" />

              {/* Icon */}
              <motion.div
                className={`cm-icon-wrap ${danger ? 'danger' : 'warn'}`}
                variants={iconVariants}
                initial="hidden"
                animate="visible"
              >
                {danger
                  ? <RiAlertLine />
                  : <RiErrorWarningLine />
                }
              </motion.div>

              {/* Text content */}
              <motion.div variants={contentVariants} initial="hidden" animate="visible">
                <h3 className="cm-title">{title}</h3>
                <p className="cm-message">{message}</p>

                <div className="cm-divider" />

                {/* Actions */}
                <div className="cm-actions">
                  <button className="cm-btn cm-btn-cancel" onClick={onCancel}>
                    Cancel
                  </button>
                  <button
                    className={`cm-btn ${danger ? 'cm-btn-confirm-danger' : 'cm-btn-confirm-warn'}`}
                    onClick={onConfirm}
                  >
                    Confirm
                  </button>
                </div>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default ConfirmModal;