import { useSearchParams, useNavigate } from "react-router-dom";
import { CheckCircleIcon } from "@heroicons/react/24/solid";
import { Button } from "../ui/button";
import { Heading } from "../ui/heading";
import { Text } from "../ui/text";

export const BillingSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const chatbotId = searchParams.get("chatbotId");

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-sky-50 via-white to-cyan-50 px-4 dark:from-sky-950/20 dark:via-zinc-950 dark:to-cyan-950/10">
      <div className="w-full max-w-md rounded-3xl border border-emerald-200/80 bg-white/90 p-10 text-center shadow-xl backdrop-blur-sm dark:border-emerald-500/20 dark:bg-zinc-900/80">
        <div className="mb-6 flex justify-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 shadow-lg shadow-emerald-500/30">
            <CheckCircleIcon className="size-10 text-white" />
          </div>
        </div>
        <Heading level={2} className="font-display text-2xl text-zinc-900 dark:text-white">
          Payment successful!
        </Heading>
        <Text className="mt-3 text-zinc-600 dark:text-zinc-300">
          Your subscription is now active. All features have been unlocked for your chatbot.
        </Text>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          {chatbotId ? (
            <Button
              color="sky"
              onClick={() => navigate(`/chatbots/${chatbotId}/dashboard`)}
            >
              Go to dashboard
            </Button>
          ) : null}
          <Button outline onClick={() => navigate("/chatbots")}>
            All chatbots
          </Button>
        </div>
      </div>
    </div>
  );
};
