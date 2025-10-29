import { Link } from "@tanstack/react-router";
import { CalendarDays, CheckCircle2, ShieldCheck } from "lucide-react";
import { useEffect } from "react";

import { useSignOut, useUserProfile } from "@/hooks/react-query/useAuth";
import { useAuthStore } from "@/hooks/useAuthStore";
import { getAuthValueFromStorage } from "@/services";

import { Button, Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui";

const featureHighlights = [
  {
    title: "Secure access",
    description: "Authentication tokens are stored safely and checked on every request.",
    Icon: ShieldCheck,
  },
  {
    title: "Smart fetching",
    description: "React Query keeps your profile data cached and up to date.",
    Icon: CalendarDays,
  },
  {
    title: "Clear validation",
    description: "Forms provide instant feedback powered by React Hook Form and zod.",
    Icon: CheckCircle2,
  },
];

const quickActions = [
  {
    title: "View profile",
    description: "Check the details you provided during registration.",
    href: "/profile",
    cta: "Open profile",
  },
  {
    title: "Sign out",
    description: "End this session if you are on a shared computer.",
    action: "signOut" as const,
    cta: "Log out",
  },
];

export default function HomePage() {
  const { mutate: signOut, isPending: isSigningOut } = useSignOut();
  const { data, isError, error, isLoading, isFetching, refetch } = useUserProfile();
  const { accessToken, setAccessToken } = useAuthStore();

  useEffect(() => {
    if (!accessToken) {
      const token = getAuthValueFromStorage()?.accessToken;
      if (token) {
        setAccessToken(token);
        refetch();
      }
    }
  }, [accessToken, refetch, setAccessToken]);
  const showLoading = !data && (isLoading || (isFetching && !isError));
  const errorMessage = error instanceof Error ? error.message : undefined;

  return (
    <div className="min-h-screen bg-slate-50">
      <main className="mx-auto flex w-full max-w-4xl flex-col gap-8 px-4 py-12">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-semibold text-slate-900">
              {data ? `Welcome back, ${data.username}!` : "Welcome back"}
            </CardTitle>
            <CardDescription>
              Manage your account, review your details, and continue your learning journey.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-3">
            <Button asChild>
              <Link to="/profile">Go to profile</Link>
            </Button>
            <Button variant="outline" onClick={() => signOut()} disabled={isSigningOut}>
              {isSigningOut ? "Signing out..." : "Log out"}
            </Button>
          </CardContent>
        </Card>

        {showLoading && (
          <Card className="border border-dashed border-slate-200">
            <CardContent className="py-6 text-sm text-muted-foreground">
              Loading your profile details...
            </CardContent>
          </Card>
        )}

        {isError && !showLoading && (
          <Card className="border border-red-200 bg-red-50">
            <CardHeader>
              <CardTitle className="text-base font-semibold text-red-600">
                Unable to load profile
              </CardTitle>
              <CardDescription className="text-sm text-red-600/80">
                {errorMessage ?? "We couldn't fetch your profile. Please try again."}
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-2">
              <Button
                variant="secondary"
                onClick={() => refetch()}
                disabled={isFetching}
              >
                {isFetching ? "Retrying..." : "Try again"}
              </Button>
              <Button variant="outline" onClick={() => signOut()} disabled={isSigningOut}>
                {isSigningOut ? "Signing out..." : "Log out"}
              </Button>
            </CardContent>
          </Card>
        )}

        <section className="grid gap-4 md:grid-cols-3">
          {featureHighlights.map(({ title, description, Icon }) => (
            <Card key={title} className="border border-slate-200">
              <CardHeader className="space-y-2">
                <div className="flex size-9 items-center justify-center rounded-full bg-primary/10">
                  <Icon className="size-4 text-primary" />
                </div>
                <CardTitle className="text-base font-semibold text-slate-900">{title}</CardTitle>
                <CardDescription>{description}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </section>

        <Card className="border border-slate-200">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-slate-900">Quick actions</CardTitle>
            <CardDescription>Jump to the most common follow-up steps.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-3 sm:grid-cols-2">
            {quickActions.map((action) => (
              <Card key={action.title} className="border border-dashed border-slate-200">
                <CardHeader className="space-y-1">
                  <CardTitle className="text-base font-medium text-slate-900">
                    {action.title}
                  </CardTitle>
                  <CardDescription>{action.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  {action.action === "signOut" ? (
                    <Button
                      variant="secondary"
                      className="w-full"
                      onClick={() => signOut()}
                      disabled={isSigningOut}
                    >
                      {isSigningOut ? "Signing out..." : action.cta}
                    </Button>
                  ) : (
                    <Button asChild className="w-full">
                      <Link to={action.href}>{action.cta}</Link>
                    </Button>
                  )}
                </CardContent>
              </Card>
            ))}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
