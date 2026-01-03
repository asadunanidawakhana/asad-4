import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { productService, type Category } from '../../services/productService';
import Loader from '../../components/Loader';
import { motion } from 'framer-motion';

export default function Categories() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function load() {
            try {
                const data = await productService.getCategories();
                setCategories(data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        }
        load();
    }, []);

    if (loading) return <Loader />;

    return (
        <div className="bg-white min-h-screen py-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">Browse by Category</h1>
                    <p className="text-gray-600 max-w-2xl mx-auto">Explore our wide range of herbal remedies categorized for your specific health needs.</p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                    {categories.map((cat, index) => (
                        <motion.div
                            key={cat.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                        >
                            <Link to={`/shop?category=${cat.slug}`} className="group block">
                                <div className="bg-gray-50 rounded-2xl p-8 text-center border border-gray-100 hover:shadow-lg transition-all duration-300 hover:bg-primary-50 group-hover:-translate-y-2">
                                    <div className="w-20 h-20 bg-white rounded-full mx-auto mb-6 flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform duration-300">
                                        <span className="text-3xl">🌿</span> {/* Placeholder icon, ideally cat image */}
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-900 group-hover:text-primary-700">{cat.name}</h3>
                                    <p className="text-sm text-gray-500 mt-2 group-hover:text-primary-600">View Products &rarr;</p>
                                </div>
                            </Link>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
}
