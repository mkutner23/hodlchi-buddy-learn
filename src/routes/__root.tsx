import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { HodlchiProvider } from "@/lib/hodlchi-store";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <div className="text-6xl mb-4">🥚</div>
        <h1 className="text-5xl font-bold text-foreground">404</h1>
        <p className="mt-3 text-muted-foreground">This nest is empty.</p>
        <Link
          to="/"
          className="mt-6 inline-flex items-center rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-soft hover:bg-primary/90"
        >
          Back home
        </Link>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold">Something wobbled.</h1>
        <p className="mt-2 text-sm text-muted-foreground">Your Hodlchi is safe. Try again.</p>
        <div className="mt-6 flex justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground"
          >
            Try again
          </button>
          <a href="/" className="rounded-full border px-5 py-2.5 text-sm font-semibold">
            Home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1, viewport-fit=cover" },
      { name: "theme-color", content: "#8fe36b" },
      { name: "google-site-verification", content: "-XBtYtp9DNWGMoyu0q01hxCINjm4wCIQF_gSFLIw3ig" },
      { property: "og:site_name", content: "Hodlchi" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { title: "Hodlchi - Learn money. Raise your Hodlchi." },
      { property: "og:title", content: "Hodlchi - Learn money. Raise your Hodlchi." },
      { name: "twitter:title", content: "Hodlchi - Learn money. Raise your Hodlchi." },
      { name: "description", content: "Hodlchi is the Duolingo of Money. Hatch a companion. Learn m" },
      { property: "og:description", content: "Hodlchi is the Duolingo of Money. Hatch a companion. Learn m" },
      { name: "twitter:description", content: "Hodlchi is the Duolingo of Money. Hatch a companion. Learn m" },
      { property: "og:image", content: "https://storage.googleapis.com/gpt-engineer-file-uploads/attachments/og-images/9cb8e19b-785c-4402-a5f2-525af371373b" },
      { name: "twitter:image", content: "https://storage.googleapis.com/gpt-engineer-file-uploads/attachments/og-images/9cb8e19b-785c-4402-a5f2-525af371373b" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "icon", href: "/favicon.ico", type: "image/x-icon" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,600;9..144,800&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap",
      },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "Organization",
              name: "Hodlchi",
              url: "https://demo.hodlchi.com",
              description:
                "Hodlchi is the Duolingo of Money — bite-size financial literacy lessons that grow a cute virtual companion.",
            },
            {
              "@type": "WebSite",
              name: "Hodlchi",
              url: "https://demo.hodlchi.com",
            },
          ],
        }),
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  return (
    <QueryClientProvider client={queryClient}>
      <HodlchiProvider>
        <Outlet />
      </HodlchiProvider>
    </QueryClientProvider>
  );
}
