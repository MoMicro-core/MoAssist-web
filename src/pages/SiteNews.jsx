import { useI18n } from "../context/I18nContext";
import { getSiteContent } from "../content/site";
import { NEWS_POSTS, NEWS_CAT_TONE } from "../content/site/shared";
import { C, GRAD } from "../content/site/theme";
import { useReveal } from "../site/useReveal";
import { SiteShell } from "../site/SiteShell";
import { Aurora, FONTS } from "../site/ui";

const { SANS, MONO } = FONTS;

export const SiteNews = () => {
  const { language } = useI18n();
  const c = getSiteContent(language);
  useReveal([language]);
  const n = c.news;

  const posts = NEWS_POSTS.map((p) => ({ ...p, ...n.posts[p.id], tone: NEWS_CAT_TONE[p.cat] }));

  return (
    <SiteShell pageKey="news" seo={c.seo.news}>
      <section style={{ position: "relative", overflow: "hidden", borderBottom: "1px solid #e0eef3" }}>
        <Aurora style={{ top: -120, right: -60, width: 440, height: 440, background: "radial-gradient(circle,rgba(43,196,204,.22),transparent 65%)" }} />
        <div style={{ position: "relative", maxWidth: 1000, margin: "0 auto", padding: "58px 24px 36px" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "#fff", border: "1px solid #cfe6ee", color: C.brand, fontFamily: MONO, fontSize: 12, fontWeight: 600, letterSpacing: ".04em", padding: "7px 14px", borderRadius: 100, marginBottom: 20 }}>{n.badge}</div>
          <h1 style={{ fontFamily: SANS, fontWeight: 700, fontSize: 44, lineHeight: 1.05, letterSpacing: "-.03em", margin: "0 0 14px" }}>{n.title}</h1>
          <p style={{ fontSize: 17.5, lineHeight: 1.6, color: C.body, maxWidth: 560, margin: 0 }}>{n.sub}</p>
        </div>
      </section>

      {/* post grid */}
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "36px 24px 8px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(320px,1fr))", gap: 22 }}>
          {posts.map((p) => (
            <article key={p.id} data-reveal className="mm-reveal mm-card" style={{ background: "#fff", border: "1px solid #e4eff3", borderRadius: 18, overflow: "hidden", cursor: "pointer", display: "flex", flexDirection: "column" }}>
              <div style={{ position: "relative", height: 176, overflow: "hidden", background: p.bg || "#0a2433" }}>
                <img src={p.image} alt={p.title} loading="lazy" decoding="async" width={900} height={500} style={{ width: "100%", height: "100%", objectFit: p.fit || "cover", padding: p.fit === "contain" ? 28 : 0, display: "block" }} />
                <span style={{ position: "absolute", top: 14, left: 14, fontFamily: MONO, fontSize: 10, fontWeight: 600, color: p.tone.tagColor, background: p.tone.tagBg, borderRadius: 6, padding: "4px 9px" }}>{n.cats[p.cat]}</span>
              </div>
              <div style={{ padding: 24, display: "flex", flexDirection: "column", gap: 10, flex: 1 }}>
                <div style={{ fontFamily: MONO, fontSize: 11.5, color: "#9cb3bd" }}>{p.date} · {p.read} {n.readSuffix}</div>
                <h2 style={{ fontFamily: SANS, fontWeight: 700, fontSize: 19.5, lineHeight: 1.22, letterSpacing: "-.015em", margin: 0 }}>{p.title}</h2>
                <p style={{ fontSize: 14.5, lineHeight: 1.55, color: C.bodySoft, margin: 0, flex: 1 }}>{p.excerpt}</p>
              </div>
            </article>
          ))}
        </div>
      </div>

      {/* newsletter */}
      <div data-reveal className="mm-reveal" style={{ maxWidth: 1100, margin: "0 auto", padding: "40px 24px 72px" }}>
        <div style={{ background: GRAD.dark, borderRadius: 22, padding: "42px 32px", display: "flex", flexWrap: "wrap", gap: 24, alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ flex: "1 1 320px" }}>
            <h2 style={{ fontFamily: SANS, fontWeight: 700, fontSize: 26, letterSpacing: "-.02em", color: "#fff", margin: "0 0 8px" }}>{n.newsletter.title}</h2>
            <p style={{ fontSize: 15, color: "#a9cdda", margin: 0 }}>{n.newsletter.sub}</p>
          </div>
          <form onSubmit={(e) => e.preventDefault()} style={{ display: "flex", gap: 10, flex: "1 1 300px", minWidth: 260 }}>
            <input type="email" aria-label="Email" placeholder={n.newsletter.placeholder} style={{ flex: 1, background: "#0c2c3b", border: "1px solid #1d4a5e", borderRadius: 11, padding: "13px 16px", fontSize: 14, color: "#dff0f5", outline: "none" }} />
            <button type="submit" className="mm-lift" style={{ background: "#5cd7d3", color: "#08303f", fontWeight: 700, fontFamily: SANS, fontSize: 14.5, padding: "13px 22px", borderRadius: 11, cursor: "pointer", whiteSpace: "nowrap", border: "none" }}>{n.newsletter.btn}</button>
          </form>
        </div>
      </div>
    </SiteShell>
  );
};

export default SiteNews;
