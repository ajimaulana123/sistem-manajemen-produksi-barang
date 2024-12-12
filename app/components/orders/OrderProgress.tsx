'use client';
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, DollarSign, Edit2, Save, X } from "lucide-react";
import { Order, Component } from '@/app/types/order';

interface OrderProgressProps {
  orders: Order[];
  onUpdateProgress: (orderId: number, newProgress: Record<number, number>) => void;
  onComplete: (orderId: number) => void;
}

interface ComponentProgressProps {
  component: Component;
  progress: number;
  orderQuantity: number;
  onProgressUpdate: (value: string) => void;
}

const calculateStatus = (order: Order): string => {
  const totalProgress = Object.values(order.progress).reduce((sum, curr) => sum + curr, 0);
  const averageProgress = totalProgress / Object.values(order.progress).length;
  
  if (averageProgress === 0) return 'Belum Dimulai';
  if (averageProgress === 100) return 'Siap Diselesaikan';
  return `Dalam Proses (${Math.round(averageProgress)}%)`;
};

const isOrderComplete = (order: Order): boolean => {
  return Object.values(order.progress).every(value => value === 100);
};

const calculateAssembledUnits = (progress: number, totalUnits: number): number => {
  return Math.floor((progress / 100) * totalUnits);
};

const ComponentProgress = ({ component, progress, orderQuantity, onProgressUpdate }: ComponentProgressProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(progress.toString());
  const assembledUnits = calculateAssembledUnits(progress, orderQuantity);

  const handleSave = () => {
    onProgressUpdate(editValue);
    setIsEditing(false);
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border transition-all hover:shadow-md">
      <div className="flex justify-between items-start mb-6">
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <h5 className="text-xl font-semibold text-blue-900">{component.name}</h5>
            {isEditing ? (
              <div className="flex gap-2">
                <Button size="sm" variant="outline" onClick={handleSave} className="text-green-600 hover:text-green-700">
                  <Save className="w-4 h-4" />
                </Button>
                <Button size="sm" variant="outline" onClick={() => setIsEditing(false)} className="text-red-600 hover:text-red-700">
                  <X className="w-4 h-4" />
                </Button>
              </div>
            ) : (
              <Button size="sm" variant="outline" onClick={() => setIsEditing(true)} className="text-blue-600 hover:text-blue-700">
                <Edit2 className="w-4 h-4" />
              </Button>
            )}
          </div>

          <div className="grid grid-cols-2 gap-6 mt-4">
            <div className="space-y-2">
              <p className="text-sm text-gray-600">Informasi Bahan</p>
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-sm">Jumlah: <span className="font-medium">{component.quantity} unit</span></p>
                <p className="text-sm">Harga: <span className="font-medium">Rp {parseInt(component.price).toLocaleString()}/unit</span></p>
                <p className="text-sm font-medium mt-2">
                  Total: Rp {(parseInt(component.price) * parseInt(component.quantity)).toLocaleString()}
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-sm text-gray-600">Progress Perakitan</p>
              <div className="bg-gray-50 p-3 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-2xl font-bold text-blue-600">{progress}%</span>
                  <span className="text-sm text-gray-500">Target: {orderQuantity} unit</span>
                </div>
                <p className="text-sm text-green-600">{assembledUnits} unit selesai</p>
                <p className="text-sm text-red-600">{orderQuantity - assembledUnits} unit tersisa</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {isEditing ? (
          <div className="flex gap-4 items-center bg-gray-50 p-4 rounded-lg">
            <Input 
              type="number"
              min="0"
              max="100"
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              className="w-32"
            />
            <span className="text-sm text-gray-600">
              ≈ {calculateAssembledUnits(parseInt(editValue), orderQuantity)} unit akan selesai
            </span>
          </div>
        ) : (
          <div className="space-y-2">
            <div className="flex items-center gap-4">
              <Input 
                type="range"
                min="0"
                max="100"
                value={progress}
                onChange={(e) => onProgressUpdate(e.target.value)}
                className="flex-grow"
              />
              <span className="w-16 text-center font-medium text-blue-600">{progress}%</span>
            </div>
            <Progress 
              value={progress} 
              className="h-3 rounded-full"
              style={{
                background: progress === 100 ? '#86efac' : '#e5e7eb'
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export const OrderProgress = ({ orders, onUpdateProgress, onComplete }: OrderProgressProps) => {
  return (
    <div className="space-y-8">
      {orders.map((order) => (
        <Card key={order.id} className="w-full overflow-hidden">
          <CardHeader className="border-b bg-gradient-to-r from-blue-50 to-indigo-50 p-6">
            <div className="flex justify-between items-start">
              <div className="space-y-4 flex-1">
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle className="text-2xl text-blue-900">{order.customerName}</CardTitle>
                    <p className="text-blue-600 font-medium">{order.productName}</p>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <span className={`px-4 py-2 rounded-full text-sm font-medium ${
                      isOrderComplete(order) 
                        ? 'bg-green-100 text-green-800 border border-green-200' 
                        : 'bg-blue-100 text-blue-800 border border-blue-200'
                    }`}>
                      {calculateStatus(order)}
                    </span>
                    {isOrderComplete(order) && (
                      <Button 
                        onClick={() => onComplete(order.id)} 
                        size="sm" 
                        className="bg-green-600 hover:bg-green-700 transition-colors"
                      >
                        Selesai
                      </Button>
                    )}
                  </div>
                </div>

                <div className="grid md:grid-cols-3 gap-4">
                  <div className="bg-white rounded-lg p-4 shadow-sm border">
                    <div className="flex items-center gap-3 mb-2">
                      <DollarSign className="w-5 h-5 text-blue-600" />
                      <h3 className="font-medium">Informasi Harga</h3>
                    </div>
                    <div className="space-y-1 text-sm">
                      <p>Total: <span className="font-semibold text-blue-900">Rp {parseInt(order.totalPrice).toLocaleString()}</span></p>
                      <p>Jumlah: <span className="font-semibold text-blue-900">{order.quantity} unit</span></p>
                    </div>
                  </div>

                  <div className="bg-white rounded-lg p-4 shadow-sm border">
                    <div className="flex items-center gap-3 mb-2">
                      <Calendar className="w-5 h-5 text-blue-600" />
                      <h3 className="font-medium">Tanggal Pesanan</h3>
                    </div>
                    <p className="text-sm font-semibold text-blue-900">
                      {new Date(order.orderDate).toLocaleDateString('id-ID', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>

                  <div className="bg-white rounded-lg p-4 shadow-sm border">
                    <div className="flex items-center gap-3 mb-2">
                      <Clock className="w-5 h-5 text-blue-600" />
                      <h3 className="font-medium">Deadline</h3>
                    </div>
                    <p className="text-sm font-semibold text-blue-900">
                      {new Date(order.deadline).toLocaleDateString('id-ID', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-6 bg-gray-50">
            <div className="space-y-6">
              <div className="flex justify-between items-center bg-white p-4 rounded-lg shadow-sm border">
                <h4 className="text-lg font-semibold text-blue-900">Progress Komponen & Perakitan</h4>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">Target:</span>
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full font-medium">
                    {order.quantity} unit
                  </span>
                </div>
              </div>

              <div className="grid gap-6">
                {order.components.map((component) => (
                  <ComponentProgress
                    key={component.id}
                    component={component}
                    progress={order.progress[component.id]}
                    orderQuantity={parseInt(order.quantity)}
                    onProgressUpdate={(value) => {
                      const newProgress = {
                        ...order.progress,
                        [component.id]: parseInt(value)
                      };
                      onUpdateProgress(order.id, newProgress);
                    }}
                  />
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
