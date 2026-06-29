export const COMPANY_INFO = {
  organizationName: "MoMicro",
  productName: "MoMicro",
  supportEmail: "support@momicro.com",
  infoEmail: "info@momicro.com",
  primaryPhone: "+491608417916",
  primaryPhoneDisplay: "+49 160 8417916",
  secondaryPhone: "+380661394645",
  secondaryPhoneDisplay: "+380 66 139 4645",
  companyNote: "MoMicro — the AI Agent for e-commerce.",
  // Official brand profiles — feeds schema `sameAs` so Google can connect the
  // "MoMicro" / "MoMicro" search terms to this domain as one entity.
  // Add real, verified URLs (LinkedIn, X, Instagram, Product Hunt, G2,
  // Crunchbase, …). Leave empty until each profile actually exists.
  socialProfiles: [],
};

export const buildOrganizationStructuredData = ({
  siteUrl,
  url,
  description,
  availableLanguages = [],
}) => ({
  "@context": "https://schema.org",
  "@type": "Organization",
  name: COMPANY_INFO.organizationName,
  // Helps Google treat the company name and the product name as one entity,
  // so searches for "MoMicro" resolve to this site.
  alternateName: COMPANY_INFO.productName,
  url: url || siteUrl || undefined,
  logo: siteUrl ? new URL("/preview/logo.svg", siteUrl).toString() : undefined,
  description,
  sameAs: COMPANY_INFO.socialProfiles?.length
    ? COMPANY_INFO.socialProfiles
    : undefined,
  email: COMPANY_INFO.infoEmail,
  telephone: COMPANY_INFO.primaryPhone,
  availableLanguage: availableLanguages.length ? availableLanguages : undefined,
  contactPoint: [
    {
      "@type": "ContactPoint",
      contactType: "customer support",
      email: COMPANY_INFO.supportEmail,
      telephone: COMPANY_INFO.primaryPhone,
      availableLanguage: availableLanguages.length ? availableLanguages : undefined,
    },
    {
      "@type": "ContactPoint",
      contactType: "sales and general information",
      email: COMPANY_INFO.infoEmail,
      telephone: COMPANY_INFO.secondaryPhone,
      availableLanguage: availableLanguages.length ? availableLanguages : undefined,
    },
  ],
});
