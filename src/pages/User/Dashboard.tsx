import { Package, Clock, ShoppingCart } from 'lucide-react';

export default function DashboardOverview() {
    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center space-x-4">
                    <div className="p-3 bg-blue-50 rounded-lg text-blue-600">
                        <Package className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-sm text-gray-500">Total Orders</p>
                        <p className="text-2xl font-bold text-gray-900">0</p>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center space-x-4">
                    <div className="p-3 bg-orange-50 rounded-lg text-orange-600">
                        <Clock className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-sm text-gray-500">Pending Orders</p>
                        <p className="text-2xl font-bold text-gray-900">0</p>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center space-x-4">
                    <div className="p-3 bg-green-50 rounded-lg text-green-600">
                        <ShoppingCart className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-sm text-gray-500">Cart Items</p>
                        <p className="text-2xl font-bold text-gray-900">0</p>
                    </div>
                </div>
            </div>

            {/* Recent Activity Placeholder */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100">
                    <h2 className="text-lg font-semibold text-gray-900">Recent Orders</h2>
                </div>
                <div className="p-6 text-center text-gray-500 py-12">
                    <Package className="w-12 h-12 mx-auto text-gray-300 mb-4" />
                    <p>No orders found.</p>
                    <button className="mt-4 text-primary-600 hover:text-primary-700 font-medium text-sm">
                        Start Shopping &rarr;
                    </button>
                </div>
            </div>
        </div>
    );
}
