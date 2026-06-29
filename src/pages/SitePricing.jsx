import { useState } from "react";
import { useI18n } from "../context/I18nContext";
import { getSiteContent } from "../content/site";
import { PRICES } from "../content/site/shared";
import { C, GRAD } from "../content/site/theme";
import { useReveal } from "../site/useReveal";
import { useSiteNav } from "../site/routes";
import { SiteShell } from "../site/SiteShell";
import { RouteCTA, FONTS } from "../site/ui";

const { SANS, MONO } = FONTS;

const FREE = { bg: "#fff", border: "1px solid #e4eff3", fg: "#0b3344", muted: "#5b7889", check: "#23b7c4", ctaBg: "#fff", ctaFg: "#0b3344", ctaBorder: "1px solid #cfe6ee" };
const FEAT = { bg: "linear-gradient(160deg,#0b3344,#12455c)", border: "1px solid #12455c", fg: "#fff", muted: "#a9cdda", check: "#5cd7d3", ctaBg: "#5cd7d3", ctaFg: "#0b3344", ctaBorder: "none" };

export const SitePricing = () => {
  const { language } = useI18n();
  const c = getSiteContent(language);
  const { go } = useSiteNav();
  const [open, setOpen] = useState(0);
  useReveal([language]);
  const p = c.pricing;
  const price = { free: PRICES.free, connected: PRICES.connected, ai: PRICES.ai };

  return (
    <SiteShell pageKey="pricing" seo={c.seo.pricing}>
      <section style={{ position: "relative", overflow: "hidden" }}>
        <div aria-hidden="true" style={{ position: "absolute", top: -120, left: "50%", transform: "translateX(-50%)", width: 560, height: 420, borderRadius: "50%", background: "radial-gradient(circle,rgba(43,196,204,.22),transparent 65%)", filter: "blur(18px)", pointerEvents: "none" }} />
        <div style={{ position: "relative", maxWidth: 980, margin: "0 auto", padding: "60px 24px 16px", textAlign: "center" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "#fff", border: "1px solid #cfe6ee", color: C.brand, fontFamily: MONO, fontSize: 12, fontWeight: 600, letterSpacing: ".04em", padding: "7px 14px", borderRadius: 100, marginBottom: 20 }}>{p.badge}</div>
          <h1 style={{ fontFamily: SANS, fontWeight: 700, fontSize: 44, lineHeight: 1.06, letterSpacing: "-.03em", margin: "0 0 16px" }}>{p.title}</h1>
          <p style={{ fontSize: 17.5, lineHeight: 1.6, color: C.body, maxWidth: 560, margin: "0 auto" }}>{p.sub}</p>
        </div>
      </section>

      {/* tiers */}
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "34px 24px 8px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: 20, alignItems: "start" }}>
          {p.tiers.map((t) => {
            const s = t.featured ? FEAT : FREE;
            return (
              <div key={t.key} data-reveal className="mm-reveal" style={{ position: "relative", background: s.bg, border: s.border, borderRadius: 20, padding: 30, boxShadow: "0 24px 50px -34px rgba(11,51,68,.4)" }}>
                {t.featured && <div style={{ position: "absolute", top: 18, right: 18, fontFamily: MONO, fontSize: 10, fontWeight: 600, letterSpacing: ".05em", color: "#0b3344", background: "#5cd7d3", borderRadius: 6, padding: "4px 9px" }}>{t.badge}</div>}
                <div style={{ fontFamily: SANS, fontWeight: 600, fontSize: 15, letterSpacing: ".02em", color: s.muted, marginBottom: 14 }}>{t.name}</div>
                <div style={{ display: "flex", alignItems: "baseline", gap: 4, marginBottom: 14 }}>
                  <span style={{ fontFamily: SANS, fontWeight: 700, fontSize: 42, letterSpacing: "-.02em", color: s.fg }}>{price[t.key]}</span>
                  <span style={{ fontSize: 15, color: s.muted }}>{p.period}</span>
                </div>
                <p style={{ fontSize: 14.5, lineHeight: 1.55, color: s.muted, margin: "0 0 20px", minHeight: 44 }}>{t.summary}</p>
                <button onClick={() => go("login")} className="mm-lift" style={{ display: "block", width: "100%", textAlign: "center", background: s.ctaBg, color: s.ctaFg, border: s.ctaBorder, fontWeight: 600, fontFamily: SANS, fontSize: 15.5, padding: 13, borderRadius: 11, cursor: "pointer", marginBottom: 22 }}>{t.cta}</button>
                <div style={{ display: "flex", flexDirection: "column", gap: 11 }}>
                  {t.features.map((f) => (
                    <div key={f} style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                      <span style={{ color: s.check, fontWeight: 700, fontSize: 14, marginTop: 1 }}>✓</span>
                      <span style={{ fontSize: 14, lineHeight: 1.4, color: s.fg }}>{f}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* included note */}
      <div data-reveal className="mm-reveal" style={{ maxWidth: 1100, margin: "0 auto", padding: "14px 24px 8px" }}>
        <div style={{ background: "#eaf7fa", border: "1px solid #cfe6ee", borderRadius: 14, padding: "16px 22px", display: "flex", flexWrap: "wrap", gap: 12, alignItems: "center", justifyContent: "center", textAlign: "center" }}>
          <span style={{ fontFamily: MONO, fontSize: 10.5, fontWeight: 600, letterSpacing: ".04em", color: "#0a7bb5", background: "#fff", border: "1px solid #bfe3ec", borderRadius: 6, padding: "4px 9px" }}>{p.includedTag}</span>
          <span className="mm-richtext" style={{ fontSize: 15, color: "#1d4f63" }} dangerouslySetInnerHTML={{ __html: p.includedNote }} />
        </div>
      </div>

      {/* comparison */}
      <div data-reveal className="mm-reveal" style={{ maxWidth: 900, margin: "0 auto", padding: "44px 24px 8px" }}>
        <h2 style={{ fontFamily: SANS, fontWeight: 700, fontSize: 28, letterSpacing: "-.02em", margin: "0 0 20px", textAlign: "center" }}>{p.compareTitle}</h2>
        <div style={{ background: "#fff", border: "1px solid #e4eff3", borderRadius: 18, overflow: "hidden", overflowX: "auto" }}>
          <div style={{ minWidth: 520 }}>
            <div style={{ display: "grid", gridTemplateColumns: "1.7fr 1fr 1fr 1fr", background: C.bg, borderBottom: "1px solid #e4eff3", padding: "15px 22px", fontSize: 13.5, fontWeight: 600 }}>
              <div style={{ color: "#7596a5" }}>&nbsp;</div>
              <div style={{ textAlign: "center", color: "#7596a5" }}>{p.compareCols[0]}</div>
              <div style={{ textAlign: "center", color: "#7596a5" }}>{p.compareCols[1]}</div>
              <div style={{ textAlign: "center", color: C.brand }}>{p.compareCols[2]}</div>
            </div>
            {p.rows.map((r) => (
              <div key={r.label} style={{ display: "grid", gridTemplateColumns: "1.7fr 1fr 1fr 1fr", padding: "14px 22px", borderTop: "1px solid #eef5f8", alignItems: "center", fontSize: 14 }}>
                <div style={{ fontWeight: 500, color: "#1d4f63" }}>{r.label}</div>
                <div style={{ textAlign: "center", color: "#90a8b4" }}>{r.v0}</div>
                <div style={{ textAlign: "center", color: "#90a8b4" }}>{r.v1}</div>
                <div style={{ textAlign: "center", color: C.ink, fontWeight: 600, background: "#f3fbfc" }}>{r.v2}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* FAQ */}
      <div data-reveal className="mm-reveal" style={{ maxWidth: 780, margin: "0 auto", padding: "44px 24px 20px" }}>
        <h2 style={{ fontFamily: SANS, fontWeight: 700, fontSize: 30, letterSpacing: "-.02em", margin: "0 0 22px", textAlign: "center" }}>{p.faqTitle}</h2>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {p.faqs.map((q, i) => {
            const isOpen = open === i;
            return (
              <div key={q.q} onClick={() => setOpen(isOpen ? -1 : i)} className="mm-lift" style={{ background: "#fff", border: "1px solid #e4eff3", borderRadius: 14, padding: "20px 22px", cursor: "pointer" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16 }}>
                  <div style={{ fontFamily: SANS, fontWeight: 600, fontSize: 16.5, letterSpacing: "-.01em", color: C.ink }}>{q.q}</div>
                  <div style={{ fontSize: 22, color: "#0a93d4", flexShrink: 0, lineHeight: 1 }}>{isOpen ? "–" : "+"}</div>
                </div>
                {isOpen && <div style={{ fontSize: 15, lineHeight: 1.6, color: C.body, marginTop: 12 }}>{q.a}</div>}
              </div>
            );
          })}
        </div>
      </div>

      <RouteCTA title={p.cta.title} sub={p.cta.sub} btnLabel={c.actions.startFreeArrow} to="login" size="md" />
    </SiteShell>
  );
};

export default SitePricing;
