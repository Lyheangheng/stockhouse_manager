import { cookies } from "next/headers";
import { notFound, redirect } from "next/navigation";

const accountDetails: Record<string, { role: "admin" | "branch"; label: string; title: string; description: string }> = {
  admin: {
    role: "admin",
    label: "ผู้ดูแลคลังกลาง",
    title: "แดชบอร์ดผู้ดูแลคลังกลาง",
    description: "อนุมัติคำขอเบิกสินค้า ตรวจสอบสต็อก และดูแลคลังกลาง",
  },
  branch1: { role: "branch", label: "สาขา 1 (ในเมือง)", title: "แดชบอร์ดสาขา 1", description: "จัดการสต็อกหน้าร้าน บันทึกการขาย และส่งใบเบิก" },
  branch2: { role: "branch", label: "สาขา 2 (รอบเมือง)", title: "แดชบอร์ดสาขา 2", description: "จัดการสต็อกหน้าร้าน บันทึกการขาย และส่งใบเบิก" },
  branch3: { role: "branch", label: "สาขา 3 (อำเภอ)", title: "แดชบอร์ดสาขา 3", description: "จัดการสต็อกหน้าร้าน บันทึกการขาย และส่งใบเบิก" },
};

export default async function DashboardPage({ params }: { params: Promise<{ accountId: string }> }) {
  const { accountId } = await params;
  const account = accountDetails[accountId];
  if (!account) notFound();

  const sessionCookie = (await cookies()).get("agrifeed_session")?.value;
  if (!sessionCookie) redirect("/");

  let session: { id?: string; role?: string } | null = null;
  try {
    session = JSON.parse(sessionCookie) as { id?: string; role?: string };
  } catch {
    redirect("/");
  }

  if (session?.id !== accountId || session.role !== account.role) redirect("/");

  const tiles = account.role === "admin"
    ? [["12", "คำขอรออนุมัติ"], ["186", "สินค้าคลังกลาง"], ["3", "สาขาที่ดูแล"]]
    : [["42", "สินค้าหน้าร้าน"], ["8", "รายการขายวันนี้"], ["2", "ใบเบิกรอดำเนินการ"]];

  return (
    <main className="dashboard-shell">
      <header className="dashboard-header">
        <div>
          <h1>AgriFeed WMS</h1>
          <p>{account.label}</p>
        </div>
        <form action="/api/logout" method="post">
          <button className="logout-button" type="submit">ออกจากระบบ</button>
        </form>
      </header>
      <section className="dashboard-content">
        <h2>{account.title}</h2>
        <p>{account.description}</p>
        <div className="dashboard-grid">
          {tiles.map(([value, label]) => (
            <div className="dashboard-tile" key={label}>
              <strong>{value}</strong>
              <span>{label}</span>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
