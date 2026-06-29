import { useI18n } from "../context/I18nContext";
import { getSiteContent } from "../content/site";
import { CHATBOT_FILES } from "../content/site/shared";
import { C, GRAD } from "../content/site/theme";
import { useReveal } from "../site/useReveal";
import { useSiteNav } from "../site/routes";
import { SiteShell } from "../site/SiteShell";
import { Aurora, Badge, GradButton, OutlineButton, RouteCTA, FONTS } from "../site/ui";

const { SANS, MONO } = FONTS;

export const SiteChatbot = () => {
  const { language } = useI18n();
  const c = getSiteContent(language);
  const { go } = useSiteNav();
  useReveal([language]);
  const b = c.chatbot;

  return (
    <SiteShell pageKey="chatbot" seo={c.seo.chatbot}>
      <section style={{ position: "relative", overflow: "hidden", borderBottom: "1px solid #e0eef3" }}>
        <Aurora style={{ top: -120, right: -70, width: 460, height: 460, background: "radial-gradient(circle,rgba(43,196,204,.24),transparent 65%)" }} />
        <div style={{ position: "relative", maxWidth: 1100, margin: "0 auto", padding: "60px 24px 48px", display: "flex", flexWrap: "wrap", gap: 44, alignItems: "center" }}>
          <div style={{ flex: "1 1 380px", minWidth: 300 }}>
            <div style={{ marginBottom: 22 }}><Badge dot>{b.badge}</Badge></div>
            <h1 style={{ fontFamily: SANS, fontWeight: 700, fontSize: 46, lineHeight: 1.05, letterSpacing: "-.03em", margin: "0 0 18px" }}>
              {b.title.split(b.titleHi)[0]}<span style={{ color: C.brand }}>{b.titleHi}</span>{b.title.split(b.titleHi)[1]}
            </h1>
            <p style={{ fontSize: 18, lineHeight: 1.6, color: C.body, margin: "0 0 26px", maxWidth: 520 }}>{b.sub}</p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
              <GradButton onClick={() => go("login")}>{b.ctaPrimary}</GradButton>
              <OutlineButton onClick={() => go("how")}>{b.ctaSecondary}</OutlineButton>
            </div>
          </div>
          <div style={{ flex: "1 1 320px", minWidth: 300 }}>
            <div style={{ background: GRAD.panelDark, border: "1px solid #16404f", borderRadius: 20, padding: 20, boxShadow: "0 34px 70px -38px rgba(8,30,40,.7)" }}>
              <div style={{ border: "1.5px dashed #2a5566", borderRadius: 13, padding: 18, textAlign: "center", marginBottom: 14 }}>
                <div style={{ width: 34, height: 34, borderRadius: "50%", background: "#123141", color: "#5cd7d3", fontSize: 18, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 8px" }}>↑</div>
                <div style={{ fontFamily: MONO, fontSize: 11.5, color: "#8fb9c6" }}>{b.drop}</div>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {CHATBOT_FILES.map((f) => (
                  <div key={f.name} style={{ display: "flex", alignItems: "center", gap: 10, background: "#0c2c3b", border: "1px solid #16414f", borderRadius: 9, padding: "10px 12px" }}>
                    <span style={{ fontSize: 13 }}>📄</span>
                    <span style={{ fontFamily: MONO, fontSize: 11.5, color: "#cfe7ee", flex: 1 }}>{f.name}</span>
                    <span style={{ fontFamily: MONO, fontSize: 9.5, color: "#5cd7d3" }}>{f.indexed ? b.indexedStates.indexed : b.indexedStates.reading}</span>
                  </div>
                ))}
              </div>
              <div style={{ marginTop: 14, display: "flex", alignItems: "center", gap: 8, fontFamily: MONO, fontSize: 10.5, color: "#5cd7d3" }}>
                <span className="mm-livedot" style={{ width: 7, height: 7, borderRadius: "50%", background: "#5cd7d3" }} />{b.trained}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* steps */}
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "50px 24px 8px" }}>
        <div data-reveal className="mm-reveal" style={{ textAlign: "center", marginBottom: 28 }}>
          <div style={{ fontFamily: MONO, fontSize: 13, letterSpacing: ".06em", textTransform: "uppercase", color: C.teal, marginBottom: 10 }}>{b.stepsHead.kicker}</div>
          <h2 style={{ fontFamily: SANS, fontWeight: 700, fontSize: 32, letterSpacing: "-.02em", margin: 0 }}>{b.stepsHead.title}</h2>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))", gap: 16 }}>
          {b.steps.map((s) => (
            <div key={s.n} data-reveal className="mm-reveal" style={{ background: "#fff", border: "1px solid #e4eff3", borderRadius: 18, padding: 26 }}>
              <div style={{ width: 40, height: 40, borderRadius: 11, background: GRAD.brand, color: "#fff", fontFamily: SANS, fontWeight: 700, fontSize: 17, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 14 }}>{s.n}</div>
              <h3 style={{ fontFamily: SANS, fontWeight: 700, fontSize: 19, letterSpacing: "-.015em", margin: "0 0 8px" }}>{s.title}</h3>
              <p style={{ fontSize: 14.5, lineHeight: 1.55, color: C.bodySoft, margin: 0 }}>{s.body}</p>
            </div>
          ))}
        </div>
      </div>

      {/* handles */}
      <div data-reveal className="mm-reveal" style={{ maxWidth: 1100, margin: "0 auto", padding: "44px 24px 8px" }}>
        <div style={{ background: "#fff", border: "1px solid #e4eff3", borderRadius: 22, padding: 34, display: "flex", flexWrap: "wrap", gap: 30, alignItems: "center" }}>
          <div style={{ flex: "1 1 280px", minWidth: 260 }}>
            <h2 style={{ fontFamily: SANS, fontWeight: 700, fontSize: 27, letterSpacing: "-.02em", margin: "0 0 12px" }}>{b.handlesTitle}</h2>
            <p style={{ fontSize: 16, lineHeight: 1.6, color: C.body, margin: 0 }}>{b.handlesBody}</p>
          </div>
          <div style={{ flex: "1 1 320px", minWidth: 280, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            {b.handles.map((h) => (
              <div key={h} style={{ display: "flex", alignItems: "center", gap: 9, background: "#f4fafb", border: "1px solid #e4eff3", borderRadius: 11, padding: "12px 13px" }}>
                <span style={{ color: C.teal, fontWeight: 700, fontSize: 13 }}>✓</span><span style={{ fontSize: 13.5, fontWeight: 500, color: "#1d4f63" }}>{h}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* upsell band */}
      <div data-reveal className="mm-reveal" style={{ maxWidth: 1100, margin: "0 auto", padding: "24px 24px 8px" }}>
        <div style={{ background: GRAD.dark, borderRadius: 18, padding: "26px 30px", display: "flex", flexWrap: "wrap", gap: 18, alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ flex: "1 1 360px" }}>
            <div style={{ fontFamily: SANS, fontWeight: 700, fontSize: 21, color: "#fff", letterSpacing: "-.015em", marginBottom: 4 }}>
              {b.upsell.titleA}<span style={{ color: "#5cd7d3" }}>{b.upsell.act}</span>{b.upsell.titleB}
            </div>
            <div style={{ fontSize: 14.5, color: "#a9cdda" }}>{b.upsell.body}</div>
          </div>
          <button onClick={() => go("how")} className="mm-lift" style={{ background: "#5cd7d3", color: "#08303f", fontWeight: 700, fontFamily: SANS, fontSize: 14.5, padding: "12px 22px", border: "none", borderRadius: 11, cursor: "pointer", whiteSpace: "nowrap" }}>{b.upsell.cta}</button>
        </div>
      </div>

      {/* dashboard via API */}
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "50px 24px 8px" }}>
        <div data-reveal className="mm-reveal" style={{ textAlign: "center", marginBottom: 28 }}>
          <div style={{ fontFamily: MONO, fontSize: 13, letterSpacing: ".06em", textTransform: "uppercase", color: C.teal, marginBottom: 10 }}>{b.dash.kicker}</div>
          <h2 style={{ fontFamily: SANS, fontWeight: 700, fontSize: 34, letterSpacing: "-.025em", margin: "0 auto", maxWidth: 640 }}>{b.dash.title}</h2>
        </div>
        <div data-reveal className="mm-reveal" style={{ background: "#fff", border: "1px solid #e4eff3", borderRadius: 22, padding: 34, display: "flex", flexWrap: "wrap-reverse", gap: 36, alignItems: "center" }}>
          <div style={{ flex: "1 1 340px", minWidth: 280, background: C.navy, borderRadius: 16, padding: 16, boxShadow: "0 26px 54px -34px rgba(8,30,40,.6)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
              <span style={{ width: 9, height: 9, borderRadius: "50%", background: "#2a5566" }} /><span style={{ width: 9, height: 9, borderRadius: "50%", background: "#2a5566" }} /><span style={{ width: 9, height: 9, borderRadius: "50%", background: "#2a5566" }} />
              <div style={{ flex: 1, background: "#0c2c3b", border: "1px solid #16414f", borderRadius: 7, padding: "5px 10px", fontFamily: MONO, fontSize: 10, color: "#8fb9c6" }}>{b.dash.browser}</div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, background: "#10384a", border: "1px solid #1d5566", borderRadius: 10, padding: "9px 11px" }}>
                <div style={{ width: 30, height: 30, borderRadius: "50%", background: GRAD.brand, color: "#fff", fontWeight: 700, fontSize: 12, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontFamily: SANS }}>S</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 12.5, color: "#eaf7fa", fontWeight: 600 }}>{b.dash.msg1Name}</div>
                  <div style={{ fontSize: 11, color: "#8fb9c6", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{b.dash.msg1}</div>
                </div>
                <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#5cd7d3", flexShrink: 0 }} />
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 10, background: "#0c2c3b", border: "1px solid #16414f", borderRadius: 10, padding: "9px 11px" }}>
                <div style={{ width: 30, height: 30, borderRadius: "50%", background: "#1d4a5e", color: "#cfe7ee", fontWeight: 700, fontSize: 12, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontFamily: SANS }}>J</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 12.5, color: "#cfe7ee", fontWeight: 600 }}>{b.dash.msg2Name}</div>
                  <div style={{ fontSize: 11, color: "#6f9aa8", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{b.dash.msg2}</div>
                </div>
              </div>
            </div>
            <div style={{ marginTop: 10, background: "#0c2c3b", border: "1px solid #16414f", borderRadius: 10, padding: 12 }}>
              <div style={{ fontFamily: MONO, fontSize: 9.5, letterSpacing: ".05em", color: "#8fb9c6", marginBottom: 8 }}>{b.dash.infoLabel}</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                <span style={{ fontFamily: MONO, fontSize: 10, color: "#dff0f5", background: "#081f2b", borderRadius: 6, padding: "4px 8px" }}>sarah@email.com</span>
                <span style={{ fontFamily: MONO, fontSize: 10, color: "#dff0f5", background: "#081f2b", borderRadius: 6, padding: "4px 8px" }}>12 orders</span>
                <span style={{ fontFamily: MONO, fontSize: 10, color: "#5cd7d3", background: "#081f2b", borderRadius: 6, padding: "4px 8px" }}>VIP · €2.4k LTV</span>
              </div>
            </div>
            <div style={{ marginTop: 10, display: "flex", gap: 8 }}>
              <div style={{ flex: 1, background: "#0c2c3b", border: "1px solid #16414f", borderRadius: 9, padding: "9px 12px", fontSize: 11.5, color: "#6f9aa8" }}>{b.dash.replyPlaceholder}</div>
              <div style={{ background: GRAD.brand, color: "#fff", fontWeight: 600, fontSize: 12, padding: "9px 14px", borderRadius: 9, display: "flex", alignItems: "center" }}>{b.dash.send}</div>
            </div>
            <div style={{ marginTop: 11, fontFamily: MONO, fontSize: 9.5, color: "#5a8493" }}>&lt;script src="cdn.momicro.ai/dashboard.js"&gt;&lt;/script&gt;</div>
          </div>
          <div style={{ flex: "1 1 320px", minWidth: 280 }}>
            <p style={{ fontSize: 16, lineHeight: 1.6, color: C.body, margin: "0 0 18px" }}>{b.dash.body}</p>
            <div style={{ display: "grid", gap: 9 }}>
              {b.dash.features.map((d) => (
                <div key={d.title} style={{ display: "flex", alignItems: "flex-start", gap: 11, background: "#f4fafb", border: "1px solid #e4eff3", borderRadius: 11, padding: "13px 15px" }}>
                  <span style={{ width: 24, height: 24, borderRadius: 6, background: "#eaf7fa", color: C.brand, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 12, fontFamily: MONO, flexShrink: 0 }}>{d.icon}</span>
                  <div>
                    <div style={{ fontSize: 14.5, fontWeight: 600, color: "#1d4f63" }}>{d.title}</div>
                    <div style={{ fontSize: 13, color: "#6b8794", lineHeight: 1.45 }}>{d.desc}</div>
                  </div>
                </div>
              ))}
            </div>
            <div style={{ marginTop: 16, fontFamily: MONO, fontSize: 11.5, color: "#0a7bb5", background: "#eaf7fa", border: "1px solid #bfe3ec", borderRadius: 8, padding: "8px 12px", display: "inline-block" }}>{b.dash.note}</div>
          </div>
        </div>
      </div>

      <RouteCTA title={b.cta.title} sub={b.cta.sub} btnLabel={b.cta.btn} to="pricing" />
    </SiteShell>
  );
};

export default SiteChatbot;
