import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useI18n } from "../context/I18nContext";
import { getSiteContent } from "../content/site";
import { buildWidgetSnippets } from "../content/site/shared";
import { COMPANY_INFO } from "../lib/companyInfo";
import { C, GRAD } from "../content/site/theme";
import { getRuntime } from "../lib/runtime";
import { useReveal } from "../site/useReveal";
import { useSiteNav } from "../site/routes";
import { SiteShell } from "../site/SiteShell";
import { Aurora, RouteCTA, FONTS } from "../site/ui";

const { SANS, MONO } = FONTS;
const TABS = ["connect", "agent", "dashboard", "files"];

const CodeBlock = ({ code, copyLabel, copiedLabel }) => {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      /* clipboard unavailable */
    }
  };
  return (
    <div style={{ position: "relative", background: C.navy, borderRadius: 12, border: "1px solid #16404f", overflow: "hidden", marginTop: 14 }}>
      <button onClick={copy} className="mm-lift" style={{ position: "absolute", top: 10, right: 10, background: copied ? "#5cd7d3" : "#0c2c3b", color: copied ? "#08303f" : "#cfe7ee", border: "1px solid #1d4a5e", borderRadius: 8, padding: "6px 12px", fontFamily: MONO, fontSize: 11.5, fontWeight: 600, cursor: "pointer" }}>
        {copied ? copiedLabel : copyLabel}
      </button>
      <pre style={{ margin: 0, padding: "18px 16px", overflowX: "auto", fontFamily: MONO, fontSize: 12.5, lineHeight: 1.6, color: "#dff0f5" }}><code>{code}</code></pre>
    </div>
  );
};

// Section heading inside a doc tab.
const H2 = ({ children }) => (
  <h2 style={{ fontFamily: SANS, fontWeight: 700, fontSize: 26, letterSpacing: "-.02em", margin: "0 0 10px", scrollMarginTop: 90 }}>{children}</h2>
);
const H3 = ({ children }) => (
  <h3 style={{ fontFamily: SANS, fontWeight: 700, fontSize: 18.5, letterSpacing: "-.015em", margin: "26px 0 8px" }}>{children}</h3>
);
const P = ({ children }) => (
  <p style={{ fontSize: 15.5, lineHeight: 1.65, color: C.body, margin: "0 0 6px" }}>{children}</p>
);

const Steps = ({ steps }) => (
  <div style={{ display: "flex", flexDirection: "column", gap: 10, margin: "14px 0 4px" }}>
    {steps.map((s) => (
      <div key={s.n} style={{ display: "flex", gap: 13, alignItems: "flex-start", background: "#fff", border: "1px solid #e4eff3", borderRadius: 12, padding: "14px 16px" }}>
        <div style={{ width: 28, height: 28, borderRadius: 8, background: GRAD.brand, color: "#fff", fontFamily: SANS, fontWeight: 700, fontSize: 13, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>{s.n}</div>
        <div>
          <div style={{ fontFamily: SANS, fontWeight: 600, fontSize: 15.5, color: C.ink, marginBottom: 2 }}>{s.title}</div>
          <div style={{ fontSize: 14.5, lineHeight: 1.55, color: C.bodySoft }}>{s.body}</div>
        </div>
      </div>
    ))}
  </div>
);

const Callout = ({ title, body, tone = "info" }) => {
  const bg = tone === "info" ? "#eaf7fa" : "#fff";
  const bd = tone === "info" ? "#cfe6ee" : "#e4eff3";
  return (
    <div style={{ display: "flex", gap: 13, alignItems: "flex-start", background: bg, border: `1px solid ${bd}`, borderRadius: 12, padding: "16px 18px", marginTop: 18 }}>
      <div style={{ width: 28, height: 28, borderRadius: 8, background: "#fff", border: "1px solid #bfe3ec", color: C.brand, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: MONO, fontWeight: 700, flexShrink: 0 }}>i</div>
      <div>
        {title && <div style={{ fontFamily: SANS, fontWeight: 700, fontSize: 15.5, color: C.ink, marginBottom: 3 }}>{title}</div>}
        <div style={{ fontSize: 14.5, lineHeight: 1.6, color: "#1d4f63" }}>{body}</div>
      </div>
    </div>
  );
};

const ConnectTab = ({ d, snip }) => (
  <div>
    <H2>{d.title}</H2>
    <P>{d.intro}</P>
    <H3>{d.stepsTitle}</H3>
    <Steps steps={d.steps} />
    <H3>{d.scriptTitle}</H3>
    <P>{d.scriptBody}</P>
    <CodeBlock code={snip.script} copyLabel={d.copy} copiedLabel={d.copied} />
    <H3>{d.mobileTitle}</H3>
    <P>{d.mobileBody}</P>
    <CodeBlock code={snip.mobile} copyLabel={d.copy} copiedLabel={d.copied} />
    <H3>{d.langTitle}</H3>
    <P>{d.langBody}</P>
    <div style={{ fontFamily: MONO, fontSize: 12.5, color: "#0a7bb5", background: "#eaf7fa", border: "1px solid #bfe3ec", borderRadius: 8, padding: "10px 13px", marginTop: 12, overflowX: "auto" }}>{d.langExamples}</div>
    <Callout title={d.tipTitle} body={d.tipBody} />
  </div>
);

const AgentTab = ({ d, copy }) => {
  const { go } = useSiteNav();
  return (
    <div>
      <H2>{d.title}</H2>
      <P>{d.intro}</P>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", gap: 10, margin: "16px 0 6px" }}>
        {d.points.map((p) => (
          <div key={p} style={{ display: "flex", alignItems: "flex-start", gap: 10, background: "#fff", border: "1px solid #e4eff3", borderRadius: 11, padding: "13px 15px" }}>
            <span style={{ color: C.teal, fontWeight: 700, fontSize: 14 }}>✓</span>
            <span style={{ fontSize: 14.5, lineHeight: 1.45, color: "#1d4f63" }}>{p}</span>
          </div>
        ))}
      </div>
      <H3>{d.howTitle}</H3>
      <P>{d.howBody}</P>
      <div style={{ background: GRAD.dark, borderRadius: 16, padding: "26px 26px", marginTop: 20 }}>
        <div style={{ fontFamily: SANS, fontWeight: 700, fontSize: 19, color: "#fff", letterSpacing: "-.015em", marginBottom: 6 }}>{d.contactTitle}</div>
        <div style={{ fontSize: 14.5, lineHeight: 1.6, color: "#a9cdda", marginBottom: 16 }}>{d.contactBody}</div>
        <div style={{ fontFamily: MONO, fontSize: 11.5, color: "#5cd7d3", marginBottom: 12 }}>{d.emailLabel}</div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 12, alignItems: "center" }}>
          <a href={`mailto:${COMPANY_INFO.supportEmail}`} className="mm-lift" style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "#5cd7d3", color: "#08303f", fontWeight: 700, fontFamily: SANS, fontSize: 15, padding: "12px 22px", borderRadius: 11, textDecoration: "none" }}>{COMPANY_INFO.supportEmail}</a>
          <button onClick={() => go("contact")} style={{ background: "transparent", color: "#cfe7ee", border: "1px solid #1d4a5e", fontWeight: 600, fontFamily: SANS, fontSize: 14.5, padding: "12px 20px", borderRadius: 11, cursor: "pointer" }}>{d.contactCta}</button>
        </div>
      </div>
    </div>
  );
};

const DashboardTab = ({ d, snip }) => (
  <div>
    <H2>{d.title}</H2>
    <P>{d.intro}</P>
    <H3>{d.stepsTitle}</H3>
    <Steps steps={d.steps} />
    <H3>{d.scriptTitle}</H3>
    <P>{d.scriptBody}</P>
    <CodeBlock code={snip.dashboardScript} copyLabel={d.copy} copiedLabel={d.copied} />
    <H3>{d.loginTitle}</H3>
    <P>{d.loginBody}</P>
    <Callout body={d.note} />
  </div>
);

const FilesTab = ({ d }) => (
  <div>
    <H2>{d.title}</H2>
    <P>{d.intro}</P>
    <H3>{d.uploadTitle}</H3>
    <P>{d.uploadIntro}</P>
    <Steps steps={d.uploadSteps} />
    <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap", marginTop: 14 }}>
      <span style={{ fontFamily: MONO, fontSize: 11.5, color: C.muted, textTransform: "uppercase", letterSpacing: ".04em" }}>{d.formatsLabel}</span>
      {d.formats.map((f) => (
        <span key={f} style={{ fontFamily: MONO, fontSize: 12, fontWeight: 600, color: "#0a7bb5", background: "#eaf7fa", border: "1px solid #bfe3ec", borderRadius: 7, padding: "5px 11px" }}>{f}</span>
      ))}
    </div>
    <H3>{d.customizeTitle}</H3>
    <P>{d.customizeBody}</P>
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))", gap: 12, marginTop: 14 }}>
      {d.customizeOptions.map((o) => (
        <div key={o.title} style={{ background: "#fff", border: "1px solid #e4eff3", borderRadius: 12, padding: "16px 18px" }}>
          <div style={{ fontFamily: SANS, fontWeight: 700, fontSize: 15.5, color: C.ink, marginBottom: 4 }}>{o.title}</div>
          <div style={{ fontSize: 14, lineHeight: 1.5, color: C.bodySoft }}>{o.desc}</div>
        </div>
      ))}
    </div>
  </div>
);

export const SiteDocs = () => {
  const { language } = useI18n();
  const c = getSiteContent(language);
  // Tab is tracked in the URL (?tab=) so deep links and crawlers see each section.
  const [searchParams, setSearchParams] = useSearchParams();
  const urlTab = searchParams.get("tab");
  const tab = TABS.includes(urlTab) ? urlTab : "connect";
  const setTab = (k) => {
    const next = new URLSearchParams(searchParams);
    if (k === "connect") next.delete("tab");
    else next.set("tab", k);
    setSearchParams(next);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  useReveal([language]);
  const d = c.docs;
  const snip = buildWidgetSnippets(getRuntime().apiBaseUrl, "YOUR_CHATBOT_ID", language === "ua" ? "uk" : language);

  return (
    <SiteShell pageKey="docs" seo={c.seo.docs}>
      <section style={{ position: "relative", overflow: "hidden", borderBottom: "1px solid #e0eef3" }}>
        <Aurora style={{ top: -120, left: -40, width: 440, height: 440, background: "radial-gradient(circle,rgba(10,147,212,.16),transparent 65%)" }} />
        <div style={{ position: "relative", maxWidth: 1180, margin: "0 auto", padding: "52px 24px 34px" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "#fff", border: "1px solid #cfe6ee", color: C.brand, fontFamily: MONO, fontSize: 12, fontWeight: 600, letterSpacing: ".04em", padding: "7px 14px", borderRadius: 100, marginBottom: 18 }}>{d.badge}</div>
          <h1 style={{ fontFamily: SANS, fontWeight: 700, fontSize: 40, lineHeight: 1.06, letterSpacing: "-.03em", margin: "0 0 14px" }}>{d.title}</h1>
          <p style={{ fontSize: 17, lineHeight: 1.6, color: C.body, maxWidth: 640, margin: 0 }}>{d.sub}</p>
        </div>
      </section>

      {/* mobile tab bar */}
      <div className="mm-docs-mobiletabs" style={{ position: "sticky", top: 57, zIndex: 30, background: "rgba(244,250,251,.92)", backdropFilter: "blur(10px)", borderBottom: "1px solid #d9e9ee", padding: "10px 16px", overflowX: "auto", gap: 8 }}>
        {TABS.map((k) => {
          const on = tab === k;
          return (
            <button key={k} onClick={() => setTab(k)} style={{ flexShrink: 0, fontFamily: SANS, fontWeight: on ? 700 : 500, fontSize: 13.5, color: on ? C.brand : "#3f6276", background: on ? "#eaf7fa" : "transparent", border: `1px solid ${on ? "#bfe3ec" : "transparent"}`, borderRadius: 100, padding: "8px 14px", cursor: "pointer", whiteSpace: "nowrap" }}>{d.tabs[k]}</button>
          );
        })}
      </div>

      <div style={{ maxWidth: 1180, margin: "0 auto", padding: "28px 24px 8px", display: "flex", gap: 36, alignItems: "flex-start" }}>
        {/* sidebar */}
        <nav className="mm-docs-sidebar" aria-label="Docs sections" style={{ flex: "0 0 230px", position: "sticky", top: 80, background: "#fff", border: "1px solid #e4eff3", borderRadius: 16, padding: 12 }}>
          <div style={{ fontFamily: MONO, fontSize: 11, letterSpacing: ".06em", textTransform: "uppercase", color: "#9cb3bd", padding: "8px 12px 10px" }}>{d.onThisTab}</div>
          {TABS.map((k) => {
            const on = tab === k;
            return (
              <button key={k} onClick={() => setTab(k)} className="mm-navlink" style={{ display: "block", width: "100%", textAlign: "left", fontFamily: SANS, fontWeight: on ? 600 : 500, fontSize: 14.5, color: on ? C.brand : "#3f6276", background: on ? "#eaf7fa" : "transparent", border: "none", borderRadius: 9, padding: "10px 12px", cursor: "pointer", marginBottom: 2 }}>{d.tabs[k]}</button>
            );
          })}
        </nav>

        {/* content */}
        <div style={{ flex: "1 1 auto", minWidth: 0, maxWidth: 780 }} key={tab}>
          {tab === "connect" && <ConnectTab d={d.connect} snip={snip} />}
          {tab === "agent" && <AgentTab d={d.agent} copy={d.copy} />}
          {tab === "dashboard" && <DashboardTab d={d.dashboard} snip={snip} />}
          {tab === "files" && <FilesTab d={d.files} />}
        </div>
      </div>

      <RouteCTA title={d.cta.title} sub={d.cta.sub} btnLabel={d.cta.btn} to="login" size="md" />
    </SiteShell>
  );
};

export default SiteDocs;
