import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { wishlistService, type WishlistItem } from '../../services/wishlistService';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import Loader from '../../components/Loader';
import { Heart, Trash2, ShoppingCart } from 'lucide-react';

export default function Wishlist() {
    const { user } = useAuth();
    const { addItem } = useCart();
    const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user) loadWishlist();
    }, [user]);

    async function loadWishlist() {
        try {
            const data = await wishlistService.getWishlist(user!.id);
            setWishlist(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }

    async function handleRemove(productId: string) {
        if (!user) return;
        try {
            await wishlistService.removeFromWishlist(user.id, productId);
            setWishlist(prev => prev.filter(item => item.product_id !== productId));
        } catch (error) {
            console.error('Failed to remove from wishlist', error);
        }
    }

    const handleAddToCart = (item: WishlistItem) => {
        if (!item.product) return;
        addItem({
            id: item.product.id || item.product_id,
            name: item.product.name,
            price: item.product.price,
            image: item.product.image_url,
            quantity: 1
        });
        // Optional: Remove from wishlist after adding to cart
        // handleRemove(item.product_id);
    };

    if (loading) return <Loader />;

    if (wishlist.length === 0) {
        return (
            <div className="text-center py-20 bg-white rounded-xl border border-gray-100 shadow-sm">
                <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900">Your wishlist is empty</h3>
                <p className="text-gray-500 mb-6">Save items you want to buy later.</p>
                <Link to="/shop" className="text-primary-600 font-medium hover:underline">Browse Products</Link>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-gray-900">My Wishlist</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {wishlist.map((item) => (
                    <div key={item.id} className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-shadow group">
                        <div className="relative aspect-square bg-gray-100">
                            <img
                                src={item.product?.image_url || 'https://via.placeholder.com/300'}
                                alt={item.product?.name}
                                className="w-full h-full object-cover"
                            />
                            <button
                                onClick={() => handleRemove(item.product_id)}
                                className="absolute top-3 right-3 p-2 bg-white/80 hover:bg-white text-red-500 rounded-full transition-colors shadow-sm"
                                title="Remove"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </div>
                        <div className="p-4">
                            <h3 className="font-bold text-gray-900 mb-1 truncate">{item.product?.name}</h3>
                            <p className="text-primary-700 font-bold mb-4">PKR {item.product?.price}</p>
                            <button
                                onClick={() => handleAddToCart(item)}
                                className="w-full flex items-center justify-center bg-gray-900 text-white py-2 rounded-lg hover:bg-gray-800 transition-colors"
                            >
                                <ShoppingCart className="w-4 h-4 mr-2" /> Add to Cart
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
