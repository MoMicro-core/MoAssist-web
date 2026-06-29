import { useI18n } from "../context/I18nContext";
import { getSiteContent } from "../content/site";
import { INTEGRATIONS } from "../content/site/shared";
import { C, GRAD } from "../content/site/theme";
import { useReveal } from "../site/useReveal";
import { SiteShell } from "../site/SiteShell";
import { Aurora, Badge, RouteCTA, FONTS } from "../site/ui";

const { SANS, MONO } = FONTS;

export const SitePlatform = () => {
  const { language } = useI18n();
  const c = getSiteContent(language);
  useReveal([language]);
  const p = c.platform;

  return (
    <SiteShell pageKey="platform" seo={c.seo.platform}>
      <section style={{ position: "relative", overflow: "hidden", borderBottom: "1px solid #e0eef3" }}>
        <Aurora style={{ top: -120, right: -80, width: 480, height: 480, background: "radial-gradient(circle,rgba(43,196,204,.26),transparent 65%)" }} />
        <div style={{ position: "relative", maxWidth: 980, margin: "0 auto", padding: "64px 24px 48px", textAlign: "center" }}>
          <div style={{ display: "flex", justifyContent: "center", marginBottom: 22 }}><Badge dot>{p.badge}</Badge></div>
          <h1 style={{ fontFamily: SANS, fontWeight: 700, fontSize: 46, lineHeight: 1.05, letterSpacing: "-.03em", margin: "0 0 18px" }}>{p.title}</h1>
          <p style={{ fontSize: 18, lineHeight: 1.6, color: C.body, maxWidth: 600, margin: "0 auto" }}>{p.sub}</p>
        </div>
      </section>

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "48px 24px 8px" }}>
        {p.capabilities.map((cap) => (
          <div key={cap.tag} data-reveal className="mm-reveal" style={{ background: "#fff", border: "1px solid #e4eff3", borderRadius: 20, padding: 32, marginBottom: 20, display: "flex", flexWrap: "wrap", gap: 30, alignItems: "flex-start" }}>
            <div style={{ flex: "1 1 320px", minWidth: 280 }}>
              <div style={{ fontFamily: MONO, fontSize: 11.5, letterSpacing: ".05em", color: C.brand, marginBottom: 12 }}>{cap.tag}</div>
              <h3 style={{ fontFamily: SANS, fontWeight: 700, fontSize: 27, lineHeight: 1.14, letterSpacing: "-.02em", margin: "0 0 12px" }}>{cap.title}</h3>
              <p style={{ fontSize: 16, lineHeight: 1.6, color: C.body, margin: 0 }}>{cap.body}</p>
            </div>
            <div style={{ flex: "1 1 240px", minWidth: 240, display: "grid", gap: 9 }}>
              {cap.points.map((pt) => (
                <div key={pt} style={{ display: "flex", alignItems: "center", gap: 11, background: "#f4fafb", border: "1px solid #e4eff3", borderRadius: 11, padding: "13px 15px" }}>
                  <span style={{ width: 22, height: 22, borderRadius: 6, background: "#eaf7fa", color: C.brand, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 13, flexShrink: 0 }}>✓</span>
                  <span style={{ fontSize: 14.5, fontWeight: 500, color: "#1d4f63" }}>{pt}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* integrations */}
      <div data-reveal className="mm-reveal" style={{ maxWidth: 1100, margin: "0 auto", padding: "36px 24px 8px" }}>
        <div style={{ background: GRAD.dark, borderRadius: 22, padding: "40px 32px", textAlign: "center" }}>
          <h2 style={{ fontFamily: SANS, fontWeight: 700, fontSize: 30, letterSpacing: "-.02em", color: "#fff", margin: "0 0 10px" }}>{p.integrationsTitle}</h2>
          <p style={{ fontSize: 15.5, color: "#a9cdda", maxWidth: 540, margin: "0 auto 26px" }}>{p.integrationsSub}</p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 10, justifyContent: "center" }}>
            {INTEGRATIONS.map((i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, background: "#0c2c3b", border: "1px solid #1d4a5e", borderRadius: 11, padding: "11px 16px", fontSize: 14, fontWeight: 500, color: "#dff0f5" }}>
                <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#5cd7d3" }} />{i}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* trust */}
      <div data-reveal className="mm-reveal" style={{ maxWidth: 1100, margin: "0 auto", padding: "48px 24px 8px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))", gap: 16 }}>
          {p.trustPoints.map((t) => (
            <div key={t.title} style={{ background: "#fff", border: "1px solid #e4eff3", borderRadius: 16, padding: 24 }}>
              <div style={{ fontFamily: SANS, fontWeight: 700, fontSize: 18, marginBottom: 8, color: C.ink }}>{t.title}</div>
              <div style={{ fontSize: 14, lineHeight: 1.55, color: C.bodySoft }}>{t.body}</div>
            </div>
          ))}
        </div>
      </div>

      <RouteCTA title={p.cta.title} sub={p.cta.sub} btnLabel={c.actions.startFreeArrow} to="login" size="md" />
    </SiteShell>
  );
};

export default SitePlatform;
