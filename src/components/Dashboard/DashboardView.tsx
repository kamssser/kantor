import React, { useEffect, useState } from 'react';
import { Users, DollarSign, TrendingUp, Package } from 'lucide-react';
import StatsCard from './StatsCard';
import { useDashboardStats, useOrders } from '../../hooks/useApi';

export default function DashboardView() {
  const { data: stats, loading: statsLoading, error: statsError } = useDashboardStats();
  const { data: orders, loading: ordersLoading } = useOrders();

  if (statsLoading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-48 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-96"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-white rounded-xl border border-gray-200 p-6 animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-20 mb-2"></div>
              <div className="h-8 bg-gray-200 rounded w-16 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-24"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (statsError) {
    return (
      <div className="space-y-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <h3 className="text-red-800 font-medium">Error loading dashboard</h3>
          <p className="text-red-600 text-sm">{statsError}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="mb-4">
        <h1 className="text-2xl font-bold text-gray-900 mb-1">Dashboard</h1>
        <p className="text-gray-600">Welcome back! Here's what's happening with your business today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatsCard
          title="Total Users"
          value={stats?.totalUsers?.toLocaleString() || '0'}
          change={12.5}
          icon={Users}
          color="blue"
        />
        <StatsCard
          title="Active Users"
          value={stats?.activeUsers?.toLocaleString() || '0'}
          change={8.2}
          icon={TrendingUp}
          color="green"
        />
        <StatsCard
          title="Total Revenue"
          value={`$${stats?.totalRevenue?.toLocaleString() || '0'}`}
          change={15.3}
          icon={DollarSign}
          color="purple"
        />
        <StatsCard
          title="Products"
          value="156"
          change={-2.1}
          icon={Package}
          color="orange"
        />
      </div>

      {/* Charts and Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Revenue Chart */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue Overview</h3>
          <div className="h-64 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <TrendingUp className="w-12 h-12 text-blue-400 mx-auto mb-4" />
              <p className="text-gray-600 font-medium">Revenue Chart</p>
              <p className="text-gray-500 text-sm">Chart will be displayed here</p>
            </div>
          </div>
        </div>

        {/* Recent Orders */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Orders</h3>
          <div className="space-y-3">
            {ordersLoading ? (
              <div className="space-y-3">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="animate-pulse p-3 bg-gray-50 rounded-lg">
                    <div className="h-4 bg-gray-200 rounded w-20 mb-1"></div>
                    <div className="h-3 bg-gray-200 rounded w-16"></div>
                  </div>
                ))}
              </div>
            ) : orders && orders.length > 0 ? (
              orders.slice(0, 5).map((order) => (
                <div key={order.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div>
                    <p className="font-medium text-gray-900 text-sm">{order.id}</p>
                    <p className="text-xs text-gray-600">{order.customer}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-gray-900 text-sm">${order.amount}</p>
                    <span className={`inline-block px-2 py-1 text-xs rounded-full ${
                      order.status === 'completed' ? 'bg-green-100 text-green-800' :
                      order.status === 'processing' ? 'bg-blue-100 text-blue-800' :
                      order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {order.status}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500">No orders found</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Activity Feed */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
        <div className="space-y-4">
          <div className="flex items-start space-x-3">
            <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
            <div>
              <p className="text-sm text-gray-900">New user registered: <span className="font-medium">John Doe</span></p>
              <p className="text-xs text-gray-500">2 minutes ago</p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
            <div>
              <p className="text-sm text-gray-900">Order completed: <span className="font-medium">#ORD-001</span></p>
              <p className="text-xs text-gray-500">5 minutes ago</p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <div className="w-2 h-2 bg-orange-500 rounded-full mt-2"></div>
            <div>
              <p className="text-sm text-gray-900">Product updated: <span className="font-medium">Wireless Headphones</span></p>
              <p className="text-xs text-gray-500">10 minutes ago</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}