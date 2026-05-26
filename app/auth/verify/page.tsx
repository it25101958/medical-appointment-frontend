import { VerifyForm } from "@/features/auth";

export default function VerifyPage({
  searchParams,
}: {
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  const emailParam = searchParams?.email;
  const email = Array.isArray(emailParam)
    ? (emailParam[0] ?? "")
    : (emailParam ?? "");

  return (
    <main className="col-start-1 col-end-14 flex min-h-[60vh] items-center justify-center">
      <div className="max-w-lg rounded-lg border border-border bg-card p-6 shadow-sm">
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-semibold">Verify Your Account</h1>
        </div>
        <VerifyForm initialEmail={email} />
      </div>
    </main>
  );
}
