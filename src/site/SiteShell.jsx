import { useEffect, useRef, useState } from "react";
import { useI18n } from "../context/I18nContext";
import { usePublicSeo } from "../lib/publicSeo";
import { resolveLocale } from "../lib/siteLocales";
import { getSiteContent } from "../content/site";
import { BRAND } from "../content/site/shared";
import { C } from "../content/site/theme";
import { NAV_KEYS, SITE_ROUTES, useSiteNav } from "./routes";
import { FONTS } from "./ui";
import "./site.css";

const { SANS, MONO } = FONTS;

// Flag + language-name dropdown.
const LanguageSwitcher = ({ compact = false }) => {
  const { language, setLanguage, languageOptions } = useI18n();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const active = languageOptions.find((o) => o.key === language) || languageOptions[0];

  useEffect(() => {
    if (!open) return undefined;
    const onDoc = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [open]);

  return (
    <div ref={ref} style={{ position: "relative", flexShrink: 0 }}>
      <button
        type="button"
        aria-label="Change language"
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="mm-navlink"
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 7,
          background: "#fff",
          border: "1px solid #d9e9ee",
          borderRadius: 10,
          padding: compact ? "9px 12px" : "8px 11px",
          cursor: "pointer",
          fontFamily: SANS,
          fontSize: 14,
          color: C.ink,
          fontWeight: 600,
        }}
      >
        <span style={{ fontSize: 16, lineHeight: 1 }}>{active.label}</span>
        <span style={{ fontFamily: MONO, fontSize: 11, color: "#3f6276", textTransform: "uppercase" }}>{active.key}</span>
        <span aria-hidden="true" style={{ fontSize: 9, color: "#7596a5" }}>▼</span>
      </button>
      {open && (
        <ul
          role="listbox"
          style={{
            position: "absolute",
            top: "calc(100% + 6px)",
            right: 0,
            minWidth: 168,
            background: "#fff",
            border: "1px solid #e4eff3",
            borderRadius: 12,
            boxShadow: "0 18px 40px -22px rgba(11,51,68,.5)",
            padding: 6,
            margin: 0,
            listStyle: "none",
            zIndex: 60,
          }}
        >
          {languageOptions.map((opt) => {
            const on = opt.key === language;
            const name = resolveLocale(opt.key).languageName;
            return (
              <li key={opt.key} role="option" aria-selected={on}>
                <button
                  type="button"
                  onClick={() => {
                    setLanguage(opt.key);
                    setOpen(false);
                  }}
                  className="mm-navlink"
                  style={{
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    background: on ? "#eaf7fa" : "transparent",
                    border: "none",
                    borderRadius: 8,
                    padding: "9px 11px",
                    cursor: "pointer",
                    fontFamily: SANS,
                    fontSize: 14.5,
                    color: on ? C.brand : "#3f6276",
                    fontWeight: on ? 700 : 500,
                    textAlign: "left",
                  }}
                >
                  <span style={{ fontSize: 17, lineHeight: 1 }}>{opt.label}</span>
                  <span>{name}</span>
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

const Logo = ({ onClick, small = false }) => (
  <div onClick={onClick} style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer", flexShrink: 0 }}>
    <picture>
      <source srcSet={BRAND.logoWebp} type="image/webp" />
      <img src={BRAND.logo} alt="MoMicro" width={small ? 30 : 32} height={small ? 30 : 32} style={{ width: small ? 30 : 32, height: small ? 30 : 32, objectFit: "contain" }} decoding="async" />
    </picture>
    <span style={{ fontFamily: SANS, fontSize: small ? 18 : 20, fontWeight: 700, letterSpacing: "-.02em", color: C.ink }}>MoMicro</span>
    {!small && (
      <span style={{ fontFamily: MONO, fontSize: 9.5, fontWeight: 600, letterSpacing: ".06em", color: C.brand, border: "1px solid #bfe3ec", borderRadius: 5, padding: "2px 6px", background: "#eaf7fa" }}>
        AI&nbsp;AGENT
      </span>
    )}
  </div>
);

const Header = ({ active }) => {
  const { go, path } = useSiteNav();
  const { t } = useI18n();
  const c = useContentNav();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header style={{ position: "sticky", top: 0, zIndex: 50, background: "rgba(244,250,251,.82)", backdropFilter: "blur(14px)", borderBottom: "1px solid #d9e9ee" }}>
      <div style={{ maxWidth: 1240, margin: "0 auto", padding: "13px 24px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 18 }}>
        <Logo onClick={() => go("home")} />

        <nav aria-label="Primary" className="mm-desktop-nav" style={{ alignItems: "center", gap: 2 }}>
          {NAV_KEYS.map((key) => {
            const on = active === key;
            return (
              <a
                key={key}
                href={path(key)}
                onClick={(e) => { e.preventDefault(); go(key); }}
                className="mm-navlink"
                style={{ fontSize: 14.5, fontWeight: on ? 600 : 500, color: on ? C.brand : "#3f6276", padding: "8px 12px", borderRadius: 8, cursor: "pointer", whiteSpace: "nowrap", textDecoration: "none" }}
              >
                {c.nav[key]}
              </a>
            );
          })}
        </nav>

        <div className="mm-desktop-actions" style={{ alignItems: "center", gap: 10, flexShrink: 0 }}>
          <LanguageSwitcher />
          <a href={path("login")} onClick={(e) => { e.preventDefault(); go("login"); }} style={{ fontSize: 14.5, fontWeight: 500, color: "#3f6276", cursor: "pointer", whiteSpace: "nowrap", textDecoration: "none" }}>
            {c.actions.login}
          </a>
          <button onClick={() => go("login")} className="mm-lift" style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "linear-gradient(135deg,#0a93d4,#23b7c4)", color: "#fff", fontWeight: 600, fontFamily: SANS, fontSize: 14.5, padding: "10px 18px", border: "none", borderRadius: 10, cursor: "pointer", whiteSpace: "nowrap", boxShadow: "0 10px 22px -10px rgba(10,147,212,.6)" }}>
            {c.actions.startFreeArrow}
          </button>
        </div>

        <button aria-label="Open menu" className="mm-burger" onClick={() => setMenuOpen(true)} style={{ flexDirection: "column", gap: 5, padding: 8, cursor: "pointer", background: "none", border: "none" }}>
          <span style={{ width: 24, height: 2.5, background: C.ink, borderRadius: 2 }} />
          <span style={{ width: 24, height: 2.5, background: C.ink, borderRadius: 2 }} />
          <span style={{ width: 24, height: 2.5, background: C.ink, borderRadius: 2 }} />
        </button>
      </div>

      {menuOpen && (
        <div style={{ position: "fixed", inset: 0, zIndex: 100, background: "rgba(8,30,40,.45)", backdropFilter: "blur(4px)" }} onClick={() => setMenuOpen(false)}>
          <div onClick={(e) => e.stopPropagation()} style={{ position: "absolute", top: 0, right: 0, width: "82%", maxWidth: 330, height: "100%", background: C.bg, padding: 22, boxShadow: "-20px 0 50px rgba(8,30,40,.3)", overflowY: "auto" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 22 }}>
              <Logo small onClick={() => { setMenuOpen(false); go("home"); }} />
              <button aria-label="Close menu" onClick={() => setMenuOpen(false)} style={{ fontSize: 26, color: C.ink, cursor: "pointer", lineHeight: 1, background: "none", border: "none" }}>×</button>
            </div>
            {NAV_KEYS.map((key) => (
              <div key={key} onClick={() => { setMenuOpen(false); go(key); }} style={{ fontFamily: SANS, fontSize: 18, fontWeight: 600, color: active === key ? C.brand : "#3f6276", padding: "13px 0", borderBottom: "1px solid #e0eef3", cursor: "pointer" }}>
                {c.nav[key]}
              </div>
            ))}
            <div style={{ marginTop: 18, marginBottom: 18 }}>
              <LanguageSwitcher compact />
            </div>
            <button onClick={() => { setMenuOpen(false); go("login"); }} style={{ width: "100%", background: "linear-gradient(135deg,#0a93d4,#23b7c4)", color: "#fff", fontWeight: 600, fontFamily: SANS, fontSize: 16, padding: 15, border: "none", borderRadius: 11, cursor: "pointer" }}>
              {c.actions.startFreeArrow}
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

const Footer = () => {
  const { go } = useSiteNav();
  const c = useContentNav();
  const f = c.footer;
  return (
    <footer style={{ marginTop: "auto", background: "#fff", borderTop: "1px solid #e0eef3" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "48px 24px", display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(160px,1fr))", gap: 32 }}>
        <div style={{ gridColumn: "1/-1", maxWidth: 340 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
            <img src={BRAND.logo} alt="MoMicro" width={30} height={30} style={{ width: 30, height: 30, objectFit: "contain" }} />
            <span style={{ fontFamily: SANS, fontSize: 19, fontWeight: 700, letterSpacing: "-.02em", color: C.ink }}>MoMicro</span>
          </div>
          <p style={{ fontSize: 14, lineHeight: 1.6, color: C.bodySoft, margin: 0 }}>{f.tagline}</p>
        </div>
        {f.cols.map((col) => (
          <div key={col.title}>
            <div style={{ fontFamily: MONO, fontSize: 11.5, letterSpacing: ".06em", textTransform: "uppercase", color: "#9cb3bd", marginBottom: 14 }}>{col.title}</div>
            {col.links.map((l) => (
              <div key={l.label} onClick={() => go(l.k)} className="mm-flink" style={{ fontSize: 14.5, color: "#3f6276", padding: "5px 0", cursor: "pointer" }}>{l.label}</div>
            ))}
          </div>
        ))}
      </div>
      <div style={{ borderTop: "1px solid #eef5f8", padding: "18px 24px", textAlign: "center", fontSize: 13, color: "#9cb3bd" }}>{f.legal}</div>
    </footer>
  );
};

// Small helper so Header/Footer read the active-language content without prop drilling.
let _contentCache = { lang: null, content: null };
const useContentNav = () => {
  const { language } = useI18n();
  if (_contentCache.lang !== language) {
    _contentCache = { lang: language, content: getSiteContent(language) };
  }
  return _contentCache.content;
};

// Page wrapper: injects per-route SEO, renders header + main + footer.
export const SiteShell = ({ pageKey, seo, children }) => {
  const { language } = useI18n();
  const localeConfig = resolveLocale(language);

  usePublicSeo({
    localeConfig,
    seo,
    pathname: SITE_ROUTES[pageKey] || "/",
    siteName: "MoMicro",
  });

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", overflowX: "clip", background: C.bg, fontFamily: SANS, color: C.ink }}>
      <Header active={pageKey} />
      <main>{children}</main>
      <Footer />
    </div>
  );
};

// Re-export for pages that need active-language content.
export { useContentNav as useSiteContent };
