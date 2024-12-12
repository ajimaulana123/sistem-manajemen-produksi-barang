'use client';
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Trash2 } from "lucide-react";
import { Order, Component } from '@/app/types/order';

interface OrderFormProps {
  onSubmit: (order: Order) => void;
}

export const OrderForm = ({ onSubmit }: OrderFormProps) => {
  const [formData, setFormData] = useState<Omit<Order, 'id' | 'status' | 'progress'>>({
    customerName: '',
    orderDate: '',
    deadline: '',
    productName: '',
    quantity: '',
    totalPrice: '',
    components: []
  });

  const addComponent = () => {
    setFormData({
      ...formData,
      components: [
        ...formData.components,
        {
          id: Date.now(),
          name: '',
          price: '',
          quantity: ''
        }
      ]
    });
  };

  const removeComponent = (id: number) => {
    setFormData({
      ...formData,
      components: formData.components.filter(comp => comp.id !== id)
    });
  };

  const updateComponent = (id: number, field: keyof Component, value: string) => {
    setFormData({
      ...formData,
      components: formData.components.map(comp =>
        comp.id === id ? { ...comp, [field]: value } : comp
      )
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newOrder: Order = {
      ...formData,
      id: Date.now(),
      status: 'active',
      progress: Object.fromEntries(
        formData.components.map(comp => [comp.id, 0])
      )
    };
    onSubmit(newOrder);
    setFormData({
      customerName: '',
      orderDate: '',
      deadline: '',
      productName: '',
      quantity: '',
      totalPrice: '',
      components: []
    });
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Form Pesanan Baru</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Nama Pelanggan</Label>
              <Input 
                value={formData.customerName}
                onChange={(e) => setFormData({...formData, customerName: e.target.value})}
                required
              />
            </div>
            <div className="space-y-2">
              <Label>Nama Produk</Label>
              <Input 
                value={formData.productName}
                onChange={(e) => setFormData({...formData, productName: e.target.value})}
                required
              />
            </div>
            <div className="space-y-2">
              <Label>Jumlah Pesanan</Label>
              <Input 
                type="number"
                value={formData.quantity}
                onChange={(e) => setFormData({...formData, quantity: e.target.value})}
                required
              />
            </div>
            <div className="space-y-2">
              <Label>Total Harga</Label>
              <Input 
                type="number"
                value={formData.totalPrice}
                onChange={(e) => setFormData({...formData, totalPrice: e.target.value})}
                required
              />
            </div>
            <div className="space-y-2">
              <Label>Tanggal Pesanan</Label>
              <Input 
                type="date"
                value={formData.orderDate}
                onChange={(e) => setFormData({...formData, orderDate: e.target.value})}
                required
              />
            </div>
            <div className="space-y-2">
              <Label>Deadline</Label>
              <Input 
                type="date"
                value={formData.deadline}
                onChange={(e) => setFormData({...formData, deadline: e.target.value})}
                required
              />
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-semibold">Komponen Produk</h3>
              <Button type="button" onClick={addComponent} variant="outline" size="sm">
                <Plus className="w-4 h-4 mr-2" />
                Tambah Komponen
              </Button>
            </div>
            
            {formData.components.map((component) => (
              <Card key={component.id} className="p-4">
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>Nama Komponen</Label>
                    <Input 
                      value={component.name}
                      onChange={(e) => updateComponent(component.id, 'name', e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Harga</Label>
                    <Input 
                      type="number"
                      value={component.price}
                      onChange={(e) => updateComponent(component.id, 'price', e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Jumlah</Label>
                    <div className="flex gap-2">
                      <Input 
                        type="number"
                        value={component.quantity}
                        onChange={(e) => updateComponent(component.id, 'quantity', e.target.value)}
                        required
                      />
                      <Button 
                        type="button"
                        variant="destructive"
                        size="icon"
                        onClick={() => removeComponent(component.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          <Button type="submit" className="w-full">
            Tambah Pesanan
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}; 