import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, User, Menu, X, Search, LogOut, LayoutDashboard } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { motion, AnimatePresence } from 'framer-motion';

export default function Navbar() {
    const { user, signOut } = useAuth();
    const { itemCount } = useCart();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const navigate = useNavigate();

    const handleSignOut = async () => {
        await signOut();
        navigate('/login');
    };

    const navLinks = [
        { name: 'Home', path: '/' },
        { name: 'Shop', path: '/shop' },
        { name: 'Categories', path: '/categories' },
        { name: 'Blog', path: '/blog' },
        { name: 'Contact', path: '/contact' },
    ];

    return (
        <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md shadow-sm border-b border-gray-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <Link to="/" className="flex items-center space-x-2">
                        <span className="text-2xl font-bold text-primary-700 tracking-tight">
                            Asad<span className="text-accent-DEFAULT">Unani</span>
                        </span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex flex-1 justify-center space-x-8">
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                to={link.path}
                                className="text-gray-700 hover:text-primary-600 font-medium transition-colors duration-200 text-sm uppercase tracking-wide"
                            >
                                {link.name}
                            </Link>
                        ))}
                    </div>

                    {/* Right Icons */}
                    <div className="hidden md:flex items-center space-x-6">
                        <button className="text-gray-600 hover:text-primary-600 transition-colors">
                            <Search className="w-5 h-5" />
                        </button>

                        <Link to="/cart" className="relative text-gray-600 hover:text-primary-600 transition-colors">
                            <ShoppingCart className="w-5 h-5" />
                            {itemCount > 0 && (
                                <span className="absolute -top-2 -right-2 bg-accent-DEFAULT text-black text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                                    {itemCount}
                                </span>
                            )}
                        </Link>

                        {/* Profile Dropdown */}
                        <div className="relative">
                            <button
                                onClick={() => setIsProfileOpen(!isProfileOpen)}
                                className="flex items-center space-x-1 text-gray-600 hover:text-primary-600 transition-colors focus:outline-none"
                            >
                                <User className="w-5 h-5" />
                            </button>

                            <AnimatePresence>
                                {isProfileOpen && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: 10 }}
                                        className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 border border-gray-100 ring-1 ring-black ring-opacity-5"
                                    >
                                        {user ? (
                                            <>
                                                <div className="px-4 py-2 text-xs text-gray-500 border-b border-gray-100 mb-1">
                                                    Signed in as<br />
                                                    <span className="font-medium text-gray-900 truncate">{user.email}</span>
                                                </div>
                                                <Link
                                                    to="/dashboard"
                                                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                                                    onClick={() => setIsProfileOpen(false)}
                                                >
                                                    <LayoutDashboard className="w-4 h-4 mr-2" />
                                                    Dashboard
                                                </Link>
                                                <button
                                                    onClick={() => {
                                                        handleSignOut();
                                                        setIsProfileOpen(false);
                                                    }}
                                                    className="flex w-full items-center px-4 py-2 text-sm text-red-600 hover:bg-gray-50"
                                                >
                                                    <LogOut className="w-4 h-4 mr-2" />
                                                    Sign Out
                                                </button>
                                            </>
                                        ) : (
                                            <>
                                                <Link
                                                    to="/login"
                                                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                                                    onClick={() => setIsProfileOpen(false)}
                                                >
                                                    Login
                                                </Link>
                                                <Link
                                                    to="/register"
                                                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                                                    onClick={() => setIsProfileOpen(false)}
                                                >
                                                    Register
                                                </Link>
                                            </>
                                        )}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden flex items-center">
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="text-gray-600 hover:text-primary-600 focus:outline-none"
                        >
                            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isMenuOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="md:hidden bg-white border-t border-gray-100 overflow-hidden"
                    >
                        <div className="px-4 pt-2 pb-4 space-y-1">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.name}
                                    to={link.path}
                                    onClick={() => setIsMenuOpen(false)}
                                    className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-primary-700 hover:bg-gray-50"
                                >
                                    {link.name}
                                </Link>
                            ))}
                            <div className="border-t border-gray-100 my-2 pt-2">
                                <Link
                                    to="/cart"
                                    onClick={() => setIsMenuOpen(false)}
                                    className="flex items-center px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-50"
                                >
                                    <ShoppingCart className="w-5 h-5 mr-3" />
                                    Cart ({itemCount})
                                </Link>
                                {user ? (
                                    <>
                                        <Link
                                            to="/dashboard"
                                            onClick={() => setIsMenuOpen(false)}
                                            className="flex items-center px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-50"
                                        >
                                            <LayoutDashboard className="w-5 h-5 mr-3" />
                                            Dashboard
                                        </Link>
                                        <button
                                            onClick={() => {
                                                handleSignOut();
                                                setIsMenuOpen(false);
                                            }}
                                            className="flex w-full items-center px-3 py-2 rounded-md text-base font-medium text-red-600 hover:bg-gray-50"
                                        >
                                            <LogOut className="w-5 h-5 mr-3" />
                                            Sign Out
                                        </button>
                                    </>
                                ) : (
                                    <Link
                                        to="/login"
                                        onClick={() => setIsMenuOpen(false)}
                                        className="flex items-center px-3 py-2 rounded-md text-base font-medium text-primary-700 hover:bg-gray-50"
                                    >
                                        <User className="w-5 h-5 mr-3" />
                                        Login / Register
                                    </Link>
                                )}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
}
