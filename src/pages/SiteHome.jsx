import { useEffect, useRef, useState } from "react";
import { useI18n } from "../context/I18nContext";
import { getSiteContent } from "../content/site";
import { C, GRAD } from "../content/site/theme";
import { useReveal } from "../site/useReveal";
import { useSiteNav } from "../site/routes";
import { SiteShell } from "../site/SiteShell";
import { Aurora, Badge, Kicker, GradButton, OutlineButton, RouteCTA, FONTS } from "../site/ui";

const { SANS, MONO } = FONTS;
const wrap = (extra = {}) => ({ maxWidth: 1200, margin: "0 auto", padding: "60px 24px 16px", ...extra });

const Reveal = ({ children, style, ...rest }) => (
  <div data-reveal className="mm-reveal" style={style} {...rest}>{children}</div>
);

// The looping "agent at work" hero demo: reveals each step on a timer.
const AgentDemo = ({ d }) => {
  const ref = useRef(null);
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const rows = ref.current ? Array.from(ref.current.querySelectorAll("[data-astep]")) : [];
    if (reduce) {
      rows.forEach((r) => { r.style.opacity = "1"; r.style.transform = "none"; });
      return undefined;
    }
    let i = 0;
    const tick = () => {
      if (i >= rows.length + 2) {
        i = 0;
        rows.forEach((r) => { r.style.opacity = "0"; r.style.transform = "translateY(8px)"; });
        return;
      }
      const r = rows[i];
      if (r) { r.style.opacity = "1"; r.style.transform = "none"; }
      i++;
    };
    const id = setInterval(tick, 1150);
    return () => clearInterval(id);
  }, []);

  const step = (props) => ({ opacity: 0, transform: "translateY(8px)", transition: "opacity .4s ease, transform .4s ease", ...props });

  return (
    <div style={{ flex: "1 1 380px", minWidth: 300 }}>
      <div ref={ref} style={{ background: GRAD.panelDark, border: "1px solid #16404f", borderRadius: 20, padding: 18, boxShadow: "0 34px 70px -34px rgba(8,30,40,.7)" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "4px 6px 14px", borderBottom: "1px solid #163b4b" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <img src="/preview/logo-opt.png" alt="" width={28} height={28} style={{ width: 28, height: 28, objectFit: "contain" }} />
            <div style={{ fontFamily: SANS, fontWeight: 600, fontSize: 14, color: "#eaf7fa" }}>{d.title}</div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 6, fontFamily: MONO, fontSize: 10.5, color: "#5cd7d3" }}>
            <span className="mm-livedot" style={{ width: 7, height: 7, borderRadius: "50%", background: "#5cd7d3" }} />{d.live}
          </div>
        </div>
        <div style={{ padding: "16px 6px 6px", display: "flex", flexDirection: "column", gap: 11, minHeight: 300 }}>
          <div data-astep style={step({ alignSelf: "flex-end", maxWidth: "84%", background: "#1d4a5e", color: "#dff0f5", fontSize: 13.5, lineHeight: 1.45, padding: "10px 13px", borderRadius: "14px 14px 4px 14px" })}>{d.user}</div>
          <div data-astep style={step({ display: "flex", alignItems: "center", gap: 10, background: "#0c2c3b", border: "1px solid #16414f", borderRadius: 11, padding: "10px 13px" })}>
            <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#5cd7d3", flexShrink: 0 }} />
            <span style={{ fontFamily: MONO, fontSize: 11.5, color: "#8fb9c6" }}>{d.identify}</span>
            <span style={{ marginLeft: "auto", fontFamily: MONO, fontSize: 11.5, color: "#eaf7fa" }}>{d.identifyVal}</span>
          </div>
          <div data-astep style={step({ background: "#0c2c3b", border: "1px solid #16414f", borderRadius: 11, padding: "10px 13px" })}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 7 }}>
              <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#5cd7d3", flexShrink: 0 }} />
              <span style={{ fontFamily: MONO, fontSize: 11.5, color: "#8fb9c6" }}>{d.query}</span>
              <span style={{ marginLeft: "auto", display: "inline-flex", alignItems: "center", gap: 5, fontFamily: MONO, fontSize: 9.5, color: "#5cd7d3", border: "1px solid #1d5566", borderRadius: 4, padding: "1px 6px" }}>
                <span className="mm-livedot" style={{ width: 5, height: 5, borderRadius: "50%", background: "#5cd7d3" }} />LIVE
              </span>
            </div>
            <div style={{ fontFamily: MONO, fontSize: 11.5, color: "#dff0f5", background: "#081f2b", borderRadius: 7, padding: "8px 10px" }}>{d.queryResult}</div>
          </div>
          <div data-astep style={step({ display: "flex", alignItems: "center", gap: 10, background: "#0c2c3b", border: "1px solid #16414f", borderRadius: 11, padding: "10px 13px" })}>
            <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#5cd7d3", flexShrink: 0 }} />
            <span style={{ fontFamily: MONO, fontSize: 11.5, color: "#8fb9c6" }}>{d.shipping}</span>
            <span style={{ marginLeft: "auto", fontFamily: MONO, fontSize: 11.5, color: "#eaf7fa" }}>{d.shippingVal}</span>
          </div>
          <div data-astep style={step({ alignSelf: "flex-start", maxWidth: "90%", background: GRAD.brand, color: "#fff", fontSize: 13.5, lineHeight: 1.5, padding: "11px 14px", borderRadius: "14px 14px 14px 4px" })}>{d.reply}</div>
        </div>
      </div>
      <div style={{ display: "flex", gap: 10, marginTop: 14, justifyContent: "center", fontFamily: MONO, fontSize: 11, color: "#5a7886", flexWrap: "wrap" }}>
        {d.legend.map((l, i) => (
          <span key={i} style={{ display: "flex", gap: 10 }}>{l}{i < d.legend.length - 1 && <span style={{ color: "#bcd3db" }}>·</span>}</span>
        ))}
      </div>
    </div>
  );
};

const Testimonials = ({ head, items }) => {
  const [idx, setIdx] = useState(0);
  const n = items.length;
  useEffect(() => {
    const id = setInterval(() => setIdx((v) => (v + 1) % n), 5200);
    return () => clearInterval(id);
  }, [n]);
  const go = (i) => setIdx(((i % n) + n) % n);
  return (
    <Reveal style={{ maxWidth: 1100, margin: "0 auto", padding: "50px 24px 20px" }}>
      <div style={{ textAlign: "center", marginBottom: 28 }}>
        <Kicker>{head.kicker}</Kicker>
        <h2 style={{ fontFamily: SANS, fontWeight: 700, fontSize: 34, letterSpacing: "-.02em", margin: 0 }}>{head.title}</h2>
      </div>
      <div style={{ position: "relative", maxWidth: 860, margin: "0 auto" }}>
        <div style={{ overflow: "hidden", borderRadius: 22 }}>
          <div style={{ display: "flex", transform: `translateX(-${idx * 100}%)`, transition: "transform .44s cubic-bezier(.16,1,.3,1)" }}>
            {items.map((t, i) => (
              <div key={i} style={{ flex: "0 0 100%", boxSizing: "border-box" }}>
                <div style={{ background: "#fff", border: "1px solid #e4eff3", borderRadius: 22, padding: 40, display: "flex", flexDirection: "column", gap: 20, minHeight: 248 }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
                    <div style={{ display: "inline-flex", background: "#eaf7fa", color: C.brand, fontSize: 13, fontWeight: 700, padding: "7px 14px", borderRadius: 100, fontFamily: MONO }}>{t.result}</div>
                    <div style={{ color: "#ffc24b", fontSize: 15, letterSpacing: 2 }}>★★★★★</div>
                  </div>
                  <p style={{ fontFamily: SANS, fontSize: 22, lineHeight: 1.42, color: C.inkSoft, margin: 0, flex: 1, letterSpacing: "-.015em" }}>&ldquo;{t.quote}&rdquo;</p>
                  <div style={{ display: "flex", alignItems: "center", gap: 13 }}>
                    <div style={{ width: 46, height: 46, borderRadius: "50%", background: GRAD.brand, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 700, fontSize: 18, flexShrink: 0 }}>{t.initial}</div>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: 15.5 }}>{t.name}</div>
                      <div style={{ fontSize: 13, color: "#7596a5" }}>{t.role}</div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 18, marginTop: 24 }}>
          <button aria-label="Previous" onClick={() => go(idx - 1)} className="mm-lift" style={{ width: 44, height: 44, borderRadius: "50%", background: "#fff", border: "1px solid #d9e9ee", boxShadow: "0 8px 20px -12px rgba(11,51,68,.5)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: C.ink, fontSize: 22, lineHeight: 1, flexShrink: 0 }}>‹</button>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            {items.map((_, i) => (
              <button key={i} aria-label={`Slide ${i + 1}`} onClick={() => go(i)} style={{ width: i === idx ? 26 : 9, height: 9, borderRadius: 100, background: i === idx ? "#0a93d4" : "#cfdfe6", cursor: "pointer", border: "none", transition: "width .3s ease, background .3s ease" }} />
            ))}
          </div>
          <button aria-label="Next" onClick={() => go(idx + 1)} className="mm-lift" style={{ width: 44, height: 44, borderRadius: "50%", background: "#fff", border: "1px solid #d9e9ee", boxShadow: "0 8px 20px -12px rgba(11,51,68,.5)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: C.ink, fontSize: 22, lineHeight: 1, flexShrink: 0 }}>›</button>
        </div>
      </div>
    </Reveal>
  );
};

export const SiteHome = () => {
  const { language } = useI18n();
  const c = getSiteContent(language);
  const { go } = useSiteNav();
  const [tab, setTab] = useState("chatbot");
  useReveal([language, tab]);
  const h = c.home;
  const card = h.products[tab];

  return (
    <SiteShell pageKey="home" seo={c.seo.home}>
      {/* HERO */}
      <section style={{ position: "relative", overflow: "hidden" }}>
        <Aurora style={{ top: -140, right: -100, width: 560, height: 560, background: "radial-gradient(circle,rgba(43,196,204,.32),transparent 65%)" }} />
        <Aurora reverse style={{ bottom: -180, left: -140, width: 520, height: 520, background: "radial-gradient(circle,rgba(10,147,212,.22),transparent 65%)" }} />
        <div style={{ position: "relative", maxWidth: 1200, margin: "0 auto", padding: "64px 24px 60px", display: "flex", flexWrap: "wrap", gap: 48, alignItems: "center" }}>
          <div style={{ flex: "1 1 420px", minWidth: 300 }}>
            <div style={{ marginBottom: 24 }}><Badge dot>{h.hero.badge}</Badge></div>
            <h1 style={{ fontFamily: SANS, fontWeight: 700, fontSize: 54, lineHeight: 1.03, letterSpacing: "-.03em", margin: "0 0 22px" }}>
              {h.hero.titlePre}<br />{h.hero.titleA}<span style={{ color: C.brand }}>{h.hero.titleAgent}</span>{h.hero.titleB}
            </h1>
            <p className="mm-richtext" style={{ fontSize: 18.5, lineHeight: 1.6, color: C.body, margin: "0 0 30px", maxWidth: 520 }} dangerouslySetInnerHTML={{ __html: h.hero.sub }} />
            <div style={{ display: "flex", flexWrap: "wrap", gap: 13, marginBottom: 28 }}>
              <GradButton size="lg" onClick={() => go("login")}>{c.actions.startFree}</GradButton>
              <OutlineButton size="lg" onClick={() => go("how")}>{c.actions.seeHow}</OutlineButton>
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {h.hero.chips.map((chip) => (
                <div key={chip} style={{ display: "flex", alignItems: "center", gap: 7, background: "#fff", border: "1px solid #dcebef", fontSize: 13, fontWeight: 500, color: "#3f6276", padding: "7px 13px", borderRadius: 100 }}>
                  <span style={{ color: C.teal, fontWeight: 700 }}>✓</span>{chip}
                </div>
              ))}
            </div>
          </div>
          <AgentDemo d={h.demo} />
        </div>
      </section>

      {/* POSITIONING BAND */}
      <Reveal style={{ maxWidth: 1200, margin: "0 auto", padding: "8px 24px" }}>
        <div style={{ background: GRAD.dark, borderRadius: 22, padding: "40px 30px", display: "flex", flexWrap: "wrap", gap: 26, alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ flex: "1 1 360px" }}>
            <div style={{ fontFamily: SANS, fontWeight: 700, fontSize: 27, letterSpacing: "-.02em", color: "#fff", lineHeight: 1.18 }}>
              {h.band.titleA}<span style={{ color: "#7fa9b8" }}>{h.band.answer}</span><br />{h.band.titleB}<span style={{ color: "#5cd7d3" }}>{h.band.resolves}</span>
            </div>
          </div>
          <div style={{ display: "flex", gap: 30, flexWrap: "wrap" }}>
            {h.band.stats.map((s, i) => (
              <div key={i}>
                <div style={{ fontFamily: SANS, fontSize: 34, fontWeight: 700, color: s.plain ? "#5cd7d3" : "#fff" }}>
                  {s.plain ? s.plain : <span data-count={s.value} data-suffix={s.suffix}>0{s.suffix}</span>}
                </div>
                <div style={{ fontSize: 13, color: "#a9cdda" }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </Reveal>

      {/* TWO PRODUCTS TABS */}
      <Reveal style={{ maxWidth: 1100, margin: "0 auto", padding: "62px 24px 8px" }}>
        <div style={{ textAlign: "center", marginBottom: 24 }}>
          <Kicker>{h.products.kicker}</Kicker>
          <h2 style={{ fontFamily: SANS, fontWeight: 700, fontSize: 34, lineHeight: 1.12, letterSpacing: "-.025em", margin: "0 auto 8px", maxWidth: 640 }}>{h.products.title}</h2>
          <p style={{ fontSize: 16, lineHeight: 1.6, color: C.body, maxWidth: 560, margin: "0 auto" }}>{h.products.sub}</p>
        </div>
        <div style={{ display: "flex", justifyContent: "center", marginBottom: 22 }}>
          <div style={{ display: "inline-flex", gap: 4, background: "#e6f1f4", border: "1px solid #d9e9ee", borderRadius: 13, padding: 5 }}>
            {["chatbot", "agent"].map((id) => {
              const on = tab === id;
              return (
                <button key={id} onClick={() => setTab(id)} style={{ fontFamily: SANS, fontWeight: on ? 700 : 600, fontSize: 15, color: on ? C.brand : C.bodySoft, background: on ? "#fff" : "transparent", boxShadow: on ? "0 6px 16px -8px rgba(11,51,68,.4)" : "none", padding: "11px 26px", borderRadius: 9, cursor: "pointer", border: "none" }}>
                  {h.products.tabs[id]}
                </button>
              );
            })}
          </div>
        </div>
        <div style={{ background: "#fff", border: "1px solid #e4eff3", borderRadius: 22, padding: 34, display: "flex", flexWrap: "wrap", gap: 36, alignItems: "center", boxShadow: "0 24px 50px -38px rgba(11,51,68,.4)" }}>
          <div style={{ flex: "1 1 320px", minWidth: 280 }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 7, fontFamily: MONO, fontSize: 11, fontWeight: 600, letterSpacing: ".04em", color: C.brand, background: "#eaf7fa", border: "1px solid #bfe3ec", borderRadius: 7, padding: "5px 11px", marginBottom: 16 }}>{card.badge}</div>
            <h3 style={{ fontFamily: SANS, fontWeight: 700, fontSize: 30, letterSpacing: "-.02em", margin: "0 0 12px" }}>{card.name}</h3>
            <p style={{ fontSize: 16.5, lineHeight: 1.6, color: C.body, margin: "0 0 20px" }}>{card.tagline}</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 11, marginBottom: 24 }}>
              {card.points.map((p) => (
                <div key={p} style={{ display: "flex", alignItems: "flex-start", gap: 11 }}>
                  <span style={{ width: 21, height: 21, borderRadius: 6, background: "#eaf7fa", color: C.brand, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 12, flexShrink: 0, marginTop: 1 }}>✓</span>
                  <span style={{ fontSize: 15, lineHeight: 1.4, color: "#1d4f63" }}>{p}</span>
                </div>
              ))}
            </div>
            <GradButton onClick={() => go(tab === "chatbot" ? "chatbot" : "how")}>{card.cta}</GradButton>
          </div>
          <div style={{ flex: "1 1 300px", minWidth: 280 }}>
            {tab === "chatbot" ? (
              <div style={{ background: C.navy, borderRadius: 16, padding: 20 }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
                  <span style={{ fontFamily: MONO, fontSize: 11.5, color: "#8fb9c6" }}>Files</span>
                  <span style={{ display: "inline-flex", alignItems: "center", gap: 5, fontFamily: MONO, fontSize: 9.5, color: "#5cd7d3" }}><span style={{ width: 6, height: 6, borderRadius: "50%", background: "#5cd7d3" }} />{card.indexed}</span>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {["returns-policy.pdf", "shipping-faq.docx", "product-guide.pdf", "store-hours.txt"].map((f) => (
                    <div key={f} style={{ display: "flex", alignItems: "center", gap: 10, background: "#0c2c3b", border: "1px solid #16414f", borderRadius: 9, padding: "9px 12px" }}>
                      <span style={{ fontSize: 13 }}>📄</span><span style={{ fontFamily: MONO, fontSize: 11.5, color: "#cfe7ee", flex: 1 }}>{f}</span><span style={{ color: "#5cd7d3", fontSize: 12 }}>✓</span>
                    </div>
                  ))}
                </div>
                <div className="mm-richtext" style={{ marginTop: 14, background: GRAD.brand, color: "#fff", fontSize: 12.5, lineHeight: 1.5, padding: "10px 13px", borderRadius: 11 }} dangerouslySetInnerHTML={{ __html: card.example.replace("→", "→ <b>") + "</b>" }} />
              </div>
            ) : (
              <div style={{ background: C.navy, borderRadius: 16, padding: 20 }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
                  <span style={{ fontFamily: MONO, fontSize: 11.5, color: "#8fb9c6" }}>{card.capsTitle}</span>
                  <span style={{ display: "inline-flex", alignItems: "center", gap: 5, fontFamily: MONO, fontSize: 9.5, color: "#5cd7d3" }}><span className="mm-livedot" style={{ width: 6, height: 6, borderRadius: "50%", background: "#5cd7d3" }} />LIVE</span>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                  {card.caps.map((cap) => (
                    <div key={cap} style={{ display: "flex", alignItems: "center", gap: 8, background: "#0c2c3b", border: "1px solid #16414f", borderRadius: 9, padding: "10px 11px" }}>
                      <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#5cd7d3", flexShrink: 0 }} /><span style={{ fontFamily: MONO, fontSize: 10.5, color: "#cfe7ee" }}>{cap}</span>
                    </div>
                  ))}
                </div>
                <div className="mm-richtext" style={{ marginTop: 14, background: GRAD.brand, color: "#fff", fontSize: 12.5, lineHeight: 1.5, padding: "10px 13px", borderRadius: 11 }} dangerouslySetInnerHTML={{ __html: card.example.replace("→", "→ <b>") + "</b>" }} />
              </div>
            )}
          </div>
        </div>
      </Reveal>

      {/* DIFFERENTIATORS */}
      <div style={wrap({ padding: "60px 24px 16px" })}>
        <Reveal style={{ textAlign: "center", marginBottom: 14 }}>
          <Kicker>{h.diff.kicker}</Kicker>
          <h2 style={{ fontFamily: SANS, fontWeight: 700, fontSize: 38, lineHeight: 1.1, letterSpacing: "-.025em", margin: "0 auto", maxWidth: 680 }}>{h.diff.title}</h2>
        </Reveal>
      </div>
      <DiffCards h={h} />

      {/* VS TABLE */}
      <Reveal style={{ maxWidth: 1100, margin: "0 auto", padding: "56px 24px 20px" }}>
        <h2 style={{ fontFamily: SANS, fontWeight: 700, fontSize: 34, letterSpacing: "-.02em", margin: "0 0 22px", textAlign: "center" }}>{h.vs.title}</h2>
        <div style={{ background: "#fff", border: "1px solid #e4eff3", borderRadius: 18, overflow: "hidden", overflowX: "auto" }}>
          <div style={{ minWidth: 560 }}>
            <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr 1.1fr", background: C.bg, borderBottom: "1px solid #e4eff3", padding: "15px 24px", fontSize: 13, fontWeight: 600 }}>
              <div style={{ color: "#7596a5" }}>&nbsp;</div>
              <div style={{ textAlign: "center", color: "#90a8b4" }}>{h.vs.colBot}</div>
              <div style={{ textAlign: "center", color: C.brand }}>{h.vs.colAgent}</div>
            </div>
            {h.vs.rows.map((v) => (
              <div key={v.label} style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr 1.1fr", padding: "15px 24px", borderTop: "1px solid #eef5f8", alignItems: "center", fontSize: 14.5 }}>
                <div style={{ fontWeight: 600, color: C.ink }}>{v.label}</div>
                <div style={{ textAlign: "center", color: "#90a8b4" }}>{v.bot}</div>
                <div style={{ textAlign: "center", color: C.ink, fontWeight: 600, background: "#f3fbfc" }}>{v.agent}</div>
              </div>
            ))}
          </div>
        </div>
      </Reveal>

      {/* AGENT LOOP */}
      <Reveal style={{ maxWidth: 1100, margin: "0 auto", padding: "54px 24px 20px" }}>
        <div style={{ display: "flex", flexWrap: "wrap", alignItems: "flex-end", justifyContent: "space-between", gap: 14, marginBottom: 26 }}>
          <div>
            <Kicker style={{ marginBottom: 10 }}>{h.loop.kicker}</Kicker>
            <h2 style={{ fontFamily: SANS, fontWeight: 700, fontSize: 32, letterSpacing: "-.02em", margin: 0 }}>{h.loop.title}</h2>
          </div>
          <div onClick={() => go("how")} className="mm-arrow" style={{ display: "inline-flex", alignItems: "center", gap: 7, color: C.brand, fontWeight: 600, fontSize: 15, cursor: "pointer", whiteSpace: "nowrap", transition: "gap .18s ease" }}>{h.loop.link}</div>
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
          {h.loop.steps.map((s) => (
            <div key={s.n} className="mm-card" style={{ flex: "1 1 170px", minWidth: 150, background: "#fff", border: "1px solid #e4eff3", borderRadius: 14, padding: 18, display: "flex", flexDirection: "column", gap: 12 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ width: 30, height: 30, borderRadius: 8, background: GRAD.brand, color: "#fff", fontFamily: SANS, fontWeight: 700, fontSize: 14, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>{s.n}</div>
                <div style={{ fontWeight: 600, fontSize: 15.5, letterSpacing: "-.01em" }}>{s.title}</div>
              </div>
              <div style={{ fontSize: 12.5, color: "#6b8794", fontFamily: MONO }}>{s.tag}</div>
            </div>
          ))}
        </div>
      </Reveal>

      <Testimonials head={h.testimonialsHead} items={h.testimonials} />

      <RouteCTA title={h.cta.title} sub={h.cta.sub} btnLabel={c.actions.startFreeArrow} to="login" />
    </SiteShell>
  );
};

// Four differentiator cards (live data / any API / personal / email).
const DiffCards = ({ h }) => {
  const items = h.diff.items;
  return (
    <>
      {/* 01 live data */}
      <Reveal style={{ maxWidth: 1200, margin: "0 auto", padding: "24px 24px" }}>
        <div style={{ background: "#fff", border: "1px solid #e4eff3", borderRadius: 22, padding: 34, display: "flex", flexWrap: "wrap", gap: 36, alignItems: "center" }}>
          <div style={{ flex: "1 1 320px", minWidth: 280 }}>
            <DiffHead item={items[0]} />
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {items[0].pills.map((p) => (
                <span key={p} style={{ background: "#eaf7fa", color: "#0a7bb5", fontSize: 13, fontWeight: 600, padding: "6px 12px", borderRadius: 8 }}>{p}</span>
              ))}
            </div>
          </div>
          <div style={{ flex: "1 1 300px", minWidth: 280, background: C.navy, borderRadius: 16, padding: 20, fontFamily: MONO }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
              <span style={{ fontSize: 11.5, color: "#8fb9c6" }}>GET /orders/4821</span>
              <span style={{ display: "inline-flex", alignItems: "center", gap: 5, fontSize: 9.5, color: "#5cd7d3" }}><span className="mm-livedot" style={{ width: 6, height: 6, borderRadius: "50%", background: "#5cd7d3" }} />LIVE</span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <div style={{ background: "#081f2b", borderRadius: 8, padding: "11px 13px", fontSize: 12, color: "#dff0f5" }}>status: <span style={{ color: "#5cd7d3" }}>"packed"</span></div>
              <div style={{ background: "#081f2b", borderRadius: 8, padding: "11px 13px", fontSize: 12, color: "#dff0f5" }}>ships: <span style={{ color: "#5cd7d3" }}>"today 18:00"</span></div>
              <div style={{ background: "#081f2b", borderRadius: 8, padding: "11px 13px", fontSize: 12, color: "#dff0f5" }}>stock: <span style={{ color: "#5cd7d3" }}>14</span></div>
            </div>
            <div style={{ fontSize: 10.5, color: "#5a8493", marginTop: 13 }}>{items[0].note}</div>
          </div>
        </div>
      </Reveal>

      {/* 02 any API */}
      <Reveal style={{ maxWidth: 1200, margin: "0 auto", padding: "24px 24px" }}>
        <div style={{ background: "#fff", border: "1px solid #e4eff3", borderRadius: 22, padding: 34, display: "flex", flexWrap: "wrap-reverse", gap: 36, alignItems: "center" }}>
          <div style={{ flex: "1 1 300px", minWidth: 280, background: C.navy, borderRadius: 16, padding: 22 }}>
            <div style={{ textAlign: "center", marginBottom: 16 }}>
              <span style={{ display: "inline-flex", alignItems: "center", gap: 8, background: GRAD.brand, color: "#fff", fontFamily: SANS, fontWeight: 600, fontSize: 13, padding: "8px 16px", borderRadius: 100 }}><span style={{ width: 8, height: 8, background: "#fff", borderRadius: "50%" }} />MoMicro Agent</span>
            </div>
            <div className="mm-dash" style={{ height: 14, backgroundImage: "linear-gradient(90deg,#2a5566 50%,transparent 0)", backgroundSize: "14px 2px", backgroundRepeat: "repeat-x", backgroundPosition: "center" }} />
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 9, marginTop: 14 }}>
              {["Order DB", "Shipping API", "ERP", "CRM", "Payments", "Email"].map((a) => (
                <div key={a} style={{ display: "flex", alignItems: "center", gap: 8, background: "#0c2c3b", border: "1px solid #16414f", borderRadius: 9, padding: "9px 11px" }}>
                  <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#5cd7d3", flexShrink: 0 }} /><span style={{ fontFamily: MONO, fontSize: 11, color: "#cfe7ee" }}>{a}</span>
                </div>
              ))}
            </div>
            <div style={{ textAlign: "center", fontFamily: MONO, fontSize: 10.5, color: "#5cd7d3", marginTop: 14 }}>{items[1].apiNote}</div>
          </div>
          <div style={{ flex: "1 1 320px", minWidth: 280 }}>
            <DiffHead item={items[1]} noMargin />
          </div>
        </div>
      </Reveal>

      {/* 03 personal */}
      <Reveal style={{ maxWidth: 1200, margin: "0 auto", padding: "24px 24px" }}>
        <div style={{ background: "#fff", border: "1px solid #e4eff3", borderRadius: 22, padding: 34, display: "flex", flexWrap: "wrap", gap: 36, alignItems: "center" }}>
          <div style={{ flex: "1 1 320px", minWidth: 280 }}>
            <DiffHead item={items[2]} noMargin />
          </div>
          <div style={{ flex: "1 1 300px", minWidth: 280, background: C.navy, borderRadius: 16, padding: 20 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 13, paddingBottom: 14, borderBottom: "1px solid #163b4b" }}>
              <div style={{ width: 46, height: 46, borderRadius: "50%", background: GRAD.brand, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontFamily: SANS, fontWeight: 700, fontSize: 18 }}>S</div>
              <div>
                <div style={{ fontFamily: SANS, fontWeight: 600, fontSize: 15, color: "#eaf7fa" }}>Sarah Chen <span style={{ fontFamily: MONO, fontSize: 10, color: "#0b3344", background: "#5cd7d3", borderRadius: 4, padding: "1px 6px", marginLeft: 4 }}>VIP</span></div>
                <div style={{ fontFamily: MONO, fontSize: 11, color: "#8fb9c6" }}>{items[2].personMeta}</div>
              </div>
            </div>
            <div style={{ background: GRAD.brand, color: "#fff", fontSize: 13, lineHeight: 1.5, padding: "11px 14px", borderRadius: 12, marginTop: 14 }}>{items[2].personMsg}</div>
          </div>
        </div>
      </Reveal>

      {/* 04 email */}
      <Reveal style={{ maxWidth: 1200, margin: "0 auto", padding: "24px 24px 8px" }}>
        <div style={{ background: "#fff", border: "1px solid #e4eff3", borderRadius: 22, padding: 34, display: "flex", flexWrap: "wrap-reverse", gap: 36, alignItems: "center" }}>
          <div style={{ flex: "1 1 300px", minWidth: 280, background: C.navy, borderRadius: 16, padding: 20 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
              <span style={{ fontFamily: MONO, fontSize: 11.5, color: "#8fb9c6" }}>{items[3].inbox}</span>
              <span style={{ fontFamily: MONO, fontSize: 10.5, color: "#5cd7d3" }}>{items[3].agentOn}</span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
              {h.diff.emails.map((e) => (
                <div key={e.subject} style={{ display: "flex", alignItems: "center", gap: 11, background: "#0c2c3b", border: "1px solid #16414f", borderRadius: 10, padding: "11px 13px" }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 12.5, color: "#dff0f5", fontWeight: 500 }}>{e.subject}</div>
                    <div style={{ fontFamily: MONO, fontSize: 10, color: "#6f9aa8" }}>{e.from}</div>
                  </div>
                  <span style={{ fontFamily: MONO, fontSize: 9.5, fontWeight: 600, color: e.solved ? "#5cd7d3" : "#ffd27a", border: `1px solid ${e.solved ? "#1d5566" : "#5a4a1d"}`, borderRadius: 5, padding: "3px 7px", whiteSpace: "nowrap" }}>{e.status}</span>
                </div>
              ))}
            </div>
          </div>
          <div style={{ flex: "1 1 320px", minWidth: 280 }}>
            <DiffHead item={items[3]} noMargin />
          </div>
        </div>
      </Reveal>
    </>
  );
};

const DiffHead = ({ item, noMargin }) => (
  <>
    <div style={{ fontFamily: MONO, fontSize: 11.5, letterSpacing: ".05em", color: C.brand, marginBottom: 12 }}>{item.tag}</div>
    <h3 style={{ fontFamily: SANS, fontWeight: 700, fontSize: 28, lineHeight: 1.14, letterSpacing: "-.02em", margin: "0 0 12px" }}>{item.title}</h3>
    <p style={{ fontSize: 16, lineHeight: 1.6, color: C.body, margin: noMargin ? 0 : "0 0 16px" }}>{item.body}</p>
  </>
);

export default SiteHome;
