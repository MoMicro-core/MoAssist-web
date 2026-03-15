import { useNavigate } from 'react-router-dom'
import { Button } from '../ui/button'
import { Heading } from '../ui/heading'
import { Text } from '../ui/text'

export const NotFound = () => {
  const navigate = useNavigate()
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 px-6 text-center">
      <Heading level={1} className="font-display text-4xl">
        Page not found
      </Heading>
      <Text className="text-sm text-zinc-600">
        The page you are looking for does not exist.
      </Text>
      <Button color="teal" onClick={() => navigate('/chatbots')}>
        Back to dashboard
      </Button>
    </div>
  )
}
