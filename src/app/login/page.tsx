import LoginForm from '@/components/auth/LoginForm';
import { googleEnabled } from '@/lib/google';
import { oauthErrorMessage } from '@/lib/oauth-messages';

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 to-brand-50 p-4">
      <LoginForm googleEnabled={googleEnabled()} initialError={oauthErrorMessage(error)} />
    </main>
  );
}