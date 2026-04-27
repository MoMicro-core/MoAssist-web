import { COMPANY_INFO } from "../lib/companyInfo";
import { useI18n } from "../context/I18nContext";
import { buildLocalizedPath, isPublicLandingPath } from "../lib/siteLocales";
import { Button } from "../ui/button";

const isExternalOrAnchor = (href = "") =>
  href.startsWith("#") ||
  href.startsWith("http") ||
  href.startsWith("mailto:") ||
  href.startsWith("tel:");

const footerCopy = {
  en: {
    columns: [
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
    ],
    supportNote: "Detailed support, info, and phone contacts are on the contacts page.",
  },
  de: {
    columns: [
      {
        title: "Produkt",
        links: [
          { label: "Startseite", href: "/" },
          { label: "Preise", href: "/pricing" },
          { label: "Login", href: "/login" },
        ],
      },
      {
        title: "Unternehmen",
        links: [
          { label: "MoMicro", href: "/momicro" },
          { label: "Kontakt", href: "/contacts" },
        ],
      },
      {
        title: "Rechtliches",
        links: [
          { label: "Datenschutz", href: "/privacy-policy" },
          { label: "Impressum", href: "/imprint" },
          { label: "AGB", href: "/terms-and-conditions" },
        ],
      },
    ],
    supportNote:
      "Detaillierte Support-, Info- und Telefonkontakte finden Sie auf der Kontaktseite.",
  },
  es: {
    columns: [
      {
        title: "Producto",
        links: [
          { label: "Inicio", href: "/" },
          { label: "Precios", href: "/pricing" },
          { label: "Login", href: "/login" },
        ],
      },
      {
        title: "Empresa",
        links: [
          { label: "MoMicro", href: "/momicro" },
          { label: "Contactos", href: "/contacts" },
        ],
      },
      {
        title: "Legal",
        links: [
          { label: "Política de privacidad", href: "/privacy-policy" },
          { label: "Aviso legal", href: "/imprint" },
          { label: "Términos y condiciones", href: "/terms-and-conditions" },
        ],
      },
    ],
    supportNote:
      "Los contactos detallados de soporte, información y teléfono están en la página de contactos.",
  },
};

export const PublicFooter = ({
  tagline,
  columns,
  companyNote,
}) => {
  const { language, t } = useI18n();
  const contactsPath = buildLocalizedPath("/contacts", language);
  const pricingPath = buildLocalizedPath("/pricing", language);
  const localizedFooter = footerCopy[language] || footerCopy.en;
  const resolvedColumns = columns || localizedFooter.columns;

  const resolveHref = (href) => {
    if (!href || isExternalOrAnchor(href)) {
      return href;
    }

    return isPublicLandingPath(href) ? buildLocalizedPath(href, language) : href;
  };

  return (
    <footer className="mx-auto mt-12 w-full max-w-7xl px-4 sm:mt-16 sm:px-8">
      <div className="brand-stage rounded-[1.75rem] px-5 py-7 sm:rounded-[2.4rem] sm:px-8 sm:py-10">
        <div className="grid gap-8 lg:grid-cols-[1.08fr,0.92fr] lg:gap-10">
          <div className="space-y-5 sm:space-y-6">
            <a href="/chatbots" className="flex items-center gap-3">
              <picture>
                <source srcSet="/preview/logo.webp" type="image/webp" />
                <img
                  src="/preview/logo-opt.png"
                  alt="MoAssist"
                  width="64"
                  height="64"
                  className="h-12 w-12 rounded-[1.1rem] bg-white/90 p-2 shadow-sm sm:h-16 sm:w-16 sm:rounded-[1.4rem] dark:bg-white/10"
                  loading="lazy"
                  decoding="async"
                />
              </picture>
              <div className="min-w-0">
                <div className="truncate font-display text-lg font-semibold text-zinc-900 sm:text-xl dark:text-white">
                  MoAssist
                </div>
                <div className="text-sm text-zinc-500 dark:text-zinc-400">
                  {tagline || t("marketingTagline")}
                </div>
              </div>
            </a>
            <div className="space-y-3 text-sm text-zinc-600 dark:text-zinc-300">
              <p>{companyNote || COMPANY_INFO.companyNote}</p>
              <p className="text-zinc-500 dark:text-zinc-400">
                {localizedFooter.supportNote}
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

          <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 sm:gap-8">
            {resolvedColumns.map((column) => (
              <div key={column.title} className="space-y-3">
                <div className="text-[11px] font-semibold uppercase tracking-[0.3em] text-zinc-500 dark:text-zinc-400">
                  {column.title}
                </div>
                <div className="space-y-2.5 text-sm text-zinc-600 dark:text-zinc-300">
                  {column.links.map((link) => (
                    <a
                      key={link.label}
                      href={resolveHref(link.href)}
                      className="block py-1 transition hover:text-zinc-900 dark:hover:text-white"
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
