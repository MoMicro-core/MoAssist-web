import { useEffect, useRef, useState } from "react";
import { PublicHeader } from "../components/PublicHeader";
import { useI18n } from "../context/I18nContext";
import { getMarketingContent } from "../content/marketingContent";
import {
  DEFAULT_LOCALE_KEY,
  SITE_LOCALES,
  buildLocaleUrl,
  resolveLocale,
} from "../lib/siteLocales";
import { Button } from "../ui/button";

const upsertMeta = (attribute, key, content) => {
  let tag = document.head.querySelector(`meta[${attribute}="${key}"]`);

  if (!tag) {
    tag = document.createElement("meta");
    tag.setAttribute(attribute, key);
    document.head.appendChild(tag);
  }

  tag.setAttribute("content", content);
};

const upsertLink = (rel, href) => {
  let link = document.head.querySelector(`link[rel="${rel}"]`);

  if (!link) {
    link = document.createElement("link");
    link.setAttribute("rel", rel);
    document.head.appendChild(link);
  }

  link.setAttribute("href", href);
};

const replaceAlternateLinks = (origin, pathname = "/") => {
  document.head
    .querySelectorAll('link[rel="alternate"][data-moassist-locale="true"]')
    .forEach((node) => node.remove());

  const xDefaultLink = document.createElement("link");
  xDefaultLink.setAttribute("rel", "alternate");
  xDefaultLink.setAttribute("hreflang", "x-default");
  xDefaultLink.setAttribute(
    "href",
    buildLocaleUrl(origin, pathname, DEFAULT_LOCALE_KEY),
  );
  xDefaultLink.dataset.moassistLocale = "true";
  document.head.appendChild(xDefaultLink);

  SITE_LOCALES.forEach((locale) => {
    const link = document.createElement("link");
    link.setAttribute("rel", "alternate");
    link.setAttribute("hreflang", locale.hreflang);
    link.setAttribute("href", buildLocaleUrl(origin, pathname, locale.key));
    link.dataset.moassistLocale = "true";
    document.head.appendChild(link);
  });
};

const replaceAlternateOgLocales = (activeLocale) => {
  document.head
    .querySelectorAll('meta[property="og:locale:alternate"][data-moassist-locale="true"]')
    .forEach((node) => node.remove());

  SITE_LOCALES.filter((locale) => locale.key !== activeLocale.key).forEach(
    (locale) => {
      const meta = document.createElement("meta");
      meta.setAttribute("property", "og:locale:alternate");
      meta.setAttribute("content", locale.ogLocale);
      meta.dataset.moassistLocale = "true";
      document.head.appendChild(meta);
    },
  );
};

const handlePlaceholderError = (event) => {
  event.currentTarget.style.opacity = "0";
};

const useLandingSeo = ({ localeConfig, seo }) => {
  useEffect(() => {
    document.documentElement.lang = localeConfig.htmlLang;
    document.title = seo.title;

    upsertMeta("name", "description", seo.description);
    upsertMeta("name", "keywords", seo.keywords);
    upsertMeta("name", "application-name", "MoAssist");
    upsertMeta("name", "language", localeConfig.languageName);
    upsertMeta("property", "og:title", seo.title);
    upsertMeta("property", "og:description", seo.ogDescription);
    upsertMeta("property", "og:type", "website");
    upsertMeta("property", "og:locale", localeConfig.ogLocale);
    upsertMeta("name", "twitter:title", seo.title);
    upsertMeta("name", "twitter:description", seo.twitterDescription);
    upsertMeta(
      "name",
      "robots",
      "index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1",
    );
    upsertMeta("property", "og:site_name", "MoAssist");

    if (window.location?.href) {
      const canonicalUrl = buildLocaleUrl(
        window.location.origin,
        window.location.pathname,
        localeConfig.key,
      );

      upsertMeta("property", "og:url", canonicalUrl);
      upsertLink("canonical", canonicalUrl);
      replaceAlternateLinks(window.location.origin, window.location.pathname);
      replaceAlternateOgLocales(localeConfig);
      upsertMeta(
        "property",
        "og:image",
        `${window.location.origin}/preview/logo.svg`,
      );
      upsertMeta("property", "og:image:alt", "MoAssist logo");
      upsertMeta(
        "name",
        "twitter:image",
        `${window.location.origin}/preview/logo.svg`,
      );
    }
  }, [localeConfig, seo]);
};

const useRevealOnScroll = () => {
  useEffect(() => {
    const revealNodes = Array.from(document.querySelectorAll("[data-reveal]"));

    if (!revealNodes.length) {
      return undefined;
    }

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      revealNodes.forEach((node) => node.classList.add("is-visible"));
      return undefined;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.16,
        rootMargin: "0px 0px -8% 0px",
      },
    );

    revealNodes.forEach((node) => observer.observe(node));

    return () => observer.disconnect();
  }, []);
};

const useWorkflowStepObserver = (sectionRef, setActiveStep) => {
  useEffect(() => {
    const sectionNode = sectionRef.current;

    if (!sectionNode) {
      return undefined;
    }

    const triggerNodes = Array.from(
      sectionNode.querySelectorAll("[data-step-trigger]"),
    );

    if (!triggerNodes.length) {
      return undefined;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) {
            return;
          }

          const nextStep = Number(entry.target.dataset.stepTrigger ?? 0);
          setActiveStep((current) =>
            current === nextStep ? current : nextStep,
          );
        });
      },
      {
        rootMargin: "-42% 0px -42% 0px",
        threshold: 0,
      },
    );

    triggerNodes.forEach((node) => observer.observe(node));

    return () => observer.disconnect();
  }, [sectionRef, setActiveStep]);
};

const usePointerLight = (lightRef) => {
  useEffect(() => {
    const lightNode = lightRef.current;

    if (!lightNode) {
      return undefined;
    }

    const canUsePointerLight = window.matchMedia(
      "(min-width: 768px) and (pointer: fine)",
    ).matches;

    if (!canUsePointerLight) {
      lightNode.style.opacity = "0";
      return undefined;
    }

    let rafId = 0;
    let nextX = window.innerWidth * 0.5;
    let nextY = window.innerHeight * 0.22;

    const render = () => {
      rafId = 0;
      const radius = lightNode.offsetWidth / 2 || 208;
      lightNode.style.transform = `translate3d(${nextX - radius}px, ${nextY - radius}px, 0)`;
    };

    const requestRender = () => {
      if (!rafId) {
        rafId = window.requestAnimationFrame(render);
      }
    };

    const resetPointerLight = () => {
      nextX = window.innerWidth * 0.5;
      nextY = window.innerHeight * 0.22;
      requestRender();
    };

    const handlePointerMove = (event) => {
      nextX = event.clientX;
      nextY = event.clientY;
      requestRender();
    };

    requestRender();
    window.addEventListener("pointermove", handlePointerMove, {
      passive: true,
    });
    window.addEventListener("pointerleave", resetPointerLight);
    window.addEventListener("blur", resetPointerLight);
    window.addEventListener("resize", resetPointerLight);

    return () => {
      if (rafId) {
        window.cancelAnimationFrame(rafId);
      }
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerleave", resetPointerLight);
      window.removeEventListener("blur", resetPointerLight);
      window.removeEventListener("resize", resetPointerLight);
      lightNode.style.opacity = "";
      lightNode.style.transform = "";
    };
  }, [lightRef]);
};

const TonePill = ({ children, className = "" }) => (
  <span
    className={`inline-flex items-center rounded-full border border-[#099ad9]/16 bg-[#099ad9]/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.28em] text-[#10435f] dark:border-[#1bb1d4]/20 dark:bg-[#1bb1d4]/14 dark:text-[#def1f2] ${className}`}
  >
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

const PlaceholderImage = ({
  title,
  alt,
  placeholderLabel,
  placeholderBody,
  className = "",
  aspectClass = "aspect-[4/3]",
}) => (
  <div
    data-reveal
    className={`landing-reveal landing-hover-lift landing-image-shell brand-stage p-4 sm:p-5 ${className}`}
  >
    <div
      className={`relative overflow-hidden rounded-[1.75rem] border border-white/75 bg-white/88 dark:border-white/10 dark:bg-[#0b1d2d]/88 ${aspectClass}`}
    >
      <img
        src="#"
        alt={alt}
        loading="lazy"
        onError={handlePlaceholderError}
        className="h-full w-full object-cover"
      />
      <div className="absolute inset-0 grid place-items-center bg-[linear-gradient(160deg,rgba(255,255,255,0.88),rgba(239,248,255,0.78))] p-6 text-center dark:bg-[linear-gradient(160deg,rgba(10,28,44,0.9),rgba(8,21,33,0.88))]">
        <div>
          <div className="text-[10px] font-semibold uppercase tracking-[0.32em] text-zinc-500 dark:text-zinc-400">
            {placeholderLabel}
          </div>
          <div className="mt-3 font-display text-2xl font-semibold text-zinc-900 dark:text-white">
            {title}
          </div>
          <p className="mt-3 max-w-sm text-sm leading-7 text-zinc-600 dark:text-zinc-300">
            {placeholderBody}
          </p>
        </div>
      </div>
    </div>
  </div>
);

const WorkflowCardImage = ({ title, alt, placeholderLabel, placeholderBody }) => (
  <div className="relative overflow-hidden rounded-[1.65rem] border border-white/75 bg-white/88 dark:border-white/10 dark:bg-[#0b1d2d]/88">
    <div className="aspect-[4/3]">
      <img
        src="#"
        alt={alt}
        loading="lazy"
        onError={handlePlaceholderError}
        className="h-full w-full object-cover"
      />
    </div>
    <div className="absolute inset-0 grid place-items-center bg-[linear-gradient(160deg,rgba(255,255,255,0.88),rgba(239,248,255,0.78))] p-6 text-center dark:bg-[linear-gradient(160deg,rgba(10,28,44,0.9),rgba(8,21,33,0.88))]">
      <div>
        <div className="text-[10px] font-semibold uppercase tracking-[0.32em] text-zinc-500 dark:text-zinc-400">
          {placeholderLabel}
        </div>
        <div className="mt-3 font-display text-2xl font-semibold text-zinc-900 dark:text-white">
          {title}
        </div>
        <p className="mt-3 max-w-sm text-sm leading-7 text-zinc-600 dark:text-zinc-300">
          {placeholderBody}
        </p>
      </div>
    </div>
  </div>
);

const HowItWorksSection = ({ activeStep, content, sectionRef }) => {
  const workflowSteps = content.workflowSteps;

  return (
  <section
    ref={sectionRef}
    id="how-it-works"
    className="relative grid gap-12 lg:grid-cols-[0.9fr_1.1fr]"
  >
    <div className="pointer-events-none absolute right-0 top-12 hidden h-56 w-56 rounded-full bg-[radial-gradient(circle,_rgba(92,215,211,0.18),_transparent_68%)] blur-2xl lg:block" />

    <div
      data-reveal
      className="landing-reveal space-y-6 lg:sticky lg:top-24 lg:self-start"
    >
      <p className="text-xs uppercase tracking-[0.4em] text-zinc-500 dark:text-zinc-400">
        {content.workflowSection.processLabel}
      </p>
      <h2 className="font-display text-3xl font-semibold text-zinc-900 sm:text-4xl dark:text-white">
        {content.workflowSection.title}
      </h2>
      <p className="max-w-xl text-base leading-8 text-zinc-600 dark:text-zinc-300">
        {content.workflowSection.body}
      </p>
      <div className="space-y-4 text-sm text-zinc-500 dark:text-zinc-400">
        {workflowSteps.map((item, index) => {
          const isActive = activeStep === index;
          return (
            <div
              key={item.step}
              data-step-indicator={index}
              className={`landing-step-indicator ${isActive ? "is-active" : ""}`}
            >
              <span className="landing-step-indicator-dot" />
              {item.label}
            </div>
          );
        })}
      </div>
      <div className="brand-panel rounded-[1.5rem] p-4">
        <div className="text-[10px] font-semibold uppercase tracking-[0.32em] text-zinc-500 dark:text-zinc-400">
          {workflowSteps[activeStep].step}
        </div>
        <div className="mt-2 font-display text-lg font-semibold text-zinc-900 dark:text-white">
          {workflowSteps[activeStep].title}
        </div>
        <p className="mt-2 text-sm leading-7 text-zinc-600 dark:text-zinc-300">
          {workflowSteps[activeStep].body}
        </p>
      </div>
    </div>

    <div className="relative min-h-[320vh]" data-workflow-stack>
      <div className="sticky top-24 h-[80vh]">
        {workflowSteps.map((item, index) => {
          const stateClass =
            index === activeStep
              ? "is-active"
              : index > activeStep
                ? "is-next"
                : "is-past";

          return (
            <div
              key={item.title}
              data-step-card={index}
              className={`landing-step-card ${stateClass}`}
            >
              <div className="brand-stage h-full rounded-[2rem] p-6 sm:p-7">
                <div className="flex h-full flex-col gap-6">
                  <div>
                    <div className="flex items-center justify-between text-xs uppercase tracking-[0.28em] text-zinc-500 dark:text-zinc-400">
                      <span>{item.step}</span>
                      <span>{String(index + 1).padStart(2, "0")}</span>
                    </div>
                    <h3 className="mt-4 font-display text-2xl font-semibold text-zinc-900 dark:text-white">
                      {item.title}
                    </h3>
                    <p className="mt-3 max-w-xl text-sm leading-7 text-zinc-600 dark:text-zinc-300">
                      {item.body}
                    </p>
                  </div>
                  <div className="flex-1">
                    <WorkflowCardImage
                      title={item.title}
                      alt={item.title}
                      placeholderLabel={content.stepPlaceholderLabel}
                      placeholderBody={content.stepPlaceholderBody}
                    />
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {workflowSteps.map((item, index) => (
        <div
          key={`${item.step}-trigger`}
          className="h-[80vh]"
          data-step-trigger={index}
        />
      ))}
    </div>
  </section>
  );
};

export const Landing = () => {
  const { language, t } = useI18n();
  const [openFaq, setOpenFaq] = useState(0);
  const [activeWorkflowStep, setActiveWorkflowStep] = useState(0);
  const workflowSectionRef = useRef(null);
  const mouseLightRef = useRef(null);
  const localeConfig = resolveLocale(language);
  const content = getMarketingContent(localeConfig.key);

  useLandingSeo({ localeConfig, seo: content.seo });
  useRevealOnScroll();
  useWorkflowStepObserver(workflowSectionRef, setActiveWorkflowStep);
  usePointerLight(mouseLightRef);

  const siteUrl = typeof window !== "undefined" ? window.location.origin : "";
  const faqStructuredData = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    inLanguage: localeConfig.htmlLang,
    mainEntity: content.faqItems.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
  const organizationStructuredData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "MoAssist",
    url: siteUrl || undefined,
    logo: siteUrl ? `${siteUrl}/preview/logo.svg` : undefined,
    description: content.appDescription,
    availableLanguage: SITE_LOCALES.map((locale) => locale.htmlLang),
    contactPoint: [
      {
        "@type": "ContactPoint",
        email: "support@momicro.ai",
        contactType: "customer support",
      },
    ],
  };
  const websiteStructuredData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "MoAssist",
    url: siteUrl || undefined,
    inLanguage: SITE_LOCALES.map((locale) => locale.htmlLang),
    description: content.appDescription,
  };
  const webPageStructuredData = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: content.seo.title,
    url: siteUrl
      ? buildLocaleUrl(siteUrl, "/", localeConfig.key)
      : undefined,
    inLanguage: localeConfig.htmlLang,
    description: content.seo.description,
    isPartOf: siteUrl
      ? {
          "@type": "WebSite",
          name: "MoAssist",
          url: siteUrl,
        }
      : undefined,
  };

  return (
    <div className="relative min-h-screen pb-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(faqStructuredData),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(organizationStructuredData),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(websiteStructuredData),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(webPageStructuredData),
        }}
      />

      <div
        ref={mouseLightRef}
        aria-hidden="true"
        className="landing-mouse-light pointer-events-none fixed left-0 top-0 z-0 hidden md:block"
      />
      <div className="landing-orb pointer-events-none absolute -left-24 top-12 h-72 w-72 rounded-full bg-[radial-gradient(circle,_rgba(9,154,217,0.14),_transparent_66%)] blur-2xl" />
      <div className="landing-orb pointer-events-none absolute -right-24 top-52 h-80 w-80 rounded-full bg-[radial-gradient(circle,_rgba(92,215,211,0.14),_transparent_66%)] blur-2xl" />
      <div className="landing-orb pointer-events-none absolute left-1/2 top-[34rem] h-[20rem] w-[20rem] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,_rgba(27,177,212,0.09),_transparent_64%)] blur-2xl" />

      <PublicHeader />

      <main className="mx-auto mt-8 w-full max-w-7xl space-y-24 px-5 sm:px-8">
        <section className="grid items-center gap-10 xl:grid-cols-[0.92fr,1.08fr]">
          <div data-reveal className="landing-reveal space-y-8">
            <TonePill>{content.heroPill}</TonePill>

            <div className="space-y-5">
              <h1 className="font-display text-4xl font-semibold tracking-tight text-zinc-900 sm:text-5xl xl:text-[4rem] xl:leading-[1.02] dark:text-white">
                {content.heroTitle}
              </h1>
              <p className="max-w-2xl text-base leading-8 text-zinc-600 sm:text-lg dark:text-zinc-300">
                {content.heroBody}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <Button color="teal" href="/chatbots">
                {t("tryNow")}
              </Button>
              <Button outline href="/login">
                {t("signIn")}
              </Button>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              {content.heroHighlights.map((item, index) => (
                <a
                  key={item.title}
                  href={item.href}
                  data-reveal
                  style={{ transitionDelay: `${index * 60}ms` }}
                  className="landing-reveal landing-hover-lift brand-panel rounded-[1.45rem] p-4 text-center"
                >
                  <div className="text-sm font-semibold text-zinc-900 dark:text-white">
                    {item.title}
                  </div>
                </a>
              ))}
            </div>
          </div>

          <PlaceholderImage
            title={content.heroImageTitle}
            alt={content.heroImageAlt}
            placeholderLabel={content.imagePlaceholderLabel}
            placeholderBody={content.imagePlaceholderBody}
            aspectClass="aspect-[1.08/1]"
          />
        </section>

        <section className="grid gap-5 md:grid-cols-3">
          {content.coreBenefits.map((item, index) => (
            <article
              key={item.title}
              data-reveal
              style={{ transitionDelay: `${index * 70}ms` }}
              className="landing-reveal landing-hover-lift brand-stage rounded-[2rem] p-6"
            >
              <h2 className="font-display text-2xl font-semibold text-zinc-900 dark:text-white">
                {item.title}
              </h2>
              <p className="mt-3 text-sm leading-7 text-zinc-600 dark:text-zinc-300">
                {item.body}
              </p>
            </article>
          ))}
        </section>

        <section id="features" className="space-y-10">
          <div data-reveal className="landing-reveal">
            <SectionHeading
              eyebrow={content.featuresSection.eyebrow}
              title={content.featuresSection.title}
              body={content.featuresSection.body}
            />
          </div>

          <div className="space-y-8">
            {content.featureSections.map((section, index) => (
              <article
                key={section.title}
                id={section.id}
                data-reveal
                style={{ transitionDelay: `${index * 50}ms` }}
                className="landing-reveal scroll-mt-28 grid gap-6 rounded-[2.25rem] border border-white/75 bg-white/74 p-6 shadow-[0_20px_60px_-44px_rgba(13,34,51,0.38)] dark:border-[rgba(93,211,223,0.18)] dark:bg-[#091725]/82 dark:shadow-[0_20px_60px_-38px_rgba(0,0,0,0.72)] sm:p-7 xl:grid-cols-[0.94fr,1.06fr] xl:items-center"
              >
                {index % 2 === 0 ? (
                  <>
                    <div className="space-y-4">
                      <TonePill>{section.eyebrow}</TonePill>
                      <h3 className="font-display text-2xl font-semibold text-zinc-900 dark:text-white">
                        {section.title}
                      </h3>
                      <p className="text-sm leading-8 text-zinc-600 dark:text-zinc-300">
                        {section.body}
                      </p>
                      <ul className="grid gap-2 sm:grid-cols-2">
                        {section.points.map((point) => (
                          <li
                            key={point}
                            className="rounded-full border border-[#099ad9]/14 bg-white/86 px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.22em] text-[#173a55] dark:border-[#5dd3df]/12 dark:bg-[#10263a] dark:text-[#def1f2]"
                          >
                            {point}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <PlaceholderImage
                      title={section.imageTitle}
                      alt={section.imageAlt}
                      placeholderLabel={content.imagePlaceholderLabel}
                      placeholderBody={content.imagePlaceholderBody}
                    />
                  </>
                ) : (
                  <>
                    <PlaceholderImage
                      title={section.imageTitle}
                      alt={section.imageAlt}
                      placeholderLabel={content.imagePlaceholderLabel}
                      placeholderBody={content.imagePlaceholderBody}
                    />
                    <div className="space-y-4">
                      <TonePill>{section.eyebrow}</TonePill>
                      <h3 className="font-display text-2xl font-semibold text-zinc-900 dark:text-white">
                        {section.title}
                      </h3>
                      <p className="text-sm leading-8 text-zinc-600 dark:text-zinc-300">
                        {section.body}
                      </p>
                      <ul className="grid gap-2 sm:grid-cols-2">
                        {section.points.map((point) => (
                          <li
                            key={point}
                            className="rounded-full border border-[#099ad9]/14 bg-white/86 px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.22em] text-[#173a55] dark:border-[#5dd3df]/12 dark:bg-[#10263a] dark:text-[#def1f2]"
                          >
                            {point}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </>
                )}
              </article>
            ))}
          </div>
        </section>

        <section className="space-y-10">
          <div data-reveal className="landing-reveal">
            <SectionHeading
              eyebrow={content.reasonsSection.eyebrow}
              title={content.reasonsSection.title}
              body={content.reasonsSection.body}
            />
          </div>

          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {content.reasonCards.map((item, index) => (
              <article
                key={item.title}
                data-reveal
                style={{ transitionDelay: `${index * 45}ms` }}
                className="landing-reveal landing-hover-lift brand-stage rounded-[2rem] p-6"
              >
                <h3 className="font-display text-xl font-semibold text-zinc-900 dark:text-white">
                  {item.title}
                </h3>
                <p className="mt-3 text-sm leading-7 text-zinc-600 dark:text-zinc-300">
                  {item.body}
                </p>
              </article>
            ))}
          </div>
        </section>

        <HowItWorksSection
          activeStep={activeWorkflowStep}
          content={content}
          sectionRef={workflowSectionRef}
        />

        <section className="space-y-10">
          <div data-reveal className="landing-reveal">
            <SectionHeading
              eyebrow={content.useCasesSection.eyebrow}
              title={content.useCasesSection.title}
              body={content.useCasesSection.body}
            />
          </div>

          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {content.useCases.map((item, index) => (
              <article
                key={item.title}
                data-reveal
                style={{ transitionDelay: `${index * 55}ms` }}
                className="landing-reveal landing-hover-lift brand-stage rounded-[2rem] p-6"
              >
                <h3 className="font-display text-xl font-semibold text-zinc-900 dark:text-white">
                  {item.title}
                </h3>
                <p className="mt-3 text-sm leading-7 text-zinc-600 dark:text-zinc-300">
                  {item.body}
                </p>
              </article>
            ))}
          </div>
        </section>

        <section
          id="faq"
          data-reveal
          className="landing-reveal brand-stage rounded-[2.4rem] p-7 sm:p-10"
        >
          <SectionHeading
            eyebrow={content.faqSection.eyebrow}
            title={content.faqSection.title}
            body={content.faqSection.body}
          />

          <div className="mt-8 space-y-3">
            {content.faqItems.map((item, index) => {
              const isOpen = openFaq === index;
              return (
                <div
                  key={item.question}
                  className="overflow-hidden rounded-[1.5rem] border border-zinc-200/80 bg-white/82 dark:border-white/10 dark:bg-[#0b1d2d]/82"
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaq(isOpen ? -1 : index)}
                    className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
                  >
                    <span className="text-sm font-semibold text-zinc-900 dark:text-white">
                      {item.question}
                    </span>
                    <span className="grid h-8 w-8 place-items-center rounded-full border border-[#099ad9]/16 bg-[#eef8ff] text-lg text-[#173a55] dark:border-[#5dd3df]/12 dark:bg-[#10263a] dark:text-[#def1f2]">
                      {isOpen ? "−" : "+"}
                    </span>
                  </button>
                  {isOpen ? (
                    <div className="border-t border-zinc-200/80 px-5 py-4 text-sm leading-7 text-zinc-600 dark:border-white/10 dark:text-zinc-300">
                      {item.answer}
                    </div>
                  ) : null}
                </div>
              );
            })}
          </div>
        </section>

        <section
          data-reveal
          className="landing-reveal brand-stage rounded-[2.4rem] p-7 sm:p-10"
        >
          <div className="grid gap-8 lg:grid-cols-[1.02fr,0.98fr] lg:items-end">
            <div className="space-y-4">
              <TonePill>{content.ctaSection.eyebrow}</TonePill>
              <h2 className="font-display text-3xl font-semibold text-zinc-900 sm:text-4xl dark:text-white">
                {content.ctaSection.title}
              </h2>
              <p className="max-w-2xl text-base leading-8 text-zinc-600 dark:text-zinc-300">
                {content.ctaSection.body}
              </p>
            </div>
            <div className="flex flex-wrap gap-3 lg:justify-end">
              <Button color="teal" href="/chatbots">
                {t("tryNow")}
              </Button>
              <Button outline href="/login">
                {t("signIn")}
              </Button>
            </div>
          </div>
        </section>
      </main>

      <footer className="mx-auto mt-16 w-full max-w-7xl px-5 sm:px-8">
        <div
          data-reveal
          className="landing-reveal brand-stage rounded-[2.4rem] px-6 py-8 sm:px-8 sm:py-10"
        >
          <div className="grid gap-10 lg:grid-cols-[1.08fr,0.92fr]">
            <div className="space-y-5">
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
                    {content.footerTagline}
                  </div>
                </div>
              </div>
              <div className="space-y-2 text-sm text-zinc-600 dark:text-zinc-300">
                <p>support@momicro.ai</p>
                <p>legal@momicro.ai</p>
                <p>
                  © {new Date().getFullYear()} MoAssist.
                </p>
              </div>
            </div>

            <div className="grid gap-8 sm:grid-cols-3">
              {content.footerColumns.map((column) => (
                <div key={column.title} className="space-y-3">
                  <div className="text-xs font-semibold uppercase tracking-[0.3em] text-zinc-500 dark:text-zinc-400">
                    {column.title}
                  </div>
                  <div className="space-y-2 text-sm text-zinc-600 dark:text-zinc-300">
                    {column.links.map((link) => (
                      <a
                        key={link.label}
                        href={link.href}
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

      <div className="fixed inset-x-0 bottom-3 z-30 px-4 sm:hidden">
        <div className="brand-stage flex items-center gap-2 rounded-2xl p-2">
          <Button outline href="/login" className="flex-1">
            {t("signIn")}
          </Button>
          <Button color="teal" href="/chatbots" className="flex-1">
            {t("tryNow")}
          </Button>
        </div>
      </div>
    </div>
  );
};
