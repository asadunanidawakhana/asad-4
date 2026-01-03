import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { productService, type Product } from '../../services/productService';
import { useCart } from '../../context/CartContext';
import Loader from '../../components/Loader';
import { ShoppingCart, Heart, Share2, Check } from 'lucide-react';

export default function ProductDetails() {
    const { id } = useParams<{ id: string }>();
    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);
    const [quantity, setQuantity] = useState(1);
    const { addItem } = useCart();
    const [added, setAdded] = useState(false);

    useEffect(() => {
        async function loadProduct() {
            if (!id) return;
            setLoading(true);
            try {
                const data = await productService.getProductById(id);
                setProduct(data);
            } catch (error) {
                console.error('Error loading product', error);
            } finally {
                setLoading(false);
            }
        }
        loadProduct();
    }, [id]);

    const handleAddToCart = () => {
        if (!product) return;
        addItem({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image_url,
            quantity: quantity
        });
        setAdded(true);
        setTimeout(() => setAdded(false), 2000);
    };

    if (loading) return <Loader />;
    if (!product) return <div className="text-center py-20">Product not found</div>;

    return (
        <div className="bg-white min-h-screen py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Breadcrumb */}
                <nav className="flex text-sm text-gray-500 mb-8">
                    <Link to="/" className="hover:text-primary-600">Home</Link>
                    <span className="mx-2">/</span>
                    <Link to="/shop" className="hover:text-primary-600">Shop</Link>
                    <span className="mx-2">/</span>
                    <span className="text-gray-900">{product.name}</span>
                </nav>

                <div className="flex flex-col md:flex-row gap-12">
                    {/* Image Gallery */}
                    <div className="md:w-1/2">
                        <div className="aspect-square bg-gray-100 rounded-2xl overflow-hidden border border-gray-200">
                            <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" />
                        </div>
                        {/* Thumbnails would go here */}
                    </div>

                    {/* Product Info */}
                    <div className="md:w-1/2">
                        <div className="mb-2">
                            <span className="bg-primary-50 text-primary-700 text-xs font-bold px-2 py-1 rounded-full uppercase tracking-wide">
                                {product.category?.name || 'Herbal'}
                            </span>
                        </div>
                        <h1 className="text-3xl font-bold text-gray-900 mb-4">{product.name}</h1>
                        <div className="flex items-center space-x-4 mb-6">
                            <span className="text-3xl font-bold text-primary-700">PKR {product.price}</span>
                            <div className="flex text-yellow-400 text-sm">★★★★★ <span className="text-gray-400 ml-2">(4.8/5)</span></div>
                        </div>

                        <p className="text-gray-600 leading-relaxed mb-8">
                            {product.description}
                        </p>

                        {/* Quantity & Actions */}
                        <div className="flex flex-col sm:flex-row gap-4 mb-8">
                            <div className="flex items-center border border-gray-300 rounded-lg w-auto sm:w-32">
                                <button
                                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                    className="px-4 py-2 text-gray-600 hover:text-primary-600 text-lg"
                                >-</button>
                                <input
                                    type="number"
                                    value={quantity}
                                    readOnly
                                    className="w-full text-center text-gray-900 font-bold focus:outline-none"
                                />
                                <button
                                    onClick={() => setQuantity(quantity + 1)}
                                    className="px-4 py-2 text-gray-600 hover:text-primary-600 text-lg"
                                >+</button>
                            </div>

                            <button
                                onClick={handleAddToCart}
                                disabled={added}
                                className={`flex-1 flex items-center justify-center px-8 py-3 rounded-lg font-bold transition-all duration-300 ${added ? 'bg-green-600 text-white' : 'bg-primary-700 text-white hover:bg-primary-800'}`}
                            >
                                {added ? (
                                    <>
                                        <Check className="w-5 h-5 mr-2" /> Added to Cart
                                    </>
                                ) : (
                                    <>
                                        <ShoppingCart className="w-5 h-5 mr-2" /> Add to Cart
                                    </>
                                )}
                            </button>

                            <button className="p-3 border border-gray-300 rounded-lg text-gray-500 hover:text-red-500 hover:border-red-500 transition-colors">
                                <Heart className="w-6 h-6" />
                            </button>
                        </div>

                        {/* Additional Info */}
                        <div className="border-t border-gray-200 pt-6 space-y-4">
                            <div className="flex items-center text-sm text-gray-600">
                                <span className="w-32 font-medium">Availability:</span>
                                {product.stock_quantity > 0 ? (
                                    <span className="text-green-600 font-medium">In Stock ({product.stock_quantity})</span>
                                ) : (
                                    <span className="text-red-600 font-medium">Out of Stock</span>
                                )}
                            </div>
                            <div className="flex items-center text-sm text-gray-600">
                                <span className="w-32 font-medium">Delivery:</span>
                                <span>2-4 Working Days</span>
                            </div>
                            <div className="flex items-center text-sm text-gray-600">
                                <span className="w-32 flex-shrink-0 font-medium">Safe Checkout:</span>
                                <div className="flex space-x-2">
                                    {/* Payment icons could go here */}
                                    <span>COD / Bank Transfer</span>
                                </div>
                            </div>
                        </div>

                        <div className="mt-8">
                            <button className="flex items-center text-primary-600 hover:text-primary-800 text-sm font-medium">
                                <Share2 className="w-4 h-4 mr-2" /> Share this product
                            </button>
                        </div>
                    </div>
                </div>

                {/* Detail Tabs (Description, Usage, etc.) could go here */}
            </div>
        </div>
    );
}
