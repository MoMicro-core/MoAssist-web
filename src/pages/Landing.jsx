import { useEffect, useRef, useState } from "react";
import {
  ArrowTrendingUpIcon,
  BoltIcon,
  ChartBarIcon,
  CheckIcon,
  ChevronDownIcon,
  CurrencyDollarIcon,
  LanguageIcon,
  PaintBrushIcon,
  ShoppingBagIcon,
  ShoppingCartIcon,
  SparklesIcon,
  TruckIcon,
  UserGroupIcon,
  WrenchScrewdriverIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { StarIcon as StarSolidIcon } from "@heroicons/react/24/solid";
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

const FeaturePoints = ({ points }) => (
  <ul className="grid gap-2.5 sm:grid-cols-2">
    {points.map((point) => (
      <li key={point} className="flex items-start gap-2.5 text-sm text-zinc-700 dark:text-zinc-300">
        <CheckIcon className="mt-0.5 h-4 w-4 shrink-0 text-[#099ad9] dark:text-[#5dd3df]" />
        {point}
      </li>
    ))}
  </ul>
);

const Stars = () => (
  <div className="flex gap-0.5" aria-label="5 out of 5 stars">
    {Array.from({ length: 5 }).map((_, i) => (
      <StarSolidIcon key={i} className="h-3.5 w-3.5 text-amber-400" />
    ))}
  </div>
);

const REASON_ICONS = [
  CurrencyDollarIcon,
  ArrowTrendingUpIcon,
  PaintBrushIcon,
  LanguageIcon,
  WrenchScrewdriverIcon,
  ChartBarIcon,
];

const USE_CASE_ICONS = [ShoppingBagIcon, TruckIcon, SparklesIcon, UserGroupIcon];

const SectionHeading = ({ eyebrow, title, body }) => (
  <div className="space-y-4">
    <TonePill>{eyebrow}</TonePill>
    <div className="space-y-2.5">
      <h2 className="font-display text-3xl font-semibold tracking-tight text-zinc-900 sm:text-4xl dark:text-white">
        {title}
      </h2>
      <div className="section-heading-accent" aria-hidden="true" />
    </div>
    {body && (
      <p className="max-w-3xl text-base leading-8 text-zinc-600 dark:text-zinc-300">
        {body}
      </p>
    )}
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
    className={`landing-reveal landing-hover-lift landing-image-shell brand-stage p-3 sm:p-5 ${className}`}
  >
    <div
      className={`relative overflow-hidden rounded-[1.4rem] border border-white/75 bg-white/88 dark:border-white/10 dark:bg-[#0b1d2d]/88 sm:rounded-[1.75rem] ${aspectClass}`}
    >
      <img
        src={src}
        alt={alt}
        loading={priority ? "eager" : "lazy"}
        decoding={priority ? "sync" : "async"}
        fetchpriority={priority ? "high" : "auto"}
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

const HERO_FLOAT_POSITION_CLASSES = ["hero-float-a", "hero-float-b", "hero-float-c"];

const HeroPill = ({ children }) => (
  <span className="inline-flex items-center gap-2 rounded-full border border-[#099ad9]/16 bg-[#099ad9]/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.28em] text-[#10435f] dark:border-[#1bb1d4]/20 dark:bg-[#1bb1d4]/14 dark:text-[#def1f2]">
    <span className="hero-pill-dot" aria-hidden="true" />
    {children}
    <SparklesIcon className="h-3 w-3 text-[#099ad9] dark:text-[#5dd3df]" aria-hidden="true" />
  </span>
);

const HeroShowcase = ({ src, alt, content }) => {
  const stats = content.socialProof?.stats?.slice(0, 3) ?? [];
  return (
    <div className="hero-showcase">
      <div className="hero-mesh" aria-hidden="true">
        <span className="hero-mesh-blob hero-mesh-blob-a" />
        <span className="hero-mesh-blob hero-mesh-blob-b" />
        <span className="hero-mesh-blob hero-mesh-blob-c" />
      </div>
      <ShowcaseImage
        src={src}
        alt={alt}
        aspectClass="aspect-[3/2] sm:aspect-[1.08/1]"
        priority
      />
      {stats.map((stat, index) => (
        <div
          key={stat.value}
          className={`hero-float ${HERO_FLOAT_POSITION_CLASSES[index]}`}
          aria-hidden="true"
        >
          <span className="hero-float-dot" />
          <span className="hero-float-value">{stat.value}</span>
        </div>
      ))}
    </div>
  );
};

const BrandMarquee = ({ content }) => {
  const stats = content.socialProof?.stats ?? [];
  if (stats.length === 0) {
    return null;
  }

  const trackItems = [...stats, ...stats];

  return (
    <section
      data-reveal
      className="landing-reveal brand-marquee"
      aria-hidden="true"
    >
      <div className="brand-marquee-track">
        {trackItems.map((stat, index) => (
          <span
            key={`${stat.value}-${index}`}
            className="brand-marquee-item"
          >
            <span className="brand-marquee-value">{stat.value}</span>
            <span>{stat.label}</span>
            <span className="brand-marquee-divider" />
          </span>
        ))}
      </div>
    </section>
  );
};

const ProblemSection = ({ content }) => {
  const ps = content.problemSection;
  if (!ps) return null;
  return (
    <section
      id="problem"
      data-reveal
      className="landing-reveal scroll-mt-28 brand-stage rounded-[1.75rem] p-5 sm:rounded-[2.4rem] sm:p-10"
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
      <div className="mt-6 grid grid-cols-2 gap-3 sm:mt-8 sm:gap-5 xl:grid-cols-4">
        {ps.items.map((item) => (
          <div
            key={item.stat}
            className="rounded-[1.25rem] border border-red-200/60 bg-red-50/60 p-4 dark:border-red-900/30 dark:bg-red-950/20 sm:rounded-[1.75rem] sm:p-6"
          >
            <div className="font-display text-2xl font-semibold text-red-600 sm:text-4xl dark:text-red-400">
              {item.stat}
            </div>
            <p className="mt-1.5 text-xs leading-5 text-zinc-600 sm:mt-2 sm:text-sm sm:leading-6 dark:text-zinc-300">
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
    <section id="social-proof" className="space-y-8 sm:space-y-10">
      <div data-reveal className="landing-reveal">
        <SectionHeading eyebrow={sp.eyebrow} title={sp.title} body="" />
      </div>

      <div className="-mx-4 flex gap-4 overflow-x-auto px-4 pb-2 sm:mx-0 sm:grid sm:grid-cols-3 sm:gap-5 sm:overflow-visible sm:px-0 sm:pb-0 no-scrollbar">
        {sp.testimonials.map((item, index) => (
          <article
            key={item.name}
            data-reveal
            style={{ transitionDelay: `${index * 90}ms` }}
            className="landing-reveal landing-hover-lift brand-stage w-[82vw] shrink-0 rounded-[1.5rem] p-5 flex flex-col justify-between gap-5 sm:w-auto sm:rounded-[2rem] sm:p-6 sm:gap-6"
          >
            <div className="space-y-3">
              <Stars />
              <blockquote className="text-sm leading-7 text-zinc-600 dark:text-zinc-300">
                &ldquo;{item.quote}&rdquo;
              </blockquote>
            </div>
            <div className="flex items-center justify-between gap-4">
              <div>
                <div className="text-sm font-semibold text-zinc-900 dark:text-white">
                  {item.name}
                </div>
                <div className="text-xs text-zinc-500 dark:text-zinc-400">{item.role}</div>
              </div>
              <span className="shrink-0 rounded-full border border-[#099ad9]/16 bg-[#099ad9]/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-[#10435f] dark:border-[#1bb1d4]/20 dark:bg-[#1bb1d4]/14 dark:text-[#def1f2]">
                {item.result}
              </span>
            </div>
          </article>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-4 sm:gap-5 xl:grid-cols-4">
        {sp.stats.map((item, index) => (
          <div
            key={item.value}
            data-reveal
            style={{ transitionDelay: `${index * 55}ms` }}
            className="landing-reveal landing-hover-lift brand-panel rounded-[1.5rem] p-4 text-center sm:rounded-[1.75rem] sm:p-6"
          >
            <div className="font-display text-3xl font-semibold text-[#099ad9] sm:text-4xl dark:text-[#5dd3df]">
              {item.value}
            </div>
            <p className="mt-1.5 text-xs text-zinc-600 sm:mt-2 sm:text-sm dark:text-zinc-300">{item.label}</p>
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

      <div className="grid gap-3 sm:gap-5 md:grid-cols-2">
        <div className="rounded-[1.5rem] border border-red-200/60 bg-red-50/50 p-4 sm:rounded-[2rem] sm:p-6 dark:border-red-900/30 dark:bg-red-950/20">
          <div className="mb-4 flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-red-400" />
            <span className="text-xs font-semibold uppercase tracking-[0.22em] text-red-600 sm:text-sm dark:text-red-400">
              {cmp.withoutLabel}
            </span>
          </div>
          <ul className="space-y-2.5 sm:space-y-3">
            {cmp.withoutItems.map((item) => (
              <li key={item} className="flex items-start gap-2.5 text-xs text-zinc-600 sm:text-sm dark:text-zinc-300">
                <XMarkIcon className="mt-0.5 h-3.5 w-3.5 shrink-0 text-red-400 sm:h-4 sm:w-4" />
                {item}
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-[1.5rem] border border-[#099ad9]/20 bg-[#099ad9]/6 p-4 sm:rounded-[2rem] sm:p-6 dark:border-[#5dd3df]/20 dark:bg-[#1bb1d4]/8">
          <div className="mb-4 flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-[#099ad9] dark:bg-[#5dd3df]" />
            <span className="text-xs font-semibold uppercase tracking-[0.22em] text-[#10435f] sm:text-sm dark:text-[#def1f2]">
              {cmp.withLabel}
            </span>
          </div>
          <ul className="space-y-2.5 sm:space-y-3">
            {cmp.withItems.map((item) => (
              <li key={item} className="flex items-start gap-2.5 text-xs text-zinc-600 sm:text-sm dark:text-zinc-300">
                <CheckIcon className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#099ad9] sm:h-4 sm:w-4 dark:text-[#5dd3df]" />
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
    <section ref={sectionRef} id="how-it-works" className="relative">
      <div className="grid gap-6 lg:hidden">
        <div data-reveal className="landing-reveal space-y-5">
          <p className="text-xs uppercase tracking-[0.4em] text-zinc-500 dark:text-zinc-400">
            {content.workflowSection.processLabel}
          </p>
          <h2 className="font-display text-3xl font-semibold text-zinc-900 sm:text-4xl dark:text-white">
            {content.workflowSection.title}
          </h2>
          <p className="text-base leading-8 text-zinc-600 dark:text-zinc-300">
            {content.workflowSection.body}
          </p>
        </div>

        <div className="grid gap-5">
          {workflowSteps.map((item, index) => {
            const visual =
              LANDING_VISUALS.workflowSteps[
                index % LANDING_VISUALS.workflowSteps.length
              ];

            return (
              <article
                key={item.title}
                data-reveal
                className="landing-reveal brand-stage rounded-[1.5rem] p-4 sm:rounded-[2rem] sm:p-5"
              >
                <div className="flex items-center justify-between gap-3 text-xs uppercase tracking-[0.28em] text-zinc-500 dark:text-zinc-400">
                  <span>{item.step}</span>
                  <span>{String(index + 1).padStart(2, "0")}</span>
                </div>
                <h3 className="mt-4 font-display text-2xl font-semibold text-zinc-900 dark:text-white">
                  {item.title}
                </h3>
                <p className="mt-3 text-sm leading-7 text-zinc-600 dark:text-zinc-300">
                  {item.body}
                </p>
                <div className="mt-5">
                  <WorkflowCardImage
                    src={resolveLandingVisual(visual, theme)}
                    aspectClass={resolveLandingAspect(visual)}
                    alt={item.imageAlt || item.title}
                  />
                </div>
              </article>
            );
          })}
        </div>
      </div>

      <div className="relative hidden gap-12 lg:grid lg:grid-cols-[0.9fr_1.1fr]">
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
          <div className="space-y-1 text-sm">
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

  const heroImageSrc = resolveLandingVisual(LANDING_VISUALS.hero, theme);

  usePublicSeo({
    localeConfig,
    seo: content.seo,
    pathname: "/",
    preloadImages: [heroImageSrc],
  });
  useRevealOnScroll();
  useWorkflowStepObserver(workflowSectionRef, setActiveWorkflowStep);
  usePointerLight(mouseLightRef);

  const siteUrl = typeof window !== "undefined" ? window.location.origin : "";
  const homeUrl = siteUrl ? buildLocaleUrl(siteUrl, "/", localeConfig.key) : undefined;
  const heroImageUrl = siteUrl ? new URL(heroImageSrc, siteUrl).toString() : undefined;
  const featureScreenshotUrl = siteUrl
    ? new URL("/preview/ready-chatbot-feature-light.svg", siteUrl).toString()
    : undefined;
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
    applicationSubCategory: "Customer Support Software",
    operatingSystem: "Web",
    url: homeUrl,
    description: content.appDescription,
    inLanguage: SITE_LOCALES.map((locale) => locale.htmlLang),
    image: heroImageUrl,
    screenshot: [heroImageUrl, featureScreenshotUrl].filter(Boolean),
    featureList: content.featureSections?.map((section) => section.title),
    audience: {
      "@type": "BusinessAudience",
      audienceType: "Online stores, Shopify brands, ecommerce support teams",
    },
    brand: {
      "@type": "Brand",
      name: COMPANY_INFO.productName,
    },
    provider: {
      "@type": "Organization",
      name: COMPANY_INFO.organizationName,
      url: siteUrl || undefined,
    },
    review: content.socialProof?.testimonials?.map((testimonial) => ({
      "@type": "Review",
      reviewBody: testimonial.quote,
      author: {
        "@type": "Person",
        name: testimonial.name,
      },
      itemReviewed: {
        "@type": "SoftwareApplication",
        name: COMPANY_INFO.productName,
      },
    })),
  };
  const howToStructuredData = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: content.workflowSection.title,
    description: content.workflowSection.body,
    totalTime: "PT5M",
    inLanguage: localeConfig.htmlLang,
    image: heroImageUrl,
    step: content.workflowSteps.map((item, index) => ({
      "@type": "HowToStep",
      position: index + 1,
      name: item.title,
      text: item.body,
      url: homeUrl ? `${homeUrl}#how-it-works` : undefined,
    })),
  };
  const breadcrumbStructuredData = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: COMPANY_INFO.productName,
        item: homeUrl,
      },
    ],
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
    potentialAction: siteUrl
      ? {
          "@type": "SearchAction",
          target: `${siteUrl}/?q={search_term_string}`,
          "query-input": "required name=search_term_string",
        }
      : undefined,
  };
  const webPageStructuredData = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: content.seo.title,
    url: homeUrl,
    inLanguage: localeConfig.htmlLang,
    description: content.seo.description,
    primaryImageOfPage: heroImageUrl
      ? {
          "@type": "ImageObject",
          url: heroImageUrl,
          contentUrl: heroImageUrl,
        }
      : undefined,
    speakable: {
      "@type": "SpeakableSpecification",
      cssSelector: ["h1", "#hero-body", "#problem h2"],
    },
    mainEntity: {
      "@type": "SoftwareApplication",
      name: COMPANY_INFO.productName,
      applicationCategory: "BusinessApplication",
      operatingSystem: "Web",
    },
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
    <div className="relative min-h-screen pb-28 sm:pb-12">
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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(howToStructuredData),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbStructuredData),
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

      <main className="mx-auto mt-4 w-full max-w-7xl space-y-12 px-4 sm:mt-8 sm:space-y-24 sm:px-8">
        <section className="grid items-center gap-6 sm:gap-10 xl:grid-cols-[0.92fr,1.08fr]">
          <div data-reveal className="landing-reveal space-y-5 sm:space-y-8">
            <HeroPill>{content.heroPill}</HeroPill>

            <div className="space-y-3 sm:space-y-5">
              <h1 className="font-display text-[1.95rem] font-semibold leading-[1.09] tracking-tight text-zinc-900 sm:text-5xl lg:text-[3.75rem] lg:leading-[1.04] xl:text-[4.25rem] xl:leading-[1.02] dark:text-white">
                {content.heroTitle}
              </h1>
              <p
                id="hero-body"
                className="max-w-2xl text-[0.9375rem] leading-[1.75] text-zinc-600 sm:text-[1.0625rem] sm:leading-8 dark:text-zinc-300"
              >
                {content.heroBody}
              </p>
            </div>

            <div className="grid w-full grid-cols-2 gap-2.5 sm:flex sm:w-auto sm:flex-wrap sm:items-center sm:gap-3">
              <Button color="teal" href="/chatbots" className="cta-sheen w-full min-w-0 justify-center sm:w-auto">
                {t("tryNow")}
              </Button>
              <Button outline href="/login" className="w-full min-w-0 justify-center sm:w-auto">
                {t("signIn")}
              </Button>
            </div>

            <p className="text-xs leading-6 text-zinc-500 sm:text-sm sm:leading-7 dark:text-zinc-400">
              {t("brandRelationshipLabel")}
            </p>

            <div className="grid grid-cols-2 gap-2.5 sm:gap-3 xl:grid-cols-4">
              {content.heroHighlights.map((item, index) => {
                const parts = item.title.split(" ");
                const firstWord = parts[0];
                const rest = parts.slice(1).join(" ");
                const isMetric = /[\d%<>]/.test(firstWord);
                return (
                  <a
                    key={item.title}
                    href={item.href}
                    data-reveal
                    style={{ transitionDelay: `${120 + index * 70}ms` }}
                    className="landing-reveal landing-hover-lift brand-panel rounded-[1.25rem] p-3 text-center sm:rounded-[1.45rem] sm:p-4"
                  >
                    {isMetric ? (
                      <>
                        <div className="font-display text-base font-bold tracking-tight text-brand-gradient sm:text-lg">{firstWord}</div>
                        <div className="mt-0.5 text-[11px] font-medium leading-snug text-zinc-600 dark:text-zinc-300">{rest}</div>
                      </>
                    ) : (
                      <div className="text-[0.8125rem] font-semibold leading-snug text-zinc-900 dark:text-white sm:text-sm">
                        {item.title}
                      </div>
                    )}
                  </a>
                );
              })}
            </div>
          </div>

          <HeroShowcase
            src={heroImageSrc}
            alt={content.heroImageAlt}
            content={content}
          />
        </section>

        <BrandMarquee content={content} />

        <ProblemSection content={content} />

        <section className="grid gap-4 sm:gap-5 md:grid-cols-3">
          {content.coreBenefits.map((item, index) => (
            <article
              key={item.title}
              data-reveal
              style={{ transitionDelay: `${index * 70}ms` }}
              className="landing-reveal landing-hover-lift brand-stage rounded-[1.5rem] p-5 sm:rounded-[2rem] sm:p-6"
            >
              <div className="flex items-center gap-3">
                <span className="benefit-number" aria-hidden="true">
                  {String(index + 1).padStart(2, "0")}
                </span>
              </div>
              <h2 className="mt-4 font-display text-xl font-semibold text-zinc-900 sm:mt-5 sm:text-2xl dark:text-white">
                {item.title}
              </h2>
              <p className="mt-2.5 text-sm leading-7 text-zinc-600 sm:mt-3 dark:text-zinc-300">
                {item.body}
              </p>
            </article>
          ))}
        </section>

        <section id="features" className="space-y-8 sm:space-y-10">
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
                  className="landing-reveal scroll-mt-28 grid gap-4 rounded-[1.25rem] border border-white/75 bg-white/74 p-3 shadow-[0_20px_60px_-44px_rgba(13,34,51,0.38)] dark:border-[rgba(93,211,223,0.18)] dark:bg-[#091725]/82 dark:shadow-[0_20px_60px_-38px_rgba(0,0,0,0.72)] sm:gap-6 sm:rounded-[2.25rem] sm:p-7 xl:grid-cols-[0.94fr,1.06fr] xl:items-center"
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
                        <FeaturePoints points={section.points} />
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
                        className="order-last xl:order-none"
                      />
                      <div className="order-first space-y-4 xl:order-none">
                        <TonePill>{section.eyebrow}</TonePill>
                        <h3 className="font-display text-2xl font-semibold text-zinc-900 dark:text-white">
                          {section.title}
                        </h3>
                        <p className="text-sm leading-8 text-zinc-600 dark:text-zinc-300">
                          {section.body}
                        </p>
                        <FeaturePoints points={section.points} />
                      </div>
                    </>
                  )}
                </article>
              );
            })}
          </div>
        </section>

        <section className="space-y-8 sm:space-y-10">
          <div data-reveal className="landing-reveal">
            <SectionHeading
              eyebrow={content.reasonsSection.eyebrow}
              title={content.reasonsSection.title}
              body={content.reasonsSection.body}
            />
          </div>

          <div className="grid grid-cols-2 gap-3 sm:gap-5 xl:grid-cols-3">
            {content.reasonCards.map((item, index) => {
              const ReasonIcon = REASON_ICONS[index % REASON_ICONS.length];
              return (
                <article
                  key={item.title}
                  data-reveal
                  style={{ transitionDelay: `${index * 55}ms` }}
                  className="landing-reveal landing-hover-lift brand-stage rounded-[1.5rem] p-4 sm:rounded-[2rem] sm:p-6"
                >
                  <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-xl bg-[#099ad9]/10 sm:mb-4 sm:h-10 sm:w-10 dark:bg-[#1bb1d4]/14">
                    <ReasonIcon className="h-4 w-4 text-[#099ad9] sm:h-5 sm:w-5 dark:text-[#5dd3df]" aria-hidden="true" />
                  </div>
                  <h3 className="font-display text-[0.9rem] font-semibold leading-snug tracking-tight text-zinc-900 sm:text-[1.05rem] dark:text-white">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-xs leading-6 text-zinc-600 sm:mt-3 sm:text-sm sm:leading-7 dark:text-zinc-300">
                    {item.body}
                  </p>
                </article>
              );
            })}
          </div>
        </section>

        <SocialProofSection content={content} />

        <HowItWorksSection
          activeStep={activeWorkflowStep}
          content={content}
          sectionRef={workflowSectionRef}
          theme={theme}
        />

        <section className="space-y-8 sm:space-y-10">
          <div data-reveal className="landing-reveal">
            <SectionHeading
              eyebrow={content.useCasesSection.eyebrow}
              title={content.useCasesSection.title}
              body={content.useCasesSection.body}
            />
          </div>

          <div className="grid grid-cols-2 gap-3 sm:gap-5 xl:grid-cols-4">
            {content.useCases.map((item, index) => {
              const UseCaseIcon = USE_CASE_ICONS[index % USE_CASE_ICONS.length];
              return (
                <article
                  key={item.title}
                  data-reveal
                  style={{ transitionDelay: `${index * 65}ms` }}
                  className="landing-reveal landing-hover-lift brand-stage rounded-[1.5rem] p-4 sm:rounded-[2rem] sm:p-6"
                >
                  <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-xl bg-[#099ad9]/10 sm:mb-4 sm:h-10 sm:w-10 dark:bg-[#1bb1d4]/14">
                    <UseCaseIcon className="h-4 w-4 text-[#099ad9] sm:h-5 sm:w-5 dark:text-[#5dd3df]" aria-hidden="true" />
                  </div>
                  <h3 className="font-display text-[0.9rem] font-semibold leading-snug tracking-tight text-zinc-900 sm:text-[1.05rem] dark:text-white">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-xs leading-6 text-zinc-600 sm:mt-3 sm:text-sm sm:leading-7 dark:text-zinc-300">
                    {item.body}
                  </p>
                </article>
              );
            })}
          </div>
        </section>

        <ComparisonSection content={content} />

        <section
          id="faq"
          data-reveal
          className="landing-reveal brand-stage rounded-[1.75rem] p-5 sm:rounded-[2.4rem] sm:p-10"
        >
          <SectionHeading
            eyebrow={content.faqSection.eyebrow}
            title={content.faqSection.title}
            body={content.faqSection.body}
          />

          <div className="mt-8 space-y-3" itemScope itemType="https://schema.org/FAQPage">
            {content.faqItems.map((item, index) => {
              const isOpen = openFaq === index;
              const panelId = `faq-panel-${index}`;
              const buttonId = `faq-button-${index}`;
              return (
                <div
                  key={item.question}
                  itemProp="mainEntity"
                  itemScope
                  itemType="https://schema.org/Question"
                  className={`overflow-hidden rounded-[1.5rem] border transition-colors duration-300 ${isOpen ? "border-[#099ad9]/24 bg-white/94 dark:border-[#5dd3df]/18 dark:bg-[#0b1d2d]/92" : "border-zinc-200/80 bg-white/82 dark:border-white/10 dark:bg-[#0b1d2d]/82"}`}
                >
                  <button
                    id={buttonId}
                    type="button"
                    onClick={() => setOpenFaq(isOpen ? -1 : index)}
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                    className="flex w-full items-center justify-between gap-4 px-4 py-4 text-left transition-colors duration-200 hover:bg-black/[0.018] dark:hover:bg-white/[0.018] sm:px-5"
                  >
                    <span
                      itemProp="name"
                      className={`text-sm font-semibold transition-colors duration-200 ${isOpen ? "text-[#099ad9] dark:text-[#5dd3df]" : "text-zinc-900 dark:text-white"}`}
                    >
                      {item.question}
                    </span>
                    <span aria-hidden="true" className={`faq-chevron${isOpen ? " is-open" : ""}`}>
                      <ChevronDownIcon className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                    </span>
                  </button>
                  <div
                    id={panelId}
                    role="region"
                    aria-labelledby={buttonId}
                    aria-hidden={!isOpen}
                    itemProp="acceptedAnswer"
                    itemScope
                    itemType="https://schema.org/Answer"
                    className={`faq-content${isOpen ? " is-open" : ""}`}
                  >
                    <div className="faq-content-inner border-t border-zinc-200/80 px-5 py-4 text-sm leading-7 text-zinc-600 dark:border-white/10 dark:text-zinc-300">
                      <span itemProp="text">{item.answer}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        <section
          data-reveal
          className="landing-reveal brand-stage cta-burst rounded-[1.75rem] p-5 sm:rounded-[2.4rem] sm:p-10"
        >
          <div className="grid gap-6 lg:grid-cols-[1.02fr,0.98fr] lg:items-end">
            <div className="space-y-4">
              <TonePill>{content.ctaSection.eyebrow}</TonePill>
              <h2 className="font-display text-2xl font-semibold leading-tight text-zinc-900 sm:text-4xl dark:text-white">
                {content.ctaSection.title}
              </h2>
              <p className="max-w-2xl text-base leading-7 text-zinc-600 sm:leading-8 dark:text-zinc-300">
                {content.ctaSection.body}
              </p>
            </div>
            <div className="space-y-3 lg:flex lg:flex-col lg:items-end">
              <div className="grid w-full grid-cols-2 gap-3 sm:flex sm:w-auto sm:flex-wrap lg:justify-end">
                <Button color="teal" href="/chatbots" className="cta-sheen w-full min-w-0 justify-center sm:w-auto">
                  {t("tryNow")}
                </Button>
                <Button outline href="/login" className="w-full min-w-0 justify-center sm:w-auto">
                  {t("signIn")}
                </Button>
              </div>
              <p className="flex items-center justify-center gap-1.5 text-xs text-zinc-500 dark:text-zinc-400 lg:justify-end">
                <CheckIcon className="h-3.5 w-3.5 text-[#099ad9] dark:text-[#5dd3df]" aria-hidden="true" />
                No credit card required · Free to get started
              </p>
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

      <div className="fixed inset-x-0 bottom-0 z-30 max-w-full px-3 pb-3 mb-safe sm:hidden">
        <div className="brand-stage grid grid-cols-2 items-center gap-2.5 rounded-[1.25rem] p-2.5 shadow-[0_-2px_0_0_rgba(255,255,255,0.6),0_22px_56px_-18px_rgba(13,34,51,0.52)] backdrop-blur-2xl dark:shadow-[0_-1px_0_0_rgba(93,211,223,0.12),0_22px_56px_-18px_rgba(0,0,0,0.8)]">
          <Button outline href="/login" className="w-full min-w-0 justify-center">
            {t("signIn")}
          </Button>
          <Button color="teal" href="/chatbots" className="cta-sheen w-full min-w-0 justify-center">
            {t("tryNow")}
          </Button>
        </div>
      </div>
    </div>
  );
};
