import { C, GRAD } from "../content/site/theme";
import { useSiteNav } from "./routes";

const MONO = "'IBM Plex Mono',monospace";
const SANS = "'IBM Plex Sans',sans-serif";

// Decorative blurred gradient blob used behind hero sections.
export const Aurora = ({ style, reverse }) => (
  <div
    aria-hidden="true"
    className={reverse ? "mm-aurora--rev" : "mm-aurora"}
    style={{
      position: "absolute",
      borderRadius: "50%",
      filter: "blur(18px)",
      pointerEvents: "none",
      ...style,
    }}
  />
);

// Small pill badge with optional live dot.
export const Badge = ({ children, dot = false }) => (
  <div
    style={{
      display: "inline-flex",
      alignItems: "center",
      gap: 8,
      background: "#fff",
      border: "1px solid #cfe6ee",
      color: C.brand,
      fontFamily: MONO,
      fontSize: 12,
      fontWeight: 600,
      letterSpacing: ".04em",
      padding: "7px 14px",
      borderRadius: 100,
    }}
  >
    {dot && (
      <span
        className="mm-livedot"
        style={{ width: 7, height: 7, borderRadius: "50%", background: C.teal }}
      />
    )}
    {children}
  </div>
);

// Uppercase mono section kicker.
export const Kicker = ({ children, color = C.teal, style }) => (
  <div
    style={{
      fontFamily: MONO,
      fontSize: 13,
      letterSpacing: ".06em",
      textTransform: "uppercase",
      color,
      marginBottom: 12,
      ...style,
    }}
  >
    {children}
  </div>
);

export const GradButton = ({ children, onClick, size = "md", as = "button", ...rest }) => {
  const pad = size === "lg" ? "15px 30px" : size === "sm" ? "10px 18px" : "13px 24px";
  const fs = size === "lg" ? 16.5 : size === "sm" ? 14.5 : 15.5;
  const Tag = as;
  return (
    <Tag
      onClick={onClick}
      className="mm-lift"
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 8,
        background: GRAD.brand,
        color: "#fff",
        fontWeight: 600,
        fontFamily: SANS,
        fontSize: fs,
        padding: pad,
        border: "none",
        borderRadius: 11,
        cursor: "pointer",
        boxShadow: "0 12px 26px -10px rgba(10,147,212,.6)",
        textDecoration: "none",
      }}
      {...rest}
    >
      {children}
    </Tag>
  );
};

export const OutlineButton = ({ children, onClick, size = "md" }) => {
  const pad = size === "lg" ? "15px 26px" : "13px 24px";
  const fs = size === "lg" ? 16.5 : 15.5;
  return (
    <button
      onClick={onClick}
      className="mm-lift"
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 8,
        background: "#fff",
        border: "1px solid #cfe6ee",
        color: C.ink,
        fontWeight: 600,
        fontFamily: SANS,
        fontSize: fs,
        padding: pad,
        borderRadius: 11,
        cursor: "pointer",
      }}
    >
      {children}
    </button>
  );
};

// The repeated bottom call-to-action band.
export const CTASection = ({ title, sub, btnLabel, onClick, size = "lg" }) => (
  <div data-reveal className="mm-reveal" style={{ maxWidth: 1100, margin: "0 auto", padding: "40px 24px 72px" }}>
    <div
      style={{
        position: "relative",
        overflow: "hidden",
        background: GRAD.cta,
        borderRadius: 24,
        padding: size === "lg" ? "60px 40px" : "54px 40px",
        textAlign: "center",
      }}
    >
      <div
        className="mm-spin"
        aria-hidden="true"
        style={{ position: "absolute", top: -90, right: -50, width: 320, height: 320, borderRadius: "50%", background: "rgba(255,255,255,.12)" }}
      />
      <h2 style={{ position: "relative", fontFamily: SANS, fontWeight: 700, fontSize: size === "lg" ? 38 : 34, lineHeight: 1.08, letterSpacing: "-.025em", color: "#fff", margin: "0 0 14px" }}>
        {title}
      </h2>
      <p style={{ position: "relative", fontSize: 17, color: "#e3f4fb", maxWidth: 520, margin: "0 auto 28px" }}>{sub}</p>
      <button
        onClick={onClick}
        className="mm-lift"
        style={{ position: "relative", display: "inline-flex", alignItems: "center", gap: 8, background: "#fff", color: "#0a7bb5", fontWeight: 700, fontFamily: SANS, fontSize: 16.5, padding: "15px 30px", border: "none", borderRadius: 11, cursor: "pointer" }}
      >
        {btnLabel}
      </button>
    </div>
  </div>
);

// Convenience: a CTA wired to a route key.
export const RouteCTA = ({ title, sub, btnLabel, to = "login", size = "lg" }) => {
  const { go } = useSiteNav();
  return <CTASection title={title} sub={sub} btnLabel={btnLabel} onClick={() => go(to)} size={size} />;
};

export const FONTS = { MONO, SANS };
