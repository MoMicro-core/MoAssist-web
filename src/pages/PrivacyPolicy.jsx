import { useI18n } from "../context/I18nContext";
import { COMPANY_INFO } from "../lib/companyInfo";
import { usePublicSeo } from "../lib/publicSeo";
import { buildLocalizedPath, resolveLocale } from "../lib/siteLocales";
import { getPrivacyPolicyContent } from "../content/legalPagesContent";

export const PrivacyPolicy = () => {
  const { language } = useI18n();
  const localeConfig = resolveLocale(language);
  const content = getPrivacyPolicyContent(localeConfig.key);

  usePublicSeo({
    localeConfig,
    seo: content.seo,
    pathname: "/privacy-policy",
  });

  return (
    <main className="mx-auto w-full max-w-4xl space-y-8 px-6 py-12 text-zinc-700 dark:text-zinc-200">
      <a
        href={buildLocalizedPath("/", language)}
        className="text-sm text-teal-700 hover:underline dark:text-teal-300"
      >
        ← {content.backLabel}
      </a>

      <header className="space-y-3">
        <h1 className="font-display text-4xl font-semibold text-zinc-900 dark:text-white">
          {content.title}
        </h1>
        <p>{content.intro}</p>
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          {content.updatedLabel}: {content.updatedValue}
        </p>
      </header>

      {content.sections.map((section) => (
        <section key={section.title} className="space-y-3">
          <h2 className="font-display text-xl font-semibold text-zinc-900 dark:text-white">
            {section.title}
          </h2>
          {section.paragraphs?.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
          {section.intro ? <p>{section.intro}</p> : null}
          {section.items?.length ? (
            <ul className="list-disc space-y-2 pl-5">
              {section.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          ) : null}
          {section.title.startsWith("10.") ? (
            <div className="space-y-1">
              <p>{COMPANY_INFO.infoEmail}</p>
              <p>{COMPANY_INFO.supportEmail}</p>
              <p>
                {COMPANY_INFO.primaryPhoneDisplay} / {COMPANY_INFO.secondaryPhoneDisplay}
              </p>
            </div>
          ) : null}
        </section>
      ))}
    </main>
  );
};
