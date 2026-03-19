import { motion } from "framer-motion";
import { Button } from "../ui/button";
import { PublicHeader } from "../components/PublicHeader";

const sectionAnimation = {
  initial: { opacity: 0, y: 28 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.22 },
  transition: { duration: 0.55, ease: "easeOut" },
};

export const Landing = () => {
  return (
    <div className="relative min-h-screen overflow-hidden pb-12">
      <div className="pointer-events-none absolute -left-20 top-20 h-64 w-64 rounded-full bg-teal-400/20 blur-3xl" />
      <div className="pointer-events-none absolute -right-24 top-64 h-72 w-72 rounded-full bg-cyan-400/20 blur-3xl" />

      <PublicHeader />

      <main className="mx-auto mt-8 w-full max-w-7xl space-y-20 px-5 sm:px-8">
        <motion.section
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, ease: "easeOut" }}
          className="grid items-center gap-10 lg:grid-cols-[1.05fr,0.95fr]"
        >
          <div className="space-y-6">
            <h1 className="font-display text-4xl font-semibold tracking-tight text-zinc-900 sm:text-5xl lg:text-6xl dark:text-white">
              Turn every visitor message into a booked conversation.
            </h1>
            <p className="max-w-xl text-base text-zinc-600 sm:text-lg dark:text-zinc-300">
              MoAssist unifies chatbot deployment, live chats, and billing per
              chatbot in one calm dashboard. Built for teams who want speed
              without noise.
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <Button color="teal" href="/chatbots">
                Try now
              </Button>
              <Button outline href="/login">
                Login
              </Button>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.55, delay: 0.2 }}
            className="relative"
          >
            <div className="absolute -inset-4 rounded-[2rem] bg-gradient-to-br from-teal-300/35 to-cyan-300/20 blur-2xl" />
            <img
              src="/preview/hero-dashboard.svg"
              alt="MoAssist dashboard preview"
              className="relative w-full rounded-[1.75rem] border border-white/60 shadow-2xl shadow-zinc-900/20"
            />
          </motion.div>
        </motion.section>

        <motion.section
          {...sectionAnimation}
          className="grid gap-5 md:grid-cols-3"
        >
          {[
            {
              title: "Real-time response desk",
              body: "Handle open chats across all chatbots with clear priority and context.",
            },
            {
              title: "Per-chatbot billing",
              body: "Launch, trial, and manage subscriptions independently per assistant.",
            },
            {
              title: "Plug-and-play install",
              body: "Deploy script and iframe widgets in minutes with full branding control.",
            },
          ].map((item) => (
            <motion.div
              key={item.title}
              whileHover={{ y: -6 }}
              className="glass-panel rounded-3xl p-6"
            >
              <h3 className="font-display text-lg font-semibold text-zinc-900 dark:text-white">
                {item.title}
              </h3>
              <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-300">
                {item.body}
              </p>
            </motion.div>
          ))}
        </motion.section>

        <motion.section
          {...sectionAnimation}
          className="grid gap-6 lg:grid-cols-2"
        >
          <motion.div
            whileHover={{ y: -6 }}
            className="glass-panel overflow-hidden rounded-3xl p-4 sm:p-5"
          >
            <img
              src="/preview/chat-flow.svg"
              alt="Chat flow preview"
              className="w-full rounded-2xl border border-white/60"
            />
          </motion.div>
          <motion.div
            whileHover={{ y: -6 }}
            className="glass-panel overflow-hidden rounded-3xl p-4 sm:p-5"
          >
            <img
              src="/preview/analytics-wave.svg"
              alt="Analytics preview"
              className="w-full rounded-2xl border border-white/60"
            />
          </motion.div>
        </motion.section>

        <motion.section
          {...sectionAnimation}
          className="glass-panel rounded-3xl p-7 sm:p-10"
        >
          <div className="max-w-3xl space-y-4">
            <h2 className="font-display text-3xl font-semibold text-zinc-900 sm:text-4xl dark:text-white">
              Ready to preview your own AI stay assistant?
            </h2>
            <p className="text-zinc-600 dark:text-zinc-300">
              Start with one chatbot, scale to many, and control every
              conversation from one interface.
            </p>
            <div className="flex flex-wrap gap-3 pt-2">
              <Button color="teal" href="/chatbots">
                Try now
              </Button>
              <Button outline href="/login">
                Login
              </Button>
            </div>
          </div>
        </motion.section>
      </main>

      <footer className="mx-auto mt-12 flex w-full max-w-7xl flex-wrap items-center justify-between gap-4 px-5 text-xs text-zinc-500 sm:px-8">
        <div>© {new Date().getFullYear()} MoAssist</div>
        <div className="flex flex-wrap items-center gap-3">
          <a
            href="/privacy-policy"
            className="hover:text-zinc-800 dark:hover:text-zinc-200"
          >
            Privacy Policy
          </a>
          <a
            href="/imprint"
            className="hover:text-zinc-800 dark:hover:text-zinc-200"
          >
            Imprint
          </a>
          <a
            href="/terms-and-conditions"
            className="hover:text-zinc-800 dark:hover:text-zinc-200"
          >
            Terms & Conditions
          </a>
        </div>
      </footer>

      <div className="fixed inset-x-0 bottom-3 z-30 px-4 sm:hidden">
        <div className="glass-panel flex items-center gap-2 rounded-2xl p-2">
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
