'use client';
import { AdminDashboard } from "@/components/admin-dashboard";
export default function AdminPage() {
  return (
    <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        </div>
        <AdminDashboard />
    </div>
  )
}
