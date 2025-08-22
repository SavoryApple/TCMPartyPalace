import React from "react";
import { useHerbCart } from "../context/HerbCartContext";

const COLORS = {
  vanilla: "#FFF7E3",
  violet: "#7C5CD3",
  claret: "#A52439",
  seal: "#3B4461",
};

export default function HerbCart({ show = true, onClose, onCreateFormula }) {
  const { cart, herbCount, maxHerbs, removeHerb, clearCart, alert } = useHerbCart();

  if (!show) return null;

  return (
    <div
      className="fixed herb-cart-drawer"
      style={{
        top: 90,
        right: 18,
        height: `calc(100vh - 102px)`,
        width: 270,
        minWidth: 270,
        maxWidth: 270,
        minHeight: 120,
        borderRadius: "1.2em",
        background: "#fff",
        boxShadow: "0 6px 40px -8px #7C5CD399",
        padding: "14px 13px 12px 13px",
        zIndex: 80,
        border: `2px solid ${COLORS.violet}`,
      }}
    >
      {/* Custom animated alert */}
      {alert && (
        <div
          className="animate-fadeInScaleUp"
          style={{
            background: COLORS.claret,
            color: COLORS.vanilla,
            borderRadius: "1em",
            padding: "12px 18px",
            marginBottom: "1em",
            fontWeight: 700,
            textAlign: "center",
            fontSize: "1.08em",
            boxShadow: `0 3px 18px -4px ${COLORS.claret}`,
            border: `2px solid ${COLORS.violet}`,
            position: "relative",
            zIndex: 99,
            letterSpacing: ".01em",
            transition: "opacity .2s",
          }}
        >
          {alert}
        </div>
      )}
      <div className="flex justify-between items-center mb-1">
        <h3 className="font-bold text-lg" style={{ color: COLORS.violet }}>
          Herb Cart{" "}
          <span
            style={{
              fontWeight: 400,
              fontSize: "1em",
              marginLeft: "0.5em",
              color: COLORS.claret,
            }}
          >
            {herbCount}/{maxHerbs}
          </span>
        </h3>
        {onClose && (
          <button
            onClick={onClose}
            aria-label="Close"
            style={{
              background: "none",
              border: "none",
              color: COLORS.claret,
              fontSize: 19,
              fontWeight: "bold",
              cursor: "pointer",
              borderRadius: 8,
              padding: "0 6px",
              lineHeight: 1,
              marginLeft: 2,
              transition: "background 0.15s",
            }}
            title="Close"
          >
            ×
          </button>
        )}
      </div>
      <ul
        style={{
          margin: "8px 0 0 0",
          padding: 0,
          listStyle: "none",
          overflowY: "auto",
          maxHeight: "38vh",
          minHeight: 16,
        }}
      >
        {cart.length === 0 ? (
          <li className="text-seal italic text-sm py-2 text-center">
            No herbs yet.
          </li>
        ) : (
          cart.map((h, idx) => (
            <li
              key={(h.pinyinName || h.name || idx) + "-cart"}
              className="flex items-center justify-between py-1 group"
              style={{
                borderBottom:
                  idx !== cart.length - 1 ? "1px solid #eee" : "none",
                fontSize: 15,
                paddingBottom: 2,
              }}
            >
              <span
                style={{
                  overflow: "hidden",
                  whiteSpace: "nowrap",
                  textOverflow: "ellipsis",
                  maxWidth: 128,
                  color: COLORS.seal,
                  fontWeight: 500,
                }}
                title={h.pinyinName || h.name}
              >
                {h.pinyinName || h.name || (
                  <span style={{ color: COLORS.claret, fontStyle: "italic" }}>
                    [Unknown]
                  </span>
                )}
              </span>
              <button
                className="ml-2"
                style={{
                  background: "none",
                  border: "none",
                  color: COLORS.claret,
                  fontSize: 17,
                  fontWeight: "bold",
                  borderRadius: 8,
                  cursor: "pointer",
                  marginLeft: 4,
                  padding: "0 4px",
                  transition: "background 0.15s",
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
      <div className="flex flex-col items-stretch mt-4 gap-2">
        <button
          disabled={cart.length === 0}
          className="w-full mb-1 px-2 py-1 rounded-full font-bold"
          style={{
            background: COLORS.violet,
            color: COLORS.vanilla,
            fontSize: 15,
            minHeight: 32,
            cursor: cart.length === 0 ? "not-allowed" : "pointer",
            opacity: cart.length === 0 ? 0.67 : 1,
            fontWeight: 700,
            transition: "background 0.15s, scale 0.15s",
            boxShadow: "0 1px 5px 0 #7C5CD344",
          }}
          onClick={onCreateFormula}
        >
          Add to Formula
        </button>
        <button
          className="w-full px-2 py-1 rounded-full font-bold"
          style={{
            background: "#fff0f0",
            color: COLORS.claret,
            border: `1.2px solid ${COLORS.claret}`,
            fontSize: 14,
            minHeight: 28,
            marginTop: 0,
            fontWeight: 700,
            opacity: cart.length === 0 ? 0.7 : 1,
            cursor: cart.length === 0 ? "not-allowed" : "pointer",
            transition: "background 0.14s",
          }}
          onClick={clearCart}
          disabled={cart.length === 0}
          title="Remove all herbs from cart"
        >
          Remove All
        </button>
      </div>
    </div>
  );
}