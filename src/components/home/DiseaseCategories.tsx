import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { categoryService, type Category } from '../../services/categoryService';

export default function DiseaseCategories() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadCategories();
    }, []);

    async function loadCategories() {
        try {
            const data = await categoryService.getAllCategories();
            setCategories(data);
        } catch (error) {
            console.error('Error loading categories:', error);
        } finally {
            setLoading(false);
        }
    }

    if (loading) return null; // Or a loader skeletons

    return (
        <section className="py-20 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold text-gray-900 mb-4">Shop by Concern</h2>
                    <div className="w-20 h-1 bg-accent-DEFAULT mx-auto"></div>
                    <p className="mt-4 text-gray-600">Find specialized treatments for your specific health needs.</p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
                    {categories.map((cat, index) => (
                        <motion.div
                            key={cat.id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                        >
                            <Link to={`/shop?category=${cat.slug}`} className="group block">
                                <div className="bg-white rounded-xl shadow-sm hover:shadow-md border border-gray-100 p-6 text-center transition-all duration-300 group-hover:-translate-y-1 h-full flex flex-col items-center justify-center">
                                    <div className="w-16 h-16 bg-primary-50 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-primary-100 transition-colors overflow-hidden">
                                        {cat.image ? (
                                            <img
                                                src={cat.image}
                                                alt={cat.name}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <span className="text-2xl">🌿</span>
                                        )}
                                    </div>
                                    <h3 className="font-semibold text-gray-900 group-hover:text-primary-700 line-clamp-2">{cat.name}</h3>
                                </div>
                            </Link>
                        </motion.div>
                    ))}
                    {categories.length === 0 && (
                        <div className="col-span-full text-center text-gray-500 py-10">
                            No categories found.
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}
