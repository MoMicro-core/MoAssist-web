import { useEffect, useState } from "react";
import { Button } from "../ui/button";

export const CookieBanner = () => {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    const cookiesAllow = localStorage.getItem("cookiesAllow");
    if (cookiesAllow === null || cookiesAllow === "false") {
      setShowBanner(true);
    }
  }, []);

  const handleAcceptAll = () => {
    localStorage.setItem("cookiesAllow", "true");
    setShowBanner(false);
  };

  const handleReject = () => {
    localStorage.setItem("cookiesAllow", "false");
    setShowBanner(false);
  };

  if (!showBanner) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-zinc-900 border-t border-zinc-200 dark:border-zinc-800 shadow-lg p-4 z-50">
      <div className="mx-auto max-w-4xl flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex-1">
          <p className="text-sm text-zinc-700 dark:text-zinc-300">
            <span className="font-semibold">We use cookies</span>
            <br className="sm:hidden" />
            {" "}Necessary cookies ensure functionality. Optional cookies improve analytics.
          </p>
        </div>
        <div className="flex gap-3">
          <Button
            onClick={handleReject}
            variant="outline"
            className="text-sm"
          >
            Reject
          </Button>
          <Button
            onClick={handleAcceptAll}
            className="bg-teal-600 hover:bg-teal-700 text-white text-sm"
          >
            Accept all
          </Button>
        </div>
      </div>
    </div>
  );
};
