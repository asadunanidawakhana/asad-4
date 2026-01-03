import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
    LayoutDashboard,
    Package,
    ShoppingCart,
    Users,
    FileText,
    Settings,
    LogOut,
    Tag,
    BarChart
} from 'lucide-react';

export default function AdminLayout() {
    const { user, signOut, isAdmin } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();

    const handleSignOut = async () => {
        await signOut();
        navigate('/admin/login');
    };

    const menuItems = [
        { name: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
        { name: 'Products', path: '/admin/products', icon: Package },
        { name: 'Categories', path: '/admin/categories', icon: Tag },
        { name: 'Orders', path: '/admin/orders', icon: ShoppingCart },
        { name: 'Users', path: '/admin/users', icon: Users },
        { name: 'Health Blogs', path: '/admin/blogs', icon: FileText },
        { name: 'Prescriptions', path: '/admin/prescriptions', icon: FileText },
        { name: 'Reports', path: '/admin/reports', icon: BarChart },
        { name: 'Settings', path: '/admin/settings', icon: Settings },
    ];

    // Simple protection check
    if (!user) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-gray-50">
                <div className="text-center">
                    <h2 className="text-xl font-bold text-red-600 mb-4">Access Denied</h2>
                    <Link to="/admin/login" className="text-primary-700 hover:underline">Go to Admin Login</Link>
                </div>
            </div>
        );
    }

    // Check role from context (fetched from profiles table)
    if (!isAdmin) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-gray-50">
                <div className="text-center">
                    <h2 className="text-xl font-bold text-red-600 mb-4">Unauthorized Access</h2>
                    <p className="text-gray-600 mb-4">You do not have permission to view this page.</p>
                    <Link to="/" className="text-primary-700 hover:underline">Return to Home</Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100 flex">
            {/* Sidebar */}
            <aside className="w-64 bg-white border-r border-gray-200 hidden md:flex flex-col fixed inset-y-0 text-white">
                <div className="h-16 flex items-center px-6 border-b border-gray-200">
                    <Link to="/" className="flex items-center space-x-2">
                        <span className="text-xl font-bold text-primary-800">Admin Panel</span>
                    </Link>
                </div>

                <nav className="flex-1 overflow-y-auto py-4">
                    <ul className="space-y-1 px-3">
                        {menuItems.map((item) => {
                            const Icon = item.icon;
                            const isActive = location.pathname === item.path;
                            return (
                                <li key={item.path}>
                                    <Link
                                        to={item.path}
                                        className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors duration-200 ${isActive
                                            ? 'bg-primary-50 text-primary-700'
                                            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                            }`}
                                    >
                                        <Icon className={`w-5 h-5 mr-3 ${isActive ? 'text-primary-600' : 'text-gray-400'}`} />
                                        {item.name}
                                    </Link>
                                </li>
                            );
                        })}
                    </ul>
                </nav>

                <div className="p-4 border-t border-gray-200">
                    <button
                        onClick={handleSignOut}
                        className="w-full flex items-center px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                        <LogOut className="w-5 h-5 mr-3" />
                        Sign Out
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 md:ml-64 p-8 overflow-y-auto h-screen">
                <Outlet />
            </main>
        </div>
    );
}
