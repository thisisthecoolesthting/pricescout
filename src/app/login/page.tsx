import { LoginForm } from "./login-form";

export const metadata = {
  title: "Sign in — PriceScout",
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; next?: string }>;
}) {
  const sp = await searchParams;
  const nextPath = sp.next?.startsWith("/") ? sp.next : "/admin";
  return (
    <div className="hero-bg hero-grain min-h-[70vh] pt-24 pb-16">
      <div className="container-pricescout mx-auto max-w-md">
        <h1 className="gradient-text mb-2 text-3xl font-bold">Sign in</h1>
        <p className="mb-6 text-sm text-muted">Operator console for your crew&rsquo;s tag list.</p>
        <LoginForm initialError={sp.error} nextPath={nextPath} />
      </div>
    </div>
  );
}
