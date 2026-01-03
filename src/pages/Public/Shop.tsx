import { useState, useEffect } from 'react';
import { productService, type Product, type Category } from '../../services/productService';
import ProductCard from '../../components/ProductCard';
import Loader from '../../components/Loader';
import { Filter, Search } from 'lucide-react';

export default function Shop() {
    const [products, setProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState<string>('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [priceRange, setPriceRange] = useState<[number, number]>([0, 10000]);

    useEffect(() => {
        async function loadData() {
            try {
                const [prodData, catData] = await Promise.all([
                    productService.getProducts(),
                    productService.getCategories(),
                ]);
                setProducts(prodData);
                setCategories(catData);
            } catch (error) {
                console.error('Failed to load shop data', error);
            } finally {
                setLoading(false);
            }
        }
        loadData();
    }, []);

    const filteredProducts = products.filter(product => {
        const matchesCategory = selectedCategory === 'all' ||
            product.category?.slug === selectedCategory ||
            product.category_id === selectedCategory; // Handle both slug and ID matching conceptually for now



        const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesPrice = product.price >= priceRange[0] && product.price <= priceRange[1];

        return matchesCategory && matchesSearch && matchesPrice;
    });

    if (loading) return <Loader />;

    return (
        <div className="bg-gray-50 min-h-screen py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col md:flex-row gap-8">

                    {/* Sidebar Filters */}
                    <aside className="w-full md:w-64 flex-shrink-0">
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 sticky top-24">
                            <div className="flex items-center space-x-2 mb-6 text-gray-900">
                                <Filter className="w-5 h-5" />
                                <h3 className="font-bold text-lg">Filters</h3>
                            </div>

                            {/* Categories */}
                            <div className="mb-8">
                                <h4 className="font-semibold text-sm text-gray-900 mb-4 uppercase tracking-wide">Categories</h4>
                                <ul className="space-y-2">
                                    <li>
                                        <button
                                            onClick={() => setSelectedCategory('all')}
                                            className={`w-full text-left text-sm ${selectedCategory === 'all' ? 'text-primary-700 font-bold' : 'text-gray-600 hover:text-primary-600'}`}
                                        >
                                            All Products
                                        </button>
                                    </li>
                                    {categories.map(cat => (
                                        <li key={cat.id}>
                                            <button
                                                onClick={() => setSelectedCategory(cat.slug)}
                                                className={`w-full text-left text-sm ${selectedCategory === cat.slug ? 'text-primary-700 font-bold' : 'text-gray-600 hover:text-primary-600'}`}
                                            >
                                                {cat.name}
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* Price Range */}
                            <div>
                                <h4 className="font-semibold text-sm text-gray-900 mb-4 uppercase tracking-wide">Price Range</h4>
                                <input
                                    type="range"
                                    min="0"
                                    max="10000"
                                    step="100"
                                    value={priceRange[1]}
                                    onChange={(e) => setPriceRange([0, parseInt(e.target.value)])}
                                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary-600"
                                />
                                <div className="flex justify-between text-xs text-gray-500 mt-2">
                                    <span>PKR 0</span>
                                    <span>PKR {priceRange[1]}</span>
                                </div>
                            </div>
                        </div>
                    </aside>

                    {/* Product Grid */}
                    <div className="flex-1">
                        {/* Header / Search */}
                        <div className="flex flex-col sm:flex-row justify-between items-center mb-8 bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                            <p className="text-gray-500 text-sm mb-4 sm:mb-0">
                                Showing <span className="font-bold text-gray-900">{filteredProducts.length}</span> results
                            </p>
                            <div className="relative w-full sm:w-64">
                                <input
                                    type="text"
                                    placeholder="Search products..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                />
                                <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                            </div>
                        </div>

                        {/* Grid */}
                        {filteredProducts.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                {filteredProducts.map(product => (
                                    <ProductCard key={product.id} product={product} />
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-20 bg-white rounded-xl border border-gray-100">
                                <p className="text-gray-500 text-lg">No products found for your criteria.</p>
                                <button onClick={() => { setSelectedCategory('all'); setSearchQuery(''); }} className="mt-4 text-primary-600 font-medium hover:underline">
                                    Clear Filters
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
