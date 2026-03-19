export const Imprint = () => {
  return (
    <main className="mx-auto w-full max-w-4xl space-y-8 px-6 py-12 text-zinc-700 dark:text-zinc-200">
      <a href="/" className="text-sm text-teal-700 hover:underline dark:text-teal-300">← Back to home</a>
      <h1 className="font-display text-4xl font-semibold text-zinc-900 dark:text-white">Imprint</h1>

      <section className="space-y-2">
        <h2 className="font-display text-xl font-semibold text-zinc-900 dark:text-white">Provider</h2>
        <p>MoMicro Assist</p>
        <p>Sample Street 1</p>
        <p>10115 Berlin, Germany</p>
      </section>

      <section className="space-y-2">
        <h2 className="font-display text-xl font-semibold text-zinc-900 dark:text-white">Contact</h2>
        <p>Email: legal@momicro.ai</p>
        <p>Support: support@momicro.ai</p>
      </section>

      <section className="space-y-2">
        <h2 className="font-display text-xl font-semibold text-zinc-900 dark:text-white">Responsible for Content</h2>
        <p>MoMicro Assist Management Team</p>
      </section>

      <section className="space-y-2">
        <h2 className="font-display text-xl font-semibold text-zinc-900 dark:text-white">Dispute Resolution</h2>
        <p>We are not obligated and generally not willing to participate in consumer arbitration proceedings.</p>
      </section>
    </main>
  )
}
