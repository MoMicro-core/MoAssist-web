import { Heading } from "../ui/heading";
import { Text } from "../ui/text";
import { Button } from "../ui/button";
import { getRuntime } from "../lib/runtime";
import { useI18n } from "../context/I18nContext";

export const Support = () => {
  const { t } = useI18n();

  return (
    <div className="space-y-6">
      <div>
        <Heading level={2} className="font-display text-2xl">
          {t("supportTitle")}
        </Heading>
        <Text className="text-sm text-zinc-600">{t("supportBody")}</Text>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-zinc-900">
          <Heading level={3} className="font-display text-lg">
            {t("contact")}
          </Heading>
          <Text className="mt-2 text-sm text-zinc-600">
            Send feedback or request onboarding assistance.
          </Text>
          <Button
            outline
            className="mt-4"
            onClick={() => (window.location.href = "mailto:support@momicro.com")}
          >
            {t("emailSupport")}
          </Button>
        </div>
      </div>
    </div>
  );
};
