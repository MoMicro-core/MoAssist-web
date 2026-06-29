import { useI18n } from "../context/I18nContext";
import { getSiteContent } from "../content/site";
import { COMPANY_INFO } from "../lib/companyInfo";
import { C, GRAD } from "../content/site/theme";
import { useReveal } from "../site/useReveal";
import { useSiteNav } from "../site/routes";
import { SiteShell } from "../site/SiteShell";
import { Aurora, FONTS } from "../site/ui";

const { SANS, MONO } = FONTS;

const Card = ({ title, body, email, phone, phoneDisplay, emailLabel, phoneLabel, featured }) => (
  <div data-reveal className="mm-reveal" style={{ flex: "1 1 320px", minWidth: 280, background: featured ? GRAD.dark : "#fff", border: featured ? "1px solid #12455c" : "1px solid #e4eff3", borderRadius: 20, padding: 30, boxShadow: "0 24px 50px -38px rgba(11,51,68,.4)" }}>
    <h2 style={{ fontFamily: SANS, fontWeight: 700, fontSize: 22, letterSpacing: "-.02em", margin: "0 0 8px", color: featured ? "#fff" : C.ink }}>{title}</h2>
    <p style={{ fontSize: 15, lineHeight: 1.55, color: featured ? "#a9cdda" : C.bodySoft, margin: 0 }}>{body}</p>
    <div style={{ marginTop: 6, color: featured ? "#dff0f5" : undefined }}>
      <RowThemed label={emailLabel} value={email} href={`mailto:${email}`} featured={featured} />
      <RowThemed label={phoneLabel} value={phoneDisplay} href={`tel:${phone}`} featured={featured} />
    </div>
  </div>
);

const RowThemed = ({ label, value, href, featured }) => (
  <div style={{ display: "flex", flexDirection: "column", gap: 3, marginTop: 14 }}>
    <span style={{ fontFamily: MONO, fontSize: 11, letterSpacing: ".04em", textTransform: "uppercase", color: featured ? "#5cd7d3" : C.muted }}>{label}</span>
    <a href={href} className={featured ? "" : "mm-flink"} style={{ fontFamily: SANS, fontWeight: 600, fontSize: 17, color: featured ? "#fff" : C.ink, textDecoration: "none", wordBreak: "break-word" }}>{value}</a>
  </div>
);

export const SiteContact = () => {
  const { language } = useI18n();
  const c = getSiteContent(language);
  const { go } = useSiteNav();
  useReveal([language]);
  const k = c.contact;

  return (
    <SiteShell pageKey="contact" seo={c.seo.contact}>
      <section style={{ position: "relative", overflow: "hidden", borderBottom: "1px solid #e0eef3" }}>
        <Aurora style={{ top: -120, left: "50%", width: 520, height: 420, background: "radial-gradient(circle,rgba(43,196,204,.2),transparent 65%)", transform: "translateX(-50%)" }} />
        <div style={{ position: "relative", maxWidth: 900, margin: "0 auto", padding: "58px 24px 40px", textAlign: "center" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "#fff", border: "1px solid #cfe6ee", color: C.brand, fontFamily: MONO, fontSize: 12, fontWeight: 600, letterSpacing: ".04em", padding: "7px 14px", borderRadius: 100, marginBottom: 20 }}>{k.badge}</div>
          <h1 style={{ fontFamily: SANS, fontWeight: 700, fontSize: 44, lineHeight: 1.05, letterSpacing: "-.03em", margin: "0 0 16px" }}>{k.title}</h1>
          <p style={{ fontSize: 17.5, lineHeight: 1.6, color: C.body, maxWidth: 560, margin: "0 auto" }}>{k.sub}</p>
        </div>
      </section>

      <div style={{ maxWidth: 940, margin: "0 auto", padding: "40px 24px 8px", display: "flex", flexWrap: "wrap", gap: 20 }}>
        <Card
          title={k.generalTitle} body={k.generalBody}
          email={COMPANY_INFO.infoEmail} phone={COMPANY_INFO.primaryPhone} phoneDisplay={COMPANY_INFO.primaryPhoneDisplay}
          emailLabel={k.emailLabel} phoneLabel={k.phoneLabel}
        />
        <Card
          featured
          title={k.supportTitle} body={k.supportBody}
          email={COMPANY_INFO.supportEmail} phone={COMPANY_INFO.secondaryPhone} phoneDisplay={COMPANY_INFO.secondaryPhoneDisplay}
          emailLabel={k.emailLabel} phoneLabel={k.phoneLabel}
        />
      </div>

      {/* response time + org */}
      <div data-reveal className="mm-reveal" style={{ maxWidth: 940, margin: "0 auto", padding: "12px 24px 8px" }}>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 16, alignItems: "center", justifyContent: "space-between", background: "#eaf7fa", border: "1px solid #cfe6ee", borderRadius: 14, padding: "18px 22px" }}>
          <div>
            <div style={{ fontFamily: SANS, fontWeight: 700, fontSize: 16, color: C.ink, marginBottom: 3 }}>{k.hoursTitle}</div>
            <div style={{ fontSize: 14.5, lineHeight: 1.55, color: "#1d4f63" }}>{k.hoursBody}</div>
          </div>
          <button onClick={() => go("docs")} className="mm-lift" style={{ display: "inline-flex", alignItems: "center", gap: 8, background: GRAD.brand, color: "#fff", fontWeight: 600, fontFamily: SANS, fontSize: 14.5, padding: "12px 20px", border: "none", borderRadius: 11, cursor: "pointer", whiteSpace: "nowrap" }}>{k.docsCta} →</button>
        </div>
        <div style={{ textAlign: "center", marginTop: 28, marginBottom: 56 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10 }}>
            <img src="/preview/logo-opt.png" alt="MoMicro" width={26} height={26} style={{ width: 26, height: 26, objectFit: "contain" }} />
            <span style={{ fontFamily: SANS, fontSize: 17, fontWeight: 700, letterSpacing: "-.02em", color: C.ink }}>MoMicro</span>
          </div>
          <div style={{ fontSize: 13.5, color: C.muted, marginTop: 6 }}>{COMPANY_INFO.companyNote}</div>
        </div>
      </div>
    </SiteShell>
  );
};

export default SiteContact;
