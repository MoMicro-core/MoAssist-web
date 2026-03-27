const createFeature = (
  id,
  eyebrow,
  title,
  body,
  points,
  imageTitle,
  imageAlt,
) => ({
  id,
  eyebrow,
  title,
  body,
  points,
  imageTitle,
  imageAlt,
});

const createFooterColumns = (product, explore, legal) => [
  {
    title: product.title,
    links: product.links,
  },
  {
    title: explore.title,
    links: explore.links,
  },
  {
    title: legal.title,
    links: legal.links,
  },
];

export const marketingContent = {
  en: {
    seo: {
      title: "MoAssist | AI Chatbots for Online Shops and Sales-Driven Businesses",
      description:
        "MoAssist helps online shops and sales-driven businesses build branded chatbots, answer with business knowledge, collect leads, support signed-in customers, and manage AI plus human conversations from one dashboard.",
      keywords:
        "online shop chatbot, ecommerce chatbot, sales chatbot, support chatbot, AI chatbot for business, lead capture chatbot, chatbot for customer portal, chatbot knowledge base, multilingual chatbot, branded website chatbot",
      ogDescription:
        "Build a branded chatbot for each store or sales flow, train it with your documents, collect customer details, and manage AI plus team replies from one dashboard.",
      twitterDescription:
        "AI chatbots for online shops and sales teams. Train with documents, collect leads, support customers, and manage AI plus human replies in one place.",
    },
    appDescription:
      "MoAssist is a chatbot platform for online shops and sales-driven businesses that want faster replies, better lead capture, and stronger customer support.",
    heroPill: "Built For Online Shops And Selling Businesses",
    heroTitle: "A better way to talk with shoppers, leads, and customers.",
    heroBody:
      "Create a branded chatbot for each store or sales flow, train it with your documents, capture customer details, support signed-in users, and manage AI plus team replies in one place.",
    heroHighlights: [
      { title: "Shop-specific chatbots", href: "#feature-individual-chatbots" },
      { title: "Knowledge-based answers", href: "#feature-knowledge-ai" },
      { title: "Lead capture", href: "#feature-lead-capture" },
      { title: "Team inbox", href: "#feature-support-workflow" },
    ],
    coreBenefits: [
      {
        title: "Create a different chatbot for each store, brand, or sales flow",
        body: "Set the welcome text, prompts, logo, colors, launcher, placement, and publish state for every chatbot.",
      },
      {
        title: "Answer from your own business material",
        body: "Upload guides, product information, policies, and other documents so the chatbot answers with real context.",
      },
      {
        title: "Handle sales and support in one system",
        body: "Collect lead data, help signed-in customers, and let AI plus your team work in the same conversation inbox.",
      },
    ],
    featuresSection: {
      eyebrow: "What you can do",
      title:
        "Everything you need to create, train, publish, and operate custom chatbots.",
      body: "MoAssist is made for online shops and businesses that sell products or services. It helps teams talk with visitors, leads, buyers, and existing customers through one connected workflow.",
    },
    featureSections: [
      createFeature(
        "feature-individual-chatbots",
        "Individual chatbot builder",
        "Create a separate chatbot for each shop, product line, brand, or customer journey.",
        "Each chatbot can have its own name, first message, suggested questions, logo, icon, colors, theme, placement, languages, and allowed domains.",
        [
          "Separate chatbot per project",
          "Draft and publish workflow",
          "Logo, icon, and launcher control",
          "Themes, languages, and domain rules",
        ],
        "MoAssist custom chatbot builder",
        "MoAssist custom chatbot builder placeholder image",
      ),
      createFeature(
        "feature-knowledge-ai",
        "Knowledge and AI answers",
        "Upload documents so the chatbot can answer with real business context.",
        "Add documents and files, turn AI replies on when your plan allows it, choose answer length, and set reply guidelines so the chatbot answers from your material instead of guessing.",
        [
          "Document and file uploads",
          "Reply instructions and tone control",
          "Short, medium, or long answer style",
          "Faster first replies for customers",
        ],
        "MoAssist knowledge upload and AI settings",
        "MoAssist knowledge upload placeholder image",
      ),
      createFeature(
        "feature-lead-capture",
        "Lead capture and customer data",
        "Collect names, emails, and other customer details inside the chat.",
        "Build your own lead form, choose the fields you need, decide what is required, and use chat for sales qualification, support intake, and contact requests.",
        [
          "Custom lead forms",
          "Required and optional fields",
          "Sales qualification and support intake",
          "Customer details stored with the conversation",
        ],
        "MoAssist lead capture and customer data flow",
        "MoAssist lead capture placeholder image",
      ),
      createFeature(
        "feature-logged-in-users",
        "Signed-in users and admin workflows",
        "Support existing customers with a chatbot that recognizes who is already logged in.",
        "MoAssist can connect the conversation to the right signed-in customer. That helps you run a real help service inside your customer area and fit chat into your own admin workflow.",
        [
          "Recognize signed-in customers",
          "Use chat inside customer accounts",
          "Fit chat into your admin workflow",
          "Keep more context than anonymous chat",
        ],
        "MoAssist connected customer support workflow",
        "MoAssist signed-in customer workflow placeholder image",
      ),
      createFeature(
        "feature-support-workflow",
        "AI and team inbox",
        "Let AI reply first and let your team step in when a person should take over.",
        "AI and human replies stay in one inbox. You can see who wrote each message, whether it was read, and whether the conversation is active, waiting, or closed.",
        [
          "AI and human replies in one thread",
          "Read and unread message status",
          "Active, waiting, and closed conversations",
          "Automatic inactivity handling",
        ],
        "MoAssist inbox and conversation lifecycle",
        "MoAssist shared inbox placeholder image",
      ),
      createFeature(
        "feature-install-launch",
        "Install and launch",
        "Launch the chatbot on your site, your store, or your customer area.",
        "Install with a script or iframe, choose the default language and extra languages, and control which domains are allowed to load the chatbot.",
        [
          "Script and iframe installation",
          "Default and additional languages",
          "Allowed domain controls",
          "Fast rollout to public and private areas",
        ],
        "MoAssist installation and rollout",
        "MoAssist installation placeholder image",
      ),
    ],
    reasonsSection: {
      eyebrow: "Why choose MoAssist",
      title: "Why sales and support teams choose MoAssist.",
      body: "Choose MoAssist when you need one system for pre-sale questions, lead capture, customer support, signed-in user help, and team takeover.",
    },
    reasonCards: [
      {
        title: "One system instead of disconnected tools",
        body: "Create, train, launch, and manage chatbots from one place.",
      },
      {
        title: "Built for businesses that sell",
        body: "MoAssist is for shops and commercial teams that need better conversations, not a generic chat widget.",
      },
      {
        title: "Each chatbot can match the business",
        body: "Every chatbot can have its own style, content, language setup, and behavior.",
      },
      {
        title: "Faster replies without losing control",
        body: "AI can answer common questions while your team still controls tone, lead capture, and takeover.",
      },
      {
        title: "Better help for existing customers",
        body: "MoAssist works for signed-in users in customer areas, not only for anonymous visitors.",
      },
      {
        title: "Useful across the whole customer journey",
        body: "Use one platform for product questions, lead capture, support, and ongoing customer service.",
      },
    ],
    workflowSection: {
      processLabel: "Process",
      title: "A simple workflow from setup to live conversations.",
      body: "Scroll through the steps to see how a chatbot moves from setup to launch and daily customer communication.",
    },
    workflowSteps: [
      {
        step: "Step 01",
        label: "Create",
        title: "Create a chatbot for the exact sales or support flow you need",
        body: "Set the name, purpose, first message, suggested questions, and basic setup for that chatbot.",
      },
      {
        step: "Step 02",
        label: "Train",
        title: "Upload knowledge and define how the chatbot should answer",
        body: "Add documents, choose answer style, and write clear reply instructions.",
      },
      {
        step: "Step 03",
        label: "Customize",
        title: "Customize the chatbot and choose what customer data to collect",
        body: "Adjust the interface, colors, texts, form fields, and languages so the experience fits your brand.",
      },
      {
        step: "Step 04",
        label: "Launch",
        title: "Publish the chatbot and handle real customer conversations",
        body: "Install it on your website or customer area, support signed-in users, and let AI plus your team reply from one place.",
      },
    ],
    useCasesSection: {
      eyebrow: "Use cases",
      title: "Who MoAssist is for.",
      body: "MoAssist is for online shops and businesses that sell products or services and need a better way to talk to visitors, leads, buyers, and signed-in customers.",
    },
    useCases: [
      {
        title: "Customer support and help center",
        body: "Answer common questions, use uploaded knowledge, and let human agents take over when needed.",
      },
      {
        title: "Sales and lead qualification",
        body: "Answer buying questions, collect contact details, and pass qualified leads to the team with context.",
      },
      {
        title: "Customer portals and member areas",
        body: "Support signed-in customers inside your product, portal, or account area.",
      },
      {
        title: "Internal admin and service workflows",
        body: "Use the dashboard as the control center for AI and human conversations.",
      },
    ],
    faqSection: {
      eyebrow: "FAQ",
      title: "Frequently asked questions about MoAssist.",
      body: "These are the questions teams usually ask before they launch a chatbot for sales, support, or signed-in customer service.",
    },
    faqItems: [
      {
        question: "What is MoAssist?",
        answer:
          "MoAssist is a platform for online shops and sales-driven businesses to create chatbots for websites, customer areas, support flows, and commercial communication.",
      },
      {
        question: "Can I create more than one chatbot?",
        answer:
          "Yes. You can create separate chatbots for different stores, brands, products, languages, or customer journeys.",
      },
      {
        question: "Can I upload documents so the chatbot knows my business?",
        answer:
          "Yes. You can upload documents and files so the chatbot can answer from your business material.",
      },
      {
        question: "Can I customize the chatbot on my website?",
        answer:
          "Yes. You can customize the design, colors, icons, launcher, text, theme, and placement.",
      },
      {
        question: "Can I collect customer data with the chatbot?",
        answer:
          "Yes. You can collect names, emails, and other custom fields with lead forms inside the chat.",
      },
      {
        question: "Can I connect the chatbot to signed-in users and my own admin flow?",
        answer:
          "Yes. MoAssist can keep the conversation connected to the right signed-in customer and fit into your internal support workflow.",
      },
      {
        question: "Can AI and human agents both reply in the same conversation?",
        answer:
          "Yes. AI and human replies stay in one thread, and the inbox shows who wrote each message and whether it was read.",
      },
      {
        question: "What happens when a customer goes inactive?",
        answer:
          "The conversation can move automatically between active, waiting, and closed states based on your inactivity rules and plan.",
      },
      {
        question: "Why do businesses choose MoAssist?",
        answer:
          "Businesses choose MoAssist because it combines chatbot setup, knowledge uploads, lead capture, signed-in customer support, and AI plus human replies in one product.",
      },
    ],
    ctaSection: {
      eyebrow: "Get started",
      title: "Start with one chatbot and grow into a stronger sales and support workflow.",
      body: "If you need a platform to build chatbots, upload business knowledge, customize the interface, collect customer data, support signed-in users, and run AI plus human replies from one dashboard, MoAssist is built for that job.",
    },
    footerTagline: "AI chatbots for online shops and support teams.",
    footerColumns: createFooterColumns(
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
    ),
    imagePlaceholderLabel: "Image Placeholder",
    imagePlaceholderBody: "Replace this placeholder with your final product screenshot.",
    stepPlaceholderLabel: "Step Placeholder",
    stepPlaceholderBody: "Replace this placeholder with your final workflow image.",
    heroImageTitle: "MoAssist AI chatbot dashboard",
    heroImageAlt: "MoAssist AI chatbot dashboard placeholder image",
  },
  at: {
    seo: {
      title: "MoAssist | KI-Chatbots für Onlineshops und verkaufsstarke Unternehmen",
      description:
        "MoAssist hilft Onlineshops und verkaufsstarken Unternehmen dabei, gebrandete Chatbots zu erstellen, mit Unternehmenswissen zu antworten, Leads zu sammeln, eingeloggte Kunden zu unterstützen und KI- plus Team-Gespräche in einem Dashboard zu verwalten.",
      keywords:
        "Chatbot für Onlineshop, E-Commerce Chatbot, Sales Chatbot, Support Chatbot, KI Chatbot für Unternehmen, Lead Capture Chatbot, Kundenportal Chatbot, Wissensbasis Chatbot, mehrsprachiger Chatbot, gebrandeter Website Chatbot",
      ogDescription:
        "Erstelle für jeden Shop oder Verkaufsprozess einen gebrandeten Chatbot, trainiere ihn mit deinen Dokumenten, sammle Kundendaten und verwalte KI- plus Team-Antworten in einem Dashboard.",
      twitterDescription:
        "KI-Chatbots für Onlineshops und Sales-Teams. Mit Dokumenten trainieren, Leads sammeln, Kunden unterstützen und KI- plus Team-Antworten an einem Ort steuern.",
    },
    appDescription:
      "MoAssist ist eine Chatbot-Plattform für Onlineshops und verkaufsstarke Unternehmen, die schneller antworten, mehr Leads sammeln und besseren Kundensupport liefern wollen.",
    heroPill: "Für Onlineshops Und Verkaufende Unternehmen",
    heroTitle: "Der bessere Weg, mit Besuchern, Leads und Kunden zu sprechen.",
    heroBody:
      "Erstelle für jeden Shop oder Sales-Prozess einen gebrandeten Chatbot, trainiere ihn mit deinen Dokumenten, sammle Kundendaten, unterstütze eingeloggte Nutzer und steuere KI- plus Team-Antworten an einem Ort.",
    heroHighlights: [
      { title: "Chatbots pro Shop", href: "#feature-individual-chatbots" },
      { title: "Antworten aus Wissen", href: "#feature-knowledge-ai" },
      { title: "Lead-Erfassung", href: "#feature-lead-capture" },
      { title: "Team-Postfach", href: "#feature-support-workflow" },
    ],
    coreBenefits: [
      {
        title: "Ein eigener Chatbot für jeden Shop, jede Marke oder jeden Sales-Prozess",
        body: "Lege Begrüßung, Prompts, Logo, Farben, Launcher, Platzierung und Veröffentlichungsstatus pro Chatbot fest.",
      },
      {
        title: "Antworten mit deinem eigenen Unternehmenswissen",
        body: "Lade Anleitungen, Produktinfos, Richtlinien und andere Dokumente hoch, damit der Chatbot mit echtem Kontext antwortet.",
      },
      {
        title: "Sales und Support in einem System",
        body: "Sammle Leads, unterstütze eingeloggte Kunden und lasse KI plus Team im selben Gesprächspostfach arbeiten.",
      },
    ],
    featuresSection: {
      eyebrow: "Was du damit machen kannst",
      title:
        "Alles, was du brauchst, um individuelle Chatbots zu erstellen, zu trainieren, zu veröffentlichen und zu betreiben.",
      body: "MoAssist ist für Onlineshops und Unternehmen gemacht, die Produkte oder Services verkaufen. Es hilft Teams, mit Besuchern, Leads, Käufern und bestehenden Kunden in einem verbundenen Ablauf zu sprechen.",
    },
    featureSections: [
      createFeature(
        "feature-individual-chatbots",
        "Individueller Chatbot-Baukasten",
        "Erstelle einen eigenen Chatbot für jeden Shop, jede Produktlinie, jede Marke oder jede Customer Journey.",
        "Jeder Chatbot kann einen eigenen Namen, erste Nachricht, vorgeschlagene Fragen, Logo, Icon, Farben, Theme, Platzierung, Sprachen und erlaubte Domains haben.",
        [
          "Eigener Chatbot pro Projekt",
          "Entwurf- und Veröffentlichungsablauf",
          "Logo-, Icon- und Launcher-Steuerung",
          "Themes, Sprachen und Domain-Regeln",
        ],
        "MoAssist Chatbot-Baukasten",
        "MoAssist Chatbot-Baukasten Platzhalterbild",
      ),
      createFeature(
        "feature-knowledge-ai",
        "Wissen und KI-Antworten",
        "Lade Dokumente hoch, damit der Chatbot mit echtem Unternehmenskontext antworten kann.",
        "Füge Dokumente und Dateien hinzu, aktiviere KI-Antworten, wenn dein Tarif es erlaubt, wähle die Antwortlänge und hinterlege Richtlinien, damit der Chatbot aus deinem Material antwortet statt zu raten.",
        [
          "Dokumenten- und Datei-Uploads",
          "Antwortregeln und Tonalität",
          "Kurze, mittlere oder lange Antworten",
          "Schnellere erste Antworten für Kunden",
        ],
        "MoAssist Wissens-Upload und KI-Einstellungen",
        "MoAssist Wissens-Upload Platzhalterbild",
      ),
      createFeature(
        "feature-lead-capture",
        "Lead-Erfassung und Kundendaten",
        "Sammle Namen, E-Mails und andere Kundendaten direkt im Chat.",
        "Baue dein eigenes Lead-Formular, wähle die nötigen Felder, lege Pflichtfelder fest und nutze den Chat für Qualifizierung, Support-Anfragen und Kontaktaufnahmen.",
        [
          "Eigene Lead-Formulare",
          "Pflicht- und optionale Felder",
          "Sales-Qualifizierung und Support-Aufnahme",
          "Kundendaten im Gespräch gespeichert",
        ],
        "MoAssist Lead-Erfassung und Kundendaten",
        "MoAssist Lead-Erfassung Platzhalterbild",
      ),
      createFeature(
        "feature-logged-in-users",
        "Eingeloggte Nutzer und Admin-Abläufe",
        "Unterstütze bestehende Kunden mit einem Chatbot, der erkennt, wer bereits eingeloggt ist.",
        "MoAssist kann das Gespräch mit dem richtigen eingeloggten Kunden verbinden. So betreibst du echten Support im Kundenbereich und bindest Chat in deinen internen Ablauf ein.",
        [
          "Eingeloggte Kunden erkennen",
          "Chat im Kundenkonto nutzen",
          "In Admin-Abläufe integrieren",
          "Mehr Kontext als bei anonymem Chat",
        ],
        "MoAssist Support für eingeloggte Kunden",
        "MoAssist Workflow für eingeloggte Kunden Platzhalterbild",
      ),
      createFeature(
        "feature-support-workflow",
        "KI und Team-Postfach",
        "Lass zuerst die KI antworten und dein Team übernehmen, wenn ein Mensch gebraucht wird.",
        "KI- und menschliche Antworten bleiben in einem Postfach. Du siehst, wer geschrieben hat, ob die Nachricht gelesen wurde und ob das Gespräch aktiv, wartend oder geschlossen ist.",
        [
          "KI- und Team-Antworten im selben Thread",
          "Gelesen- und Ungelesen-Status",
          "Aktive, wartende und geschlossene Gespräche",
          "Automatische Inaktivitätslogik",
        ],
        "MoAssist Postfach und Gesprächsstatus",
        "MoAssist gemeinsames Postfach Platzhalterbild",
      ),
      createFeature(
        "feature-install-launch",
        "Installation und Start",
        "Starte den Chatbot auf deiner Website, in deinem Shop oder im Kundenbereich.",
        "Installiere ihn per Script oder Iframe, wähle Standardsprache und zusätzliche Sprachen und steuere, auf welchen Domains der Chatbot geladen werden darf.",
        [
          "Script- und Iframe-Installation",
          "Standardsprache und weitere Sprachen",
          "Kontrolle erlaubter Domains",
          "Schneller Rollout für öffentliche und interne Bereiche",
        ],
        "MoAssist Installation und Rollout",
        "MoAssist Installation Platzhalterbild",
      ),
    ],
    reasonsSection: {
      eyebrow: "Warum MoAssist",
      title: "Warum Sales- und Support-Teams MoAssist wählen.",
      body: "Wähle MoAssist, wenn du ein System für Vorverkaufsfragen, Lead-Erfassung, Support, Hilfe für eingeloggte Nutzer und Team-Übernahme brauchst.",
    },
    reasonCards: [
      {
        title: "Ein System statt vieler getrennter Tools",
        body: "Erstellen, trainieren, veröffentlichen und verwalten an einem Ort.",
      },
      {
        title: "Für Unternehmen gemacht, die verkaufen",
        body: "MoAssist ist für Shops und kommerzielle Teams gedacht, nicht für ein beliebiges Chat-Widget.",
      },
      {
        title: "Jeder Chatbot kann zum Geschäft passen",
        body: "Jeder Chatbot kann eigenen Stil, Inhalt, Sprachen und Verhalten haben.",
      },
      {
        title: "Schnellere Antworten ohne Kontrollverlust",
        body: "Die KI beantwortet Standardfragen, während dein Team Ton, Lead-Erfassung und Übernahme steuert.",
      },
      {
        title: "Besserer Support für bestehende Kunden",
        body: "MoAssist funktioniert auch für eingeloggte Nutzer im Kundenbereich.",
      },
      {
        title: "Nützlich entlang der ganzen Customer Journey",
        body: "Nutze eine Plattform für Produktfragen, Leads, Support und laufende Kundenbetreuung.",
      },
    ],
    workflowSection: {
      processLabel: "Ablauf",
      title: "Ein einfacher Weg von der Einrichtung bis zu echten Gesprächen.",
      body: "Scrolle durch die Schritte und sieh, wie ein Chatbot von der Einrichtung bis zum täglichen Kundenkontakt wächst.",
    },
    workflowSteps: [
      {
        step: "Schritt 01",
        label: "Erstellen",
        title: "Erstelle einen Chatbot für genau den Sales- oder Support-Prozess, den du brauchst",
        body: "Lege Namen, Zweck, erste Nachricht, vorgeschlagene Fragen und die Grundkonfiguration fest.",
      },
      {
        step: "Schritt 02",
        label: "Trainieren",
        title: "Lade Wissen hoch und definiere, wie der Chatbot antworten soll",
        body: "Füge Dokumente hinzu, wähle den Antwortstil und schreibe klare Antwortregeln.",
      },
      {
        step: "Schritt 03",
        label: "Anpassen",
        title: "Passe den Chatbot an und bestimme, welche Kundendaten gesammelt werden",
        body: "Gestalte Oberfläche, Farben, Texte, Formularfelder und Sprachen so, dass alles zu deiner Marke passt.",
      },
      {
        step: "Schritt 04",
        label: "Starten",
        title: "Veröffentliche den Chatbot und bearbeite echte Kundengespräche",
        body: "Installiere ihn auf Website oder Kundenbereich, unterstütze eingeloggte Nutzer und lasse KI plus Team an einem Ort antworten.",
      },
    ],
    useCasesSection: {
      eyebrow: "Einsatzbereiche",
      title: "Für wen MoAssist gemacht ist.",
      body: "MoAssist ist für Onlineshops und Unternehmen, die Produkte oder Services verkaufen und besser mit Besuchern, Leads, Käufern und eingeloggten Kunden sprechen wollen.",
    },
    useCases: [
      {
        title: "Kundensupport und Help Center",
        body: "Beantworte häufige Fragen, nutze hochgeladenes Wissen und lass bei Bedarf echte Mitarbeiter übernehmen.",
      },
      {
        title: "Sales und Lead-Qualifizierung",
        body: "Beantworte Kauf-Fragen, sammle Kontaktdaten und übergib qualifizierte Leads mit Kontext an dein Team.",
      },
      {
        title: "Kundenportale und Member Areas",
        body: "Unterstütze eingeloggte Kunden direkt in Produkt, Portal oder Konto-Bereich.",
      },
      {
        title: "Interne Admin- und Service-Abläufe",
        body: "Nutze das Dashboard als Steuerzentrale für KI- und Team-Gespräche.",
      },
    ],
    faqSection: {
      eyebrow: "FAQ",
      title: "Häufige Fragen zu MoAssist.",
      body: "Das sind die Fragen, die Teams meist stellen, bevor sie einen Chatbot für Sales, Support oder eingeloggte Kunden starten.",
    },
    faqItems: [
      {
        question: "Was ist MoAssist?",
        answer:
          "MoAssist ist eine Plattform für Onlineshops und verkaufsstarke Unternehmen, die Chatbots für Websites, Kundenbereiche, Support-Prozesse und kommerzielle Kommunikation erstellen wollen.",
      },
      {
        question: "Kann ich mehrere Chatbots erstellen?",
        answer:
          "Ja. Du kannst getrennte Chatbots für verschiedene Shops, Marken, Produkte, Sprachen oder Customer Journeys anlegen.",
      },
      {
        question: "Kann ich Dokumente hochladen, damit der Chatbot mein Geschäft kennt?",
        answer:
          "Ja. Du kannst Dokumente und Dateien hochladen, damit der Chatbot aus deinem Unternehmensmaterial antwortet.",
      },
      {
        question: "Kann ich den Chatbot auf meiner Website anpassen?",
        answer:
          "Ja. Du kannst Design, Farben, Icons, Launcher, Texte, Theme und Platzierung anpassen.",
      },
      {
        question: "Kann ich mit dem Chatbot Kundendaten sammeln?",
        answer:
          "Ja. Du kannst Namen, E-Mails und weitere Felder mit Lead-Formularen direkt im Chat sammeln.",
      },
      {
        question: "Kann ich den Chatbot mit eingeloggten Nutzern und meinem Admin-Ablauf verbinden?",
        answer:
          "Ja. MoAssist kann das Gespräch mit dem richtigen eingeloggten Kunden verbinden und in deinen Support-Ablauf passen.",
      },
      {
        question: "Können KI und echte Mitarbeiter im selben Gespräch antworten?",
        answer:
          "Ja. KI- und Team-Antworten bleiben im selben Thread, und das Postfach zeigt Autor und Lesestatus jeder Nachricht.",
      },
      {
        question: "Was passiert, wenn ein Kunde inaktiv wird?",
        answer:
          "Das Gespräch kann je nach Inaktivitätsregeln und Tarif automatisch zwischen aktiv, wartend und geschlossen wechseln.",
      },
      {
        question: "Warum wählen Unternehmen MoAssist?",
        answer:
          "Unternehmen wählen MoAssist, weil Chatbot-Erstellung, Wissens-Uploads, Lead-Erfassung, Support für eingeloggte Kunden und KI- plus Team-Antworten in einem Produkt zusammenkommen.",
      },
    ],
    ctaSection: {
      eyebrow: "Loslegen",
      title: "Starte mit einem Chatbot und baue daraus einen stärkeren Sales- und Support-Ablauf.",
      body: "Wenn du eine Plattform brauchst, um Chatbots zu bauen, Unternehmenswissen hochzuladen, die Oberfläche anzupassen, Kundendaten zu sammeln, eingeloggte Nutzer zu unterstützen und KI plus Team-Antworten aus einem Dashboard zu steuern, dann ist MoAssist dafür gemacht.",
    },
    footerTagline: "KI-Chatbots für Onlineshops und Support-Teams.",
    footerColumns: createFooterColumns(
      {
        title: "Produkt",
        links: [
          { label: "Dashboard", href: "/chatbots" },
          { label: "Login", href: "/login" },
          { label: "Support", href: "mailto:support@momicro.ai" },
        ],
      },
      {
        title: "Entdecken",
        links: [
          { label: "Funktionen", href: "#features" },
          { label: "So funktioniert es", href: "#how-it-works" },
          { label: "FAQ", href: "#faq" },
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
    ),
    imagePlaceholderLabel: "Bild-Platzhalter",
    imagePlaceholderBody: "Ersetze diesen Platzhalter durch deinen finalen Produkt-Screenshot.",
    stepPlaceholderLabel: "Schritt-Platzhalter",
    stepPlaceholderBody: "Ersetze diesen Platzhalter durch dein finales Workflow-Bild.",
    heroImageTitle: "MoAssist KI-Chatbot-Dashboard",
    heroImageAlt: "MoAssist KI-Chatbot-Dashboard Platzhalterbild",
  },
  es: {
    seo: {
      title: "MoAssist | Chatbots con IA para tiendas online y negocios que venden",
      description:
        "MoAssist ayuda a tiendas online y negocios que venden productos o servicios a crear chatbots con marca propia, responder con conocimiento del negocio, captar leads, asistir a clientes registrados y gestionar conversaciones con IA y equipo desde un solo panel.",
      keywords:
        "chatbot para tienda online, chatbot ecommerce, chatbot de ventas, chatbot de soporte, chatbot IA para negocios, chatbot captacion de leads, chatbot para portal de clientes, chatbot base de conocimiento, chatbot multilingue, chatbot con marca",
      ogDescription:
        "Crea un chatbot para cada tienda o flujo de ventas, entrénalo con tus documentos, recoge datos de clientes y gestiona respuestas de IA y equipo desde un solo panel.",
      twitterDescription:
        "Chatbots con IA para tiendas online y equipos de ventas. Entrena con documentos, capta leads, ayuda a clientes y gestiona respuestas humanas y automáticas en un solo lugar.",
    },
    appDescription:
      "MoAssist es una plataforma de chatbots para tiendas online y negocios que venden y quieren responder más rápido, captar más leads y ofrecer mejor soporte.",
    heroPill: "Para Tiendas Online Y Negocios Que Venden",
    heroTitle: "Una mejor forma de hablar con compradores, leads y clientes.",
    heroBody:
      "Crea un chatbot con marca propia para cada tienda o flujo comercial, entrénalo con tus documentos, recoge datos de clientes, ayuda a usuarios registrados y gestiona respuestas de IA y equipo desde un solo lugar.",
    heroHighlights: [
      { title: "Chatbots por tienda", href: "#feature-individual-chatbots" },
      { title: "Respuestas con conocimiento", href: "#feature-knowledge-ai" },
      { title: "Captación de leads", href: "#feature-lead-capture" },
      { title: "Bandeja del equipo", href: "#feature-support-workflow" },
    ],
    coreBenefits: [
      {
        title: "Un chatbot distinto para cada tienda, marca o flujo comercial",
        body: "Define mensaje de bienvenida, prompts, logo, colores, launcher, ubicación y estado de publicación para cada chatbot.",
      },
      {
        title: "Respuestas con tu propio material de negocio",
        body: "Sube guías, información de productos, políticas y otros documentos para que el chatbot responda con contexto real.",
      },
      {
        title: "Ventas y soporte en un solo sistema",
        body: "Capta leads, ayuda a clientes registrados y deja que la IA y tu equipo trabajen en la misma bandeja de conversación.",
      },
    ],
    featuresSection: {
      eyebrow: "Qué puedes hacer",
      title:
        "Todo lo que necesitas para crear, entrenar, publicar y operar chatbots personalizados.",
      body: "MoAssist está hecho para tiendas online y negocios que venden productos o servicios. Ayuda a los equipos a hablar con visitantes, leads, compradores y clientes existentes dentro de un flujo conectado.",
    },
    featureSections: [
      createFeature(
        "feature-individual-chatbots",
        "Constructor de chatbots",
        "Crea un chatbot distinto para cada tienda, línea de producto, marca o recorrido del cliente.",
        "Cada chatbot puede tener su propio nombre, primer mensaje, preguntas sugeridas, logo, icono, colores, tema, ubicación, idiomas y dominios permitidos.",
        [
          "Un chatbot por proyecto",
          "Flujo de borrador y publicación",
          "Control de logo, icono y launcher",
          "Temas, idiomas y reglas de dominio",
        ],
        "MoAssist constructor de chatbots",
        "Imagen de marcador de posición del constructor de chatbots de MoAssist",
      ),
      createFeature(
        "feature-knowledge-ai",
        "Conocimiento y respuestas IA",
        "Sube documentos para que el chatbot responda con contexto real del negocio.",
        "Añade documentos y archivos, activa respuestas IA cuando tu plan lo permita, elige longitud de respuesta y define guías para que el chatbot responda desde tu material y no improvise.",
        [
          "Subida de documentos y archivos",
          "Instrucciones de respuesta y tono",
          "Respuesta corta, media o larga",
          "Primeras respuestas más rápidas",
        ],
        "MoAssist conocimiento y ajustes IA",
        "Imagen de marcador de posición de conocimiento en MoAssist",
      ),
      createFeature(
        "feature-lead-capture",
        "Captación de leads y datos del cliente",
        "Recoge nombres, correos y otros datos del cliente dentro del chat.",
        "Crea tu propio formulario, elige los campos que necesitas, decide qué es obligatorio y usa el chat para cualificar ventas, recibir soporte y captar contactos.",
        [
          "Formularios personalizados",
          "Campos obligatorios y opcionales",
          "Calificación comercial y soporte",
          "Datos del cliente guardados en la conversación",
        ],
        "MoAssist captación de leads y datos",
        "Imagen de marcador de posición de captación de leads en MoAssist",
      ),
      createFeature(
        "feature-logged-in-users",
        "Usuarios registrados y flujos internos",
        "Da soporte a clientes existentes con un chatbot que reconoce quién ya inició sesión.",
        "MoAssist puede mantener la conversación vinculada al cliente correcto. Así puedes crear un servicio de ayuda real dentro del área de cliente y encajar el chat en tu flujo interno.",
        [
          "Reconocer clientes registrados",
          "Usar chat en el área del cliente",
          "Integrarlo con tu flujo interno",
          "Más contexto que un chat anónimo",
        ],
        "MoAssist soporte para clientes registrados",
        "Imagen de marcador de posición de soporte para clientes registrados",
      ),
      createFeature(
        "feature-support-workflow",
        "Bandeja de IA y equipo",
        "Deja que la IA responda primero y que tu equipo tome el control cuando haga falta una persona.",
        "Las respuestas de IA y de agentes humanos quedan en la misma bandeja. Puedes ver quién escribió, si el mensaje fue leído y si la conversación está activa, pendiente o cerrada.",
        [
          "IA y humanos en el mismo hilo",
          "Estado de leído y no leído",
          "Conversaciones activas, pendientes y cerradas",
          "Gestión automática por inactividad",
        ],
        "MoAssist bandeja y ciclo de conversación",
        "Imagen de marcador de posición de bandeja compartida en MoAssist",
      ),
      createFeature(
        "feature-install-launch",
        "Instalación y lanzamiento",
        "Lanza el chatbot en tu web, tu tienda o tu área privada.",
        "Instálalo con script o iframe, elige idioma principal y extra, y controla en qué dominios puede cargarse.",
        [
          "Instalación con script o iframe",
          "Idioma principal e idiomas extra",
          "Control de dominios permitidos",
          "Despliegue rápido en áreas públicas y privadas",
        ],
        "MoAssist instalación y lanzamiento",
        "Imagen de marcador de posición de instalación de MoAssist",
      ),
    ],
    reasonsSection: {
      eyebrow: "Por qué MoAssist",
      title: "Por qué los equipos comerciales y de soporte eligen MoAssist.",
      body: "Elige MoAssist si necesitas un sistema para preguntas de venta, captación de leads, soporte, ayuda a usuarios registrados y toma de control por parte del equipo.",
    },
    reasonCards: [
      {
        title: "Un sistema en lugar de varias herramientas",
        body: "Crea, entrena, publica y gestiona chatbots desde un solo lugar.",
      },
      {
        title: "Hecho para negocios que venden",
        body: "MoAssist está pensado para tiendas y equipos comerciales, no para un chat genérico.",
      },
      {
        title: "Cada chatbot puede adaptarse al negocio",
        body: "Cada chatbot puede tener su propio estilo, contenido, idiomas y comportamiento.",
      },
      {
        title: "Respuestas más rápidas sin perder control",
        body: "La IA responde preguntas repetidas mientras tu equipo mantiene el control del tono y la intervención.",
      },
      {
        title: "Mejor ayuda para clientes existentes",
        body: "MoAssist funciona con usuarios registrados dentro del área de cliente.",
      },
      {
        title: "Útil durante todo el recorrido del cliente",
        body: "Usa una sola plataforma para preguntas de compra, leads, soporte y atención continua.",
      },
    ],
    workflowSection: {
      processLabel: "Proceso",
      title: "Un flujo simple desde la configuración hasta las conversaciones reales.",
      body: "Desplázate por los pasos para ver cómo un chatbot pasa de la configuración al uso diario con clientes.",
    },
    workflowSteps: [
      {
        step: "Paso 01",
        label: "Crear",
        title: "Crea un chatbot para el flujo comercial o de soporte que necesitas",
        body: "Define nombre, objetivo, mensaje inicial, preguntas sugeridas y configuración básica.",
      },
      {
        step: "Paso 02",
        label: "Entrenar",
        title: "Sube conocimiento y define cómo debe responder el chatbot",
        body: "Añade documentos, elige el estilo de respuesta y escribe instrucciones claras.",
      },
      {
        step: "Paso 03",
        label: "Personalizar",
        title: "Personaliza el chatbot y decide qué datos del cliente recoger",
        body: "Ajusta interfaz, colores, textos, campos del formulario e idiomas para que todo encaje con tu marca.",
      },
      {
        step: "Paso 04",
        label: "Lanzar",
        title: "Publica el chatbot y gestiona conversaciones reales",
        body: "Instálalo en tu web o área de cliente, ayuda a usuarios registrados y deja que la IA y tu equipo respondan desde un solo lugar.",
      },
    ],
    useCasesSection: {
      eyebrow: "Casos de uso",
      title: "Para quién es MoAssist.",
      body: "MoAssist es para tiendas online y negocios que venden productos o servicios y quieren hablar mejor con visitantes, leads, compradores y clientes registrados.",
    },
    useCases: [
      {
        title: "Soporte y centro de ayuda",
        body: "Responde preguntas frecuentes, usa el conocimiento subido y deja que agentes humanos entren cuando haga falta.",
      },
      {
        title: "Ventas y calificación de leads",
        body: "Responde dudas de compra, capta datos y pasa leads cualificados al equipo con contexto.",
      },
      {
        title: "Portales de clientes y áreas privadas",
        body: "Ayuda a clientes registrados dentro de tu producto, portal o zona de cuenta.",
      },
      {
        title: "Flujos internos y de servicio",
        body: "Usa el panel como centro de control para conversaciones de IA y humanas.",
      },
    ],
    faqSection: {
      eyebrow: "FAQ",
      title: "Preguntas frecuentes sobre MoAssist.",
      body: "Estas son las preguntas que más suelen hacer los equipos antes de lanzar un chatbot para ventas, soporte o ayuda a clientes registrados.",
    },
    faqItems: [
      {
        question: "¿Qué es MoAssist?",
        answer:
          "MoAssist es una plataforma para tiendas online y negocios que venden y quieren crear chatbots para sitios web, áreas de cliente, soporte y comunicación comercial.",
      },
      {
        question: "¿Puedo crear más de un chatbot?",
        answer:
          "Sí. Puedes crear chatbots separados para distintas tiendas, marcas, productos, idiomas o recorridos del cliente.",
      },
      {
        question: "¿Puedo subir documentos para que el chatbot conozca mi negocio?",
        answer:
          "Sí. Puedes subir documentos y archivos para que el chatbot responda desde tu material de negocio.",
      },
      {
        question: "¿Puedo personalizar el chatbot en mi web?",
        answer:
          "Sí. Puedes personalizar diseño, colores, iconos, launcher, textos, tema y ubicación.",
      },
      {
        question: "¿Puedo recoger datos de clientes con el chatbot?",
        answer:
          "Sí. Puedes recoger nombres, correos y otros campos personalizados con formularios dentro del chat.",
      },
      {
        question: "¿Puedo conectar el chatbot con usuarios registrados y con mi flujo interno?",
        answer:
          "Sí. MoAssist puede mantener la conversación vinculada al cliente correcto e integrarse con tu flujo de soporte.",
      },
      {
        question: "¿La IA y los agentes humanos pueden responder en la misma conversación?",
        answer:
          "Sí. Las respuestas de IA y de humanos quedan en el mismo hilo, y la bandeja muestra autor y estado de lectura.",
      },
      {
        question: "¿Qué pasa cuando un cliente queda inactivo?",
        answer:
          "La conversación puede cambiar automáticamente entre activa, pendiente y cerrada según tus reglas de inactividad y tu plan.",
      },
      {
        question: "¿Por qué las empresas eligen MoAssist?",
        answer:
          "Porque reúne creación de chatbots, carga de conocimiento, captación de leads, soporte a clientes registrados y respuestas de IA y equipo en un solo producto.",
      },
    ],
    ctaSection: {
      eyebrow: "Empieza ahora",
      title: "Empieza con un chatbot y conviértelo en un mejor flujo de ventas y soporte.",
      body: "Si necesitas una plataforma para crear chatbots, subir conocimiento del negocio, personalizar la interfaz, captar datos de clientes, ayudar a usuarios registrados y gestionar respuestas de IA y equipo desde un panel, MoAssist está hecho para eso.",
    },
    footerTagline: "Chatbots con IA para tiendas online y equipos de soporte.",
    footerColumns: createFooterColumns(
      {
        title: "Producto",
        links: [
          { label: "Panel", href: "/chatbots" },
          { label: "Login", href: "/login" },
          { label: "Soporte", href: "mailto:support@momicro.ai" },
        ],
      },
      {
        title: "Explorar",
        links: [
          { label: "Funciones", href: "#features" },
          { label: "Cómo funciona", href: "#how-it-works" },
          { label: "FAQ", href: "#faq" },
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
    ),
    imagePlaceholderLabel: "Marcador de imagen",
    imagePlaceholderBody: "Sustituye este marcador por tu captura final del producto.",
    stepPlaceholderLabel: "Marcador del paso",
    stepPlaceholderBody: "Sustituye este marcador por tu imagen final del flujo.",
    heroImageTitle: "Panel de chatbot IA de MoAssist",
    heroImageAlt: "Imagen de marcador del panel de chatbot IA de MoAssist",
  },
  fr: {
    seo: {
      title: "MoAssist | Chatbots IA pour boutiques en ligne et entreprises qui vendent",
      description:
        "MoAssist aide les boutiques en ligne et les entreprises qui vendent des produits ou services à créer des chatbots de marque, répondre avec leur propre base de connaissances, collecter des leads, aider les clients connectés et gérer les conversations IA et humaines depuis un seul tableau de bord.",
      keywords:
        "chatbot boutique en ligne, chatbot ecommerce, chatbot vente, chatbot support, chatbot IA entreprise, chatbot capture de leads, chatbot portail client, chatbot base de connaissances, chatbot multilingue, chatbot marque blanche",
      ogDescription:
        "Créez un chatbot pour chaque boutique ou parcours commercial, entraînez-le avec vos documents, collectez des informations clients et gérez les réponses IA et humaines depuis un seul tableau de bord.",
      twitterDescription:
        "Chatbots IA pour boutiques en ligne et équipes commerciales. Formez-les avec vos documents, collectez des leads, aidez vos clients et centralisez les réponses humaines et IA.",
    },
    appDescription:
      "MoAssist est une plateforme de chatbots pour les boutiques en ligne et les entreprises commerciales qui veulent répondre plus vite, mieux qualifier les leads et offrir un meilleur support.",
    heroPill: "Pour Les Boutiques En Ligne Et Les Entreprises Commerciales",
    heroTitle: "Une meilleure façon de parler aux acheteurs, prospects et clients.",
    heroBody:
      "Créez un chatbot de marque pour chaque boutique ou parcours commercial, entraînez-le avec vos documents, collectez des données clients, aidez les utilisateurs connectés et gérez les réponses IA et humaines au même endroit.",
    heroHighlights: [
      { title: "Chatbots par boutique", href: "#feature-individual-chatbots" },
      { title: "Réponses basées sur vos contenus", href: "#feature-knowledge-ai" },
      { title: "Collecte de leads", href: "#feature-lead-capture" },
      { title: "Boîte d'équipe", href: "#feature-support-workflow" },
    ],
    coreBenefits: [
      {
        title: "Un chatbot différent pour chaque boutique, marque ou parcours de vente",
        body: "Définissez l'accueil, les prompts, le logo, les couleurs, le lanceur, l'emplacement et l'état de publication pour chaque chatbot.",
      },
      {
        title: "Des réponses basées sur vos propres documents",
        body: "Importez guides, fiches produit, politiques et autres documents pour que le chatbot réponde avec un vrai contexte métier.",
      },
      {
        title: "Vente et support dans un seul système",
        body: "Collectez des leads, aidez les clients connectés et laissez l'IA et votre équipe travailler dans la même boîte de conversation.",
      },
    ],
    featuresSection: {
      eyebrow: "Ce que vous pouvez faire",
      title:
        "Tout ce qu'il faut pour créer, entraîner, publier et gérer des chatbots personnalisés.",
      body: "MoAssist est conçu pour les boutiques en ligne et les entreprises qui vendent des produits ou des services. Il aide les équipes à parler aux visiteurs, prospects, acheteurs et clients existants dans un flux unique.",
    },
    featureSections: [
      createFeature(
        "feature-individual-chatbots",
        "Créateur de chatbots",
        "Créez un chatbot distinct pour chaque boutique, gamme de produits, marque ou parcours client.",
        "Chaque chatbot peut avoir son propre nom, premier message, questions suggérées, logo, icône, couleurs, thème, emplacement, langues et domaines autorisés.",
        [
          "Un chatbot par projet",
          "Brouillon et publication",
          "Contrôle du logo, de l'icône et du lanceur",
          "Thèmes, langues et règles de domaine",
        ],
        "MoAssist créateur de chatbots",
        "Image de remplacement du créateur de chatbots MoAssist",
      ),
      createFeature(
        "feature-knowledge-ai",
        "Connaissances et réponses IA",
        "Importez des documents pour que le chatbot réponde avec un vrai contexte métier.",
        "Ajoutez des documents et fichiers, activez les réponses IA si votre offre le permet, choisissez la longueur de réponse et définissez les consignes pour éviter les réponses approximatives.",
        [
          "Import de documents et fichiers",
          "Consignes et ton des réponses",
          "Réponses courtes, moyennes ou longues",
          "Premières réponses plus rapides",
        ],
        "MoAssist connaissances et réglages IA",
        "Image de remplacement des connaissances MoAssist",
      ),
      createFeature(
        "feature-lead-capture",
        "Collecte de leads et données clients",
        "Collectez noms, e-mails et autres données clients directement dans le chat.",
        "Créez votre propre formulaire, choisissez les champs nécessaires, définissez les champs obligatoires et utilisez le chat pour la qualification commerciale, les demandes de support et les prises de contact.",
        [
          "Formulaires personnalisés",
          "Champs obligatoires et optionnels",
          "Qualification commerciale et support",
          "Données clients stockées dans la conversation",
        ],
        "MoAssist collecte de leads et données clients",
        "Image de remplacement de collecte de leads MoAssist",
      ),
      createFeature(
        "feature-logged-in-users",
        "Utilisateurs connectés et workflows internes",
        "Aidez les clients existants avec un chatbot qui reconnaît les utilisateurs déjà connectés.",
        "MoAssist peut relier la conversation au bon client connecté. Vous pouvez ainsi proposer une vraie assistance dans l'espace client et intégrer le chat à votre workflow interne.",
        [
          "Reconnaître les clients connectés",
          "Utiliser le chat dans l'espace client",
          "Intégrer le chat au workflow interne",
          "Conserver plus de contexte qu'un chat anonyme",
        ],
        "MoAssist assistance pour clients connectés",
        "Image de remplacement pour l'assistance des clients connectés",
      ),
      createFeature(
        "feature-support-workflow",
        "Boîte IA et équipe",
        "Laissez l'IA répondre d'abord et votre équipe reprendre quand une personne doit intervenir.",
        "Les réponses IA et humaines restent dans la même boîte. Vous voyez qui a écrit, si le message a été lu et si la conversation est active, en attente ou fermée.",
        [
          "IA et humains dans le même fil",
          "Statut lu et non lu",
          "Conversations actives, en attente ou fermées",
          "Gestion automatique de l'inactivité",
        ],
        "MoAssist boîte de réception et cycle de conversation",
        "Image de remplacement de la boîte partagée MoAssist",
      ),
      createFeature(
        "feature-install-launch",
        "Installation et lancement",
        "Déployez le chatbot sur votre site, votre boutique ou votre espace client.",
        "Installez-le avec un script ou un iframe, choisissez la langue principale et les langues supplémentaires, puis contrôlez les domaines autorisés.",
        [
          "Installation par script ou iframe",
          "Langue principale et langues supplémentaires",
          "Contrôle des domaines autorisés",
          "Déploiement rapide sur zones publiques et privées",
        ],
        "MoAssist installation et lancement",
        "Image de remplacement d'installation MoAssist",
      ),
    ],
    reasonsSection: {
      eyebrow: "Pourquoi MoAssist",
      title: "Pourquoi les équipes commerciales et support choisissent MoAssist.",
      body: "Choisissez MoAssist si vous avez besoin d'un système unique pour les questions avant-vente, la collecte de leads, le support, l'aide aux clients connectés et la reprise par l'équipe.",
    },
    reasonCards: [
      {
        title: "Un seul système au lieu de plusieurs outils",
        body: "Créez, entraînez, publiez et gérez vos chatbots depuis le même endroit.",
      },
      {
        title: "Conçu pour les entreprises qui vendent",
        body: "MoAssist est pensé pour les boutiques et équipes commerciales, pas pour un simple widget générique.",
      },
      {
        title: "Chaque chatbot peut suivre votre activité",
        body: "Chaque chatbot peut avoir son propre style, contenu, configuration de langues et comportement.",
      },
      {
        title: "Des réponses plus rapides sans perdre le contrôle",
        body: "L'IA répond aux questions courantes pendant que votre équipe garde la main sur le ton et la reprise.",
      },
      {
        title: "Un meilleur support pour les clients existants",
        body: "MoAssist fonctionne aussi dans les espaces clients connectés.",
      },
      {
        title: "Utile sur tout le parcours client",
        body: "Utilisez une seule plateforme pour les questions produit, les leads, le support et l'accompagnement client continu.",
      },
    ],
    workflowSection: {
      processLabel: "Processus",
      title: "Un parcours simple, de la configuration aux conversations en direct.",
      body: "Faites défiler les étapes pour voir comment un chatbot passe de la mise en place à la communication quotidienne avec vos clients.",
    },
    workflowSteps: [
      {
        step: "Étape 01",
        label: "Créer",
        title: "Créez un chatbot pour le flux commercial ou support exact dont vous avez besoin",
        body: "Définissez le nom, l'objectif, le message d'accueil, les questions suggérées et les réglages de base.",
      },
      {
        step: "Étape 02",
        label: "Former",
        title: "Importez vos connaissances et définissez la façon de répondre",
        body: "Ajoutez des documents, choisissez le style de réponse et rédigez des consignes claires.",
      },
      {
        step: "Étape 03",
        label: "Personnaliser",
        title: "Personnalisez le chatbot et choisissez les données clients à collecter",
        body: "Ajustez l'interface, les couleurs, les textes, les champs de formulaire et les langues pour rester cohérent avec votre marque.",
      },
      {
        step: "Étape 04",
        label: "Lancer",
        title: "Publiez le chatbot et gérez de vraies conversations clients",
        body: "Installez-le sur votre site ou espace client, aidez les utilisateurs connectés et laissez l'IA et votre équipe répondre depuis un seul endroit.",
      },
    ],
    useCasesSection: {
      eyebrow: "Cas d'usage",
      title: "Pour qui MoAssist est conçu.",
      body: "MoAssist est conçu pour les boutiques en ligne et les entreprises qui vendent des produits ou services et veulent mieux parler aux visiteurs, prospects, acheteurs et clients connectés.",
    },
    useCases: [
      {
        title: "Support client et centre d'aide",
        body: "Répondez aux questions fréquentes, utilisez vos contenus importés et laissez un agent intervenir quand c'est nécessaire.",
      },
      {
        title: "Vente et qualification de leads",
        body: "Répondez aux questions d'achat, collectez les coordonnées et transmettez les leads qualifiés à l'équipe avec du contexte.",
      },
      {
        title: "Portails clients et espaces membres",
        body: "Aidez les clients connectés dans votre produit, portail ou espace compte.",
      },
      {
        title: "Workflows internes et de service",
        body: "Utilisez le tableau de bord comme centre de contrôle pour les conversations IA et humaines.",
      },
    ],
    faqSection: {
      eyebrow: "FAQ",
      title: "Questions fréquentes sur MoAssist.",
      body: "Voici les questions que les équipes posent le plus souvent avant de lancer un chatbot pour la vente, le support ou l'aide aux clients connectés.",
    },
    faqItems: [
      {
        question: "Qu'est-ce que MoAssist ?",
        answer:
          "MoAssist est une plateforme pour les boutiques en ligne et les entreprises commerciales qui veulent créer des chatbots pour site web, espace client, support et communication commerciale.",
      },
      {
        question: "Puis-je créer plusieurs chatbots ?",
        answer:
          "Oui. Vous pouvez créer des chatbots séparés pour différentes boutiques, marques, produits, langues ou parcours clients.",
      },
      {
        question: "Puis-je importer des documents pour que le chatbot connaisse mon activité ?",
        answer:
          "Oui. Vous pouvez importer des documents et fichiers pour que le chatbot réponde à partir de vos contenus métier.",
      },
      {
        question: "Puis-je personnaliser le chatbot sur mon site ?",
        answer:
          "Oui. Vous pouvez personnaliser le design, les couleurs, les icônes, le lanceur, les textes, le thème et l'emplacement.",
      },
      {
        question: "Puis-je collecter des données clients avec le chatbot ?",
        answer:
          "Oui. Vous pouvez collecter noms, e-mails et autres champs personnalisés via des formulaires intégrés au chat.",
      },
      {
        question: "Puis-je relier le chatbot aux utilisateurs connectés et à mon workflow interne ?",
        answer:
          "Oui. MoAssist peut garder la conversation liée au bon client connecté et s'intégrer à votre workflow de support.",
      },
      {
        question: "L'IA et les agents humains peuvent-ils répondre dans la même conversation ?",
        answer:
          "Oui. Les réponses IA et humaines restent dans le même fil, et la boîte de réception montre l'auteur et le statut de lecture.",
      },
      {
        question: "Que se passe-t-il lorsqu'un client devient inactif ?",
        answer:
          "La conversation peut passer automatiquement entre active, en attente et fermée selon vos règles d'inactivité et votre offre.",
      },
      {
        question: "Pourquoi les entreprises choisissent-elles MoAssist ?",
        answer:
          "Parce que MoAssist réunit création de chatbots, import de connaissances, collecte de leads, support des clients connectés et réponses IA et humaines dans un seul produit.",
      },
    ],
    ctaSection: {
      eyebrow: "Commencer",
      title: "Commencez avec un chatbot, puis développez un meilleur flux de vente et de support.",
      body: "Si vous cherchez une plateforme pour créer des chatbots, importer vos connaissances métier, personnaliser l'interface, collecter des données clients, aider les utilisateurs connectés et gérer les réponses IA et humaines depuis un tableau de bord, MoAssist est conçu pour cela.",
    },
    footerTagline: "Chatbots IA pour boutiques en ligne et équipes support.",
    footerColumns: createFooterColumns(
      {
        title: "Produit",
        links: [
          { label: "Tableau de bord", href: "/chatbots" },
          { label: "Connexion", href: "/login" },
          { label: "Support", href: "mailto:support@momicro.ai" },
        ],
      },
      {
        title: "Explorer",
        links: [
          { label: "Fonctionnalités", href: "#features" },
          { label: "Comment ça marche", href: "#how-it-works" },
          { label: "FAQ", href: "#faq" },
        ],
      },
      {
        title: "Juridique",
        links: [
          { label: "Politique de confidentialité", href: "/privacy-policy" },
          { label: "Mentions légales", href: "/imprint" },
          { label: "Conditions générales", href: "/terms-and-conditions" },
        ],
      },
    ),
    imagePlaceholderLabel: "Visuel à remplacer",
    imagePlaceholderBody: "Remplacez cet espace par votre capture produit finale.",
    stepPlaceholderLabel: "Étape visuelle",
    stepPlaceholderBody: "Remplacez cet espace par votre visuel de workflow final.",
    heroImageTitle: "Tableau de bord chatbot IA MoAssist",
    heroImageAlt: "Image de remplacement du tableau de bord chatbot IA MoAssist",
  },
  gr: {
    seo: {
      title: "MoAssist | Chatbots AI για ηλεκτρονικά καταστήματα και επιχειρήσεις που πουλάνε",
      description:
        "Το MoAssist βοηθά ηλεκτρονικά καταστήματα και επιχειρήσεις που πουλάνε προϊόντα ή υπηρεσίες να δημιουργούν branded chatbots, να απαντούν με τη δική τους γνώση, να συλλέγουν leads, να υποστηρίζουν συνδεδεμένους πελάτες και να διαχειρίζονται συνομιλίες AI και ανθρώπων από ένα dashboard.",
      keywords:
        "chatbot για eshop, ecommerce chatbot, sales chatbot, support chatbot, AI chatbot για επιχειρήσεις, chatbot συλλογής leads, chatbot για portal πελατών, chatbot γνώσης, πολύγλωσσο chatbot, branded chatbot ιστοσελίδας",
      ogDescription:
        "Δημιουργήστε chatbot για κάθε κατάστημα ή εμπορική ροή, εκπαιδεύστε το με έγγραφα, συλλέξτε στοιχεία πελατών και διαχειριστείτε απαντήσεις AI και ομάδας από ένα dashboard.",
      twitterDescription:
        "Chatbots AI για ηλεκτρονικά καταστήματα και ομάδες πωλήσεων. Εκπαίδευση με έγγραφα, συλλογή leads, υποστήριξη πελατών και διαχείριση AI και ανθρώπινων απαντήσεων σε ένα μέρος.",
    },
    appDescription:
      "Το MoAssist είναι πλατφόρμα chatbot για ηλεκτρονικά καταστήματα και εμπορικές επιχειρήσεις που θέλουν πιο γρήγορες απαντήσεις, περισσότερα leads και καλύτερη υποστήριξη πελατών.",
    heroPill: "Για Ηλεκτρονικά Καταστήματα Και Επιχειρήσεις Που Πουλάνε",
    heroTitle: "Ένας καλύτερος τρόπος να μιλάτε με αγοραστές, leads και πελάτες.",
    heroBody:
      "Δημιουργήστε branded chatbot για κάθε κατάστημα ή εμπορική ροή, εκπαιδεύστε το με τα έγγραφά σας, συλλέξτε στοιχεία πελατών, υποστηρίξτε συνδεδεμένους χρήστες και διαχειριστείτε απαντήσεις AI και ομάδας από ένα σημείο.",
    heroHighlights: [
      { title: "Chatbots ανά κατάστημα", href: "#feature-individual-chatbots" },
      { title: "Απαντήσεις από γνώση", href: "#feature-knowledge-ai" },
      { title: "Συλλογή leads", href: "#feature-lead-capture" },
      { title: "Inbox ομάδας", href: "#feature-support-workflow" },
    ],
    coreBenefits: [
      {
        title: "Ξεχωριστό chatbot για κάθε κατάστημα, brand ή εμπορική ροή",
        body: "Ορίστε μήνυμα υποδοχής, prompts, λογότυπο, χρώματα, launcher, θέση και κατάσταση δημοσίευσης για κάθε chatbot.",
      },
      {
        title: "Απαντήσεις με το δικό σας επιχειρηματικό υλικό",
        body: "Ανεβάστε οδηγούς, πληροφορίες προϊόντων, πολιτικές και άλλα έγγραφα ώστε το chatbot να απαντά με πραγματικό context.",
      },
      {
        title: "Πωλήσεις και υποστήριξη σε ένα σύστημα",
        body: "Συλλέξτε leads, βοηθήστε συνδεδεμένους πελάτες και αφήστε το AI και την ομάδα σας να δουλεύουν στο ίδιο inbox.",
      },
    ],
    featuresSection: {
      eyebrow: "Τι μπορείτε να κάνετε",
      title:
        "Όλα όσα χρειάζεστε για να δημιουργήσετε, να εκπαιδεύσετε, να δημοσιεύσετε και να διαχειριστείτε εξατομικευμένα chatbots.",
      body: "Το MoAssist είναι φτιαγμένο για ηλεκτρονικά καταστήματα και επιχειρήσεις που πουλάνε προϊόντα ή υπηρεσίες. Βοηθά τις ομάδες να μιλάνε με επισκέπτες, leads, αγοραστές και υπάρχοντες πελάτες μέσα από μία ενιαία ροή.",
    },
    featureSections: [
      createFeature(
        "feature-individual-chatbots",
        "Builder chatbot",
        "Δημιουργήστε ξεχωριστό chatbot για κάθε κατάστημα, σειρά προϊόντων, brand ή διαδρομή πελάτη.",
        "Κάθε chatbot μπορεί να έχει δικό του όνομα, πρώτο μήνυμα, προτεινόμενες ερωτήσεις, λογότυπο, εικονίδιο, χρώματα, θέμα, θέση, γλώσσες και επιτρεπόμενα domains.",
        [
          "Ξεχωριστό chatbot ανά project",
          "Ροή draft και publish",
          "Έλεγχος λογοτύπου, εικονιδίου και launcher",
          "Themes, γλώσσες και κανόνες domain",
        ],
        "MoAssist builder chatbot",
        "Εικόνα placeholder για builder chatbot του MoAssist",
      ),
      createFeature(
        "feature-knowledge-ai",
        "Γνώση και απαντήσεις AI",
        "Ανεβάστε έγγραφα ώστε το chatbot να απαντά με πραγματικό επιχειρηματικό context.",
        "Προσθέστε έγγραφα και αρχεία, ενεργοποιήστε απαντήσεις AI όταν το πλάνο σας το επιτρέπει, επιλέξτε μήκος απάντησης και ορίστε οδηγίες για να αποφεύγονται πρόχειρες απαντήσεις.",
        [
          "Ανέβασμα εγγράφων και αρχείων",
          "Οδηγίες απάντησης και τόνος",
          "Σύντομες, μεσαίες ή μεγάλες απαντήσεις",
          "Πιο γρήγορες πρώτες απαντήσεις",
        ],
        "MoAssist γνώση και ρυθμίσεις AI",
        "Εικόνα placeholder γνώσης MoAssist",
      ),
      createFeature(
        "feature-lead-capture",
        "Συλλογή leads και στοιχείων πελατών",
        "Συλλέξτε ονόματα, email και άλλα στοιχεία πελατών μέσα στο chat.",
        "Δημιουργήστε δική σας φόρμα, επιλέξτε τα πεδία που χρειάζεστε, ορίστε ποια είναι υποχρεωτικά και χρησιμοποιήστε το chat για qualification, support intake και αιτήματα επικοινωνίας.",
        [
          "Προσαρμοσμένες φόρμες",
          "Υποχρεωτικά και προαιρετικά πεδία",
          "Qualification και support intake",
          "Στοιχεία πελάτη μέσα στη συνομιλία",
        ],
        "MoAssist συλλογή leads και στοιχείων",
        "Εικόνα placeholder για συλλογή leads MoAssist",
      ),
      createFeature(
        "feature-logged-in-users",
        "Συνδεδεμένοι χρήστες και εσωτερικές ροές",
        "Υποστηρίξτε υπάρχοντες πελάτες με chatbot που αναγνωρίζει ποιος είναι ήδη συνδεδεμένος.",
        "Το MoAssist μπορεί να κρατήσει τη συνομιλία συνδεδεμένη με τον σωστό πελάτη. Έτσι μπορείτε να προσφέρετε πραγματική βοήθεια μέσα στην περιοχή πελάτη και να εντάξετε το chat στη δική σας εσωτερική ροή.",
        [
          "Αναγνώριση συνδεδεμένων πελατών",
          "Χρήση chat στην περιοχή πελάτη",
          "Σύνδεση με admin workflow",
          "Περισσότερο context από ανώνυμο chat",
        ],
        "MoAssist υποστήριξη συνδεδεμένων πελατών",
        "Εικόνα placeholder για υποστήριξη συνδεδεμένων πελατών",
      ),
      createFeature(
        "feature-support-workflow",
        "Inbox AI και ομάδας",
        "Αφήστε το AI να απαντά πρώτο και την ομάδα σας να αναλαμβάνει όταν χρειάζεται άνθρωπος.",
        "Οι απαντήσεις AI και ανθρώπων μένουν στο ίδιο inbox. Βλέπετε ποιος έγραψε, αν το μήνυμα διαβάστηκε και αν η συνομιλία είναι ενεργή, σε αναμονή ή κλειστή.",
        [
          "AI και άνθρωποι στο ίδιο thread",
          "Κατάσταση διαβασμένου και αδιάβαστου",
          "Ενεργές, σε αναμονή και κλειστές συνομιλίες",
          "Αυτόματος χειρισμός αδράνειας",
        ],
        "MoAssist inbox και κύκλος συνομιλίας",
        "Εικόνα placeholder για κοινό inbox MoAssist",
      ),
      createFeature(
        "feature-install-launch",
        "Εγκατάσταση και launch",
        "Βάλτε το chatbot στο site, στο κατάστημα ή στην περιοχή πελάτη σας.",
        "Εγκαταστήστε το με script ή iframe, επιλέξτε βασική και επιπλέον γλώσσες και ελέγξτε ποια domains επιτρέπεται να το φορτώνουν.",
        [
          "Εγκατάσταση με script ή iframe",
          "Βασική και επιπλέον γλώσσες",
          "Έλεγχος επιτρεπόμενων domains",
          "Γρήγορο rollout σε δημόσιες και ιδιωτικές περιοχές",
        ],
        "MoAssist εγκατάσταση και launch",
        "Εικόνα placeholder εγκατάστασης MoAssist",
      ),
    ],
    reasonsSection: {
      eyebrow: "Γιατί MoAssist",
      title: "Γιατί ομάδες πωλήσεων και υποστήριξης επιλέγουν το MoAssist.",
      body: "Επιλέξτε το MoAssist αν χρειάζεστε ένα σύστημα για ερωτήσεις πριν την πώληση, συλλογή leads, υποστήριξη, βοήθεια σε συνδεδεμένους χρήστες και takeover από την ομάδα.",
    },
    reasonCards: [
      {
        title: "Ένα σύστημα αντί για πολλά εργαλεία",
        body: "Δημιουργία, εκπαίδευση, δημοσίευση και διαχείριση από ένα σημείο.",
      },
      {
        title: "Φτιαγμένο για επιχειρήσεις που πουλάνε",
        body: "Το MoAssist είναι για καταστήματα και εμπορικές ομάδες, όχι για ένα απλό generic chat widget.",
      },
      {
        title: "Κάθε chatbot ταιριάζει στην επιχείρηση",
        body: "Κάθε chatbot μπορεί να έχει δικό του στιλ, περιεχόμενο, γλώσσες και συμπεριφορά.",
      },
      {
        title: "Πιο γρήγορες απαντήσεις χωρίς απώλεια ελέγχου",
        body: "Το AI απαντά στις συχνές ερωτήσεις, ενώ η ομάδα κρατά τον έλεγχο του tone και του takeover.",
      },
      {
        title: "Καλύτερη εξυπηρέτηση για υπάρχοντες πελάτες",
        body: "Το MoAssist λειτουργεί και για συνδεδεμένους χρήστες μέσα στην περιοχή πελάτη.",
      },
      {
        title: "Χρήσιμο σε όλη τη διαδρομή πελάτη",
        body: "Χρησιμοποιήστε μία πλατφόρμα για ερωτήσεις προϊόντων, leads, υποστήριξη και συνεχή εξυπηρέτηση πελατών.",
      },
    ],
    workflowSection: {
      processLabel: "Διαδικασία",
      title: "Μία απλή ροή από το setup μέχρι τις ζωντανές συνομιλίες.",
      body: "Κάντε scroll στα βήματα για να δείτε πώς ένα chatbot περνά από τη ρύθμιση στην καθημερινή επικοινωνία με πελάτες.",
    },
    workflowSteps: [
      {
        step: "Βήμα 01",
        label: "Δημιουργία",
        title: "Δημιουργήστε chatbot για την ακριβή εμπορική ή υποστηρικτική ροή που χρειάζεστε",
        body: "Ορίστε όνομα, σκοπό, πρώτο μήνυμα, προτεινόμενες ερωτήσεις και βασικές ρυθμίσεις.",
      },
      {
        step: "Βήμα 02",
        label: "Εκπαίδευση",
        title: "Ανεβάστε γνώση και ορίστε πώς πρέπει να απαντά το chatbot",
        body: "Προσθέστε έγγραφα, επιλέξτε ύφος απάντησης και γράψτε καθαρές οδηγίες.",
      },
      {
        step: "Βήμα 03",
        label: "Προσαρμογή",
        title: "Προσαρμόστε το chatbot και επιλέξτε ποια στοιχεία πελατών θα συλλέγετε",
        body: "Ρυθμίστε interface, χρώματα, κείμενα, πεδία φόρμας και γλώσσες ώστε η εμπειρία να ταιριάζει με το brand σας.",
      },
      {
        step: "Βήμα 04",
        label: "Launch",
        title: "Δημοσιεύστε το chatbot και διαχειριστείτε πραγματικές συνομιλίες πελατών",
        body: "Εγκαταστήστε το στο site ή στην περιοχή πελάτη σας, βοηθήστε συνδεδεμένους χρήστες και αφήστε το AI και την ομάδα σας να απαντούν από ένα σημείο.",
      },
    ],
    useCasesSection: {
      eyebrow: "Περιπτώσεις χρήσης",
      title: "Για ποιον είναι το MoAssist.",
      body: "Το MoAssist είναι για ηλεκτρονικά καταστήματα και επιχειρήσεις που πουλάνε προϊόντα ή υπηρεσίες και χρειάζονται καλύτερη επικοινωνία με επισκέπτες, leads, αγοραστές και συνδεδεμένους πελάτες.",
    },
    useCases: [
      {
        title: "Υποστήριξη πελατών και help center",
        body: "Απαντήστε σε συχνές ερωτήσεις, χρησιμοποιήστε τη γνώση που ανεβάσατε και αφήστε ανθρώπους να αναλάβουν όταν χρειάζεται.",
      },
      {
        title: "Πωλήσεις και qualification leads",
        body: "Απαντήστε σε ερωτήσεις αγοράς, συλλέξτε στοιχεία επικοινωνίας και περάστε ποιοτικά leads στην ομάδα με context.",
      },
      {
        title: "Portals πελατών και member areas",
        body: "Υποστηρίξτε συνδεδεμένους πελάτες μέσα στο προϊόν, το portal ή τον λογαριασμό σας.",
      },
      {
        title: "Εσωτερικές ροές admin και service",
        body: "Χρησιμοποιήστε το dashboard ως κέντρο ελέγχου για συνομιλίες AI και ανθρώπων.",
      },
    ],
    faqSection: {
      eyebrow: "FAQ",
      title: "Συχνές ερωτήσεις για το MoAssist.",
      body: "Αυτές είναι οι ερωτήσεις που κάνουν πιο συχνά οι ομάδες πριν ξεκινήσουν chatbot για πωλήσεις, υποστήριξη ή εξυπηρέτηση συνδεδεμένων πελατών.",
    },
    faqItems: [
      {
        question: "Τι είναι το MoAssist;",
        answer:
          "Το MoAssist είναι πλατφόρμα για ηλεκτρονικά καταστήματα και εμπορικές επιχειρήσεις που θέλουν chatbots για ιστοσελίδα, περιοχή πελάτη, υποστήριξη και εμπορική επικοινωνία.",
      },
      {
        question: "Μπορώ να δημιουργήσω πάνω από ένα chatbot;",
        answer:
          "Ναι. Μπορείτε να δημιουργήσετε ξεχωριστά chatbots για διαφορετικά καταστήματα, brands, προϊόντα, γλώσσες ή customer journeys.",
      },
      {
        question: "Μπορώ να ανεβάσω έγγραφα ώστε το chatbot να γνωρίζει την επιχείρησή μου;",
        answer:
          "Ναι. Μπορείτε να ανεβάσετε έγγραφα και αρχεία ώστε το chatbot να απαντά από το δικό σας επιχειρηματικό υλικό.",
      },
      {
        question: "Μπορώ να προσαρμόσω το chatbot στο site μου;",
        answer:
          "Ναι. Μπορείτε να προσαρμόσετε design, χρώματα, icons, launcher, κείμενα, theme και θέση.",
      },
      {
        question: "Μπορώ να συλλέγω στοιχεία πελατών με το chatbot;",
        answer:
          "Ναι. Μπορείτε να συλλέγετε ονόματα, emails και άλλα custom πεδία με φόρμες μέσα στο chat.",
      },
      {
        question: "Μπορώ να συνδέσω το chatbot με συνδεδεμένους χρήστες και το δικό μου admin flow;",
        answer:
          "Ναι. Το MoAssist μπορεί να κρατά τη συνομιλία συνδεδεμένη με τον σωστό πελάτη και να ταιριάζει στη ροή υποστήριξής σας.",
      },
      {
        question: "Μπορούν AI και άνθρωποι να απαντούν στην ίδια συνομιλία;",
        answer:
          "Ναι. Οι απαντήσεις AI και ανθρώπων μένουν στο ίδιο thread και το inbox δείχνει ποιος έγραψε και αν διαβάστηκε το μήνυμα.",
      },
      {
        question: "Τι συμβαίνει όταν ένας πελάτης μείνει ανενεργός;",
        answer:
          "Η συνομιλία μπορεί να αλλάζει αυτόματα μεταξύ ενεργής, σε αναμονή και κλειστής ανάλογα με τους κανόνες αδράνειας και το πλάνο σας.",
      },
      {
        question: "Γιατί οι επιχειρήσεις επιλέγουν το MoAssist;",
        answer:
          "Γιατί ενώνει δημιουργία chatbot, ανέβασμα γνώσης, συλλογή leads, υποστήριξη συνδεδεμένων πελατών και απαντήσεις AI και ανθρώπων σε ένα προϊόν.",
      },
    ],
    ctaSection: {
      eyebrow: "Ξεκινήστε",
      title: "Ξεκινήστε με ένα chatbot και εξελίξτε το σε καλύτερη ροή πωλήσεων και υποστήριξης.",
      body: "Αν χρειάζεστε πλατφόρμα για να δημιουργείτε chatbots, να ανεβάζετε επιχειρηματική γνώση, να προσαρμόζετε το interface, να συλλέγετε στοιχεία πελατών, να υποστηρίζετε συνδεδεμένους χρήστες και να διαχειρίζεστε απαντήσεις AI και ομάδας από ένα dashboard, το MoAssist είναι φτιαγμένο γι' αυτό.",
    },
    footerTagline: "Chatbots AI για ηλεκτρονικά καταστήματα και ομάδες υποστήριξης.",
    footerColumns: createFooterColumns(
      {
        title: "Προϊόν",
        links: [
          { label: "Dashboard", href: "/chatbots" },
          { label: "Σύνδεση", href: "/login" },
          { label: "Υποστήριξη", href: "mailto:support@momicro.ai" },
        ],
      },
      {
        title: "Εξερεύνηση",
        links: [
          { label: "Λειτουργίες", href: "#features" },
          { label: "Πώς λειτουργεί", href: "#how-it-works" },
          { label: "FAQ", href: "#faq" },
        ],
      },
      {
        title: "Νομικά",
        links: [
          { label: "Πολιτική απορρήτου", href: "/privacy-policy" },
          { label: "Στοιχεία εταιρείας", href: "/imprint" },
          { label: "Όροι και προϋποθέσεις", href: "/terms-and-conditions" },
        ],
      },
    ),
    imagePlaceholderLabel: "Placeholder εικόνας",
    imagePlaceholderBody: "Αντικαταστήστε αυτό το placeholder με το τελικό screenshot του προϊόντος σας.",
    stepPlaceholderLabel: "Placeholder βήματος",
    stepPlaceholderBody: "Αντικαταστήστε αυτό το placeholder με την τελική εικόνα του workflow σας.",
    heroImageTitle: "Dashboard chatbot AI του MoAssist",
    heroImageAlt: "Placeholder εικόνα dashboard chatbot AI του MoAssist",
  },
  it: {
    seo: {
      title: "MoAssist | Chatbot AI per ecommerce e aziende che vendono",
      description:
        "MoAssist aiuta ecommerce e aziende che vendono prodotti o servizi a creare chatbot brandizzati, rispondere con la propria conoscenza aziendale, raccogliere lead, assistere clienti autenticati e gestire conversazioni AI e umane da un solo dashboard.",
      keywords:
        "chatbot ecommerce, chatbot per negozio online, chatbot vendite, chatbot supporto, chatbot AI per aziende, chatbot lead generation, chatbot portale clienti, chatbot knowledge base, chatbot multilingua, chatbot brandizzato",
      ogDescription:
        "Crea un chatbot per ogni negozio o funnel di vendita, addestralo con i tuoi documenti, raccogli dati clienti e gestisci risposte AI e del team da un solo dashboard.",
      twitterDescription:
        "Chatbot AI per ecommerce e team commerciali. Addestramento con documenti, raccolta lead, supporto clienti e gestione di risposte AI e umane in un unico posto.",
    },
    appDescription:
      "MoAssist è una piattaforma chatbot per ecommerce e aziende commerciali che vogliono rispondere più velocemente, raccogliere più lead e offrire un supporto migliore.",
    heroPill: "Per Ecommerce E Aziende Che Vendono",
    heroTitle: "Un modo migliore per parlare con visitatori, lead e clienti.",
    heroBody:
      "Crea un chatbot brandizzato per ogni negozio o funnel commerciale, addestralo con i tuoi documenti, raccogli dati clienti, supporta utenti autenticati e gestisci risposte AI e del team da un solo punto.",
    heroHighlights: [
      { title: "Chatbot per negozio", href: "#feature-individual-chatbots" },
      { title: "Risposte dalla tua conoscenza", href: "#feature-knowledge-ai" },
      { title: "Raccolta lead", href: "#feature-lead-capture" },
      { title: "Inbox del team", href: "#feature-support-workflow" },
    ],
    coreBenefits: [
      {
        title: "Un chatbot diverso per ogni negozio, brand o funnel",
        body: "Configura messaggio iniziale, prompt, logo, colori, launcher, posizione e stato di pubblicazione per ogni chatbot.",
      },
      {
        title: "Risposte basate sui tuoi contenuti aziendali",
        body: "Carica guide, informazioni prodotto, policy e altri documenti per far rispondere il chatbot con contesto reale.",
      },
      {
        title: "Vendite e supporto nello stesso sistema",
        body: "Raccogli lead, aiuta clienti autenticati e lascia che AI e team lavorino nella stessa inbox conversazionale.",
      },
    ],
    featuresSection: {
      eyebrow: "Cosa puoi fare",
      title:
        "Tutto quello che serve per creare, addestrare, pubblicare e gestire chatbot personalizzati.",
      body: "MoAssist è pensato per ecommerce e aziende che vendono prodotti o servizi. Aiuta i team a parlare con visitatori, lead, acquirenti e clienti esistenti in un unico flusso connesso.",
    },
    featureSections: [
      createFeature(
        "feature-individual-chatbots",
        "Builder chatbot",
        "Crea un chatbot separato per ogni negozio, linea prodotto, brand o percorso cliente.",
        "Ogni chatbot può avere nome, primo messaggio, domande suggerite, logo, icona, colori, tema, posizione, lingue e domini consentiti.",
        [
          "Un chatbot per ogni progetto",
          "Bozza e pubblicazione",
          "Controllo di logo, icona e launcher",
          "Temi, lingue e regole dominio",
        ],
        "MoAssist builder chatbot",
        "Immagine segnaposto del builder chatbot MoAssist",
      ),
      createFeature(
        "feature-knowledge-ai",
        "Conoscenza e risposte AI",
        "Carica documenti così il chatbot risponde con contesto reale.",
        "Aggiungi documenti e file, attiva le risposte AI se il piano lo consente, scegli la lunghezza delle risposte e definisci linee guida per evitare risposte improvvisate.",
        [
          "Upload di documenti e file",
          "Istruzioni e tono delle risposte",
          "Risposte brevi, medie o lunghe",
          "Prime risposte più rapide",
        ],
        "MoAssist conoscenza e impostazioni AI",
        "Immagine segnaposto della conoscenza MoAssist",
      ),
      createFeature(
        "feature-lead-capture",
        "Lead capture e dati cliente",
        "Raccogli nomi, email e altri dati direttamente nella chat.",
        "Crea il tuo modulo, scegli i campi necessari, decidi quali sono obbligatori e usa la chat per qualificare lead, gestire richieste di supporto e raccogliere contatti.",
        [
          "Moduli personalizzati",
          "Campi obbligatori e opzionali",
          "Qualifica lead e support intake",
          "Dati cliente salvati nella conversazione",
        ],
        "MoAssist lead capture e dati cliente",
        "Immagine segnaposto lead capture MoAssist",
      ),
      createFeature(
        "feature-logged-in-users",
        "Utenti autenticati e workflow interni",
        "Supporta clienti esistenti con un chatbot che riconosce chi ha già effettuato l'accesso.",
        "MoAssist può mantenere la conversazione collegata al cliente giusto. Così puoi offrire vero supporto nell'area clienti e inserire la chat nel tuo workflow interno.",
        [
          "Riconoscere clienti autenticati",
          "Usare la chat nell'area clienti",
          "Integrare la chat con il workflow interno",
          "Più contesto rispetto a una chat anonima",
        ],
        "MoAssist supporto per clienti autenticati",
        "Immagine segnaposto supporto clienti autenticati MoAssist",
      ),
      createFeature(
        "feature-support-workflow",
        "Inbox AI e team",
        "Lascia che l'AI risponda per prima e che il team intervenga quando serve una persona.",
        "Le risposte AI e umane restano nella stessa inbox. Puoi vedere chi ha scritto, se il messaggio è stato letto e se la conversazione è attiva, in attesa o chiusa.",
        [
          "AI e umani nello stesso thread",
          "Stato letto e non letto",
          "Conversazioni attive, in attesa o chiuse",
          "Gestione automatica dell'inattività",
        ],
        "MoAssist inbox e ciclo conversazione",
        "Immagine segnaposto inbox condivisa MoAssist",
      ),
      createFeature(
        "feature-install-launch",
        "Installazione e lancio",
        "Pubblica il chatbot sul tuo sito, store o area clienti.",
        "Installalo con script o iframe, scegli lingua principale e lingue extra e controlla quali domini possono caricarlo.",
        [
          "Installazione via script o iframe",
          "Lingua principale e lingue extra",
          "Controllo domini consentiti",
          "Rollout rapido in aree pubbliche e private",
        ],
        "MoAssist installazione e lancio",
        "Immagine segnaposto installazione MoAssist",
      ),
    ],
    reasonsSection: {
      eyebrow: "Perché MoAssist",
      title: "Perché i team commerciali e di supporto scelgono MoAssist.",
      body: "Scegli MoAssist se ti serve un sistema unico per domande pre-vendita, lead capture, supporto, aiuto per utenti autenticati e presa in carico del team.",
    },
    reasonCards: [
      {
        title: "Un solo sistema invece di molti strumenti scollegati",
        body: "Crea, addestra, pubblica e gestisci chatbot da un unico posto.",
      },
      {
        title: "Pensato per aziende che vendono",
        body: "MoAssist è per ecommerce e team commerciali, non per una semplice chat generica.",
      },
      {
        title: "Ogni chatbot può adattarsi al business",
        body: "Ogni chatbot può avere stile, contenuti, lingue e comportamento propri.",
      },
      {
        title: "Risposte più rapide senza perdere il controllo",
        body: "L'AI gestisce le domande frequenti mentre il team mantiene il controllo su tono e takeover.",
      },
      {
        title: "Supporto migliore per clienti esistenti",
        body: "MoAssist funziona anche per utenti autenticati dentro l'area clienti.",
      },
      {
        title: "Utile lungo tutto il percorso cliente",
        body: "Usa un'unica piattaforma per domande prodotto, lead, supporto e customer care continuo.",
      },
    ],
    workflowSection: {
      processLabel: "Processo",
      title: "Un flusso semplice dalla configurazione alle conversazioni reali.",
      body: "Scorri i passaggi per vedere come un chatbot passa dal setup alla comunicazione quotidiana con i clienti.",
    },
    workflowSteps: [
      {
        step: "Step 01",
        label: "Crea",
        title: "Crea un chatbot per il flusso commerciale o di supporto che ti serve",
        body: "Definisci nome, obiettivo, primo messaggio, domande suggerite e impostazioni base.",
      },
      {
        step: "Step 02",
        label: "Addestra",
        title: "Carica conoscenza e definisci come deve rispondere il chatbot",
        body: "Aggiungi documenti, scegli lo stile di risposta e scrivi istruzioni chiare.",
      },
      {
        step: "Step 03",
        label: "Personalizza",
        title: "Personalizza il chatbot e scegli quali dati cliente raccogliere",
        body: "Regola interfaccia, colori, testi, campi del modulo e lingue per farlo aderire al tuo brand.",
      },
      {
        step: "Step 04",
        label: "Lancia",
        title: "Pubblica il chatbot e gestisci conversazioni reali con i clienti",
        body: "Installalo sul sito o nell'area clienti, aiuta utenti autenticati e lascia che AI e team rispondano da un unico punto.",
      },
    ],
    useCasesSection: {
      eyebrow: "Casi d'uso",
      title: "Per chi è MoAssist.",
      body: "MoAssist è per ecommerce e aziende che vendono prodotti o servizi e vogliono parlare meglio con visitatori, lead, acquirenti e clienti autenticati.",
    },
    useCases: [
      {
        title: "Supporto clienti e help center",
        body: "Rispondi alle domande frequenti, usa la conoscenza caricata e fai intervenire agenti umani quando serve.",
      },
      {
        title: "Vendite e qualificazione lead",
        body: "Rispondi alle domande d'acquisto, raccogli contatti e passa lead qualificati al team con contesto.",
      },
      {
        title: "Portali clienti e aree riservate",
        body: "Supporta clienti autenticati dentro prodotto, portale o area account.",
      },
      {
        title: "Workflow interni e di servizio",
        body: "Usa il dashboard come centro di controllo per conversazioni AI e umane.",
      },
    ],
    faqSection: {
      eyebrow: "FAQ",
      title: "Domande frequenti su MoAssist.",
      body: "Queste sono le domande che i team fanno più spesso prima di lanciare un chatbot per vendite, supporto o assistenza a clienti autenticati.",
    },
    faqItems: [
      {
        question: "Che cos'è MoAssist?",
        answer:
          "MoAssist è una piattaforma per ecommerce e aziende commerciali che vogliono creare chatbot per siti web, aree clienti, supporto e comunicazione commerciale.",
      },
      {
        question: "Posso creare più di un chatbot?",
        answer:
          "Sì. Puoi creare chatbot separati per diversi negozi, brand, prodotti, lingue o customer journey.",
      },
      {
        question: "Posso caricare documenti così il chatbot conosce il mio business?",
        answer:
          "Sì. Puoi caricare documenti e file così il chatbot risponde dai tuoi contenuti aziendali.",
      },
      {
        question: "Posso personalizzare il chatbot sul mio sito?",
        answer:
          "Sì. Puoi personalizzare design, colori, icone, launcher, testi, tema e posizione.",
      },
      {
        question: "Posso raccogliere dati cliente con il chatbot?",
        answer:
          "Sì. Puoi raccogliere nomi, email e altri campi personalizzati con moduli dentro la chat.",
      },
      {
        question: "Posso collegare il chatbot a utenti autenticati e al mio workflow interno?",
        answer:
          "Sì. MoAssist può mantenere la conversazione collegata al cliente giusto e integrarsi nel tuo flusso di supporto.",
      },
      {
        question: "AI e agenti umani possono rispondere nella stessa conversazione?",
        answer:
          "Sì. Le risposte AI e umane restano nello stesso thread e l'inbox mostra autore e stato di lettura.",
      },
      {
        question: "Cosa succede quando un cliente diventa inattivo?",
        answer:
          "La conversazione può cambiare automaticamente tra attiva, in attesa e chiusa secondo le tue regole di inattività e il tuo piano.",
      },
      {
        question: "Perché le aziende scelgono MoAssist?",
        answer:
          "Perché riunisce creazione chatbot, caricamento conoscenza, lead capture, supporto clienti autenticati e risposte AI e del team in un solo prodotto.",
      },
    ],
    ctaSection: {
      eyebrow: "Inizia ora",
      title: "Inizia con un chatbot e trasformalo in un flusso migliore per vendite e supporto.",
      body: "Se ti serve una piattaforma per creare chatbot, caricare conoscenza aziendale, personalizzare l'interfaccia, raccogliere dati cliente, supportare utenti autenticati e gestire risposte AI e umane da un dashboard, MoAssist è progettato per questo.",
    },
    footerTagline: "Chatbot AI per ecommerce e team di supporto.",
    footerColumns: createFooterColumns(
      {
        title: "Prodotto",
        links: [
          { label: "Dashboard", href: "/chatbots" },
          { label: "Login", href: "/login" },
          { label: "Supporto", href: "mailto:support@momicro.ai" },
        ],
      },
      {
        title: "Esplora",
        links: [
          { label: "Funzioni", href: "#features" },
          { label: "Come funziona", href: "#how-it-works" },
          { label: "FAQ", href: "#faq" },
        ],
      },
      {
        title: "Legale",
        links: [
          { label: "Privacy Policy", href: "/privacy-policy" },
          { label: "Imprint", href: "/imprint" },
          { label: "Termini e condizioni", href: "/terms-and-conditions" },
        ],
      },
    ),
    imagePlaceholderLabel: "Segnaposto immagine",
    imagePlaceholderBody: "Sostituisci questo segnaposto con lo screenshot finale del prodotto.",
    stepPlaceholderLabel: "Segnaposto step",
    stepPlaceholderBody: "Sostituisci questo segnaposto con l'immagine finale del workflow.",
    heroImageTitle: "Dashboard chatbot AI MoAssist",
    heroImageAlt: "Immagine segnaposto dashboard chatbot AI MoAssist",
  },
  ru: {
    seo: {
      title: "MoAssist | AI-чатботы для интернет-магазинов и продающих компаний",
      description:
        "MoAssist помогает интернет-магазинам и компаниям, которые продают товары или услуги, создавать брендированные чатботы, отвечать на основе своих материалов, собирать лиды, поддерживать авторизованных клиентов и управлять AI- и человеческими диалогами из одной панели.",
      keywords:
        "чатбот для интернет-магазина, ecommerce chatbot, чатбот для продаж, чатбот для поддержки, AI чатбот для бизнеса, чатбот для лидогенерации, чатбот для кабинета клиента, чатбот база знаний, многоязычный чатбот, брендированный чатбот",
      ogDescription:
        "Создавайте чатбот для каждого магазина или воронки продаж, обучайте его на своих документах, собирайте данные клиентов и управляйте ответами AI и команды из одной панели.",
      twitterDescription:
        "AI-чатботы для интернет-магазинов и команд продаж. Обучение на документах, сбор лидов, поддержка клиентов и единое управление AI и живыми ответами.",
    },
    appDescription:
      "MoAssist — это платформа чатботов для интернет-магазинов и коммерческих компаний, которым нужны более быстрые ответы, больше лидов и лучший клиентский сервис.",
    heroPill: "Для Интернет-Магазинов И Продающих Компаний",
    heroTitle: "Более удобный способ общаться с покупателями, лидами и клиентами.",
    heroBody:
      "Создавайте брендированный чатбот для каждого магазина или коммерческого сценария, обучайте его на своих документах, собирайте данные клиентов, помогайте авторизованным пользователям и управляйте ответами AI и команды из одного места.",
    heroHighlights: [
      { title: "Чатботы по магазинам", href: "#feature-individual-chatbots" },
      { title: "Ответы на основе знаний", href: "#feature-knowledge-ai" },
      { title: "Сбор лидов", href: "#feature-lead-capture" },
      { title: "Входящие команды", href: "#feature-support-workflow" },
    ],
    coreBenefits: [
      {
        title: "Отдельный чатбот для каждого магазина, бренда или сценария продаж",
        body: "Настройте приветствие, prompts, логотип, цвета, launcher, размещение и статус публикации для каждого чатбота.",
      },
      {
        title: "Ответы на основе ваших бизнес-материалов",
        body: "Загрузите инструкции, данные о товарах, политики и другие документы, чтобы чатбот отвечал с реальным контекстом.",
      },
      {
        title: "Продажи и поддержка в одной системе",
        body: "Собирайте лиды, помогайте авторизованным клиентам и дайте AI и команде работать в одном inbox.",
      },
    ],
    featuresSection: {
      eyebrow: "Что можно делать",
      title:
        "Все, что нужно для создания, обучения, публикации и управления индивидуальными чатботами.",
      body: "MoAssist создан для интернет-магазинов и компаний, которые продают товары или услуги. Он помогает командам общаться с посетителями, лидами, покупателями и действующими клиентами в одном связанном процессе.",
    },
    featureSections: [
      createFeature(
        "feature-individual-chatbots",
        "Конструктор чатботов",
        "Создавайте отдельный чатбот для каждого магазина, товарной линии, бренда или клиентского сценария.",
        "У каждого чатбота могут быть свои имя, первое сообщение, подсказки, логотип, иконка, цвета, тема, размещение, языки и разрешенные домены.",
        [
          "Отдельный чатбот для каждого проекта",
          "Черновик и публикация",
          "Управление логотипом, иконкой и launcher",
          "Темы, языки и правила доменов",
        ],
        "MoAssist конструктор чатботов",
        "Изображение-заглушка конструктора чатботов MoAssist",
      ),
      createFeature(
        "feature-knowledge-ai",
        "Знания и AI-ответы",
        "Загрузите документы, чтобы чатбот отвечал с реальным бизнес-контекстом.",
        "Добавляйте документы и файлы, включайте AI-ответы, если это доступно по тарифу, выбирайте длину ответов и задавайте правила, чтобы чатбот не угадывал.",
        [
          "Загрузка документов и файлов",
          "Правила ответа и тон общения",
          "Короткие, средние и длинные ответы",
          "Более быстрые первые ответы",
        ],
        "MoAssist знания и настройки AI",
        "Изображение-заглушка базы знаний MoAssist",
      ),
      createFeature(
        "feature-lead-capture",
        "Сбор лидов и данных клиентов",
        "Собирайте имена, email и другие данные клиента прямо в чате.",
        "Создайте собственную форму, выберите нужные поля, определите обязательные поля и используйте чат для квалификации лидов, приема запросов и контактов.",
        [
          "Настраиваемые формы",
          "Обязательные и необязательные поля",
          "Квалификация лидов и прием обращений",
          "Данные клиента сохраняются в диалоге",
        ],
        "MoAssist сбор лидов и данных клиентов",
        "Изображение-заглушка сбора лидов MoAssist",
      ),
      createFeature(
        "feature-logged-in-users",
        "Авторизованные пользователи и внутренние процессы",
        "Поддерживайте существующих клиентов с чатботом, который понимает, кто уже вошел в систему.",
        "MoAssist может связывать диалог с правильным авторизованным клиентом. Так вы строите реальную поддержку в личном кабинете и встраиваете чат в свою внутреннюю работу.",
        [
          "Распознавание авторизованных клиентов",
          "Чат в личном кабинете клиента",
          "Интеграция во внутренний workflow",
          "Больше контекста, чем в анонимном чате",
        ],
        "MoAssist поддержка авторизованных клиентов",
        "Изображение-заглушка поддержки авторизованных клиентов",
      ),
      createFeature(
        "feature-support-workflow",
        "Inbox AI и команды",
        "Пусть AI отвечает первым, а команда подключается, когда нужен человек.",
        "AI- и человеческие ответы остаются в одном inbox. Вы видите, кто написал сообщение, прочитано ли оно и в каком состоянии находится диалог.",
        [
          "AI и люди в одной переписке",
          "Статус прочитано и не прочитано",
          "Активные, ожидающие и закрытые диалоги",
          "Автоматическая логика неактивности",
        ],
        "MoAssist inbox и цикл диалога",
        "Изображение-заглушка общего inbox MoAssist",
      ),
      createFeature(
        "feature-install-launch",
        "Установка и запуск",
        "Запустите чатбот на сайте, в магазине или в личном кабинете.",
        "Подключите его через script или iframe, выберите основной и дополнительные языки и управляйте разрешенными доменами.",
        [
          "Установка через script или iframe",
          "Основной и дополнительные языки",
          "Контроль разрешенных доменов",
          "Быстрый запуск в публичных и закрытых зонах",
        ],
        "MoAssist установка и запуск",
        "Изображение-заглушка установки MoAssist",
      ),
    ],
    reasonsSection: {
      eyebrow: "Почему MoAssist",
      title: "Почему команды продаж и поддержки выбирают MoAssist.",
      body: "Выбирайте MoAssist, если вам нужна одна система для вопросов до покупки, сбора лидов, поддержки, помощи авторизованным пользователям и передачи диалога команде.",
    },
    reasonCards: [
      {
        title: "Одна система вместо набора разрозненных инструментов",
        body: "Создавайте, обучайте, публикуйте и управляйте чатботами в одном месте.",
      },
      {
        title: "Сделано для компаний, которые продают",
        body: "MoAssist подходит интернет-магазинам и коммерческим командам, а не просто для случайного чат-виджета.",
      },
      {
        title: "Каждый чатбот можно подстроить под бизнес",
        body: "У каждого чатбота могут быть свой стиль, контент, языки и поведение.",
      },
      {
        title: "Быстрые ответы без потери контроля",
        body: "AI берет частые вопросы, а команда сохраняет контроль над тоном и передачей диалога.",
      },
      {
        title: "Лучшая помощь действующим клиентам",
        body: "MoAssist работает и для авторизованных пользователей внутри клиентской зоны.",
      },
      {
        title: "Полезно на всем пути клиента",
        body: "Используйте одну платформу для вопросов о покупке, лидов, поддержки и дальнейшего сервиса.",
      },
    ],
    workflowSection: {
      processLabel: "Процесс",
      title: "Простой путь от настройки до живых диалогов.",
      body: "Прокрутите шаги и посмотрите, как чатбот проходит путь от setup до ежедневного общения с клиентами.",
    },
    workflowSteps: [
      {
        step: "Шаг 01",
        label: "Создание",
        title: "Создайте чатбот для нужного сценария продаж или поддержки",
        body: "Задайте имя, цель, первое сообщение, подсказки и базовые настройки.",
      },
      {
        step: "Шаг 02",
        label: "Обучение",
        title: "Загрузите знания и определите стиль ответов чатбота",
        body: "Добавьте документы, выберите формат ответов и напишите понятные инструкции.",
      },
      {
        step: "Шаг 03",
        label: "Настройка",
        title: "Настройте чатбот и выберите, какие данные клиентов собирать",
        body: "Отредактируйте интерфейс, цвета, тексты, поля формы и языки, чтобы все совпадало с вашим брендом.",
      },
      {
        step: "Шаг 04",
        label: "Запуск",
        title: "Опубликуйте чатбот и ведите реальные клиентские диалоги",
        body: "Установите его на сайт или в клиентскую зону, помогайте авторизованным пользователям и управляйте ответами AI и команды из одного места.",
      },
    ],
    useCasesSection: {
      eyebrow: "Сценарии использования",
      title: "Для кого подходит MoAssist.",
      body: "MoAssist подходит интернет-магазинам и компаниям, которые продают товары или услуги и хотят лучше общаться с посетителями, лидами, покупателями и авторизованными клиентами.",
    },
    useCases: [
      {
        title: "Поддержка клиентов и help center",
        body: "Отвечайте на частые вопросы, используйте загруженные материалы и подключайте сотрудников, когда это нужно.",
      },
      {
        title: "Продажи и квалификация лидов",
        body: "Отвечайте на вопросы перед покупкой, собирайте контакты и передавайте квалифицированные лиды команде с контекстом.",
      },
      {
        title: "Клиентские порталы и личные кабинеты",
        body: "Помогайте авторизованным клиентам внутри продукта, портала или аккаунта.",
      },
      {
        title: "Внутренние процессы и сервис",
        body: "Используйте dashboard как центр управления AI- и человеческими диалогами.",
      },
    ],
    faqSection: {
      eyebrow: "FAQ",
      title: "Частые вопросы о MoAssist.",
      body: "Это вопросы, которые чаще всего задают команды перед запуском чатбота для продаж, поддержки или сервиса для авторизованных клиентов.",
    },
    faqItems: [
      {
        question: "Что такое MoAssist?",
        answer:
          "MoAssist — это платформа для интернет-магазинов и коммерческих компаний, которым нужны чатботы для сайта, личного кабинета, поддержки и коммерческого общения.",
      },
      {
        question: "Можно создать несколько чатботов?",
        answer:
          "Да. Вы можете создать отдельные чатботы для разных магазинов, брендов, продуктов, языков и клиентских сценариев.",
      },
      {
        question: "Можно загрузить документы, чтобы чатбот знал мой бизнес?",
        answer:
          "Да. Вы можете загружать документы и файлы, чтобы чатбот отвечал на основе ваших материалов.",
      },
      {
        question: "Можно настроить чатбот под мой сайт?",
        answer:
          "Да. Вы можете настраивать дизайн, цвета, иконки, launcher, тексты, тему и размещение.",
      },
      {
        question: "Можно собирать данные клиентов через чатбота?",
        answer:
          "Да. Вы можете собирать имена, email и другие поля через формы внутри чата.",
      },
      {
        question: "Можно связать чатбот с авторизованными пользователями и своим workflow?",
        answer:
          "Да. MoAssist может связывать диалог с правильным клиентом и встраиваться в ваш процесс поддержки.",
      },
      {
        question: "Могут ли AI и сотрудники отвечать в одном диалоге?",
        answer:
          "Да. Ответы AI и людей остаются в одном потоке, а inbox показывает автора и статус прочтения.",
      },
      {
        question: "Что происходит, если клиент становится неактивным?",
        answer:
          "Диалог может автоматически переходить между активным, ожидающим и закрытым состоянием согласно вашим правилам неактивности и тарифу.",
      },
      {
        question: "Почему компании выбирают MoAssist?",
        answer:
          "Потому что в одном продукте объединены создание чатботов, база знаний, сбор лидов, поддержка авторизованных клиентов и ответы AI и команды.",
      },
    ],
    ctaSection: {
      eyebrow: "Начать",
      title: "Начните с одного чатбота и выстройте более сильный процесс продаж и поддержки.",
      body: "Если вам нужна платформа для создания чатботов, загрузки бизнес-материалов, настройки интерфейса, сбора данных клиентов, поддержки авторизованных пользователей и управления ответами AI и команды из одной панели, MoAssist создан именно для этого.",
    },
    footerTagline: "AI-чатботы для интернет-магазинов и команд поддержки.",
    footerColumns: createFooterColumns(
      {
        title: "Продукт",
        links: [
          { label: "Dashboard", href: "/chatbots" },
          { label: "Вход", href: "/login" },
          { label: "Поддержка", href: "mailto:support@momicro.ai" },
        ],
      },
      {
        title: "Разделы",
        links: [
          { label: "Возможности", href: "#features" },
          { label: "Как это работает", href: "#how-it-works" },
          { label: "FAQ", href: "#faq" },
        ],
      },
      {
        title: "Юридическое",
        links: [
          { label: "Политика конфиденциальности", href: "/privacy-policy" },
          { label: "Imprint", href: "/imprint" },
          { label: "Условия использования", href: "/terms-and-conditions" },
        ],
      },
    ),
    imagePlaceholderLabel: "Заглушка изображения",
    imagePlaceholderBody: "Замените эту заглушку на финальный скриншот продукта.",
    stepPlaceholderLabel: "Заглушка шага",
    stepPlaceholderBody: "Замените эту заглушку на финальное изображение workflow.",
    heroImageTitle: "Панель AI-чатбота MoAssist",
    heroImageAlt: "Изображение-заглушка панели AI-чатбота MoAssist",
  },
  ua: {
    seo: {
      title: "MoAssist | AI-чатботи для інтернет-магазинів і бізнесів, що продають",
      description:
        "MoAssist допомагає інтернет-магазинам і бізнесам, що продають товари або послуги, створювати брендовані чатботи, відповідати на основі власних матеріалів, збирати ліди, підтримувати авторизованих клієнтів і керувати AI- та людськими розмовами з однієї панелі.",
      keywords:
        "чатбот для інтернет-магазину, ecommerce chatbot, чатбот для продажів, чатбот для підтримки, AI чатбот для бізнесу, чатбот для збору лідів, чатбот для кабінету клієнта, чатбот база знань, багатомовний чатбот, брендований чатбот",
      ogDescription:
        "Створюйте чатбот для кожного магазину або воронки продажів, навчайте його на своїх документах, збирайте дані клієнтів і керуйте відповідями AI та команди з однієї панелі.",
      twitterDescription:
        "AI-чатботи для інтернет-магазинів і команд продажів. Навчання на документах, збір лідів, підтримка клієнтів і єдине керування AI та живими відповідями.",
    },
    appDescription:
      "MoAssist — це платформа чатботів для інтернет-магазинів і комерційних бізнесів, яким потрібні швидші відповіді, більше лідів і кращий клієнтський сервіс.",
    heroPill: "Для Інтернет-Магазинів І Бізнесів, Що Продають",
    heroTitle: "Кращий спосіб спілкуватися з покупцями, лідами та клієнтами.",
    heroBody:
      "Створюйте брендований чатбот для кожного магазину або комерційного сценарію, навчайте його на своїх документах, збирайте дані клієнтів, допомагайте авторизованим користувачам і керуйте відповідями AI та команди з одного місця.",
    heroHighlights: [
      { title: "Чатботи для магазинів", href: "#feature-individual-chatbots" },
      { title: "Відповіді на основі знань", href: "#feature-knowledge-ai" },
      { title: "Збір лідів", href: "#feature-lead-capture" },
      { title: "Inbox команди", href: "#feature-support-workflow" },
    ],
    coreBenefits: [
      {
        title: "Окремий чатбот для кожного магазину, бренду або сценарію продажів",
        body: "Налаштовуйте вітальне повідомлення, prompts, логотип, кольори, launcher, розміщення та статус публікації для кожного чатбота.",
      },
      {
        title: "Відповіді на основі ваших бізнес-матеріалів",
        body: "Завантажуйте інструкції, інформацію про товари, політики та інші документи, щоб чатбот відповідав із реальним контекстом.",
      },
      {
        title: "Продажі та підтримка в одній системі",
        body: "Збирайте ліди, допомагайте авторизованим клієнтам і дайте AI та команді працювати в одному inbox.",
      },
    ],
    featuresSection: {
      eyebrow: "Що можна робити",
      title:
        "Усе, що потрібно для створення, навчання, публікації та керування індивідуальними чатботами.",
      body: "MoAssist створений для інтернет-магазинів і бізнесів, що продають товари або послуги. Він допомагає командам спілкуватися з відвідувачами, лідами, покупцями та чинними клієнтами в одному пов'язаному процесі.",
    },
    featureSections: [
      createFeature(
        "feature-individual-chatbots",
        "Конструктор чатботів",
        "Створюйте окремий чатбот для кожного магазину, лінійки товарів, бренду або клієнтського сценарію.",
        "Кожен чатбот може мати власні назву, перше повідомлення, підказки, логотип, іконку, кольори, тему, розміщення, мови та дозволені домени.",
        [
          "Окремий чатбот для кожного проєкту",
          "Чернетка і публікація",
          "Керування логотипом, іконкою та launcher",
          "Теми, мови та правила доменів",
        ],
        "MoAssist конструктор чатботів",
        "Зображення-заглушка конструктора чатботів MoAssist",
      ),
      createFeature(
        "feature-knowledge-ai",
        "Знання та AI-відповіді",
        "Завантажуйте документи, щоб чатбот відповідав із реальним бізнес-контекстом.",
        "Додавайте документи й файли, вмикайте AI-відповіді, якщо це доступно у вашому тарифі, обирайте довжину відповідей і задавайте правила, щоб чатбот не вгадував.",
        [
          "Завантаження документів і файлів",
          "Правила відповіді та тон",
          "Короткі, середні та довгі відповіді",
          "Швидші перші відповіді",
        ],
        "MoAssist знання та налаштування AI",
        "Зображення-заглушка бази знань MoAssist",
      ),
      createFeature(
        "feature-lead-capture",
        "Збір лідів і даних клієнтів",
        "Збирайте імена, email та інші дані клієнтів прямо в чаті.",
        "Створіть власну форму, оберіть потрібні поля, визначте обов'язкові поля й використовуйте чат для кваліфікації лідів, прийому звернень та контактів.",
        [
          "Кастомні форми",
          "Обов'язкові та необов'язкові поля",
          "Кваліфікація лідів і support intake",
          "Дані клієнта зберігаються в розмові",
        ],
        "MoAssist збір лідів і даних клієнтів",
        "Зображення-заглушка збору лідів MoAssist",
      ),
      createFeature(
        "feature-logged-in-users",
        "Авторизовані користувачі та внутрішні процеси",
        "Підтримуйте наявних клієнтів за допомогою чатбота, який розуміє, хто вже увійшов у систему.",
        "MoAssist може пов'язувати діалог із правильним авторизованим клієнтом. Так ви будуєте реальну підтримку в кабінеті клієнта та вбудовуєте чат у свій внутрішній workflow.",
        [
          "Розпізнавання авторизованих клієнтів",
          "Чат у кабінеті клієнта",
          "Інтеграція у внутрішній workflow",
          "Більше контексту, ніж в анонімному чаті",
        ],
        "MoAssist підтримка авторизованих клієнтів",
        "Зображення-заглушка підтримки авторизованих клієнтів",
      ),
      createFeature(
        "feature-support-workflow",
        "Inbox AI і команди",
        "Нехай AI відповідає першим, а команда підключається, коли потрібна людина.",
        "AI- та людські відповіді залишаються в одному inbox. Ви бачите, хто написав повідомлення, чи воно прочитане і в якому стані перебуває розмова.",
        [
          "AI і люди в одному thread",
          "Статус прочитано і не прочитано",
          "Активні, очікуючі та закриті розмови",
          "Автоматична логіка неактивності",
        ],
        "MoAssist inbox і цикл розмови",
        "Зображення-заглушка спільного inbox MoAssist",
      ),
      createFeature(
        "feature-install-launch",
        "Установка і запуск",
        "Запускайте чатбот на сайті, у магазині або в кабінеті клієнта.",
        "Підключайте його через script або iframe, обирайте основну й додаткові мови та керуйте дозволеними доменами.",
        [
          "Установка через script або iframe",
          "Основна і додаткові мови",
          "Контроль дозволених доменів",
          "Швидкий запуск у публічних і закритих зонах",
        ],
        "MoAssist установка і запуск",
        "Зображення-заглушка установки MoAssist",
      ),
    ],
    reasonsSection: {
      eyebrow: "Чому MoAssist",
      title: "Чому команди продажів і підтримки обирають MoAssist.",
      body: "Обирайте MoAssist, якщо вам потрібна одна система для запитань до покупки, збору лідів, підтримки, допомоги авторизованим користувачам і передачі діалогу команді.",
    },
    reasonCards: [
      {
        title: "Одна система замість набору розрізнених інструментів",
        body: "Створюйте, навчайте, публікуйте й керуйте чатботами в одному місці.",
      },
      {
        title: "Створено для бізнесів, що продають",
        body: "MoAssist підходить інтернет-магазинам і комерційним командам, а не просто як випадковий чат-віджет.",
      },
      {
        title: "Кожен чатбот можна підлаштувати під бізнес",
        body: "Кожен чатбот може мати власний стиль, контент, мови та поведінку.",
      },
      {
        title: "Швидші відповіді без втрати контролю",
        body: "AI бере типові запитання, а команда зберігає контроль над тоном і takeover.",
      },
      {
        title: "Краща допомога чинним клієнтам",
        body: "MoAssist працює і для авторизованих користувачів у клієнтській зоні.",
      },
      {
        title: "Корисно на всьому шляху клієнта",
        body: "Використовуйте одну платформу для запитань про покупку, лідів, підтримки та подальшого сервісу.",
      },
    ],
    workflowSection: {
      processLabel: "Процес",
      title: "Простий шлях від налаштування до живих розмов.",
      body: "Прокрутіть кроки й подивіться, як чатбот проходить шлях від setup до щоденної комунікації з клієнтами.",
    },
    workflowSteps: [
      {
        step: "Крок 01",
        label: "Створення",
        title: "Створіть чатбот для потрібного сценарію продажів або підтримки",
        body: "Задайте назву, мету, перше повідомлення, підказки та базові налаштування.",
      },
      {
        step: "Крок 02",
        label: "Навчання",
        title: "Завантажте знання й визначте стиль відповідей чатбота",
        body: "Додайте документи, оберіть формат відповідей і напишіть зрозумілі інструкції.",
      },
      {
        step: "Крок 03",
        label: "Налаштування",
        title: "Налаштуйте чатбот і оберіть, які дані клієнтів збирати",
        body: "Відредагуйте інтерфейс, кольори, тексти, поля форми й мови, щоб усе відповідало вашому бренду.",
      },
      {
        step: "Крок 04",
        label: "Запуск",
        title: "Опублікуйте чатбот і ведіть реальні діалоги з клієнтами",
        body: "Встановіть його на сайт або в клієнтську зону, допомагайте авторизованим користувачам і керуйте відповідями AI та команди з одного місця.",
      },
    ],
    useCasesSection: {
      eyebrow: "Сценарії використання",
      title: "Для кого підходить MoAssist.",
      body: "MoAssist підходить інтернет-магазинам і бізнесам, що продають товари або послуги та хочуть краще спілкуватися з відвідувачами, лідами, покупцями й авторизованими клієнтами.",
    },
    useCases: [
      {
        title: "Підтримка клієнтів і help center",
        body: "Відповідайте на часті питання, використовуйте завантажені матеріали й підключайте співробітників, коли це потрібно.",
      },
      {
        title: "Продажі та кваліфікація лідів",
        body: "Відповідайте на запитання перед покупкою, збирайте контакти й передавайте якісні ліди команді з контекстом.",
      },
      {
        title: "Клієнтські портали й особисті кабінети",
        body: "Допомагайте авторизованим клієнтам усередині продукту, порталу або акаунта.",
      },
      {
        title: "Внутрішні процеси та сервіс",
        body: "Використовуйте dashboard як центр керування AI- та людськими діалогами.",
      },
    ],
    faqSection: {
      eyebrow: "FAQ",
      title: "Часті запитання про MoAssist.",
      body: "Це запитання, які команди найчастіше ставлять перед запуском чатбота для продажів, підтримки або сервісу для авторизованих клієнтів.",
    },
    faqItems: [
      {
        question: "Що таке MoAssist?",
        answer:
          "MoAssist — це платформа для інтернет-магазинів і комерційних бізнесів, яким потрібні чатботи для сайту, кабінету клієнта, підтримки та комерційної комунікації.",
      },
      {
        question: "Чи можна створити кілька чатботів?",
        answer:
          "Так. Ви можете створити окремі чатботи для різних магазинів, брендів, продуктів, мов і клієнтських сценаріїв.",
      },
      {
        question: "Чи можна завантажити документи, щоб чатбот знав мій бізнес?",
        answer:
          "Так. Ви можете завантажувати документи й файли, щоб чатбот відповідав на основі ваших матеріалів.",
      },
      {
        question: "Чи можна налаштувати чатбот під мій сайт?",
        answer:
          "Так. Ви можете налаштовувати дизайн, кольори, іконки, launcher, тексти, тему й розміщення.",
      },
      {
        question: "Чи можна збирати дані клієнтів через чатбота?",
        answer:
          "Так. Ви можете збирати імена, email та інші поля через форми всередині чату.",
      },
      {
        question: "Чи можна зв'язати чатбот з авторизованими користувачами та своїм workflow?",
        answer:
          "Так. MoAssist може прив'язувати діалог до правильного клієнта й вбудовуватися у ваш процес підтримки.",
      },
      {
        question: "Чи можуть AI і співробітники відповідати в одному діалозі?",
        answer:
          "Так. Відповіді AI і людей залишаються в одному потоці, а inbox показує автора й статус прочитання.",
      },
      {
        question: "Що відбувається, коли клієнт стає неактивним?",
        answer:
          "Діалог може автоматично переходити між активним, очікуючим і закритим станом згідно з вашими правилами неактивності та тарифом.",
      },
      {
        question: "Чому бізнеси обирають MoAssist?",
        answer:
          "Тому що в одному продукті об'єднано створення чатботів, базу знань, збір лідів, підтримку авторизованих клієнтів і відповіді AI та команди.",
      },
    ],
    ctaSection: {
      eyebrow: "Почати",
      title: "Почніть з одного чатбота й побудуйте сильніший процес продажів і підтримки.",
      body: "Якщо вам потрібна платформа для створення чатботів, завантаження бізнес-матеріалів, налаштування інтерфейсу, збору даних клієнтів, підтримки авторизованих користувачів і керування відповідями AI та команди з однієї панелі, MoAssist створений саме для цього.",
    },
    footerTagline: "AI-чатботи для інтернет-магазинів і команд підтримки.",
    footerColumns: createFooterColumns(
      {
        title: "Продукт",
        links: [
          { label: "Dashboard", href: "/chatbots" },
          { label: "Вхід", href: "/login" },
          { label: "Підтримка", href: "mailto:support@momicro.ai" },
        ],
      },
      {
        title: "Розділи",
        links: [
          { label: "Можливості", href: "#features" },
          { label: "Як це працює", href: "#how-it-works" },
          { label: "FAQ", href: "#faq" },
        ],
      },
      {
        title: "Юридичне",
        links: [
          { label: "Політика конфіденційності", href: "/privacy-policy" },
          { label: "Imprint", href: "/imprint" },
          { label: "Умови використання", href: "/terms-and-conditions" },
        ],
      },
    ),
    imagePlaceholderLabel: "Заглушка зображення",
    imagePlaceholderBody: "Замініть цю заглушку фінальним скріншотом продукту.",
    stepPlaceholderLabel: "Заглушка кроку",
    stepPlaceholderBody: "Замініть цю заглушку фінальним зображенням workflow.",
    heroImageTitle: "Панель AI-чатбота MoAssist",
    heroImageAlt: "Зображення-заглушка панелі AI-чатбота MoAssist",
  },
};

marketingContent.de = marketingContent.at;
delete marketingContent.at;
delete marketingContent.gr;

export const getMarketingContent = (key) =>
  marketingContent[key] || marketingContent.en;
