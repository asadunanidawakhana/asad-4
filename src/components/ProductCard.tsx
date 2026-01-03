import { ShoppingCart, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';
import { type Product } from '../services/productService';
import { useCart } from '../context/CartContext';
import { motion } from 'framer-motion';

interface ProductCardProps {
    product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
    const { addItem } = useCart();

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col group overflow-hidden"
        >
            <div className="relative h-64 bg-gray-100 overflow-hidden">
                <img
                    src={product.image_url}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                {/* Overlay Actions */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center space-x-4">
                    <button
                        onClick={() => addItem({
                            id: product.id,
                            name: product.name,
                            price: product.price,
                            image: product.image_url,
                            quantity: 1
                        })}
                        className="bg-white text-primary-900 p-3 rounded-full hover:bg-accent-DEFAULT hover:text-white transition-colors transform translate-y-4 group-hover:translate-y-0 duration-300"
                        title="Add to Cart"
                    >
                        <ShoppingCart className="w-5 h-5" />
                    </button>
                    <Link
                        to={`/product/${product.id}`}
                        className="bg-white text-primary-900 p-3 rounded-full hover:bg-accent-DEFAULT hover:text-white transition-colors transform translate-y-4 group-hover:translate-y-0 duration-300 delay-75"
                        title="View Details"
                    >
                        <Eye className="w-5 h-5" />
                    </Link>
                </div>
            </div>

            <div className="p-4 flex flex-col flex-grow">
                <div className="mb-2">
                    <span className="text-xs text-primary-600 font-medium bg-primary-50 px-2 py-1 rounded-md">
                        {product.category?.name || 'Herbal'}
                    </span>
                </div>
                <Link to={`/product/${product.id}`} className="block">
                    <h3 className="text-lg font-bold text-gray-900 mb-1 hover:text-primary-700 transition-colors line-clamp-1">{product.name}</h3>
                </Link>
                <p className="text-sm text-gray-500 line-clamp-2 mb-3 flex-grow">{product.description}</p>

                <div className="flex items-center justify-between mt-auto pt-3 border-t border-gray-50">
                    <span className="text-xl font-bold text-gray-900">PKR {product.price}</span>
                    <div className="flex text-yellow-400 text-xs">
                        ★★★★★
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
