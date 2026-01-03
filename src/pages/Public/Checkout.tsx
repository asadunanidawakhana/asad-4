import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { orderService } from '../../services/orderService';
import { ArrowLeft, CheckCircle, Truck, CreditCard, ShoppingBag } from 'lucide-react';

export default function Checkout() {
    const { items, total, clearCart } = useCart();
    const { user } = useAuth();
    const navigate = useNavigate();

    const [shippingInfo, setShippingInfo] = useState({
        fullName: '',
        phone: '',
        address: '',
        city: '',
        state: '',
        zip: ''
    });

    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);

    if (items.length === 0 && !success) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center p-8">
                    <ShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h2>
                    <p className="text-gray-500 mb-6">Looks like you haven't added anything yet.</p>
                    <Link to="/shop" className="bg-primary-700 text-white px-6 py-3 rounded-full font-medium hover:bg-primary-800 transition-colors">
                        Start Shopping
                    </Link>
                </div>
            </div>
        );
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setShippingInfo(prev => ({ ...prev, [name]: value }));
    };

    const handlePlaceOrder = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) {
            navigate('/login', { state: { from: '/checkout' } });
            return;
        }

        setLoading(true);
        setError(null);

        try {
            await orderService.createOrder(
                user.id,
                items,
                total,
                shippingInfo,
                'cod' // Hardcoded for now
            );

            setSuccess(true);
            clearCart();

            // Optional: Scroll to top
            window.scrollTo(0, 0);

        } catch (err: any) {
            console.error("Order failed", err);
            setError(err.message || "Failed to place order. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-md w-full bg-white p-10 rounded-2xl shadow-xl text-center">
                    <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-green-100 mb-6">
                        <CheckCircle className="h-10 w-10 text-green-600" />
                    </div>
                    <h2 className="text-3xl font-extrabold text-gray-900 mb-2">Order Placed!</h2>
                    <p className="text-gray-500 mb-8">
                        Thank you for your purchase. Your order has been received and will be processed shortly.
                    </p>
                    <div className="space-y-3">
                        <Link to="/dashboard/orders" className="block w-full bg-primary-700 text-white py-3 rounded-lg font-bold hover:bg-primary-800 transition-colors">
                            View Order Details
                        </Link>
                        <Link to="/" className="block w-full bg-white text-primary-700 border border-primary-200 py-3 rounded-lg font-bold hover:bg-gray-50 transition-colors">
                            Continue Shopping
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="mb-8">
                    <Link to="/cart" className="flex items-center text-gray-500 hover:text-gray-900">
                        <ArrowLeft className="w-5 h-5 mr-1" /> Back to Cart
                    </Link>
                </div>

                <h1 className="text-3xl font-bold text-gray-900 mb-8">Checkout</h1>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">

                    {/* Form Section */}
                    <div className="space-y-8">
                        <form id="checkout-form" onSubmit={handlePlaceOrder}>
                            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 mb-6">
                                <div className="flex items-center mb-6">
                                    <Truck className="w-6 h-6 text-primary-600 mr-3" />
                                    <h2 className="text-xl font-semibold text-gray-900">Shipping Information</h2>
                                </div>
                                <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
                                    <div className="sm:col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                                        <input type="text" name="fullName" required value={shippingInfo.fullName} onChange={handleInputChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500" placeholder="John Doe" />
                                    </div>
                                    <div className="sm:col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                                        <input type="tel" name="phone" required value={shippingInfo.phone} onChange={handleInputChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500" placeholder="+92 300 1234567" />
                                    </div>
                                    <div className="sm:col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                                        <input type="text" name="address" required value={shippingInfo.address} onChange={handleInputChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500" placeholder="House 123, Street 4, Sector..." />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                                        <input type="text" name="city" required value={shippingInfo.city} onChange={handleInputChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500" placeholder="Lahore" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Postal Code</label>
                                        <input type="text" name="zip" required value={shippingInfo.zip} onChange={handleInputChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500" placeholder="54000" />
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                                <div className="flex items-center mb-6">
                                    <CreditCard className="w-6 h-6 text-primary-600 mr-3" />
                                    <h2 className="text-xl font-semibold text-gray-900">Payment Method</h2>
                                </div>
                                <div className="space-y-4">
                                    <div className="flex items-center p-4 border rounded-lg border-primary-200 bg-primary-50">
                                        <input id="method-cod" name="paymentMethod" type="radio" checked readOnly className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300" />
                                        <label htmlFor="method-cod" className="ml-3 block text-sm font-medium text-gray-900">
                                            Cash on Delivery (COD)
                                        </label>
                                    </div>
                                    <div className="flex items-center p-4 border rounded-lg border-gray-200 opacity-50 cursor-not-allowed">
                                        <input id="method-card" name="paymentMethod" type="radio" disabled className="h-4 w-4 text-gray-300 border-gray-300" />
                                        <label htmlFor="method-card" className="ml-3 block text-sm font-medium text-gray-500">
                                            Credit / Debit Card (Coming Soon)
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>

                    {/* Order Summary */}
                    <div>
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 sticky top-24">
                            <h2 className="text-xl font-semibold text-gray-900 mb-6">Order Summary</h2>

                            <div className="flow-root mb-8">
                                <ul className="-my-4 divide-y divide-gray-200">
                                    {items.map((item) => (
                                        <li key={item.id} className="py-4 flex">
                                            <div className="flex-shrink-0 w-16 h-16 border border-gray-200 rounded-md overflow-hidden">
                                                <img src={item.image || 'https://via.placeholder.com/64?text=Img'} alt={item.name} className="w-full h-full object-center object-cover" />
                                            </div>
                                            <div className="ml-4 flex-1 flex flex-col">
                                                <div>
                                                    <div className="flex justify-between text-base font-medium text-gray-900">
                                                        <h3 className="line-clamp-1">{item.name}</h3>
                                                        <p className="ml-4">PKR {item.price * item.quantity}</p>
                                                    </div>
                                                </div>
                                                <div className="flex-1 flex items-end justify-between text-sm">
                                                    <p className="text-gray-500">Qty {item.quantity}</p>
                                                </div>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <div className="border-t border-gray-200 pt-6 space-y-4">
                                <div className="flex justify-between text-sm text-gray-600">
                                    <p>Subtotal</p>
                                    <p>PKR {total}</p>
                                </div>
                                <div className="flex justify-between text-sm text-gray-600">
                                    <p>Shipping</p>
                                    <p className="text-green-600">Free</p>
                                </div>
                                <div className="border-t border-gray-200 pt-4 flex justify-between text-base font-bold text-gray-900">
                                    <p>Total</p>
                                    <p>PKR {total}</p>
                                </div>
                            </div>

                            {error && (
                                <div className="mt-6 bg-red-50 text-red-600 p-3 rounded-lg text-sm border border-red-100">
                                    {error}
                                </div>
                            )}

                            <button
                                type="submit"
                                form="checkout-form"
                                disabled={loading}
                                className="w-full mt-8 bg-primary-700 border border-transparent rounded-lg shadow-sm py-3 px-4 text-base font-bold text-white hover:bg-primary-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                            >
                                {loading ? 'Processing...' : 'Place Order'}
                            </button>

                            <div className="mt-6 flex justify-center text-sm text-center text-gray-500">
                                <p>
                                    Looking for more?{' '}
                                    <Link to="/shop" className="text-primary-600 font-medium hover:text-primary-500">
                                        Continue Shopping<span aria-hidden="true"> &rarr;</span>
                                    </Link>
                                </p>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
