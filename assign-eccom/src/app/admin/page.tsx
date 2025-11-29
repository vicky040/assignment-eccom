'use client';
import { AdminDashboard } from "@/components/admin-dashboard";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";


export default function AdminPage() {
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  // TODO: Implement discount code generation logic
  // const handleGenerateDiscount = async () => {
  //   setIsGenerating(true);
  //   try {
  //     const response = await fetch('/api/admin/generate-discount', { method: 'POST' });
  //     const data = await response.json();
  //     if (!response.ok) {
  //       throw new Error(data.message || 'Failed to generate discount.');
  //     }
  //     toast({
  //       title: 'Discount Generated!',
  //       description: `New code ${data.code} for ${data.percentage}% off has been created.`,
  //     });
  //     // You might want to refresh the stats here to show the new code
  //   } catch (error: any) {
  //     toast({
  //       variant: 'destructive',
  //       title: 'Error',
  //       description: error.message,
  //     });
  //   } finally {
  //     setIsGenerating(false);
  //   }
  // };

  return (
    <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        </div>
        <AdminDashboard />
    </div>
  )
}
