// FILE: app/c/[code]/page.tsx
import { redirect, notFound } from "next/navigation";
import ClaimCard from "@/components/claim-card";

export default async function CardPage({
  params,
}: {
  params: { code: string };
}) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/card/${params.code}`,
    { cache: "no-store" },
  );
  if (!res.ok) notFound();

  const data = await res.json();

  if (data.claimed) redirect(`/${data.username}`);

  return <ClaimCard code={params.code} name={data.name} locked={data.locked} />;
}
