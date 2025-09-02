import React from "react";

// Consistent footer card for all pages, responsive for all screen sizes
const COLORS = {
  backgroundRed: "#9A2D1F",
  accentGold: "#D4AF37",
  font: '"Noto Serif SC", "Songti SC", "KaiTi", serif',
};

export default function FooterCard({ style = {} }) {
  return (
    <footer
      className="p-6 text-center animate-cardTextFade footer-card"
      style={{
        background: COLORS.backgroundRed,
        color: COLORS.accentGold,
        fontFamily: COLORS.font,
        borderTop: `5px double ${COLORS.accentGold}`,
        fontWeight: 700,
        letterSpacing: "0.02em",
        marginTop: "36px",
        width: "100vw",
        left: 0,
        position: "relative",
        ...style,
      }}
    >
      <p>
        &copy; {new Date().getFullYear()} The TCM Atlas · Made with passion for Chinese Medicine
      </p>
      <style>
        {`
          .footer-card {
            font-size: 1.15em;
          }
          @media (max-width: 700px) {
            .footer-card {
              padding: 16px 4px !important;
              font-size: 1em !important;
              border-top-width: 4px !important;
              margin-top: 16px !important;
            }
          }
          @media (max-width: 500px) {
            .footer-card {
              padding: 10px 1px !important;
              font-size: 0.97em !important;
              margin-top: 8px !important;
            }
          }
        `}
      </style>
    </footer>
  );
}