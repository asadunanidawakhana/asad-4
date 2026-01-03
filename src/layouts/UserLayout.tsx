import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
    LayoutDashboard,
    Package,
    FileText,
    Heart,
    User as UserIcon,
    LogOut,
    MapPin
} from 'lucide-react';

export default function UserLayout() {
    const { user, signOut } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();

    const handleSignOut = async () => {
        await signOut();
        navigate('/login');
    };

    const menuItems = [
        { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
        { name: 'My Orders', path: '/dashboard/orders', icon: Package },
        { name: 'Prescriptions', path: '/dashboard/prescriptions', icon: FileText },
        { name: 'Wishlist', path: '/dashboard/wishlist', icon: Heart },
        { name: 'Addresses', path: '/dashboard/addresses', icon: MapPin },
        { name: 'Profile', path: '/dashboard/profile', icon: UserIcon },
    ];

    if (!user) {
        // Basic protection, though ideally handled by a ProtectedRoute wrapper
        // navigate('/login'); // Can't easily do this in render without effects, usually handled higher up
        return <div className="p-8 text-center"><Link to="/login" className="text-primary-600 hover:underline">Please log in to view dashboard.</Link></div>;
    }

    return (
        <div className="min-h-screen bg-gray-50 pt-8 pb-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col md:flex-row gap-8">

                    {/* Sidebar */}
                    <aside className="w-full md:w-64 flex-shrink-0">
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden sticky top-24">
                            <div className="p-6 border-b border-gray-100 bg-primary-50">
                                <div className="flex items-center space-x-3">
                                    <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-bold text-xl">
                                        {user.email?.[0].toUpperCase()}
                                    </div>
                                    <div className="overflow-hidden">
                                        <p className="text-sm font-medium text-gray-900 truncate">Hello,</p>
                                        <p className="text-sm text-gray-500 truncate">{user.email}</p>
                                    </div>
                                </div>
                            </div>

                            <nav className="p-4 space-y-1">
                                {menuItems.map((item) => {
                                    const Icon = item.icon;
                                    const isActive = location.pathname === item.path;
                                    return (
                                        <Link
                                            key={item.path}
                                            to={item.path}
                                            className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors duration-200 ${isActive
                                                ? 'bg-primary-50 text-primary-700'
                                                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                                }`}
                                        >
                                            <Icon className={`w-5 h-5 mr-3 ${isActive ? 'text-primary-600' : 'text-gray-400'}`} />
                                            {item.name}
                                        </Link>
                                    );
                                })}

                                <button
                                    onClick={handleSignOut}
                                    className="w-full flex items-center px-4 py-3 text-sm font-medium text-red-600 rounded-lg hover:bg-red-50 transition-colors duration-200 mt-4"
                                >
                                    <LogOut className="w-5 h-5 mr-3" />
                                    Sign Out
                                </button>
                            </nav>
                        </div>
                    </aside>

                    {/* Main Content */}
                    <main className="flex-1">
                        <Outlet />
                    </main>
                </div>
            </div>
        </div>
    );
}
