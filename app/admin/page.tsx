import type { Metadata } from "next";
import { AdminApp } from "@/components/admin/admin-app";

export const metadata: Metadata = {
  title: "Administración | Good Cell",
  robots: { index: false, follow: false },
};

export default function AdminPage() {
  return <AdminApp />;
}