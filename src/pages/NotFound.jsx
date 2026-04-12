import { useNavigate } from 'react-router-dom'
import { useI18n } from '../context/I18nContext'
import { Button } from '../ui/button'
import { Heading } from '../ui/heading'
import { Text } from '../ui/text'

export const NotFound = () => {
  const navigate = useNavigate()
  const { language } = useI18n()
  const copy =
    {
      de: {
        title: 'Seite nicht gefunden',
        body: 'Die gesuchte Seite existiert nicht.',
        cta: 'Zurück zum Dashboard',
      },
      es: {
        title: 'Página no encontrada',
        body: 'La página que buscas no existe.',
        cta: 'Volver al panel',
      },
    }[language] || {
      title: 'Page not found',
      body: 'The page you are looking for does not exist.',
      cta: 'Back to dashboard',
    }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 px-6 text-center">
      <Heading level={1} className="font-display text-4xl">
        {copy.title}
      </Heading>
      <Text className="text-sm text-zinc-600">
        {copy.body}
      </Text>
      <Button color="teal" onClick={() => navigate('/chatbots')}>
        {copy.cta}
      </Button>
    </div>
  )
}
