import { useI18n } from "../context/I18nContext";
import { getSiteContent } from "../content/site";
import { C, GRAD } from "../content/site/theme";
import { useReveal } from "../site/useReveal";
import { useSiteNav } from "../site/routes";
import { SiteShell } from "../site/SiteShell";
import { Aurora, Badge, RouteCTA, FONTS } from "../site/ui";

const { SANS, MONO } = FONTS;

export const SiteHow = () => {
  const { language } = useI18n();
  const c = getSiteContent(language);
  const { go } = useSiteNav();
  useReveal([language]);
  const h = c.how;

  return (
    <SiteShell pageKey="how" seo={c.seo.how}>
      <section style={{ position: "relative", overflow: "hidden", borderBottom: "1px solid #e0eef3" }}>
        <Aurora style={{ top: -130, right: -70, width: 480, height: 480, background: "radial-gradient(circle,rgba(43,196,204,.26),transparent 65%)" }} />
        <div style={{ position: "relative", maxWidth: 900, margin: "0 auto", padding: "60px 24px 44px", textAlign: "center" }}>
          <div style={{ display: "flex", justifyContent: "center", marginBottom: 22 }}><Badge dot>{h.badge}</Badge></div>
          <h1 style={{ fontFamily: SANS, fontWeight: 700, fontSize: 46, lineHeight: 1.04, letterSpacing: "-.03em", margin: "0 0 18px" }}>
            {h.title.split(h.titleHi)[0]}<span style={{ color: C.brand }}>{h.titleHi}</span>{h.title.split(h.titleHi)[1]}
          </h1>
          <p style={{ fontSize: 18, lineHeight: 1.6, color: C.body, maxWidth: 560, margin: "0 auto" }}>{h.sub}</p>
        </div>
      </section>

      {/* glance stepper */}
      <div data-reveal className="mm-reveal" style={{ maxWidth: 980, margin: "0 auto", padding: "44px 24px 8px" }}>
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 6, position: "relative" }}>
          <div style={{ position: "absolute", top: 21, left: "8%", right: "8%", height: 2, background: "linear-gradient(90deg,#bfe3ec,#5cd7d3)", zIndex: 0 }} />
          {h.steps.map((s) => (
            <div key={s.n} style={{ position: "relative", zIndex: 1, flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 10, textAlign: "center" }}>
              <div style={{ width: 44, height: 44, borderRadius: "50%", background: GRAD.brand, color: "#fff", fontFamily: SANS, fontWeight: 700, fontSize: 17, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 0 0 5px #f4fafb" }}>{s.n}</div>
              <div style={{ fontSize: 12.5, fontWeight: 600, color: "#1d4f63", maxWidth: 120 }}>{s.short}</div>
            </div>
          ))}
        </div>
      </div>

      {/* vertical timeline */}
      <div style={{ maxWidth: 760, margin: "0 auto", padding: "30px 24px 8px" }}>
        {h.steps.map((s) => (
          <div key={s.n} data-reveal className="mm-reveal" style={{ display: "flex", gap: 20, alignItems: "stretch" }}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", flexShrink: 0 }}>
              <div style={{ width: 46, height: 46, borderRadius: 13, background: s.accent ? "linear-gradient(135deg,#0b3344,#0a93d4)" : GRAD.brand, color: "#fff", fontFamily: SANS, fontWeight: 700, fontSize: 18, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>{s.n}</div>
              <div style={{ flex: 1, width: 2, background: "#dcebef", margin: "6px 0", minHeight: 18 }} />
            </div>
            <div style={{ flex: 1, background: "#fff", border: "1px solid #e4eff3", borderRadius: 16, padding: "22px 24px", marginBottom: 16 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap", marginBottom: 9 }}>
                <h3 style={{ fontFamily: SANS, fontWeight: 700, fontSize: 20, letterSpacing: "-.015em", margin: 0 }}>{s.title}</h3>
                {s.accent && <span style={{ fontFamily: MONO, fontSize: 9.5, fontWeight: 600, color: "#0a7bb5", background: "#eaf7fa", border: "1px solid #bfe3ec", borderRadius: 5, padding: "2px 7px" }}>{h.core}</span>}
              </div>
              <p style={{ fontSize: 15.5, lineHeight: 1.55, color: C.bodySoft, margin: "0 0 14px" }}>{s.line}</p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 7 }}>
                {s.chips.map((chip) => (
                  <span key={chip} style={{ fontFamily: MONO, fontSize: 11.5, fontWeight: 500, color: "#3f6276", background: "#f4fafb", border: "1px solid #e4eff3", borderRadius: 7, padding: "5px 10px" }}>{chip}</span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* live example */}
      <div data-reveal className="mm-reveal" style={{ maxWidth: 900, margin: "0 auto", padding: "30px 24px 8px" }}>
        <div style={{ background: GRAD.panelDark, borderRadius: 22, padding: 30, display: "flex", flexWrap: "wrap", gap: 30, alignItems: "center" }}>
          <div style={{ flex: "1 1 240px", minWidth: 220 }}>
            <div style={{ fontFamily: MONO, fontSize: 11.5, letterSpacing: ".05em", color: "#5cd7d3", marginBottom: 12 }}>{h.example.kicker}</div>
            <h3 style={{ fontFamily: SANS, fontWeight: 700, fontSize: 25, lineHeight: 1.16, letterSpacing: "-.02em", color: "#fff", margin: "0 0 12px" }}>{h.example.title}</h3>
            <p style={{ fontSize: 15, lineHeight: 1.6, color: "#a9cdda", margin: "0 0 18px" }}>{h.example.body}</p>
            <button onClick={() => go("login")} className="mm-lift" style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "#5cd7d3", color: "#08303f", fontWeight: 700, fontFamily: SANS, fontSize: 15, padding: "12px 22px", border: "none", borderRadius: 11, cursor: "pointer" }}>{c.actions.tryFree}</button>
          </div>
          <div style={{ flex: "1 1 280px", minWidth: 260, display: "flex", flexDirection: "column", gap: 9 }}>
            <div style={{ alignSelf: "flex-end", maxWidth: "88%", background: "#1d4a5e", color: "#dff0f5", fontSize: 13, lineHeight: 1.45, padding: "10px 13px", borderRadius: "13px 13px 4px 13px" }}>{h.example.user}</div>
            <div style={{ display: "flex", alignItems: "center", gap: 9, background: "#0c2c3b", border: "1px solid #16414f", borderRadius: 10, padding: "9px 12px" }}>
              <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#5cd7d3", flexShrink: 0 }} />
              <span style={{ fontFamily: MONO, fontSize: 11, color: "#8fb9c6" }}>{h.example.step}</span>
              <span style={{ marginLeft: "auto", fontFamily: MONO, fontSize: 11, color: "#5cd7d3" }}>{h.example.done}</span>
            </div>
            <div style={{ alignSelf: "flex-start", maxWidth: "92%", background: GRAD.brand, color: "#fff", fontSize: 13, lineHeight: 1.5, padding: "10px 13px", borderRadius: "13px 13px 13px 4px" }}>{h.example.reply}</div>
          </div>
        </div>
      </div>

      <RouteCTA title={h.cta.title} sub={h.cta.sub} btnLabel={c.actions.startFreeArrow} to="login" size="md" />
    </SiteShell>
  );
};

export default SiteHow;
