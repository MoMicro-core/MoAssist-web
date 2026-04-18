export const COMPANY_INFO = {
  organizationName: "MoMicro",
  productName: "MoAssist",
  supportEmail: "support@momicro.com",
  infoEmail: "info@momicro.com",
  primaryPhone: "+491608417916",
  primaryPhoneDisplay: "+49 160 8417916",
  secondaryPhone: "+380661394645",
  secondaryPhoneDisplay: "+380 66 139 4645",
  companyNote: "MoAssist is powered by MoMicro.",
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
  url: url || siteUrl || undefined,
  logo: siteUrl ? new URL("/preview/logo.svg", siteUrl).toString() : undefined,
  description,
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
