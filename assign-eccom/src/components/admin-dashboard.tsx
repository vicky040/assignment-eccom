'use client';

import { useEffect, useState } from 'react';
import { AdminStats } from '@/lib/types';
import { StatCard } from './stat-card';
import { DollarSign, Hash, ShoppingBag, Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Badge } from './ui/badge';

export function AdminDashboard() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('/api/admin/analytics');
        if (!response.ok) throw new Error('Failed to fetch admin stats');
        const data = await response.json();
        setStats(data);
      } catch (error) {
        console.error("Failed to fetch admin stats:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (isLoading) {
    return (
        <div className="flex justify-center items-center h-64">
            <Loader2 className="h-12 w-12 animate-spin text-primary"/>
        </div>
    );
  }

  if (!stats) {
    return <p>Could not load statistics.</p>;
  }

  return (
    <div className="space-y-8">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Total Revenue" value={`$${stats.totalAmount.toFixed(2)}`} icon={<DollarSign className="h-4 w-4 text-muted-foreground" />} />
        <StatCard title="Items Sold" value={stats.itemCount.toString()} icon={<ShoppingBag className="h-4 w-4 text-muted-foreground" />} />
        <StatCard title="Discounts Used" value={stats.discountCodes.filter(d => d.isUsed).length.toString()} icon={<Hash className="h-4 w-4 text-muted-foreground" />} />
        <StatCard title="Total Discount Amount" value={`$${stats.totalDiscountAmount.toFixed(2)}`} icon={<DollarSign className="h-4 w-4 text-muted-foreground" />} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Generated Discount Codes</CardTitle>
        </CardHeader>
        <CardContent>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Code</TableHead>
                        <TableHead>Percentage</TableHead>
                        <TableHead>Status</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {stats.discountCodes.length > 0 ? stats.discountCodes.map(dc => (
                        <TableRow key={dc.code}>
                            <TableCell className="font-mono">{dc.code}</TableCell>
                            <TableCell>{dc.percentage}%</TableCell>
                            <TableCell>
                                <Badge variant={dc.isUsed ? 'destructive' : 'default'}>{dc.isUsed ? 'Used' : 'Available'}</Badge>
                            </TableCell>
                        </TableRow>
                    )) : (
                        <TableRow>
                            <TableCell colSpan={3} className="text-center text-muted-foreground">
                                No discount codes generated yet.
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </CardContent>
      </Card>
    </div>
  );
}
