import LoginForm from '@/components/auth/LoginForm';

export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 to-brand-50 p-4 dark:from-[#1a1f2e] dark:to-[#1e2538]">
      <LoginForm />
    </main>
  );
}
