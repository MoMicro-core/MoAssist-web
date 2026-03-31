import { PublicFooter } from "../components/PublicFooter";
import { PublicHeader } from "../components/PublicHeader";
import { useI18n } from "../context/I18nContext";
import { getPricingPageContent } from "../content/publicPagesContent";
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

const SectionHeading = ({ eyebrow, title, body }) => (
  <div className="space-y-4">
    <TonePill>{eyebrow}</TonePill>
    <h2 className="font-display text-3xl font-semibold text-zinc-900 sm:text-4xl dark:text-white">
      {title}
    </h2>
    <p className="max-w-3xl text-base leading-8 text-zinc-600 dark:text-zinc-300">
      {body}
    </p>
  </div>
);

export const Pricing = () => {
  const { language, t } = useI18n();
  const localeConfig = resolveLocale(language);
  const content = getPricingPageContent(localeConfig.key);
  const resolveHref = (href) =>
    isPublicLandingPath(href) ? buildLocalizedPath(href, language) : href;

  usePublicSeo({
    localeConfig,
    seo: content.seo,
    pathname: "/pricing",
  });

  const siteUrl = typeof window !== "undefined" ? window.location.origin : "";
  const organizationStructuredData = buildOrganizationStructuredData({
    siteUrl,
    url: siteUrl ? buildLocaleUrl(siteUrl, "/pricing", localeConfig.key) : undefined,
    description:
      "MoMicro operates MoAssist pricing, onboarding, support, and product information.",
  });
  const ceoStructuredData = buildCeoStructuredData({ siteUrl });
  const softwareStructuredData = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: COMPANY_INFO.productName,
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web",
    inLanguage: localeConfig.htmlLang,
    description: content.seo.description,
    brand: {
      "@type": "Brand",
      name: COMPANY_INFO.productName,
    },
    provider: {
      "@type": "Organization",
      name: COMPANY_INFO.organizationName,
      url: siteUrl || undefined,
    },
    offers: content.tiers.map((tier) => ({
      "@type": "Offer",
      name: tier.name,
      priceCurrency: "USD",
      price: tier.priceLabel.replace("$", ""),
      availability: "https://schema.org/InStock",
      url: siteUrl ? buildLocaleUrl(siteUrl, "/pricing", localeConfig.key) : undefined,
    })),
  };
  const faqStructuredData = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    inLanguage: localeConfig.htmlLang,
    mainEntity: content.faq.items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
  const breadcrumbStructuredData = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: siteUrl ? buildLocaleUrl(siteUrl, "/", localeConfig.key) : undefined,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Pricing",
        item: siteUrl
          ? buildLocaleUrl(siteUrl, "/pricing", localeConfig.key)
          : undefined,
      },
    ],
  };
  const webPageStructuredData = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: content.seo.title,
    url: siteUrl
      ? buildLocaleUrl(siteUrl, "/pricing", localeConfig.key)
      : undefined,
    inLanguage: localeConfig.htmlLang,
    description: content.seo.description,
    about: {
      "@type": "SoftwareApplication",
      name: COMPANY_INFO.productName,
    },
    publisher: {
      "@type": "Organization",
      name: COMPANY_INFO.organizationName,
      email: COMPANY_INFO.infoEmail,
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
          __html: JSON.stringify(softwareStructuredData),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(faqStructuredData),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbStructuredData),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(webPageStructuredData),
        }}
      />

      <div className="landing-orb pointer-events-none absolute -left-24 top-16 h-72 w-72 rounded-full bg-[radial-gradient(circle,_rgba(9,154,217,0.14),_transparent_66%)] blur-2xl" />
      <div className="landing-orb pointer-events-none absolute -right-24 top-40 h-80 w-80 rounded-full bg-[radial-gradient(circle,_rgba(92,215,211,0.14),_transparent_66%)] blur-2xl" />

      <PublicHeader />

      <main className="mx-auto mt-8 w-full max-w-7xl space-y-16 px-5 sm:px-8">
        <section className="brand-stage rounded-[2.6rem] px-6 py-8 sm:px-10 sm:py-12">
          <div className="grid gap-10 lg:grid-cols-[1fr,0.72fr] lg:items-end">
            <div className="space-y-6">
              <TonePill>{content.hero.eyebrow}</TonePill>
              <div className="space-y-4">
                <h1 className="font-display text-4xl font-semibold tracking-tight text-zinc-900 sm:text-5xl dark:text-white">
                  {content.hero.title}
                </h1>
                <p className="max-w-3xl text-base leading-8 text-zinc-600 sm:text-lg dark:text-zinc-300">
                  {content.hero.body}
                </p>
                <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#10435f] dark:text-[#def1f2]">
                  {content.hero.trial}
                </p>
                <p className="max-w-2xl text-sm leading-7 text-zinc-500 dark:text-zinc-400">
                  {t("brandRelationshipLabel")}
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <Button color="teal" href="/login">
                  Start 7-day free trial
                </Button>
                <Button outline href="/chatbots">
                  Open dashboard
                </Button>
              </div>
            </div>

            <div className="brand-panel rounded-[2rem] p-6">
              <div className="text-xs font-semibold uppercase tracking-[0.32em] text-zinc-500 dark:text-zinc-400">
                Why this page exists
              </div>
              <p className="mt-4 text-sm leading-7 text-zinc-600 dark:text-zinc-300">
                This pricing page is here to make the difference obvious: the Free
                tier covers basic website chat, the $20 Connected tier adds
                signed-in customer workflows, and the $50 Full AI tier is the
                main, most used plan for businesses that want AI to automate
                routine customer answers at scale.
              </p>
            </div>
          </div>
        </section>

        <section className="grid gap-5 lg:grid-cols-3">
          {content.tiers.map((tier) => (
            <article
              key={tier.name}
              className={`rounded-[2rem] border p-6 shadow-[0_20px_60px_-44px_rgba(13,34,51,0.38)] ${
                tier.featured
                  ? "border-[#1bb1d4]/35 bg-[linear-gradient(160deg,rgba(230,251,255,0.92),rgba(255,255,255,0.9))] dark:border-[#5dd3df]/30 dark:bg-[linear-gradient(160deg,rgba(11,29,45,0.96),rgba(8,21,33,0.92))]"
                  : "border-white/75 bg-white/84 dark:border-white/10 dark:bg-[#091725]/82"
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="font-display text-2xl font-semibold text-zinc-900 dark:text-white">
                    {tier.name}
                  </div>
                  <div className="mt-2 text-sm uppercase tracking-[0.24em] text-zinc-500 dark:text-zinc-400">
                    {tier.badge}
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-display text-4xl font-semibold text-zinc-900 dark:text-white">
                    {tier.priceLabel}
                  </div>
                  <div className="text-sm text-zinc-500 dark:text-zinc-400">
                    {tier.period}
                  </div>
                </div>
              </div>

              <p className="mt-5 text-sm leading-7 text-zinc-600 dark:text-zinc-300">
                {tier.summary}
              </p>

              <ul className="mt-6 space-y-3 text-sm text-zinc-700 dark:text-zinc-200">
                {tier.features.map((feature) => (
                  <li key={feature} className="flex gap-3">
                    <span className="mt-1 h-2.5 w-2.5 rounded-full bg-sky-500 dark:bg-cyan-300" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <Button
                href={tier.ctaHref}
                color={tier.featured ? "sky" : "teal"}
                className="mt-8 w-full"
              >
                {tier.ctaLabel}
              </Button>
            </article>
          ))}
        </section>

        <section className="space-y-8">
          <SectionHeading
            eyebrow={content.comparison.eyebrow}
            title={content.comparison.title}
            body={content.comparison.body}
          />

          <div className="overflow-hidden rounded-[2rem] border border-white/75 bg-white/86 shadow-[0_20px_60px_-44px_rgba(13,34,51,0.38)] dark:border-white/10 dark:bg-[#091725]/82">
            <div className="overflow-x-auto">
              <table className="min-w-full border-collapse">
                <thead>
                  <tr className="border-b border-zinc-200/70 dark:border-white/10">
                    <th className="px-5 py-4 text-left text-sm font-semibold text-zinc-900 dark:text-white">
                      Capability
                    </th>
                    {content.tiers.map((tier) => (
                      <th
                        key={tier.name}
                        className="px-5 py-4 text-left text-sm font-semibold text-zinc-900 dark:text-white"
                      >
                        {tier.name}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {content.comparison.rows.map((row) => (
                    <tr
                      key={row.label}
                      className="border-b border-zinc-200/60 last:border-b-0 dark:border-white/10"
                    >
                      <td className="px-5 py-4 text-sm text-zinc-600 dark:text-zinc-300">
                        {row.label}
                      </td>
                      {row.values.map((value) => (
                        <td
                          key={`${row.label}-${value}`}
                          className="px-5 py-4 text-sm text-zinc-700 dark:text-zinc-200"
                        >
                          {value}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        <section className="space-y-8">
          <SectionHeading
            eyebrow={content.faq.eyebrow}
            title={content.faq.title}
            body="These answers are written for buyers who want a direct summary before they start the free plan or a 7-day trial."
          />

          <div className="grid gap-5 md:grid-cols-2">
            {content.faq.items.map((item) => (
              <article
                key={item.question}
                className="brand-stage rounded-[2rem] p-6"
              >
                <h3 className="font-display text-xl font-semibold text-zinc-900 dark:text-white">
                  {item.question}
                </h3>
                <p className="mt-3 text-sm leading-7 text-zinc-600 dark:text-zinc-300">
                  {item.answer}
                </p>
              </article>
            ))}
          </div>
        </section>

        <section className="brand-stage rounded-[2.4rem] p-7 sm:p-10">
          <div className="grid gap-8 lg:grid-cols-[1fr,0.72fr] lg:items-end">
            <div className="space-y-4">
              <TonePill>Next Step</TonePill>
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
        tagline="Pricing for MoAssist, the chatbot product built by MoMicro."
        companyNote={COMPANY_INFO.companyNote}
      />
    </div>
  );
};
