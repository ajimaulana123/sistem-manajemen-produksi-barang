'use client';
import { useState, useEffect } from 'react';
import { OrderForm } from '../components/orders/OrderForm';
import { OrderProgress } from '../components/orders/OrderProgress';
import { OrderHistory } from '../components/orders/OrderHistory';
import { Order } from '@/app/types/order';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Plus, List, History, ArrowRight } from 'lucide-react';

interface EmptyStateProps {
  title: string;
  description: string;
  action?: () => void;
}

export default function DashboardPage() {
  const [activeOrders, setActiveOrders] = useState<Order[]>([]);
  const [completedOrders, setCompletedOrders] = useState<Order[]>([]);
  const [activeTab, setActiveTab] = useState('progress');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const savedActiveOrders = localStorage.getItem('activeOrders');
        const savedCompletedOrders = localStorage.getItem('completedOrders');
        
        if (savedActiveOrders) setActiveOrders(JSON.parse(savedActiveOrders));
        if (savedCompletedOrders) setCompletedOrders(JSON.parse(savedCompletedOrders));
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem('activeOrders', JSON.stringify(activeOrders));
      localStorage.setItem('completedOrders', JSON.stringify(completedOrders));
    }
  }, [activeOrders, completedOrders, isLoading]);

  const handleNewOrder = (order: Order) => {
    setActiveOrders([...activeOrders, order]);
    setActiveTab('progress');
  };

  const handleUpdateProgress = (orderId: number, newProgress: Record<number, number>) => {
    setActiveOrders(activeOrders.map(order => 
      order.id === orderId ? { ...order, progress: newProgress } : order
    ));
  };

  const handleComplete = (orderId: number) => {
    const completedOrder = activeOrders.find(order => order.id === orderId);
    if (completedOrder) {
      const updatedOrder: Order = {
        ...completedOrder,
        status: 'completed',
        completedAt: new Date().toISOString()
      };
      setCompletedOrders([...completedOrders, updatedOrder]);
      setActiveOrders(activeOrders.filter(order => order.id !== orderId));
    }
  };

  const tabs = [
    {
      id: 'new',
      label: 'Pesanan Baru',
      icon: Plus,
      count: null
    },
    {
      id: 'progress',
      label: 'Progress',
      icon: List,
      count: activeOrders.length
    },
    {
      id: 'history',
      label: 'Riwayat',
      icon: History,
      count: completedOrders.length
    }
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 md:p-6 space-y-6">
      {/* Dashboard Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
            Dashboard Produksi
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Kelola dan pantau proses produksi
          </p>
        </div>

        {activeTab !== 'new' && (
          <Button onClick={() => setActiveTab('new')}>
            <Plus className="mr-2 h-4 w-4" />
            Pesanan Baru
          </Button>
        )}
      </div>

      {/* Tab Navigation */}
      <Card className="overflow-hidden">
        <div className="flex flex-wrap md:flex-nowrap border-b dark:border-gray-700">
          {tabs.map((tab) => (
            <Button
              key={tab.id}
              variant={activeTab === tab.id ? 'default' : 'ghost'}
              className={`flex-1 rounded-none justify-center gap-2 ${
                activeTab === tab.id ? 'border-b-2 border-primary' : ''
              }`}
              onClick={() => setActiveTab(tab.id)}
            >
              <tab.icon className="h-4 w-4" />
              <span>{tab.label}</span>
              {tab.count !== null && (
                <span className="ml-2 px-2 py-0.5 text-xs rounded-full bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400">
                  {tab.count}
                </span>
              )}
            </Button>
          ))}
        </div>

        <CardContent className="p-4 md:p-6">
          {activeTab === 'new' && (
            <div className="animate-fadeIn">
              <OrderForm onSubmit={handleNewOrder} />
            </div>
          )}

          {activeTab === 'progress' && (
            <div className="animate-fadeIn">
              {activeOrders.length === 0 ? (
                <EmptyState
                  title="Belum ada pesanan aktif"
                  description="Mulai dengan membuat pesanan baru"
                  action={() => setActiveTab('new')}
                />
              ) : (
                <OrderProgress
                  orders={activeOrders}
                  onUpdateProgress={handleUpdateProgress}
                  onComplete={handleComplete}
                />
              )}
            </div>
          )}

          {activeTab === 'history' && (
            <div className="animate-fadeIn">
              {completedOrders.length === 0 ? (
                <EmptyState
                  title="Belum ada riwayat pesanan"
                  description="Riwayat pesanan yang telah selesai akan muncul di sini"
                />
              ) : (
                <OrderHistory orders={completedOrders} />
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}



const EmptyState = ({ title, description, action }: EmptyStateProps) => (
  <div className="flex flex-col items-center justify-center py-12 text-center">
    <div className="rounded-full bg-blue-50 dark:bg-blue-900/20 p-4 mb-4">
      <List className="h-8 w-8 text-blue-600 dark:text-blue-400" />
    </div>
    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">{title}</h3>
    <p className="text-gray-600 dark:text-gray-300 mb-6">{description}</p>
    {action && (
      <Button onClick={action}>
        Buat Pesanan
        <ArrowRight className="ml-2 h-4 w-4" />
      </Button>
    )}
  </div>
);