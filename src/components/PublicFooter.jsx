import { COMPANY_INFO } from "../lib/companyInfo";
import { useI18n } from "../context/I18nContext";
import { buildLocalizedPath, isPublicLandingPath } from "../lib/siteLocales";
import { Button } from "../ui/button";

const isExternalOrAnchor = (href = "") =>
  href.startsWith("#") ||
  href.startsWith("http") ||
  href.startsWith("mailto:") ||
  href.startsWith("tel:");

const defaultColumns = [
  {
    title: "Product",
    links: [
      { label: "Home", href: "/" },
      { label: "Pricing", href: "/pricing" },
      { label: "Login", href: "/login" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "MoMicro", href: "/momicro" },
      { label: "Contacts", href: "/contacts" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy Policy", href: "/privacy-policy" },
      { label: "Imprint", href: "/imprint" },
      { label: "Terms & Conditions", href: "/terms-and-conditions" },
    ],
  },
];

export const PublicFooter = ({
  tagline,
  columns = defaultColumns,
  companyNote,
}) => {
  const { language, t } = useI18n();
  const contactsPath = buildLocalizedPath("/contacts", language);
  const pricingPath = buildLocalizedPath("/pricing", language);

  const resolveHref = (href) => {
    if (!href || isExternalOrAnchor(href)) {
      return href;
    }

    return isPublicLandingPath(href) ? buildLocalizedPath(href, language) : href;
  };

  return (
    <footer className="mx-auto mt-16 w-full max-w-7xl px-5 sm:px-8">
      <div className="brand-stage rounded-[2.4rem] px-6 py-8 sm:px-8 sm:py-10">
        <div className="grid gap-10 lg:grid-cols-[1.08fr,0.92fr]">
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <img
                src="/preview/logo.svg"
                alt="MoAssist"
                className="h-12 w-12 rounded-2xl bg-white/90 p-1.5 shadow-sm dark:bg-white/10"
              />
              <div>
                <div className="font-display text-xl font-semibold text-zinc-900 dark:text-white">
                  MoAssist
                </div>
                <div className="text-sm text-zinc-500 dark:text-zinc-400">
                  {tagline || t("marketingTagline")}
                </div>
              </div>
            </div>
            <div className="space-y-3 text-sm text-zinc-600 dark:text-zinc-300">
              <p>{companyNote || COMPANY_INFO.companyNote}</p>
              <p className="text-zinc-500 dark:text-zinc-400">
                Detailed support, info, and phone contacts are on the contacts page.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button color="sky" href={contactsPath}>
                {t("contactsNav")}
              </Button>
              <Button outline href={pricingPath}>
                {t("pricingNav")}
              </Button>
            </div>
            <div className="text-sm text-zinc-500 dark:text-zinc-400">
              © {new Date().getFullYear()} MoMicro
            </div>
          </div>

          <div className="grid gap-8 sm:grid-cols-3">
            {columns.map((column) => (
              <div key={column.title} className="space-y-3">
                <div className="text-xs font-semibold uppercase tracking-[0.3em] text-zinc-500 dark:text-zinc-400">
                  {column.title}
                </div>
                <div className="space-y-2 text-sm text-zinc-600 dark:text-zinc-300">
                  {column.links.map((link) => (
                    <a
                      key={link.label}
                      href={resolveHref(link.href)}
                      className="block transition hover:text-zinc-900 dark:hover:text-white"
                    >
                      {link.label}
                    </a>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};
