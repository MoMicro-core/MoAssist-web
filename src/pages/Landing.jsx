import { useEffect, useRef, useState } from "react";
import { PublicHeader } from "../components/PublicHeader";
import { Button } from "../ui/button";

const heroHighlights = [
  {
    title: "Individual chatbots",
    href: "#feature-individual-chatbots",
  },
  {
    title: "Knowledge uploads",
    href: "#feature-knowledge-ai",
  },
  {
    title: "Lead capture",
    href: "#feature-lead-capture",
  },
  {
    title: "Support workflow",
    href: "#feature-support-workflow",
  },
];

const coreBenefits = [
  {
    title: "Create a different chatbot for each shop, brand, or sales flow",
    body: "Set the name, welcome text, prompts, logo, colors, launcher, placement, and publish settings for each chatbot.",
  },
  {
    title: "Upload your business knowledge and let AI answer from it",
    body: "Add documents and guides, choose the reply style, and set clear instructions so the chatbot answers in the right tone.",
  },
  {
    title: "Use chat for sales, support, and customer service",
    body: "Collect lead data, support signed-in users, and let your team answer from one dashboard with clear message and conversation status.",
  },
];

const featureSections = [
  {
    id: "feature-individual-chatbots",
    eyebrow: "Individual chatbot builder",
    title:
      "Create a separate chatbot for each shop, product, brand, or customer journey.",
    body: "Each chatbot can have its own name, first message, suggested questions, logo, icon, colors, theme, placement, languages, and allowed domains.",
    points: [
      "Separate chatbot for each project",
      "Draft and publish workflow",
      "Logo, bubble icon, and launcher control",
      "Themes, translations, and domain rules",
    ],
    imageTitle: "MoAssist custom chatbot builder",
    imageAlt: "MoAssist individual chatbot setup placeholder image",
  },
  {
    id: "feature-knowledge-ai",
    eyebrow: "Knowledge and AI answers",
    title:
      "Upload documents so the AI can answer with real business context.",
    body: "Add documents and files, turn AI replies on, choose answer length, and set reply guidelines so the chatbot answers from your material instead of guessing.",
    points: [
      "Document and file uploads",
      "AI role and response guidelines",
      "Short, medium, or long answer style",
      "Faster first replies for customers",
    ],
    imageTitle: "MoAssist knowledge upload and AI settings",
    imageAlt: "MoAssist knowledge upload placeholder image",
  },
  {
    id: "feature-lead-capture",
    eyebrow: "Lead capture and customer data",
    title:
      "Collect names, emails, and other customer details right inside chat.",
    body: "Build your own lead form, choose the fields you need, decide what is required, and use chat for sales qualification, support intake, and contact requests.",
    points: [
      "Custom lead capture forms",
      "Required and optional fields",
      "Sales qualification and support intake",
      "Customer details stored with the conversation",
    ],
    imageTitle: "MoAssist lead capture and customer data flow",
    imageAlt: "MoAssist lead capture placeholder image",
  },
  {
    id: "feature-logged-in-users",
    eyebrow: "Logged-in users and admin workflows",
    title:
      "Connect the chatbot to your signed-in users and your internal workflow.",
    body: "The chatbot can stay linked to the right customer when that person is already signed in. This helps you build a real help service for existing users and fit chat into your own admin flow.",
    points: [
      "Recognize logged-in users",
      "Customer help service inside your product",
      "Works with your admin and support workflow",
      "Better context than anonymous chat",
    ],
    imageTitle: "MoAssist connected customer support workflow",
    imageAlt: "MoAssist logged-in user support placeholder image",
  },
  {
    id: "feature-support-workflow",
    eyebrow: "AI and team inbox",
    title:
      "Let AI reply first and let your team step in when needed.",
    body: "AI and human replies stay in one inbox. You can see who wrote each message, whether it was read, and whether the conversation is active, waiting, or closed.",
    points: [
      "AI and human replies in one thread",
      "Read and unread message status",
      "Active, waiting, and closed conversations",
      "Automatic inactivity handling",
    ],
    imageTitle: "MoAssist inbox and conversation lifecycle",
    imageAlt: "MoAssist shared inbox placeholder image",
  },
  {
    id: "feature-install-launch",
    eyebrow: "Install and launch",
    title:
      "Launch the chatbot on your site, shop, or customer area.",
    body: "Install with a script or iframe and control which domains are allowed to load the chatbot.",
    points: [
      "Script and iframe installation",
      "Allowed domain controls",
      "Fast rollout to public and private areas",
      "Ready for branded help services",
    ],
    imageTitle: "MoAssist installation and rollout",
    imageAlt: "MoAssist installation placeholder image",
  },
];

const reasonCards = [
  {
    title: "One platform instead of many disconnected tools",
    body: "Create, train, launch, and manage chatbots from one place.",
  },
  {
    title: "Built for real selling businesses",
    body: "MoAssist is made for teams that need better sales and support conversations, not just a generic chat box.",
  },
  {
    title: "Each chatbot can fit the business",
    body: "Every project can have its own style, content, behavior, and setup.",
  },
  {
    title: "AI replies faster without taking control away",
    body: "The chatbot can answer common questions while your team still controls tone, lead capture, and takeover.",
  },
  {
    title: "Better support for existing customers",
    body: "MoAssist can work as a real help service for signed-in users, not only for anonymous visitors.",
  },
  {
    title: "Useful across the full customer journey",
    body: "Use the same system for sales questions, lead capture, support, and ongoing customer help.",
  },
];

const workflowSteps = [
  {
    step: "Step 01",
    label: "Create",
    title: "Create a chatbot for the exact business flow you need",
    body: "Set the name, purpose, first message, suggested questions, and basic setup.",
  },
  {
    step: "Step 02",
    label: "Train",
    title: "Upload knowledge and define how the AI should reply",
    body: "Add documents, choose answer style, and write reply instructions.",
  },
  {
    step: "Step 03",
    label: "Design",
    title: "Customize the design and choose what data to collect",
    body: "Adjust the chatbot UI, form fields, and copy so the experience feels branded and useful.",
  },
  {
    step: "Step 04",
    label: "Launch",
    title: "Launch it and handle real customer conversations",
    body: "Install it on your site, connect signed-in users, and let AI plus your team answer from one place.",
  },
];

const useCases = [
  {
    title: "Customer support and help center",
    body: "Answer common questions, use uploaded knowledge, and let human agents take over when needed.",
  },
  {
    title: "Sales and lead qualification",
    body: "Answer buying questions, collect contact details, and pass serious leads to the team with context.",
  },
  {
    title: "Customer portals and member areas",
    body: "Support signed-in customers inside your product, portal, or account area.",
  },
  {
    title: "Internal admin and service workflows",
    body: "Use the dashboard as the control center for AI and human conversations.",
  },
];

const faqItems = [
  {
    question: "What is MoAssist?",
    answer:
      "MoAssist is a platform for creating custom chatbots for websites, customer areas, sales flows, and support teams.",
  },
  {
    question: "Can I create more than one chatbot?",
    answer:
      "Yes. You can create separate chatbots for different brands, shops, products, languages, or use cases.",
  },
  {
    question: "Can I upload documents so the AI knows my business?",
    answer:
      "Yes. You can upload documents and files so the chatbot answers from your business material.",
  },
  {
    question: "Can I customize the chatbot on my website?",
    answer:
      "Yes. You can customize the chatbot design, colors, icons, launcher, text, theme, and placement.",
  },
  {
    question: "Can I collect customer data with the chatbot?",
    answer:
      "Yes. You can collect names, emails, and other custom fields with lead forms inside the chat.",
  },
  {
    question: "Can I connect the chatbot to logged-in users and my own admin flow?",
    answer:
      "Yes. You can connect the chatbot to signed-in users and fit it into your own customer support workflow.",
  },
  {
    question: "Can AI and human agents both reply in the same conversation?",
    answer:
      "Yes. AI and human replies stay in one thread, and the inbox shows who wrote each message and whether it was read.",
  },
  {
    question: "What happens when a customer goes inactive?",
    answer:
      "The conversation can change automatically based on your inactivity settings so the inbox stays organized.",
  },
  {
    question: "Why should customers choose MoAssist?",
    answer:
      "Customers choose MoAssist because it combines chatbot setup, business knowledge, UI customization, lead capture, signed-in user support, and AI plus human replies in one product.",
  },
];

const footerColumns = [
  {
    title: "Product",
    links: [
      { label: "Dashboard", href: "/chatbots" },
      { label: "Login", href: "/login" },
      { label: "Support", href: "mailto:support@momicro.ai" },
    ],
  },
  {
    title: "Explore",
    links: [
      { label: "Features", href: "#features" },
      { label: "How it works", href: "#how-it-works" },
      { label: "FAQ", href: "#faq" },
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

const handlePlaceholderError = (event) => {
  event.currentTarget.style.opacity = "0";
};

const useLandingSeo = () => {
  useEffect(() => {
    document.title =
      "MoAssist | Custom AI Chatbots for Websites, Customer Portals, and Support Teams";

    upsertMeta(
      "name",
      "description",
      "AI chatbots for online shops and businesses that sell products or services. Upload documents, customize the chatbot, collect leads, support signed-in users, and manage AI and team replies from one dashboard.",
    );
    upsertMeta(
      "name",
      "keywords",
      "ecommerce chatbot, online shop chatbot, sales chatbot, custom AI chatbot, website chatbot platform, customer support chatbot, lead capture chatbot, chatbot document upload, chatbot UI customization, customer portal chatbot, help service chatbot, AI and human inbox",
    );
    upsertMeta("name", "application-name", "MoAssist");
    upsertMeta(
      "property",
      "og:title",
      "MoAssist | Custom AI Chatbots for Websites, Customer Portals, and Support Teams",
    );
    upsertMeta(
      "property",
      "og:description",
      "Launch AI chatbots for online shops and selling businesses, upload documents, collect leads, support signed-in users, and manage AI and team replies from one platform.",
    );
    upsertMeta("property", "og:type", "website");
    upsertMeta(
      "name",
      "twitter:title",
      "MoAssist | Custom AI Chatbots for Websites, Customer Portals, and Support Teams",
    );
    upsertMeta(
      "name",
      "twitter:description",
      "Create chatbots for online shops and selling businesses, upload knowledge, customize the chatbot, collect customer data, and run AI plus human support from one dashboard.",
    );
    upsertMeta(
      "name",
      "robots",
      "index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1",
    );
    upsertMeta("property", "og:site_name", "MoAssist");

    if (window.location?.href) {
      upsertMeta("property", "og:url", window.location.href);
      upsertLink("canonical", window.location.origin + "/");
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
  }, []);
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
            Image Placeholder
          </div>
          <div className="mt-3 font-display text-2xl font-semibold text-zinc-900 dark:text-white">
            {title}
          </div>
          <p className="mt-3 max-w-sm text-sm leading-7 text-zinc-600 dark:text-zinc-300">
            Replace this placeholder with your final product screenshot.
          </p>
        </div>
      </div>
    </div>
  </div>
);

const WorkflowCardImage = ({ title, alt }) => (
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
          Step Placeholder
        </div>
        <div className="mt-3 font-display text-2xl font-semibold text-zinc-900 dark:text-white">
          {title}
        </div>
        <p className="mt-3 max-w-sm text-sm leading-7 text-zinc-600 dark:text-zinc-300">
          Replace this placeholder with your final workflow image.
        </p>
      </div>
    </div>
  </div>
);

const HowItWorksSection = ({ activeStep, sectionRef }) => (
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
        Process
      </p>
      <h2 className="font-display text-3xl font-semibold text-zinc-900 sm:text-4xl dark:text-white">
        A simple workflow from setup to live conversations.
      </h2>
      <p className="max-w-xl text-base leading-8 text-zinc-600 dark:text-zinc-300">
        Scroll down to move through each step. The active card changes while the
        left side stays pinned and updates with the current stage of the setup.
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
                      title={`${item.step} visual`}
                      alt={`${item.title} placeholder image`}
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

export const Landing = () => {
  const [openFaq, setOpenFaq] = useState(0);
  const [activeWorkflowStep, setActiveWorkflowStep] = useState(0);
  const workflowSectionRef = useRef(null);
  const mouseLightRef = useRef(null);

  useLandingSeo();
  useRevealOnScroll();
  useWorkflowStepObserver(workflowSectionRef, setActiveWorkflowStep);
  usePointerLight(mouseLightRef);

  const siteUrl = typeof window !== "undefined" ? window.location.origin : "";
  const faqStructuredData = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqItems.map((item) => ({
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
    description:
      "Platform for online shops and selling businesses to create AI chatbots with document uploads, chatbot customization, lead capture, signed-in user support, and AI plus human conversation management.",
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
            <TonePill>For Online Shops And Selling Businesses</TonePill>

            <div className="space-y-5">
              <h1 className="font-display text-4xl font-semibold tracking-tight text-zinc-900 sm:text-5xl xl:text-[4rem] xl:leading-[1.02] dark:text-white">
                AI chatbots for online shops and businesses that sell products
                or services.
              </h1>
              <p className="max-w-2xl text-base leading-8 text-zinc-600 sm:text-lg dark:text-zinc-300">
                MoAssist helps selling businesses create their own chatbot,
                upload documents, customize the chatbot design, collect customer
                data, and answer with AI. It also gives teams one dashboard for
                human replies, customer conversations, and help services for
                signed-in users.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <Button color="teal" href="/chatbots">
                Open dashboard
              </Button>
              <Button outline href="/login">
                Login
              </Button>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              {heroHighlights.map((item, index) => (
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
            title="MoAssist AI chatbot dashboard"
            alt="MoAssist AI website chatbot dashboard placeholder image"
            aspectClass="aspect-[1.08/1]"
          />
        </section>

        <section className="grid gap-5 md:grid-cols-3">
          {coreBenefits.map((item, index) => (
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
              eyebrow="What you can do"
              title="Everything you need to create, train, publish, and operate custom chatbots."
              body="MoAssist is built for online shops and selling businesses. It helps teams speak with visitors, leads, buyers, and existing customers through one connected chatbot workflow."
            />
          </div>

          <div className="space-y-8">
            {featureSections.map((section, index) => (
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
                    />
                  </>
                ) : (
                  <>
                    <PlaceholderImage
                      title={section.imageTitle}
                      alt={section.imageAlt}
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
              eyebrow="Why choose MoAssist"
              title="Why businesses choose MoAssist for customer communication and help services."
              body="Choose MoAssist when you need one system for pre-sale questions, lead capture, customer support, signed-in user help, and team takeover."
            />
          </div>

          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {reasonCards.map((item, index) => (
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
          sectionRef={workflowSectionRef}
        />

        <section className="space-y-10">
          <div data-reveal className="landing-reveal">
            <SectionHeading
              eyebrow="Use cases"
              title="Who MoAssist is for."
              body="MoAssist is for online shops and businesses that sell products or services and need a better way to talk to visitors, leads, buyers, and signed-in customers."
            />
          </div>

          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {useCases.map((item, index) => (
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
            eyebrow="FAQ"
            title="Frequently asked questions about our website chatbot platform."
            body="These are the questions customers usually ask when they want to understand what the chatbot does, how it fits their website, and why it is worth choosing."
          />

          <div className="mt-8 space-y-3">
            {faqItems.map((item, index) => {
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
              <TonePill>Get started</TonePill>
              <h2 className="font-display text-3xl font-semibold text-zinc-900 sm:text-4xl dark:text-white">
                Start with one chatbot, then grow into a stronger sales and
                support system.
              </h2>
              <p className="max-w-2xl text-base leading-8 text-zinc-600 dark:text-zinc-300">
                If you need a platform to build chatbots, upload business
                knowledge, customize the chatbot, collect customer data, support
                signed-in users, and let AI plus humans answer from one
                dashboard, MoAssist is built for that job.
              </p>
            </div>
            <div className="flex flex-wrap gap-3 lg:justify-end">
              <Button color="teal" href="/chatbots">
                Try now
              </Button>
              <Button outline href="/login">
                Login
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
                    AI chatbots for online shops and support teams.
                  </div>
                </div>
              </div>
              <div className="space-y-2 text-sm text-zinc-600 dark:text-zinc-300">
                <p>support@momicro.ai</p>
                <p>legal@momicro.ai</p>
                <p>
                  © {new Date().getFullYear()} MoAssist. All rights reserved.
                </p>
              </div>
            </div>

            <div className="grid gap-8 sm:grid-cols-3">
              {footerColumns.map((column) => (
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
            Login
          </Button>
          <Button color="teal" href="/chatbots" className="flex-1">
            Try now
          </Button>
        </div>
      </div>
    </div>
  );
};
