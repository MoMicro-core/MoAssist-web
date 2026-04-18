import { useI18n } from "../context/I18nContext";
import { COMPANY_INFO } from "../lib/companyInfo";
import { usePublicSeo } from "../lib/publicSeo";
import { buildLocalizedPath, resolveLocale } from "../lib/siteLocales";
import { getImprintContent } from "../content/legalPagesContent";

export const Imprint = () => {
  const { language } = useI18n();
  const localeConfig = resolveLocale(language);
  const content = getImprintContent(localeConfig.key);

  usePublicSeo({
    localeConfig,
    seo: content.seo,
    pathname: "/imprint",
  });

  return (
    <main className="mx-auto w-full max-w-4xl space-y-8 px-6 py-12 text-zinc-700 dark:text-zinc-200">
      <a
        href={buildLocalizedPath("/", language)}
        className="text-sm text-teal-700 hover:underline dark:text-teal-300"
      >
        ← {content.backLabel}
      </a>
      <h1 className="font-display text-4xl font-semibold text-zinc-900 dark:text-white">
        {content.title}
      </h1>

      <section className="space-y-2">
        <h2 className="font-display text-xl font-semibold text-zinc-900 dark:text-white">
          {content.providerTitle}
        </h2>
        <p>{COMPANY_INFO.organizationName}</p>
        <p>Sample Street 1</p>
        <p>10115 Berlin, Germany</p>
      </section>

      <section className="space-y-2">
        <h2 className="font-display text-xl font-semibold text-zinc-900 dark:text-white">
          {content.contactTitle}
        </h2>
        <p>Email: {COMPANY_INFO.infoEmail}</p>
        <p>Support: {COMPANY_INFO.supportEmail}</p>
        <p>Phone: {COMPANY_INFO.primaryPhoneDisplay}</p>
        <p>Phone: {COMPANY_INFO.secondaryPhoneDisplay}</p>
      </section>

      <section className="space-y-2">
        <h2 className="font-display text-xl font-semibold text-zinc-900 dark:text-white">
          {content.responsibleTitle}
        </h2>
        <p>MoAssist is powered by MoMicro.</p>
      </section>

      <section className="space-y-2">
        <h2 className="font-display text-xl font-semibold text-zinc-900 dark:text-white">
          {content.disputeTitle}
        </h2>
        <p>{content.disputeBody}</p>
      </section>
    </main>
  );
};
