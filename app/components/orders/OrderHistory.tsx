'use client';
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText } from "lucide-react";
import { Order } from '@/app/types/order';
import { generatePDF } from '@/lib/pdf';

interface OrderHistoryProps {
  orders: Order[];
}

export const OrderHistory = ({ orders }: OrderHistoryProps) => {
  return (
    <div className="space-y-4">
      {orders.map(order => (
        <Card key={order.id}>
          <CardContent className="p-4">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-semibold">{order.customerName} - {order.productName}</h3>
                <p className="text-sm text-gray-600">
                  Jumlah: {order.quantity} | Total: Rp {parseInt(order.totalPrice).toLocaleString()}
                </p>
                <p className="text-sm text-gray-600">
                  Selesai pada: {new Date(order.completedAt!).toLocaleDateString()}
                </p>
              </div>
              <Button variant="outline" onClick={() => generatePDF(order)}>
                <FileText className="w-4 h-4 mr-2" />
                Export PDF
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}; 