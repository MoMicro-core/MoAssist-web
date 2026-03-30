import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import {
  DEFAULT_LOCALE_KEY,
  LANGUAGE_OPTIONS,
  buildLocalizedPath,
  isPublicLandingPath,
  readLocaleFromPathname,
  readLocaleFromSearch,
  resolveLocale,
} from "../lib/siteLocales";

const I18nContext = createContext(null);

const LANG_KEY = "moassist-language";

const dictionary = {
  en: {
    appName: "MoAssist",
    dashboard: "Dashboard",
    chatbots: "Chatbots",
    profile: "Profile",
    support: "Support",
    chatsMenu: "Chats",
    activeChats: "Active chats",
    activeChatsBody: "Open conversations from all chatbots in one place.",
    billings: "Billings",
    billingTab: "Billing",
    signOut: "Sign out",
    signIn: "Sign in",
    tryNow: "Try now",
    register: "Register",
    marketingTagline: "AI chat concierge",
    continueWithGoogle: "Continue with Google",
    continueWithApple: "Continue with Apple",
    orUseEmail: "Or continue with email",
    fullNameLabel: "Full name",
    emailLabel: "Email",
    passwordLabel: "Password",
    pleaseWait: "Please wait",
    switchToRegister: "Create account instead",
    switchToSignIn: "Use existing account",
    loginTitle: "Manage chatbots, conversations, and knowledge in one place.",
    loginBody:
      "Sign in with Firebase and sync your dashboard with MoAssist server sessions.",
    featureA:
      "Track chatbots, publish widgets, and respond to conversations from a single hub.",
    featureB:
      "Upload knowledge files and monitor analytics without leaving the dashboard.",
    newChatbot: "New chatbot",
    createChatbot: "Create chatbot",
    chatbotName: "Chatbot name",
    cancel: "Cancel",
    creating: "Creating",
    noChatbots: "No chatbots yet",
    noChatbotsBody:
      "Create your first chatbot to start collecting conversations.",
    chatbotSettings: "Chatbot settings",
    saveChanges: "Save changes",
    saving: "Saving",
    embedTitle: "Embed your chatbot",
    embedBody: "Use the snippets below to install the widget on your website.",
    scriptEmbed: "Script embed",
    iframeEmbed: "Iframe embed",
    copy: "Copy",
    copyCode: "Copy code",
    conversations: "Conversations",
    selectConversation: "Select a conversation.",
    messagesPlaceholder: "Write a reply...",
    searchConversations: "Search by name or email",
    recentConversations: "Recent conversations",
    allConversations: "All conversations",
    allConversationsBody: "All conversations across your chatbots.",
    allLabel: "All",
    activeLabel: "Active",
    openLabel: "Open",
    pendingLabel: "Pending",
    closedLabel: "Closed",
    viewAllChats: "View all chats",
    loadingConversations: "Loading conversations...",
    noConversationsYet: "No conversations yet.",
    noConversationsFound: "No conversations found.",
    newVisitor: "New visitor",
    noMessagesYet: "No messages yet",
    online: "Online",
    totalConversations: "Total conversations",
    activeChatbots: "Active chatbots",
    openConversations: "Open conversations",
    unreadConversations: "Unread conversations",
    totalMessages: "Total messages",
    leadsCaptured: "Leads captured",
    knowledgeFiles: "Knowledge files",
    activity: "Activity",
    needsReply: "Needs reply",
    insights: "Insights",
    dashboardOverview: "Clarity-first dashboard",
    dashboardOverviewBody:
      "Track performance quickly, then hide anything you do not need.",
    customizeDashboard: "Customize dashboard",
    showMetrics: "Show KPI cards",
    showRecentDashboard: "Show recent conversations",
    showInsightsDashboard: "Show insights panel",
    compactMode: "Compact mode",
    resetLayout: "Reset layout",
    dashboardHiddenState:
      "All dashboard panels are hidden. Open Customize dashboard to enable them again.",
    basics: "Basics",
    titleLabel: "Title",
    botNameLabel: "Bot name",
    statusLabel: "Status",
    initialMessageLabel: "Initial message",
    inputPlaceholderLabel: "Input placeholder",
    conversationBehavior: "Conversation behavior",
    authEnabledLabel: "Require website auth",
    inactivityHoursLabel: "Inactivity timeout (hours)",
    authClientHelp:
      "Pass authClient from your website session before loading the widget script.",
    authenticatedChatHelp:
      "Authenticated chats only switch between active and pending and cannot be closed manually.",
    appearance: "Appearance",
    widgetLocationLabel: "Widget location",
    roundedCornersLabel: "Rounded corners",
    logoUrlLabel: "Logo URL",
    bubbleIconUrlLabel: "Bubble icon URL",
    domains: "Domains and prompts",
    allowedDomainsLabel: "Allowed domains",
    suggestedMessagesLabel: "Suggested messages",
    leadForm: "Lead capture form",
    formTitleLabel: "Form title",
    keyLabel: "Key",
    labelLabel: "Label",
    typeLabel: "Type",
    requiredLabel: "Required",
    aiConfig: "AI configuration",
    enableAiLabel: "Enable AI replies",
    templateLabel: "Template",
    responseLengthLabel: "Response length",
    guidelinesLabel: "Guidelines",
    uploadFiles: "Upload files",
    uploading: "Uploading",
    addField: "Add field",
    remove: "Remove",
    delete: "Delete",
    noFiles: "No files uploaded.",
    statusDraft: "Draft",
    statusPublished: "Published",
    supportTitle: "Support",
    supportBody: "Get help with setup, billing, and widget troubleshooting.",
    docs: "Documentation",
    contact: "Contact",
    openDocs: "Open docs",
    emailSupport: "Email support",
    accountDetails: "Account details",
    subscription: "Subscription",
    billingPerChatbotBody:
      "Billing is managed per chatbot. Select one to continue.",
    billingChatbot: "Billing chatbot",
    noChatbotsForBilling: "Create a chatbot first to manage billing.",
    selectedChatbot: "Selected chatbot",
    planLabel: "Plan",
    billingStatusLabel: "Status",
    currentPeriodEndLabel: "Current period end",
    loadingBilling: "Loading billing...",
    startTrial: "Start trial",
    upgrade: "Upgrade plan",
    manageBilling: "Manage billing",
    openBilling: "Open billing",
    freePlanLabel: "Free",
    tierDescriptionFallback: "Choose the plan that matches the support flow you need.",
    currentPlanCta: "Current plan",
    upgradeToPlan: "Choose this plan",
    language: "Language",
    defaultLanguageSetting: "Default chatbot language",
    enabledLanguagesLabel: "Additional chatbot languages",
    defaultLanguagePinnedHelp:
      "The main chatbot language is always included in the selected languages.",
    defaultLanguageShort: "default",
    createLanguagesHelp:
      "Choose the main chatbot language first, then add only the extra languages you want to publish.",
    enabledLanguagesHelp:
      "Only the selected languages will be generated and served in the widget.",
    theme: "Theme",
    light: "Light",
    dark: "Dark",
    hideMenu: "Hide menu",
    showMenu: "Show menu",
    preview: "Preview",
    send: "Send",
    closeChat: "Close chat",
    closingChat: "Closing...",
    publish: "Publish",
    setDraft: "Set draft",
    statusActive: "Active",
    statusPending: "Pending",
    authenticatedLabel: "Authenticated",
    humanLabel: "Human",
    aiLabel: "AI",
    visitorLabel: "Visitor",
    agentLabel: "Agent",
    messageReadByTeam: "Read by team",
    messageUnreadByTeam: "Unread by team",
    messageReadByVisitor: "Read by visitor",
    messageUnreadByVisitor: "Unread by visitor",
    scriptPath: "Script path",
    iframePath: "Iframe path",
    copyUrl: "Copy",
    billingAccessTitle: "Plan and access",
    billingAccessBody:
      "This chatbot plan controls signed-in customer chat, AI replies, and knowledge uploads. Open billing to upgrade or manage payments.",
    billingAccessUpgradeHint:
      "Move to a higher plan when you want signed-in customer sessions, AI answers, or knowledge uploads for this chatbot.",
    billingAccessFullHint:
      "This chatbot already has access to signed-in customer chat, AI replies, and knowledge uploads.",
    subscriptionAccessTitle: "Subscription access",
    subscriptionAccessBody:
      "Each chatbot inherits its available features from the current plan, so blocked options stay disabled and safe to edit around.",
    authUpgradeHint:
      "Upgrade to the Connected or Full AI plan to connect signed-in website customers to chat sessions.",
    aiPlanHint:
      "AI replies are available on the Full AI plan and can still be configured here.",
    aiUpgradeHint:
      "Upgrade to the Full AI plan to turn on automated answers.",
    knowledgeUpgradeHint:
      "Knowledge uploads are available on the Full AI plan.",
    pluginScriptBody:
      "Copy the website script and paste it into your site to load the chatbot widget.",
    pluginIframeBody:
      "Copy the iframe code if you want to place the chatbot inside a fixed area on a page.",
    pluginAuthBody:
      "Copy the website session snippet so the chatbot can recognize signed-in customers before the widget loads.",
  },
  de: {
    appName: "MoAssist",
    dashboard: "Übersicht",
    chatbots: "Chatbots",
    profile: "Profil",
    support: "Support",
    chatsMenu: "Chats",
    activeChats: "Aktive Chats",
    activeChatsBody: "Offene Gespraeche ueber alle deine Chatbots.",
    billings: "Abrechnung",
    billingTab: "Billing",
    signOut: "Abmelden",
    signIn: "Anmelden",
    tryNow: "Jetzt testen",
    register: "Registrieren",
    marketingTagline: "KI Chat Concierge",
    continueWithGoogle: "Mit Google fortfahren",
    continueWithApple: "Mit Apple fortfahren",
    orUseEmail: "Oder mit E-Mail fortfahren",
    fullNameLabel: "Vollstaendiger Name",
    emailLabel: "E-Mail",
    passwordLabel: "Passwort",
    pleaseWait: "Bitte warten",
    switchToRegister: "Stattdessen Konto erstellen",
    switchToSignIn: "Vorhandenes Konto verwenden",
    loginTitle: "Verwalte Chatbots, Gespräche und Wissen an einem Ort.",
    loginBody:
      "Melde dich mit Firebase an und synchronisiere dein Dashboard mit MoAssist.",
    featureA:
      "Chatbots verfolgen, Widgets veröffentlichen und Gespräche an einem Ort beantworten.",
    featureB: "Wissensdateien hochladen und Analysen ohne Wechsel anzeigen.",
    newChatbot: "Neuer Chatbot",
    createChatbot: "Chatbot erstellen",
    chatbotName: "Chatbot Name",
    cancel: "Abbrechen",
    creating: "Erstellen",
    noChatbots: "Noch keine Chatbots",
    noChatbotsBody: "Erstelle deinen ersten Chatbot, um Gespräche zu sammeln.",
    chatbotSettings: "Chatbot Einstellungen",
    saveChanges: "Änderungen speichern",
    saving: "Speichern",
    embedTitle: "Chatbot einbetten",
    embedBody: "Nutze die Snippets, um das Widget einzubinden.",
    scriptEmbed: "Script Einbettung",
    iframeEmbed: "Iframe Einbettung",
    copy: "Kopieren",
    copyCode: "Code kopieren",
    conversations: "Gespräche",
    selectConversation: "Wähle ein Gespräch.",
    messagesPlaceholder: "Antwort schreiben...",
    searchConversations: "Suche nach Name oder E-Mail",
    recentConversations: "Aktuelle Gespräche",
    allConversations: "Alle Gespraeche",
    allConversationsBody: "Alle Gespraeche ueber deine Chatbots.",
    allLabel: "Alle",
    activeLabel: "Aktiv",
    openLabel: "Offen",
    pendingLabel: "Wartend",
    closedLabel: "Geschlossen",
    viewAllChats: "Alle Chats anzeigen",
    loadingConversations: "Gespräche werden geladen...",
    noConversationsYet: "Noch keine Gespräche.",
    noConversationsFound: "Keine Gespräche gefunden.",
    newVisitor: "Neuer Besucher",
    noMessagesYet: "Noch keine Nachrichten",
    online: "Online",
    totalConversations: "Gesamtgespräche",
    activeChatbots: "Aktive Chatbots",
    openConversations: "Offene Gespräche",
    unreadConversations: "Ungelesen",
    totalMessages: "Nachrichten",
    leadsCaptured: "Leads",
    knowledgeFiles: "Wissensdateien",
    activity: "Aktivitaet",
    needsReply: "Antwort noetig",
    insights: "Einblicke",
    dashboardOverview: "Klares Dashboard",
    dashboardOverviewBody:
      "Verfolge Leistung schnell und blende alles Unnoetige aus.",
    customizeDashboard: "Dashboard anpassen",
    showMetrics: "KPI Karten anzeigen",
    showRecentDashboard: "Aktuelle Gespraeche anzeigen",
    showInsightsDashboard: "Insights Bereich anzeigen",
    compactMode: "Kompakter Modus",
    resetLayout: "Layout zuruecksetzen",
    dashboardHiddenState:
      "Alle Dashboard Bereiche sind verborgen. Aktiviere sie wieder ueber Dashboard anpassen.",
    basics: "Grundlagen",
    titleLabel: "Titel",
    botNameLabel: "Bot Name",
    statusLabel: "Status",
    initialMessageLabel: "Startnachricht",
    inputPlaceholderLabel: "Eingabe Platzhalter",
    conversationBehavior: "Gesprächsverhalten",
    authEnabledLabel: "Website Auth verlangen",
    inactivityHoursLabel: "Inaktivitaetslimit (Stunden)",
    authClientHelp:
      "Uebergib authClient aus deiner Website Session, bevor das Widget Script geladen wird.",
    authenticatedChatHelp:
      "Authentifizierte Chats wechseln nur zwischen aktiv und wartend und koennen nicht manuell geschlossen werden.",
    appearance: "Design",
    widgetLocationLabel: "Widget Position",
    roundedCornersLabel: "Abgerundete Ecken",
    logoUrlLabel: "Logo URL",
    bubbleIconUrlLabel: "Bubble Icon URL",
    domains: "Domains und Prompts",
    allowedDomainsLabel: "Erlaubte Domains",
    suggestedMessagesLabel: "Vorschlaege",
    leadForm: "Kontaktformular",
    formTitleLabel: "Formular Titel",
    keyLabel: "Schluessel",
    labelLabel: "Label",
    typeLabel: "Typ",
    requiredLabel: "Pflichtfeld",
    aiConfig: "KI-Konfiguration",
    enableAiLabel: "KI Antworten aktivieren",
    templateLabel: "Vorlage",
    responseLengthLabel: "Antwortlaenge",
    guidelinesLabel: "Richtlinien",
    uploadFiles: "Dateien hochladen",
    uploading: "Hochladen",
    addField: "Feld hinzufügen",
    remove: "Entfernen",
    delete: "Loeschen",
    noFiles: "Keine Dateien hochgeladen.",
    statusDraft: "Entwurf",
    statusPublished: "Veröffentlicht",
    supportTitle: "Support",
    supportBody: "Hilfe bei Setup, Abrechnung und Widget-Fehlern.",
    docs: "Dokumentation",
    contact: "Kontakt",
    openDocs: "Dokumente öffnen",
    emailSupport: "Support kontaktieren",
    accountDetails: "Kontodaten",
    subscription: "Abo",
    billingPerChatbotBody:
      "Abrechnung ist pro Chatbot. Bitte waehle einen Chatbot aus.",
    billingChatbot: "Abrechnungs Chatbot",
    noChatbotsForBilling:
      "Erstelle zuerst einen Chatbot, um Abrechnung zu verwalten.",
    selectedChatbot: "Ausgewaehlter Chatbot",
    planLabel: "Plan",
    billingStatusLabel: "Status",
    currentPeriodEndLabel: "Aktuelles Periodenende",
    loadingBilling: "Abrechnung wird geladen...",
    startTrial: "Testphase starten",
    upgrade: "Upgrade",
    manageBilling: "Abrechnung verwalten",
    openBilling: "Billing oeffnen",
    language: "Sprache",
    theme: "Design",
    light: "Hell",
    dark: "Dunkel",
    hideMenu: "Menue ausblenden",
    showMenu: "Menue anzeigen",
    preview: "Vorschau",
    send: "Senden",
    closeChat: "Chat schliessen",
    closingChat: "Wird geschlossen...",
    publish: "Veroeffentlichen",
    setDraft: "Entwurf",
    statusActive: "Aktiv",
    statusPending: "Wartend",
    authenticatedLabel: "Authentifiziert",
    humanLabel: "Mensch",
    aiLabel: "KI",
    visitorLabel: "Besucher",
    agentLabel: "Agent",
    messageReadByTeam: "Vom Team gelesen",
    messageUnreadByTeam: "Vom Team ungelesen",
    messageReadByVisitor: "Vom Besucher gelesen",
    messageUnreadByVisitor: "Vom Besucher ungelesen",
    scriptPath: "Script Pfad",
    iframePath: "Iframe Pfad",
    copyUrl: "Kopieren",
    billingAccessTitle: "Plan und Zugriff",
    billingAccessBody:
      "Der Plan dieses Chatbots steuert angemeldete Kundensitzungen, KI-Antworten und Wissensdateien. Oeffne Billing, um Upgrades oder Zahlungen zu verwalten.",
    billingAccessUpgradeHint:
      "Wechsle auf einen hoeheren Plan, wenn dieser Chatbot angemeldete Kunden, KI-Antworten oder Wissensdateien nutzen soll.",
    billingAccessFullHint:
      "Dieser Chatbot hat bereits Zugriff auf angemeldete Kundenchats, KI-Antworten und Wissensdateien.",
    pluginScriptBody:
      "Kopiere das Website-Script und fuege es in deine Seite ein, um das Chatbot-Widget zu laden.",
    pluginIframeBody:
      "Kopiere den Iframe-Code, wenn du den Chatbot in einem festen Bereich einer Seite anzeigen willst.",
    pluginAuthBody:
      "Kopiere das Session-Snippet deiner Website, damit der Chatbot angemeldete Kunden erkennt, bevor das Widget geladen wird.",
  },
  es: {
    appName: "MoAssist",
    dashboard: "Panel",
    chatbots: "Chatbots",
    profile: "Perfil",
    support: "Soporte",
    chatsMenu: "Chats",
    activeChats: "Chats activos",
    activeChatsBody: "Conversaciones abiertas de todos tus chatbots.",
    billings: "Facturacion",
    billingTab: "Billing",
    signOut: "Salir",
    signIn: "Entrar",
    tryNow: "Probar ahora",
    register: "Registrar",
    marketingTagline: "Asistente de chat con IA",
    continueWithGoogle: "Continuar con Google",
    continueWithApple: "Continuar con Apple",
    orUseEmail: "O continuar con correo",
    fullNameLabel: "Nombre completo",
    emailLabel: "Correo",
    passwordLabel: "Contrasena",
    pleaseWait: "Espera un momento",
    switchToRegister: "Crear cuenta en su lugar",
    switchToSignIn: "Usar cuenta existente",
    loginTitle:
      "Gestiona chatbots, conversaciones y conocimiento en un solo lugar.",
    loginBody: "Inicia sesión con Firebase y sincroniza el panel con MoAssist.",
    featureA:
      "Gestiona chatbots, publica widgets y responde conversaciones en un solo panel.",
    featureB: "Sube archivos de conocimiento y analiza métricas sin salir.",
    newChatbot: "Nuevo chatbot",
    createChatbot: "Crear chatbot",
    chatbotName: "Nombre del chatbot",
    cancel: "Cancelar",
    creating: "Creando",
    noChatbots: "Aún no hay chatbots",
    noChatbotsBody: "Crea tu primer chatbot para empezar.",
    chatbotSettings: "Ajustes del chatbot",
    saveChanges: "Guardar cambios",
    saving: "Guardando",
    embedTitle: "Inserta tu chatbot",
    embedBody: "Usa los fragmentos para instalar el widget.",
    scriptEmbed: "Script",
    iframeEmbed: "Iframe",
    copy: "Copiar",
    copyCode: "Copiar codigo",
    conversations: "Conversaciones",
    selectConversation: "Selecciona una conversación.",
    messagesPlaceholder: "Escribe una respuesta...",
    searchConversations: "Buscar por nombre o correo",
    recentConversations: "Conversaciones recientes",
    allConversations: "Todas las conversaciones",
    allConversationsBody: "Todas las conversaciones de tus chatbots.",
    allLabel: "Todas",
    activeLabel: "Activas",
    openLabel: "Abiertas",
    pendingLabel: "Pendientes",
    closedLabel: "Cerradas",
    viewAllChats: "Ver todos los chats",
    loadingConversations: "Cargando conversaciones...",
    noConversationsYet: "Sin conversaciones.",
    noConversationsFound: "No se encontraron conversaciones.",
    newVisitor: "Nuevo visitante",
    noMessagesYet: "Sin mensajes",
    online: "En línea",
    totalConversations: "Total conversaciones",
    activeChatbots: "Chatbots activos",
    openConversations: "Abiertas",
    unreadConversations: "Sin leer",
    totalMessages: "Mensajes",
    leadsCaptured: "Leads",
    knowledgeFiles: "Archivos",
    activity: "Actividad",
    needsReply: "Pendientes",
    insights: "Insights",
    dashboardOverview: "Panel claro y minimo",
    dashboardOverviewBody:
      "Sigue el rendimiento rapido y oculta lo que no necesites.",
    customizeDashboard: "Personalizar panel",
    showMetrics: "Mostrar tarjetas KPI",
    showRecentDashboard: "Mostrar conversaciones recientes",
    showInsightsDashboard: "Mostrar panel de insights",
    compactMode: "Modo compacto",
    resetLayout: "Restablecer panel",
    dashboardHiddenState:
      "Todos los paneles estan ocultos. Abre Personalizar panel para mostrarlos de nuevo.",
    basics: "Básico",
    titleLabel: "Título",
    botNameLabel: "Nombre del bot",
    statusLabel: "Estado",
    initialMessageLabel: "Mensaje inicial",
    inputPlaceholderLabel: "Placeholder",
    conversationBehavior: "Comportamiento de la conversacion",
    authEnabledLabel: "Requerir auth del sitio",
    inactivityHoursLabel: "Tiempo de inactividad (horas)",
    authClientHelp:
      "Pasa authClient desde la sesion de tu sitio antes de cargar el script del widget.",
    authenticatedChatHelp:
      "Los chats autenticados solo usan activo o pendiente y no se pueden cerrar manualmente.",
    appearance: "Apariencia",
    widgetLocationLabel: "Ubicación del widget",
    roundedCornersLabel: "Esquinas redondeadas",
    logoUrlLabel: "URL del logo",
    bubbleIconUrlLabel: "URL del icono",
    domains: "Dominios y prompts",
    allowedDomainsLabel: "Dominios permitidos",
    suggestedMessagesLabel: "Mensajes sugeridos",
    leadForm: "Formulario de leads",
    formTitleLabel: "Título del formulario",
    keyLabel: "Clave",
    labelLabel: "Etiqueta",
    typeLabel: "Tipo",
    requiredLabel: "Requerido",
    aiConfig: "Configuración IA",
    enableAiLabel: "Activar respuestas IA",
    templateLabel: "Plantilla",
    responseLengthLabel: "Longitud de respuesta",
    guidelinesLabel: "Guías",
    uploadFiles: "Subir archivos",
    uploading: "Subiendo",
    addField: "Agregar campo",
    remove: "Eliminar",
    delete: "Eliminar",
    noFiles: "No hay archivos.",
    statusDraft: "Borrador",
    statusPublished: "Publicado",
    supportTitle: "Soporte",
    supportBody: "Ayuda con configuración, pagos y widget.",
    docs: "Documentación",
    contact: "Contacto",
    openDocs: "Abrir docs",
    emailSupport: "Contactar soporte",
    accountDetails: "Cuenta",
    subscription: "Suscripción",
    billingPerChatbotBody:
      "La facturacion se gestiona por chatbot. Selecciona uno para continuar.",
    billingChatbot: "Chatbot de facturacion",
    noChatbotsForBilling: "Crea primero un chatbot para gestionar pagos.",
    selectedChatbot: "Chatbot seleccionado",
    planLabel: "Plan",
    billingStatusLabel: "Estado",
    currentPeriodEndLabel: "Fin del periodo actual",
    loadingBilling: "Cargando facturacion...",
    startTrial: "Iniciar prueba",
    upgrade: "Mejorar plan",
    manageBilling: "Gestionar pagos",
    openBilling: "Abrir billing",
    language: "Idioma",
    theme: "Tema",
    light: "Claro",
    dark: "Oscuro",
    hideMenu: "Ocultar menu",
    showMenu: "Mostrar menu",
    preview: "Vista previa",
    send: "Enviar",
    closeChat: "Cerrar chat",
    closingChat: "Cerrando...",
    publish: "Publicar",
    setDraft: "Borrador",
    statusActive: "Activo",
    statusPending: "Pendiente",
    authenticatedLabel: "Autenticado",
    humanLabel: "Humano",
    aiLabel: "IA",
    visitorLabel: "Visitante",
    agentLabel: "Agente",
    messageReadByTeam: "Leido por el equipo",
    messageUnreadByTeam: "No leido por el equipo",
    messageReadByVisitor: "Leido por el visitante",
    messageUnreadByVisitor: "No leido por el visitante",
    scriptPath: "Ruta del script",
    iframePath: "Ruta del iframe",
    copyUrl: "Copiar",
    billingAccessTitle: "Plan y acceso",
    billingAccessBody:
      "El plan de este chatbot controla chats con usuarios identificados, respuestas con IA y archivos de conocimiento. Abre billing para mejorar el plan o gestionar pagos.",
    billingAccessUpgradeHint:
      "Sube de plan cuando quieras sesiones con usuarios identificados, respuestas con IA o archivos de conocimiento en este chatbot.",
    billingAccessFullHint:
      "Este chatbot ya tiene acceso a sesiones con usuarios identificados, respuestas con IA y archivos de conocimiento.",
    pluginScriptBody:
      "Copia el script del sitio y pegalo en tu web para cargar el widget del chatbot.",
    pluginIframeBody:
      "Copia el codigo del iframe si quieres colocar el chatbot dentro de un area fija de una pagina.",
    pluginAuthBody:
      "Copia el fragmento de sesion de tu sitio para que el chatbot reconozca a usuarios identificados antes de cargar el widget.",
  },
};

dictionary.fr = {
  appName: "MoAssist",
  dashboard: "Tableau de bord",
  signOut: "Se deconnecter",
  signIn: "Se connecter",
  tryNow: "Essayer",
  marketingTagline: "Concierge chat IA",
  theme: "Theme",
  light: "Clair",
  dark: "Sombre",
  hideMenu: "Masquer le menu",
  showMenu: "Afficher le menu",
};

dictionary.it = {
  appName: "MoAssist",
  dashboard: "Dashboard",
  signOut: "Esci",
  signIn: "Accedi",
  tryNow: "Prova ora",
  marketingTagline: "Assistente chat AI",
  theme: "Tema",
  light: "Chiaro",
  dark: "Scuro",
  hideMenu: "Nascondi menu",
  showMenu: "Mostra menu",
};

dictionary.ru = {
  appName: "MoAssist",
  dashboard: "Панель",
  signOut: "Выйти",
  signIn: "Войти",
  tryNow: "Попробовать",
  marketingTagline: "AI чат-консьерж",
  theme: "Тема",
  light: "Светлая",
  dark: "Темная",
  hideMenu: "Скрыть меню",
  showMenu: "Показать меню",
};

dictionary.ua = {
  appName: "MoAssist",
  dashboard: "Панель",
  signOut: "Вийти",
  signIn: "Увійти",
  tryNow: "Спробувати",
  marketingTagline: "AI чат-консьєрж",
  theme: "Тема",
  light: "Світла",
  dark: "Темна",
  hideMenu: "Сховати меню",
  showMenu: "Показати меню",
};

export const I18nProvider = ({ children }) => {
  const location = useLocation();
  const [language, setLanguage] = useState(() => {
    const pathLocale = readLocaleFromPathname(window.location.pathname);
    if (pathLocale?.key && pathLocale.key !== DEFAULT_LOCALE_KEY) {
      return pathLocale.key;
    }

    const queryLocale = readLocaleFromSearch(window.location.search);
    if (queryLocale?.key) {
      return queryLocale.key;
    }

    const stored = localStorage.getItem(LANG_KEY);
    return resolveLocale(stored).key || DEFAULT_LOCALE_KEY;
  });

  useEffect(() => {
    const pathLocale = readLocaleFromPathname(location.pathname);

    if (pathLocale?.key && pathLocale.key !== DEFAULT_LOCALE_KEY) {
      if (pathLocale.key !== language) {
        setLanguage(pathLocale.key);
        localStorage.setItem(LANG_KEY, pathLocale.key);
      }

      return;
    }

    const queryLocale = readLocaleFromSearch(location.search);
    const hasQueryLocale = new URLSearchParams(location.search).has("lang");

    if (hasQueryLocale && isPublicLandingPath(location.pathname)) {
      const normalizedUrl = new URL(window.location.href);
      normalizedUrl.pathname = buildLocalizedPath(
        location.pathname,
        queryLocale.key,
      );
      normalizedUrl.searchParams.delete("lang");
      window.history.replaceState({}, "", normalizedUrl.toString());

      if (queryLocale.key !== language) {
        setLanguage(queryLocale.key);
        localStorage.setItem(LANG_KEY, queryLocale.key);
      }

      return;
    }

    if (location.pathname === "/" && language !== DEFAULT_LOCALE_KEY) {
      const localizedUrl = new URL(window.location.href);
      localizedUrl.pathname = buildLocalizedPath("/", language);
      window.history.replaceState({}, "", localizedUrl.toString());
    }
  }, [language, location.pathname, location.search]);

  const t = useMemo(
    () => (key) => dictionary[language]?.[key] || dictionary.en[key] || key,
    [language],
  );

  const value = useMemo(
    () => ({
      language,
      setLanguage: (lang) => {
        const nextLocale = resolveLocale(lang);

        if (!dictionary[nextLocale.key]) return;

        setLanguage(nextLocale.key);
        localStorage.setItem(LANG_KEY, nextLocale.key);

        const nextUrl = new URL(window.location.href);

        if (isPublicLandingPath(location.pathname)) {
          nextUrl.pathname = buildLocalizedPath(
            location.pathname,
            nextLocale.key,
          );
          nextUrl.searchParams.delete("lang");
        }

        window.location.replace(nextUrl.toString());
      },
      t,
      languages: LANGUAGE_OPTIONS.map(({ key }) => key),
      languageOptions: LANGUAGE_OPTIONS,
    }),
    [language, location.pathname, t],
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
};

export const useI18n = () => useContext(I18nContext);
