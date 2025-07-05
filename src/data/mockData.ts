import { User, DashboardStats, Product, Order } from '../types';

export const mockUsers: User[] = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    role: 'admin',
    status: 'active',
    createdAt: '2024-01-15',
    lastLogin: '2024-01-20'
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane@example.com',
    role: 'user',
    status: 'active',
    createdAt: '2024-01-10',
    lastLogin: '2024-01-19'
  },
  {
    id: '3',
    name: 'Mike Johnson',
    email: 'mike@example.com',
    role: 'moderator',
    status: 'inactive',
    createdAt: '2024-01-05',
    lastLogin: '2024-01-18'
  },
  {
    id: '4',
    name: 'Sarah Wilson',
    email: 'sarah@example.com',
    role: 'user',
    status: 'active',
    createdAt: '2024-01-12',
    lastLogin: '2024-01-20'
  }
];

export const mockStats: DashboardStats = {
  totalUsers: 1247,
  activeUsers: 892,
  totalRevenue: 45230,
  monthlyGrowth: 12.5
};

export const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Wireless Headphones',
    category: 'Electronics',
    price: 99.99,
    stock: 45,
    status: 'active'
  },
  {
    id: '2',
    name: 'Smart Watch',
    category: 'Electronics',
    price: 299.99,
    stock: 23,
    status: 'active'
  },
  {
    id: '3',
    name: 'Coffee Maker',
    category: 'Appliances',
    price: 149.99,
    stock: 0,
    status: 'inactive'
  }
];

export const mockOrders: Order[] = [
  {
    id: 'ORD-001',
    customer: 'John Doe',
    amount: 299.99,
    status: 'completed',
    date: '2024-01-20',
    items: 2
  },
  {
    id: 'ORD-002',
    customer: 'Jane Smith',
    amount: 149.99,
    status: 'processing',
    date: '2024-01-20',
    items: 1
  },
  {
    id: 'ORD-003',
    customer: 'Mike Johnson',
    amount: 99.99,
    status: 'pending',
    date: '2024-01-19',
    items: 1
  }
];