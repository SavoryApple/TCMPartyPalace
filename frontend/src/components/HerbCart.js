import React from "react";
import { useHerbCart } from "../context/HerbCartContext";

// Accent colors to compliment App.js, now with more color variety!
const COLORS = {
  background: "#F9E8C2",
  accentGold: "#D4AF37",
  accentEmerald: "#438C3B",
  accentRed: "#9A2D1F",
  accentBlack: "#44210A",
  accentIvory: "#FCF5E5",
  accentBlue: "#2176AE",
  accentDarkGold: "#B38E3F",
  accentCrimson: "#C0392B",
  accentPink: "#FFB6B3",
  accentTeal: "#31B6B3",
  accentLavender: "#B38EFC",
  shadowStrong: "#B38E3FCC",
};

const SIDEBAR_WIDTH = 300;

// Pulse and slide-in animation for the cart drawer
const cartButtonPulseKeyframes = `
@keyframes cartPulseGlow {
  0% { box-shadow: 0 0 0 0 ${COLORS.accentGold}33; }
  50% { box-shadow: 0 0 18px 8px ${COLORS.accentBlue}88; }
  100% { box-shadow: 0 0 0 0 ${COLORS.accentGold}33; }
}
@keyframes cartDrawerSlideIn {
  0% { opacity: 0; transform: translateY(40px) scale(0.98);}
  60% { opacity: 1; transform: translateY(-8px) scale(1.03);}
  100% { opacity: 1; transform: translateY(0) scale(1);}
}
`;

function HerbCartIconButton({ cartCount, onClick, isCartOpen }) {
  const [hovered, setHovered] = React.useState(false);

  return (
    <>
      <style>{cartButtonPulseKeyframes}</style>
      <button
        onClick={onClick}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          position: "fixed",
          right: 18,
          bottom: 28,
          zIndex: 110,
          background: isCartOpen ? COLORS.accentEmerald : COLORS.accentGold,
          color: isCartOpen ? COLORS.accentIvory : COLORS.accentBlack,
          borderRadius: "50%",
          width: 46,
          height: 46,
          minWidth: 46,
          minHeight: 46,
          boxShadow: `0 8px 40px -8px ${COLORS.shadowStrong}`,
          fontWeight: 700,
          fontSize: 28,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          border: `2.5px solid ${COLORS.accentBlue}`,
          transition: "background 0.2s, transform 0.13s",
          outline: "none",
          cursor: "pointer",
          overflow: "visible",
          animation: "cartPulseGlow 1.7s infinite",
          transform: hovered ? "scale(1.13)" : "scale(1)",
        }}
        aria-label={isCartOpen ? "Minimize Cart" : "Open Cart"}
        title={isCartOpen ? "Minimize Cart" : "Open Cart"}
      >
        <span style={{ position: "relative", display: "inline-block", width: 28, height: 28 }}>
          <span style={{ fontSize: 24, lineHeight: "28px", display: "block" }}>🛒</span>
          {cartCount > 0 && (
            <span
              style={{
                position: "absolute",
                top: -10,
                right: -10,
                minWidth: 19,
                height: 19,
                padding: "0 4px",
                background: COLORS.accentPink,
                color: COLORS.accentRed,
                borderRadius: "50%",
                fontSize: 13,
                fontWeight: 700,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: `0 2px 8px -2px ${COLORS.accentGold}88, 0 0 0 2px ${COLORS.accentRed}66`,
                border: `2px solid ${COLORS.accentGold}`,
                pointerEvents: "none",
                userSelect: "none",
              }}
            >
              {cartCount}
            </span>
          )}
        </span>
      </button>
    </>
  );
}

export default function HerbCart({
  show = true,
  onClose,
  onOpen,
  onCreateFormula,
  sidebarTop = 90
}) {
  const { cart, herbCount, maxHerbs, removeHerb, clearCart, alert } = useHerbCart();

  function handleCartToggle() {
    if (show) {
      if (typeof onClose === "function") onClose();
    } else {
      if (typeof onOpen === "function") onOpen();
    }
  }

  return (
    <>
      <HerbCartIconButton
        cartCount={cart.length}
        onClick={handleCartToggle}
        isCartOpen={show}
      />
      {show && (
        <div
          className="fixed herb-cart-drawer animate-cartDrawerSlideIn"
          style={{
            top: sidebarTop,
            right: 18,
            width: SIDEBAR_WIDTH,
            minWidth: SIDEBAR_WIDTH,
            maxWidth: SIDEBAR_WIDTH,
            minHeight: 120,
            borderRadius: "2em",
            background: `linear-gradient(120deg, ${COLORS.background} 70%, ${COLORS.accentTeal} 100%)`,
            boxShadow: `0 0 32px -8px ${COLORS.accentLavender}88, 0 2px 12px -2px ${COLORS.accentGold}44`,
            padding: "16px 14px 14px 16px",
            zIndex: 20,
            border: `2.5px solid ${COLORS.accentGold}`,
            marginTop: "0.5em",
            marginBottom: "0.5em",
            scrollbarWidth: "thin",
            scrollbarColor: `${COLORS.accentGold} ${COLORS.background}`,
            transition: "box-shadow 0.2s, top 0.2s, height 0.2s",
            display: "flex",
            flexDirection: "column",
            height: `calc(100vh - ${sidebarTop}px)`,
            overflow: "hidden",
            animation: "cartDrawerSlideIn 0.7s cubic-bezier(.36,1.29,.45,1.01)",
          }}
        >
          {alert && (
            <div
              className="animate-fadeInScaleUp"
              style={{
                background: COLORS.accentCrimson,
                color: COLORS.accentIvory,
                borderRadius: "1.1em",
                padding: "12px 18px",
                marginBottom: "1em",
                fontWeight: 700,
                textAlign: "center",
                fontSize: "1.08em",
                boxShadow: `0 3px 18px -4px ${COLORS.accentCrimson}`,
                border: `2px solid ${COLORS.accentGold}`,
                position: "relative",
                zIndex: 99,
                letterSpacing: ".01em",
                transition: "opacity .2s",
                textShadow: "0 1px 6px #B38E3F44",
              }}
            >
              {alert}
            </div>
          )}
          <div className="flex flex-col mb-1" style={{ flex: "none", alignItems: "flex-start" }}>
            <h3 className="font-bold text-lg" style={{
              color: COLORS.accentBlue,
              textShadow: "0 1px 0 #fff, 0 1px 5px #438C3B22",
              marginBottom: "2px"
            }}>
              Herb Cart
            </h3>
            <span
              style={{
                fontWeight: 700,
                fontSize: "1em",
                marginTop: "0px",
                color: COLORS.accentDarkGold,
                background: `${COLORS.background}`,
                borderRadius: "0.7em",
                padding: "2px 13px",
                boxShadow: `0 0 4px 0 ${COLORS.accentGold}18`,
                letterSpacing: "0.01em",
                display: "inline-block",
                marginBottom: "2px"
              }}
            >
              {herbCount}/{maxHerbs}
            </span>
          </div>
          <ul
            style={{
              margin: "8px 0 0 0",
              padding: 0,
              listStyle: "none",
              overflowY: "auto",
              flex: "1 1 auto",
              minHeight: 0,
            }}
          >
            {cart.length === 0 ? (
              <li className="italic text-sm py-2 text-center"
                  style={{ color: COLORS.accentBlue, fontWeight: 600, letterSpacing: "0.01em" }}>
                No herbs yet.
              </li>
            ) : (
              cart.map((h, idx) => (
                <li
                  key={(h.pinyinName || h.name || idx) + "-cart"}
                  className="flex items-center justify-between py-1 group"
                  style={{
                    borderBottom:
                      idx !== cart.length - 1 ? `1px dashed ${COLORS.accentLavender}88` : "none",
                    fontSize: 15,
                    paddingBottom: 2,
                    animation: "fadeInScaleUp 0.6s cubic-bezier(.36,1.29,.45,1.01)",
                  }}
                >
                  <span
                    style={{
                      overflow: "hidden",
                      whiteSpace: "nowrap",
                      textOverflow: "ellipsis",
                      maxWidth: 128,
                      color: COLORS.accentBlack,
                      fontWeight: 600,
                      background: COLORS.accentIvory,
                      borderRadius: "1em",
                      padding: "0.5px 8px",
                      boxShadow: `0 0 5px 0 ${COLORS.accentGold}18`,
                      display: "flex",
                      alignItems: "center",
                      gap: "0.75em",
                    }}
                    title={h.pinyinName || h.name}
                  >
                    {h.pinyinName || h.name || (
                      <span style={{ color: COLORS.accentRed, fontStyle: "italic" }}>
                        [Unknown]
                      </span>
                    )}
                    {/* Show dosage if present */}
                    {h.dosage && (
                      <span style={{
                        color: COLORS.accentDarkGold,
                        fontWeight: 700,
                        background: COLORS.background,
                        borderRadius: "0.6em",
                        padding: "2px 7px",
                        fontSize: "0.96em",
                        marginLeft: "2px",
                        border: `1px solid ${COLORS.accentGold}`,
                        boxShadow: `0 0 2px 0 ${COLORS.accentGold}15`
                      }}>
                        {h.dosage}
                      </span>
                    )}
                  </span>
                  <button
                    className="ml-2"
                    style={{
                      background: COLORS.accentPink,
                      border: `1px solid ${COLORS.accentRed}`,
                      color: COLORS.accentRed,
                      fontSize: 16,
                      fontWeight: 700,
                      borderRadius: 8,
                      cursor: "pointer",
                      marginLeft: 4,
                      padding: "0 7px",
                      transition: "background 0.16s",
                      boxShadow: `0 1px 7px -2px ${COLORS.accentGold}33`,
                    }}
                    aria-label="Remove"
                    title="Remove"
                    onClick={() => removeHerb(h.pinyinName || h.name)}
                  >
                    ×
                  </button>
                </li>
              ))
            )}
          </ul>
          <div className="flex flex-col items-stretch mt-4 gap-2" style={{ flex: "none" }}>
            <button
              disabled={cart.length === 0}
              className="w-full mb-1 px-2 py-1 rounded-full font-bold"
              style={{
                background: `linear-gradient(92deg, ${COLORS.accentEmerald} 60%, ${COLORS.accentTeal} 100%)`,
                color: COLORS.accentIvory,
                fontSize: 15,
                minHeight: 32,
                cursor: cart.length === 0 ? "not-allowed" : "pointer",
                opacity: cart.length === 0 ? 0.67 : 1,
                fontWeight: 700,
                transition: "background 0.15s, scale 0.15s",
                boxShadow: `0 1px 8px 0 ${COLORS.accentEmerald}33`,
                letterSpacing: "0.01em",
                animation: cart.length > 0 ? "cartPulseGlow 1.2s infinite" : "none"
              }}
              onClick={onCreateFormula}
            >
              Add to Formula
            </button>
            <button
              className="w-full px-2 py-1 rounded-full font-bold"
              style={{
                background: COLORS.accentLavender,
                color: COLORS.accentRed,
                border: `1.2px solid ${COLORS.accentRed}`,
                fontSize: 14,
                minHeight: 28,
                marginTop: 0,
                fontWeight: 700,
                opacity: cart.length === 0 ? 0.7 : 1,
                cursor: cart.length === 0 ? "not-allowed" : "pointer",
                transition: "background 0.14s",
                boxShadow: `0 1px 8px 0 ${COLORS.accentLavender}22`,
                letterSpacing: "0.01em",
              }}
              onClick={clearCart}
              disabled={cart.length === 0}
              title="Remove all herbs from cart"
            >
              Remove All
            </button>
          </div>
        </div>
      )}
    </>
  );
}