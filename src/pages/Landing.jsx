import { useEffect, useRef, useState } from "react";
import { PublicFooter } from "../components/PublicFooter";
import { PublicHeader } from "../components/PublicHeader";
import { useI18n } from "../context/I18nContext";
import { useTheme } from "../context/ThemeContext";
import { getMarketingContent } from "../content/marketingContent";
import {
  COMPANY_INFO,

  buildOrganizationStructuredData,
} from "../lib/companyInfo";
import { usePublicSeo } from "../lib/publicSeo";
import {
  SITE_LOCALES,
  buildLocaleUrl,
  resolveLocale,
} from "../lib/siteLocales";
import { Button } from "../ui/button";

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

const LANDING_VISUALS = {
  hero: {
    light: "/preview/ready-chatbot-hero-light.svg",
    dark: "/preview/ready-chatbot-hero-dark.svg",
  },
  featureSections: [
    {
      light: "/preview/ready-chatbot-feature-light.svg",
      dark: "/preview/ready-chatbot-feature-dark.svg",
    },
    {
      light: "/preview/knowledge-files-focused-light.svg",
      dark: "/preview/knowledge-files-focused-dark.svg",
      aspectClass: "aspect-[2/1]",
    },
    {
      light: "/preview/lead-capture-focused-light.svg",
      dark: "/preview/lead-capture-focused-dark.svg",
    },
    {
      light: "/preview/auth-support-focused-light.svg",
      dark: "/preview/auth-support-focused-dark.svg",
    },
    {
      light: "/preview/ai-handoff-focused-light.svg",
      dark: "/preview/ai-handoff-focused-dark.svg",
    },
    {
      light: "/preview/install-scripts-focused-light.svg",
      dark: "/preview/install-scripts-focused-dark.svg",
    },
  ],
  workflowSteps: [
    {
      light: "/preview/chatbots-overview-focused-light.svg",
      dark: "/preview/chatbots-overview-focused-dark.svg",
    },
    {
      light: "/preview/knowledge-files-focused-light.svg",
      dark: "/preview/knowledge-files-focused-dark.svg",
      aspectClass: "aspect-[2/1]",
    },
    {
      light: "/preview/ui-customization-focused-light.svg",
      dark: "/preview/ui-customization-focused-dark.svg",
    },
    {
      light: "/preview/ai-handoff-focused-light.svg",
      dark: "/preview/ai-handoff-focused-dark.svg",
    },
  ],
};

const resolveLandingVisual = (visual, theme) =>
  theme === "dark" ? visual.dark || visual.light : visual.light;

const resolveLandingAspect = (visual, fallback = "aspect-[4/3]") =>
  visual.aspectClass || fallback;

const ShowcaseImage = ({
  src,
  alt,
  className = "",
  aspectClass = "aspect-[4/3]",
  priority = false,
}) => (
  <div
    data-reveal
    className={`landing-reveal landing-hover-lift landing-image-shell brand-stage p-4 sm:p-5 ${className}`}
  >
    <div
      className={`relative overflow-hidden rounded-[1.75rem] border border-white/75 bg-white/88 dark:border-white/10 dark:bg-[#0b1d2d]/88 ${aspectClass}`}
    >
      <img
        src={src}
        alt={alt}
        loading={priority ? "eager" : "lazy"}
        className="h-full w-full object-cover object-center"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.1),transparent_28%,transparent_74%,rgba(7,25,37,0.12))]"
      />
    </div>
  </div>
);

const WorkflowCardImage = ({ src, alt, aspectClass = "aspect-[4/3]" }) => (
  <div className="relative overflow-hidden rounded-[1.65rem] border border-white/75 bg-white/88 dark:border-white/10 dark:bg-[#0b1d2d]/88">
    <div className={aspectClass}>
      <img
        src={src}
        alt={alt}
        loading="lazy"
        className="h-full w-full object-cover object-center"
      />
    </div>
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.08),transparent_26%,transparent_74%,rgba(7,25,37,0.14))]"
    />
  </div>
);

const ProblemSection = ({ content }) => {
  const ps = content.problemSection;
  if (!ps) return null;
  return (
    <section
      id="problem"
      data-reveal
      className="landing-reveal scroll-mt-28 brand-stage rounded-[2.4rem] p-7 sm:p-10"
    >
      <div className="space-y-4">
        <TonePill>{ps.eyebrow}</TonePill>
        <h2 className="font-display text-3xl font-semibold text-zinc-900 sm:text-4xl dark:text-white">
          {ps.title}
        </h2>
        <p className="max-w-3xl text-base leading-8 text-zinc-600 dark:text-zinc-300">
          {ps.body}
        </p>
      </div>
      <div className="mt-8 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {ps.items.map((item) => (
          <div
            key={item.stat}
            className="rounded-[1.75rem] border border-red-200/60 bg-red-50/60 p-6 dark:border-red-900/30 dark:bg-red-950/20"
          >
            <div className="font-display text-4xl font-semibold text-red-600 dark:text-red-400">
              {item.stat}
            </div>
            <p className="mt-2 text-sm leading-6 text-zinc-600 dark:text-zinc-300">
              {item.label}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};

const SocialProofSection = ({ content }) => {
  const sp = content.socialProof;
  if (!sp) return null;
  return (
    <section id="social-proof" className="space-y-10">
      <div data-reveal className="landing-reveal">
        <SectionHeading eyebrow={sp.eyebrow} title={sp.title} body="" />
      </div>

      <div className="grid gap-5 md:grid-cols-3">
        {sp.testimonials.map((item, index) => (
          <article
            key={item.name}
            data-reveal
            style={{ transitionDelay: `${index * 70}ms` }}
            className="landing-reveal landing-hover-lift brand-stage rounded-[2rem] p-6 flex flex-col justify-between gap-6"
          >
            <blockquote className="text-sm leading-7 text-zinc-600 dark:text-zinc-300">
              &ldquo;{item.quote}&rdquo;
            </blockquote>
            <div className="flex items-center justify-between gap-4">
              <div>
                <div className="text-sm font-semibold text-zinc-900 dark:text-white">
                  {item.name}
                </div>
                <div className="text-xs text-zinc-500 dark:text-zinc-400">{item.role}</div>
              </div>
              <span className="rounded-full border border-[#099ad9]/16 bg-[#099ad9]/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-[#10435f] dark:border-[#1bb1d4]/20 dark:bg-[#1bb1d4]/14 dark:text-[#def1f2]">
                {item.result}
              </span>
            </div>
          </article>
        ))}
      </div>

      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {sp.stats.map((item, index) => (
          <div
            key={item.value}
            data-reveal
            style={{ transitionDelay: `${index * 55}ms` }}
            className="landing-reveal landing-hover-lift brand-panel rounded-[1.75rem] p-6 text-center"
          >
            <div className="font-display text-4xl font-semibold text-[#099ad9] dark:text-[#5dd3df]">
              {item.value}
            </div>
            <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-300">{item.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

const ComparisonSection = ({ content }) => {
  const cmp = content.comparison;
  if (!cmp) return null;
  return (
    <section
      id="comparison"
      data-reveal
      className="landing-reveal scroll-mt-28 space-y-8"
    >
      <SectionHeading eyebrow={cmp.eyebrow} title={cmp.title} body="" />

      <div className="grid gap-5 md:grid-cols-2">
        <div className="rounded-[2rem] border border-red-200/60 bg-red-50/50 p-6 dark:border-red-900/30 dark:bg-red-950/20">
          <div className="mb-5 flex items-center gap-2">
            <span className="h-3 w-3 rounded-full bg-red-400" />
            <span className="text-sm font-semibold uppercase tracking-[0.22em] text-red-600 dark:text-red-400">
              {cmp.withoutLabel}
            </span>
          </div>
          <ul className="space-y-3">
            {cmp.withoutItems.map((item) => (
              <li key={item} className="flex items-start gap-3 text-sm text-zinc-600 dark:text-zinc-300">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-red-400" />
                {item}
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-[2rem] border border-[#099ad9]/20 bg-[#099ad9]/6 p-6 dark:border-[#5dd3df]/20 dark:bg-[#1bb1d4]/8">
          <div className="mb-5 flex items-center gap-2">
            <span className="h-3 w-3 rounded-full bg-[#099ad9] dark:bg-[#5dd3df]" />
            <span className="text-sm font-semibold uppercase tracking-[0.22em] text-[#10435f] dark:text-[#def1f2]">
              {cmp.withLabel}
            </span>
          </div>
          <ul className="space-y-3">
            {cmp.withItems.map((item) => (
              <li key={item} className="flex items-start gap-3 text-sm text-zinc-600 dark:text-zinc-300">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#099ad9] dark:bg-[#5dd3df]" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
};

const HowItWorksSection = ({ activeStep, content, sectionRef, theme }) => {
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
          const visual =
            LANDING_VISUALS.workflowSteps[
              index % LANDING_VISUALS.workflowSteps.length
            ];
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
                      src={resolveLandingVisual(visual, theme)}
                      aspectClass={resolveLandingAspect(visual)}
                      alt={item.imageAlt || item.title}
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
  const { theme } = useTheme();
  const [openFaq, setOpenFaq] = useState(0);
  const [activeWorkflowStep, setActiveWorkflowStep] = useState(0);
  const workflowSectionRef = useRef(null);
  const mouseLightRef = useRef(null);
  const localeConfig = resolveLocale(language);
  const content = getMarketingContent(localeConfig.key);

  usePublicSeo({ localeConfig, seo: content.seo, pathname: "/" });
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
  const organizationStructuredData = buildOrganizationStructuredData({
    siteUrl,
    description: "MoMicro is the organization behind the MoAssist product.",
    availableLanguages: SITE_LOCALES.map((locale) => locale.htmlLang),
  });
  const productStructuredData = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: COMPANY_INFO.productName,
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web",
    description: content.appDescription,
    brand: {
      "@type": "Brand",
      name: COMPANY_INFO.productName,
    },
    provider: {
      "@type": "Organization",
      name: COMPANY_INFO.organizationName,
      url: siteUrl || undefined,
    },
  };
  const websiteStructuredData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: COMPANY_INFO.productName,
    url: siteUrl || undefined,
    inLanguage: SITE_LOCALES.map((locale) => locale.htmlLang),
    description: content.appDescription,
    publisher: {
      "@type": "Organization",
      name: COMPANY_INFO.organizationName,
      email: COMPANY_INFO.infoEmail,
    },
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
    about: {
      "@type": "SoftwareApplication",
      name: COMPANY_INFO.productName,
    },
    isPartOf: siteUrl
      ? {
          "@type": "WebSite",
          name: COMPANY_INFO.productName,
          url: siteUrl,
        }
      : undefined,
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
          __html: JSON.stringify(productStructuredData),
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

            <p className="max-w-2xl text-sm leading-7 text-zinc-500 dark:text-zinc-400">
              {t("brandRelationshipLabel")}
            </p>

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

          <ShowcaseImage
            src={resolveLandingVisual(LANDING_VISUALS.hero, theme)}
            alt={content.heroImageAlt}
            aspectClass="aspect-[1.08/1]"
            priority
          />
        </section>

        <ProblemSection content={content} />

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
            {content.featureSections.map((section, index) => {
              const visual =
                LANDING_VISUALS.featureSections[
                  index % LANDING_VISUALS.featureSections.length
                ];

              return (
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
                      <ShowcaseImage
                        src={resolveLandingVisual(visual, theme)}
                        alt={section.imageAlt}
                        aspectClass={resolveLandingAspect(visual)}
                      />
                    </>
                  ) : (
                    <>
                      <ShowcaseImage
                        src={resolveLandingVisual(visual, theme)}
                        alt={section.imageAlt}
                        aspectClass={resolveLandingAspect(visual)}
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
              );
            })}
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

        <SocialProofSection content={content} />

        <HowItWorksSection
          activeStep={activeWorkflowStep}
          content={content}
          sectionRef={workflowSectionRef}
          theme={theme}
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

        <ComparisonSection content={content} />

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

      <PublicFooter
        tagline={content.footerTagline}
        companyNote={COMPANY_INFO.companyNote}
        columns={[
          {
            ...content.footerColumns[0],
            links: [
              ...content.footerColumns[0].links.slice(0, 1),
              { label: t("pricingNav"), href: "/pricing" },
              { label: t("contactsNav"), href: "/contacts" },
              content.footerColumns[0].links[1],
            ],
          },
          {
            ...content.footerColumns[1],
            links: [
              ...content.footerColumns[1].links,
              { label: "MoMicro", href: "/momicro" },
            ],
          },
          content.footerColumns[2],
        ]}
      />

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
