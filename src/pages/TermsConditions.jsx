import { useI18n } from "../context/I18nContext";
import { usePublicSeo } from "../lib/publicSeo";
import { buildLocalizedPath, resolveLocale } from "../lib/siteLocales";
import { getTermsContent } from "../content/legalPagesContent";

export const TermsConditions = () => {
  const { language } = useI18n();
  const localeConfig = resolveLocale(language);
  const content = getTermsContent(localeConfig.key);

  usePublicSeo({
    localeConfig,
    seo: content.seo,
    pathname: "/terms-and-conditions",
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

      {content.sections.map((section) => (
        <section key={section.title} className="space-y-3">
          <h2 className="font-display text-xl font-semibold text-zinc-900 dark:text-white">
            {section.title}
          </h2>
          {section.body && <p>{section.body}</p>}
          {section.subsections?.map((subsection) => (
            <div key={subsection.subtitle} className="space-y-2 ml-4">
              <h3 className="font-display text-lg font-semibold text-zinc-900 dark:text-white">
                {subsection.subtitle}
              </h3>
              <p>{subsection.body}</p>
            </div>
          ))}
        </section>
      ))}
    </main>
  );
};
