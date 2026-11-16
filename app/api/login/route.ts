import { NextResponse } from "next/server";

type Account = {
  username: string | undefined;
  password: string | undefined;
  role: "admin" | "branch";
  id: string;
  label: string;
};

const accounts: Account[] = [
  { id: "admin", label: "ผู้ดูแลคลังกลาง", role: "admin", username: process.env.ADMIN_USERNAME, password: process.env.ADMIN_PASSWORD },
  { id: "branch1", label: "สาขา 1 (ในเมือง)", role: "branch", username: process.env.BRANCH1_USERNAME, password: process.env.BRANCH1_PASSWORD },
  { id: "branch2", label: "สาขา 2 (รอบเมือง)", role: "branch", username: process.env.BRANCH2_USERNAME, password: process.env.BRANCH2_PASSWORD },
  { id: "branch3", label: "สาขา 3 (อำเภอ)", role: "branch", username: process.env.BRANCH3_USERNAME, password: process.env.BRANCH3_PASSWORD },
];

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as { username?: string; password?: string } | null;
  const username = body?.username?.trim().toLowerCase();
  const password = body?.password;
  const account = accounts.find((item) => item.username?.toLowerCase() === username && item.password === password);

  if (!account) {
    return NextResponse.json({ error: "ชื่อผู้ใช้งานหรือรหัสผ่านไม่ถูกต้อง" }, { status: 401 });
  }

  const response = NextResponse.json({ redirect: `/dashboard/${account.id}` });
  response.cookies.set("agrifeed_session", JSON.stringify({ id: account.id, role: account.role, label: account.label }), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 8,
  });
  return response;
}
