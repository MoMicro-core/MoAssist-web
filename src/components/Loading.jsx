export const Loading = ({ label = 'Loading' }) => (
  <div className="flex min-h-[240px] items-center justify-center">
    <div className="flex items-center gap-3 rounded-full bg-white px-4 py-2 shadow-sm ring-1 ring-zinc-950/5">
      <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-emerald-500" />
      <span className="text-sm font-medium text-zinc-700">{label}</span>
    </div>
  </div>
)
