import { useSearchParams, useNavigate } from "react-router-dom";
import { XCircleIcon } from "@heroicons/react/24/solid";
import { Button } from "../ui/button";
import { Heading } from "../ui/heading";
import { Text } from "../ui/text";

export const BillingFailure = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const chatbotId = searchParams.get("chatbotId");

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-red-50 via-white to-rose-50 px-4 dark:from-red-950/20 dark:via-zinc-950 dark:to-rose-950/10">
      <div className="w-full max-w-md rounded-3xl border border-red-200/80 bg-white/90 p-10 text-center shadow-xl backdrop-blur-sm dark:border-red-500/20 dark:bg-zinc-900/80">
        <div className="mb-6 flex justify-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-red-400 to-rose-500 shadow-lg shadow-red-500/30">
            <XCircleIcon className="size-10 text-white" />
          </div>
        </div>
        <Heading level={2} className="font-display text-2xl text-zinc-900 dark:text-white">
          Payment unsuccessful
        </Heading>
        <Text className="mt-3 text-zinc-600 dark:text-zinc-300">
          Something went wrong with your payment. No charge was made. Please try again or contact support if the issue persists.
        </Text>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          {chatbotId ? (
            <Button
              color="sky"
              onClick={() => navigate(`/chatbots/${chatbotId}/billing`)}
            >
              Try again
            </Button>
          ) : (
            <Button color="sky" onClick={() => navigate("/billings")}>
              Try again
            </Button>
          )}
          <Button outline onClick={() => navigate("/chatbots")}>
            Back to chatbots
          </Button>
        </div>
      </div>
    </div>
  );
};
