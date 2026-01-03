import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Cart() {
    const { items, updateQuantity, removeItem, cartTotal, clearCart } = useCart();
    const navigate = useNavigate();

    if (items.length === 0) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center p-8 text-center bg-gray-50">
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="bg-white p-8 rounded-full shadow-lg mb-6"
                >
                    <ShoppingBag className="w-16 h-16 text-gray-300" />
                </motion.div>
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Your cart is empty</h2>
                <p className="text-gray-500 mb-8 max-w-sm">Looks like you haven't added any medicines or herbal products to your cart yet.</p>
                <Link
                    to="/shop"
                    className="bg-primary-700 text-white px-8 py-3 rounded-full font-semibold hover:bg-primary-800 transition-all shadow-lg hover:shadow-xl"
                >
                    Start Shopping
                </Link>
            </div>
        );
    }

    return (
        <div className="bg-gray-50 min-h-screen py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-8">Shopping Cart</h1>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Cart Items List */}
                    <div className="lg:col-span-2 space-y-4">
                        {items.map((item) => (
                            <motion.div
                                key={item.id}
                                layout
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-gray-100 flex gap-4 sm:gap-6"
                            >
                                <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                                    <img
                                        src={item.image || 'https://placehold.co/100x100?text=No+Image'}
                                        alt={item.name}
                                        className="w-full h-full object-cover"
                                    />
                                </div>

                                <div className="flex-1 flex flex-col justify-between">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h3 className="text-lg font-bold text-gray-900 line-clamp-1">{item.name}</h3>
                                            <p className="text-sm text-gray-500">{item.category || 'General'}</p>
                                        </div>
                                        <button
                                            onClick={() => removeItem(item.id)}
                                            className="text-gray-400 hover:text-red-500 transition-colors p-1"
                                            title="Remove item"
                                        >
                                            <Trash2 className="w-5 h-5" />
                                        </button>
                                    </div>

                                    <div className="flex justify-between items-center mt-4">
                                        <div className="flex items-center space-x-3 bg-gray-50 rounded-lg p-1 border border-gray-200">
                                            <button
                                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                className="p-1 hover:bg-white rounded-md transition-colors disabled:opacity-50"
                                                disabled={item.quantity <= 1}
                                            >
                                                <Minus className="w-4 h-4 text-gray-600" />
                                            </button>
                                            <span className="text-sm font-semibold w-8 text-center">{item.quantity}</span>
                                            <button
                                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                className="p-1 hover:bg-white rounded-md transition-colors"
                                            >
                                                <Plus className="w-4 h-4 text-gray-600" />
                                            </button>
                                        </div>
                                        <div className="text-right">
                                            <span className="text-lg font-bold text-gray-900">PKR {item.price * item.quantity}</span>
                                            {item.quantity > 1 && (
                                                <p className="text-xs text-gray-500">PKR {item.price} each</p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}

                        <div className="flex justify-end pt-4">
                            <button
                                onClick={clearCart}
                                className="text-red-600 hover:text-red-800 text-sm font-medium hover:underline"
                            >
                                Clear Cart
                            </button>
                        </div>
                    </div>

                    {/* Order Summary */}
                    <div className="lg:col-span-1">
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 sticky top-24">
                            <h2 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h2>

                            <div className="space-y-4 mb-6">
                                <div className="flex justify-between text-gray-600">
                                    <span>Subtotal</span>
                                    <span>PKR {cartTotal}</span>
                                </div>
                                <div className="flex justify-between text-gray-600">
                                    <span>Shipping Estimate</span>
                                    <span className="text-green-600 font-medium">Free</span>
                                </div>
                                <div className="border-t border-gray-100 pt-4 flex justify-between items-center">
                                    <span className="text-lg font-bold text-gray-900">Total</span>
                                    <span className="text-2xl font-bold text-primary-700">PKR {cartTotal}</span>
                                </div>
                            </div>

                            <button
                                onClick={() => navigate('/checkout')}
                                className="w-full bg-primary-700 text-white py-4 rounded-xl font-bold text-lg hover:bg-primary-800 transition-all shadow-lg hover:shadow-primary-700/20 flex items-center justify-center group"
                            >
                                Proceed to Checkout
                                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </button>

                            <p className="text-xs text-gray-500 text-center mt-4">
                                Secure Checkout - 100% Money Back Guarantee
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
