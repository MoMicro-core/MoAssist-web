import { Heading } from '../ui/heading'
import { Text } from '../ui/text'
import { Button } from '../ui/button'
import { getRuntime } from '../lib/runtime'

export const Support = () => (
  <div className="space-y-6">
    <div>
      <Heading level={2} className="font-display text-2xl">
        Support
      </Heading>
      <Text className="text-sm text-zinc-600">
        Get help with setup, billing, and widget troubleshooting.
      </Text>
    </div>
    <div className="grid gap-4 md:grid-cols-2">
      <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
        <Heading level={3} className="font-display text-lg">
          Documentation
        </Heading>
        <Text className="mt-2 text-sm text-zinc-600">
          Review the MoAssist API, widget embed, and knowledge file guides.
        </Text>
        <Button
          color="teal"
          className="mt-4"
          onClick={() => window.open(`${getRuntime().apiBaseUrl}/docs`, '_blank')}
        >
          Open docs
        </Button>
      </div>
      <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
        <Heading level={3} className="font-display text-lg">
          Contact
        </Heading>
        <Text className="mt-2 text-sm text-zinc-600">
          Send feedback or request onboarding assistance.
        </Text>
        <Button outline className="mt-4" onClick={() => window.location.href = 'mailto:support@momicro.ai'}>
          Email support
        </Button>
      </div>
    </div>
  </div>
)
