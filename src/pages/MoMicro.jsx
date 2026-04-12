import { PublicFooter } from "../components/PublicFooter";
import { PublicHeader } from "../components/PublicHeader";
import { useI18n } from "../context/I18nContext";
import { getMoMicroPageContent } from "../content/publicPagesContent";
import {
  COMPANY_INFO,
  buildCeoStructuredData,
  buildOrganizationStructuredData,
} from "../lib/companyInfo";
import { usePublicSeo } from "../lib/publicSeo";
import {
  buildLocaleUrl,
  buildLocalizedPath,
  isPublicLandingPath,
  resolveLocale,
} from "../lib/siteLocales";
import { Button } from "../ui/button";

const TonePill = ({ children }) => (
  <span className="inline-flex items-center rounded-full border border-[#099ad9]/16 bg-[#099ad9]/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.28em] text-[#10435f] dark:border-[#1bb1d4]/20 dark:bg-[#1bb1d4]/14 dark:text-[#def1f2]">
    {children}
  </span>
);

export const MoMicro = () => {
  const { language } = useI18n();
  const localeConfig = resolveLocale(language);
  const content = getMoMicroPageContent(localeConfig.key);
  const resolveHref = (href) =>
    isPublicLandingPath(href) ? buildLocalizedPath(href, language) : href;

  usePublicSeo({
    localeConfig,
    seo: content.seo,
    pathname: "/momicro",
    siteName: "MoMicro",
  });

  const siteUrl = typeof window !== "undefined" ? window.location.origin : "";
  const organizationStructuredData = {
    ...buildOrganizationStructuredData({
      siteUrl,
      url: siteUrl ? buildLocaleUrl(siteUrl, "/momicro", localeConfig.key) : undefined,
      description: content.seo.description,
    }),
    makesOffer: {
      "@type": "Offer",
      itemOffered: {
        "@type": "SoftwareApplication",
        name: COMPANY_INFO.productName,
      },
    },
  };
  const ceoStructuredData = buildCeoStructuredData({ siteUrl });
  const webPageStructuredData = {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    name: content.seo.title,
    url: siteUrl
      ? buildLocaleUrl(siteUrl, "/momicro", localeConfig.key)
      : undefined,
    inLanguage: localeConfig.htmlLang,
    description: content.seo.description,
    about: {
      "@type": "Organization",
      name: COMPANY_INFO.organizationName,
    },
    mainEntity: {
      "@type": "Person",
      name: COMPANY_INFO.ceoName,
      jobTitle: COMPANY_INFO.ceoJobTitle,
    },
  };

  return (
    <div className="relative min-h-screen pb-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(organizationStructuredData),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(ceoStructuredData),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(webPageStructuredData),
        }}
      />

      <div className="landing-orb pointer-events-none absolute -left-24 top-12 h-72 w-72 rounded-full bg-[radial-gradient(circle,_rgba(9,154,217,0.14),_transparent_66%)] blur-2xl" />
      <div className="landing-orb pointer-events-none absolute -right-24 top-40 h-80 w-80 rounded-full bg-[radial-gradient(circle,_rgba(92,215,211,0.14),_transparent_66%)] blur-2xl" />

      <PublicHeader />

      <main className="mx-auto mt-8 w-full max-w-7xl space-y-14 px-5 sm:px-8">
        <section className="brand-stage rounded-[2.6rem] px-6 py-8 sm:px-10 sm:py-12">
          <div className="max-w-4xl space-y-6">
            <TonePill>{content.hero.eyebrow}</TonePill>
            <h1 className="font-display text-4xl font-semibold tracking-tight text-zinc-900 sm:text-5xl dark:text-white">
              {content.hero.title}
            </h1>
            <p className="text-base leading-8 text-zinc-600 sm:text-lg dark:text-zinc-300">
              {content.hero.body}
            </p>
          </div>
        </section>

        <section className="grid gap-5 md:grid-cols-3">
          {content.points.map((point) => (
            <article key={point.title} className="brand-stage rounded-[2rem] p-6">
              <h2 className="font-display text-2xl font-semibold text-zinc-900 dark:text-white">
                {point.title}
              </h2>
              <p className="mt-3 text-sm leading-7 text-zinc-600 dark:text-zinc-300">
                {point.body}
              </p>
            </article>
          ))}
        </section>

        <section className="brand-stage rounded-[2.4rem] p-7 sm:p-10">
          <div className="grid gap-8 lg:grid-cols-[1fr,0.72fr] lg:items-end">
            <div className="space-y-4">
              <TonePill>{content.exploreLabel}</TonePill>
              <h2 className="font-display text-3xl font-semibold text-zinc-900 sm:text-4xl dark:text-white">
                {content.cta.title}
              </h2>
              <p className="max-w-2xl text-base leading-8 text-zinc-600 dark:text-zinc-300">
                {content.cta.body}
              </p>
            </div>
            <div className="flex flex-wrap gap-3 lg:justify-end">
              <Button color="teal" href={resolveHref(content.cta.primaryHref)}>
                {content.cta.primaryLabel}
              </Button>
              <Button outline href={resolveHref(content.cta.secondaryHref)}>
                {content.cta.secondaryLabel}
              </Button>
            </div>
          </div>
        </section>
      </main>

      <PublicFooter
        tagline={content.footerTagline}
        companyNote={COMPANY_INFO.companyNote}
      />
    </div>
  );
};
