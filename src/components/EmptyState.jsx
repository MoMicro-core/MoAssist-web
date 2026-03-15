import { Button } from '../ui/button'
import { Heading } from '../ui/heading'
import { Text } from '../ui/text'

export const EmptyState = ({ title, description, actionLabel, onAction }) => (
  <div className="flex min-h-[240px] flex-col items-center justify-center gap-4 rounded-2xl border border-dashed border-zinc-200 bg-white p-10 text-center shadow-sm dark:border-white/10 dark:bg-zinc-900">
    <div className="space-y-1">
      <Heading level={3} className="font-display text-xl">
        {title}
      </Heading>
      <Text className="text-sm text-zinc-600">{description}</Text>
    </div>
    {actionLabel && onAction ? (
      <Button color="teal" onClick={onAction}>
        {actionLabel}
      </Button>
    ) : null}
  </div>
)
