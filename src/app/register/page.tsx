import RegisterForm from '@/components/auth/RegisterForm';

export default function RegisterPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 to-brand-50 p-4 dark:from-[#121620] dark:to-[#1a202c]">
      <RegisterForm />
    </main>
  );
}
