import { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, ShoppingCart, Loader } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { supabase } from '../../services/supabaseClient';

// Type definition for Product
interface Product {
    id: string;
    name: string;
    price: number;
    image_url: string;
    category: { name: string } | { name: string }[] | null;
}

export default function FeaturedProducts() {
    const scrollRef = useRef<HTMLDivElement>(null);
    const { addItem } = useCart();
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const { data, error } = await supabase
                .from('products')
                .select(`
                    id, 
                    name, 
                    price, 
                    image_url,
                    category:categories(name)
                `)
                .limit(10);

            if (error) throw error;

            // Supabase join returns an array if one-to-many, but usually object if foreign key is on product.
            // Safe casting
            setProducts(data as unknown as Product[] || []);
        } catch (error) {
            console.error('Error fetching products:', error);
        } finally {
            setLoading(false);
        }
    };

    const scroll = (direction: 'left' | 'right') => {
        if (scrollRef.current) {
            const { current } = scrollRef;
            const scrollAmount = 320;
            if (direction === 'left') {
                current.scrollLeft -= scrollAmount;
            } else {
                current.scrollLeft += scrollAmount;
            }
        }
    };

    return (
        <section className="py-20 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-end mb-12">
                    <div>
                        <h2 className="text-3xl font-bold text-gray-900 mb-2">Featured Products</h2>
                        <div className="w-20 h-1 bg-accent-DEFAULT"></div>
                    </div>
                    <div className="flex space-x-2">
                        <button onClick={() => scroll('left')} className="p-2 rounded-full border border-gray-300 hover:bg-primary-50 hover:border-primary-500 transition-colors">
                            <ChevronLeft className="w-5 h-5 text-gray-600" />
                        </button>
                        <button onClick={() => scroll('right')} className="p-2 rounded-full border border-gray-300 hover:bg-primary-50 hover:border-primary-500 transition-colors">
                            <ChevronRight className="w-5 h-5 text-gray-600" />
                        </button>
                    </div>
                </div>

                {loading ? (
                    <div className="flex justify-center p-12">
                        <Loader className="w-8 h-8 animate-spin text-primary-500" />
                    </div>
                ) : (
                    <div
                        ref={scrollRef}
                        className="flex space-x-6 overflow-x-auto scrollbar-hide pb-4 snap-x snap-mandatory"
                        style={{ scrollBehavior: 'smooth' }}
                    >
                        {products.map((product) => (
                            <motion.div
                                key={product.id}
                                className="flex-none w-72 snap-start bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300"
                                whileHover={{ y: -5 }}
                            >
                                <div className="relative h-64 bg-gray-100 rounded-t-xl overflow-hidden group">
                                    <img src={product.image_url || 'https://placehold.co/300x300?text=No+Image'} alt={product.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                                    <button
                                        onClick={() => {
                                            const catName = Array.isArray(product.category)
                                                ? product.category[0]?.name
                                                : product.category?.name;

                                            addItem({
                                                ...product,
                                                quantity: 1,
                                                category: catName || 'General',
                                                image: product.image_url
                                            });
                                        }}
                                        className="absolute bottom-4 right-4 bg-white p-3 rounded-full shadow-md translate-y-12 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 hover:bg-primary-600 hover:text-white text-primary-700"
                                    >
                                        <ShoppingCart className="w-5 h-5" />
                                    </button>
                                </div>
                                <div className="p-5">
                                    <p className="text-xs text-primary-600 font-medium mb-1">
                                        {Array.isArray(product.category) ? product.category[0]?.name : product.category?.name || 'General'}
                                    </p>
                                    <Link to={`/product/${product.id}`}>
                                        <h3 className="text-lg font-bold text-gray-900 mb-2 hover:text-primary-700 transition-colors line-clamp-1">{product.name}</h3>
                                    </Link>
                                    <div className="flex justify-between items-center">
                                        <span className="text-lg font-bold text-gray-900">PKR {product.price}</span>
                                        <div className="flex text-yellow-400 text-xs">
                                            {'★'.repeat(5)}
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
}
