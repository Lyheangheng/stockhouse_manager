import { cookies } from "next/headers";
import { notFound, redirect } from "next/navigation";

const accountRoles: Record<string, "admin" | "branch"> = {
  admin: "admin",
  branch1: "branch",
  branch2: "branch",
  branch3: "branch",
};

export default async function DashboardPage({ params }: { params: Promise<{ accountId: string }> }) {
  const { accountId } = await params;
  const role = accountRoles[accountId];
  if (!role) notFound();

  const sessionCookie = (await cookies()).get("agrifeed_session")?.value;
  if (!sessionCookie) redirect("/");

  let session: { id?: string; role?: string } | null = null;
  try {
    session = JSON.parse(sessionCookie) as { id?: string; role?: string };
  } catch {
    redirect("/");
  }

  if (session?.id !== accountId || session.role !== role) redirect("/");

  return (
    <iframe
      title="AgriFeed WMS"
      src={`/wms.html?account=${encodeURIComponent(accountId)}`}
      style={{ width: "100%", height: "100vh", border: 0, display: "block" }}
    />
  );
}
