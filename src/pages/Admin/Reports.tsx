import { useState, useEffect } from 'react';
import { supabase } from '../../services/supabaseClient';
import { BarChart3, TrendingUp, Users, ShoppingBag } from 'lucide-react';

const Reports = () => {
    const [stats, setStats] = useState({
        totalSales: 0,
        totalOrders: 0,
        totalUsers: 0,
        avgOrderValue: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            // Fetch Total Orders
            const { count: ordersCount, error: ordersError } = await supabase
                .from('orders')
                .select('*', { count: 'exact', head: true });

            if (ordersError) throw ordersError;

            // Fetch Total Sales
            const { data: salesData, error: salesError } = await supabase
                .from('orders')
                .select('total');

            if (salesError) throw salesError;
            const totalSales = salesData?.reduce((sum, order) => sum + (Number(order.total) || 0), 0) || 0;

            // Fetch Total Users
            const { count: usersCount, error: usersError } = await supabase
                .from('profiles')
                .select('*', { count: 'exact', head: true });

            if (usersError) throw usersError;

            setStats({
                totalSales,
                totalOrders: ordersCount || 0,
                totalUsers: usersCount || 0,
                avgOrderValue: ordersCount ? Math.round(totalSales / ordersCount) : 0
            });
        } catch (error) {
            console.error('Error fetching report stats:', error);
        } finally {
            setLoading(false);
        }
    };

    const quickStats = [
        { label: 'Total Sales', value: `PKR ${stats.totalSales.toLocaleString()}`, change: 'Real-time', icon: TrendingUp, color: 'text-green-600', bg: 'bg-green-100' },
        { label: 'Total Orders', value: stats.totalOrders.toString(), change: 'Real-time', icon: ShoppingBag, color: 'text-blue-600', bg: 'bg-blue-100' },
        { label: 'Total Users', value: stats.totalUsers.toString(), change: 'Real-time', icon: Users, color: 'text-purple-600', bg: 'bg-purple-100' },
        { label: 'Avg. Order Value', value: `PKR ${stats.avgOrderValue.toLocaleString()}`, change: 'Real-time', icon: BarChart3, color: 'text-orange-600', bg: 'bg-orange-100' },
    ];

    if (loading) return <div className="p-8 text-center">Loading reports...</div>;

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-gray-900">Analytics & Reports</h1>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {quickStats.map((stat, index) => (
                    <div key={index} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <div className="flex justify-between items-start mb-4">
                            <div className={`p-3 rounded-lg ${stat.bg} ${stat.color}`}>
                                <stat.icon className="w-6 h-6" />
                            </div>
                            <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full">
                                {stat.change}
                            </span>
                        </div>
                        <h3 className="text-gray-500 text-sm font-medium">{stat.label}</h3>
                        <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Sales Chart Placeholder - Keeping static for now as per minimal requirement, can be upgraded later */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 min-h-[300px] flex flex-col">
                    <h3 className="text-lg font-bold text-gray-900 mb-6">Sales Overview</h3>
                    <div className="flex-grow flex items-end justify-between space-x-2 px-4">
                        {[40, 65, 45, 80, 55, 90, 70].map((h, i) => (
                            <div key={i} className="w-full bg-primary-100 rounded-t-lg hover:bg-primary-200 transition-colors relative group">
                                <div
                                    className="absolute bottom-0 w-full bg-primary-600 rounded-t-lg transition-all duration-500"
                                    style={{ height: `${h}%` }}
                                ></div>
                                {/* Tooltip */}
                                <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                                    {h}%
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="flex justify-between mt-4 text-xs text-gray-500">
                        <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
                    </div>
                </div>

                {/* Top Products - Keeping static/mock for now as OrderItems logic is complex, can be separate task */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h3 className="text-lg font-bold text-gray-900 mb-6">Top Selling Products</h3>
                    <div className="space-y-4">
                        <div className="p-4 text-center text-gray-500 text-sm italic">
                            Real-time product analytics coming soon.
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Reports;
