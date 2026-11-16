import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AgriFeed WMS | เข้าสู่ระบบ",
  description: "ระบบจัดการคลังสินค้าอาหารสัตว์",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="th">
      <body>{children}</body>
    </html>
  );
}
