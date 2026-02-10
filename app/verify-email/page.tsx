import VerifyEmailClient from "./VerifyEmailClient";

// Server Component do Next.js
// Pega o email diretamente dos query params do URL
interface PageProps {
  searchParams?: { email?: string };
}

export default function Page({ searchParams }: PageProps) {
  const emailFromUrl = searchParams?.email || "";

  return <VerifyEmailClient emailFromUrl={emailFromUrl} />;
}
