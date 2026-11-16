"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const result = (await response.json()) as { error?: string; redirect?: string };

      if (!response.ok || !result.redirect) {
        setError(result.error || "เข้าสู่ระบบไม่สำเร็จ");
        return;
      }

      router.push(result.redirect);
      router.refresh();
    } catch {
      setError("ไม่สามารถเชื่อมต่อระบบเข้าสู่ระบบได้ กรุณาลองใหม่");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="login-shell">
      <section className="login-card">
        <div className="brand-panel">
          <div className="brand-mark">AF</div>
          <h1>ระบบจัดการคลังสินค้าอาหารสัตว์</h1>
          <p>AgriFeed WMS สำหรับคลังกลางและสาขาย่อยทั้ง 3 แห่ง</p>
        </div>
        <div className="login-panel">
          <p className="eyebrow">AgriFeed WMS</p>
          <h2>เข้าสู่ระบบ</h2>
          <p className="intro">กรอกชื่อผู้ใช้งานและรหัสผ่านเพื่อเข้าสู่แดชบอร์ดของคุณ</p>
          <form onSubmit={handleSubmit}>
            <div className="field">
              <label htmlFor="username">ชื่อผู้ใช้งาน</label>
              <input id="username" value={username} onChange={(event) => setUsername(event.target.value)} autoComplete="username" required />
            </div>
            <div className="field">
              <label htmlFor="password">รหัสผ่าน</label>
              <input id="password" type="password" value={password} onChange={(event) => setPassword(event.target.value)} autoComplete="current-password" required />
            </div>
            {error && <p className="error" role="alert">{error}</p>}
            <button className="submit-button" type="submit" disabled={loading}>
              {loading ? "กำลังตรวจสอบ..." : "เข้าสู่ระบบ"}
            </button>
          </form>
        </div>
      </section>
    </main>
  );
}
