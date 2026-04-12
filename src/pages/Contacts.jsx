import { PublicFooter } from "../components/PublicFooter";
import { PublicHeader } from "../components/PublicHeader";
import { getContactsPageContent } from "../content/publicPagesContent";
import {
  COMPANY_INFO,
  buildCeoStructuredData,
  buildOrganizationStructuredData,
} from "../lib/companyInfo";
import { usePublicSeo } from "../lib/publicSeo";
import {
  buildLocaleUrl,
  buildLocalizedPath,
  resolveLocale,
} from "../lib/siteLocales";
import { Button } from "../ui/button";
import { useI18n } from "../context/I18nContext";

const TonePill = ({ children }) => (
  <span className="inline-flex items-center rounded-full border border-[#099ad9]/16 bg-[#099ad9]/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.28em] text-[#10435f] dark:border-[#1bb1d4]/20 dark:bg-[#1bb1d4]/14 dark:text-[#def1f2]">
    {children}
  </span>
);

export const Contacts = () => {
  const { language, t } = useI18n();
  const localeConfig = resolveLocale(language);
  const pricingPath = buildLocalizedPath("/pricing", language);
  const content = getContactsPageContent(localeConfig.key);
  const contactCards = [
    {
      ...content.cards[0],
      value: COMPANY_INFO.supportEmail,
      actionHref: `mailto:${COMPANY_INFO.supportEmail}`,
    },
    {
      ...content.cards[1],
      value: COMPANY_INFO.infoEmail,
      actionHref: `mailto:${COMPANY_INFO.infoEmail}`,
    },
    {
      ...content.cards[2],
      value: COMPANY_INFO.primaryPhoneDisplay,
      actionHref: `tel:${COMPANY_INFO.primaryPhone}`,
    },
    {
      ...content.cards[3],
      value: COMPANY_INFO.secondaryPhoneDisplay,
      actionHref: `tel:${COMPANY_INFO.secondaryPhone}`,
    },
    {
      ...content.cards[4],
      value: COMPANY_INFO.ceoName,
      actionHref: "/pricing",
      internal: true,
    },
  ];

  usePublicSeo({
    localeConfig,
    seo: content.seo,
    pathname: "/contacts",
  });

  const siteUrl = typeof window !== "undefined" ? window.location.origin : "";
  const organizationStructuredData = buildOrganizationStructuredData({
    siteUrl,
    url: siteUrl ? buildLocaleUrl(siteUrl, "/contacts", localeConfig.key) : undefined,
    description:
      "Dedicated MoAssist and MoMicro contacts page for support, general information, and leadership details.",
  });
  const ceoStructuredData = buildCeoStructuredData({ siteUrl });
  const contactPageStructuredData = {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    name: content.breadcrumbCurrent,
    url: siteUrl
      ? buildLocaleUrl(siteUrl, "/contacts", localeConfig.key)
      : undefined,
    inLanguage: localeConfig.htmlLang,
    description:
      "Dedicated contact page for MoAssist and MoMicro support, info, and phone details.",
    about: {
      "@type": "Organization",
      name: COMPANY_INFO.organizationName,
    },
  };
  const breadcrumbStructuredData = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: content.breadcrumbHome,
        item: siteUrl ? buildLocaleUrl(siteUrl, "/", localeConfig.key) : undefined,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: content.breadcrumbCurrent,
        item: siteUrl
          ? buildLocaleUrl(siteUrl, "/contacts", localeConfig.key)
          : undefined,
      },
    ],
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
          __html: JSON.stringify(contactPageStructuredData),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbStructuredData),
        }}
      />

      <div className="landing-orb pointer-events-none absolute -left-24 top-12 h-72 w-72 rounded-full bg-[radial-gradient(circle,_rgba(9,154,217,0.14),_transparent_66%)] blur-2xl" />
      <div className="landing-orb pointer-events-none absolute -right-24 top-40 h-80 w-80 rounded-full bg-[radial-gradient(circle,_rgba(92,215,211,0.14),_transparent_66%)] blur-2xl" />

      <PublicHeader />

      <main className="mx-auto mt-8 w-full max-w-7xl space-y-14 px-5 sm:px-8">
        <section className="brand-stage rounded-[2.6rem] px-6 py-8 sm:px-10 sm:py-12">
          <div className="grid gap-10 lg:grid-cols-[1fr,0.72fr] lg:items-end">
            <div className="space-y-6">
              <TonePill>{t("contactsNav")}</TonePill>
              <div className="space-y-4">
                <h1 className="font-display text-4xl font-semibold tracking-tight text-zinc-900 sm:text-5xl dark:text-white">
                  {content.heroTitle}
                </h1>
                <p className="max-w-3xl text-base leading-8 text-zinc-600 sm:text-lg dark:text-zinc-300">
                  {content.heroBody}
                </p>
              </div>
            </div>

            <div className="brand-panel rounded-[2rem] p-6">
              <div className="text-xs font-semibold uppercase tracking-[0.32em] text-zinc-500 dark:text-zinc-400">
                {content.companyLabel}
              </div>
              <div className="mt-4 space-y-3 text-sm leading-7 text-zinc-600 dark:text-zinc-300">
                <p>{COMPANY_INFO.companyNote}</p>
                <p>{content.companyBody}</p>
              </div>
              <Button color="teal" href={pricingPath} className="mt-6">
                {content.companyCtaLabel}
              </Button>
            </div>
          </div>
        </section>

        <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {contactCards.map((card) => (
            <article key={card.title} className="brand-stage rounded-[2rem] p-6">
              <div className="text-xs font-semibold uppercase tracking-[0.28em] text-zinc-500 dark:text-zinc-400">
                {card.title}
              </div>
              <h2 className="mt-3 font-display text-2xl font-semibold text-zinc-900 dark:text-white">
                {card.value}
              </h2>
              <p className="mt-3 text-sm leading-7 text-zinc-600 dark:text-zinc-300">
                {card.body}
              </p>
              <Button
                outline
                href={
                  card.internal
                    ? buildLocalizedPath(card.actionHref, language)
                    : card.actionHref
                }
                className="mt-6"
              >
                {card.buttonLabel}
              </Button>
            </article>
          ))}
        </section>
      </main>

      <PublicFooter />
    </div>
  );
};
