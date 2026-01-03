import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { categoryService, type Category } from '../../../services/categoryService';
import Loader from '../../../components/Loader';
import { Edit, Trash2, Plus, Search } from 'lucide-react';

export default function CategoryList() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        loadCategories();
    }, []);

    async function loadCategories() {
        try {
            const data = await categoryService.getAllCategories();
            setCategories(data);
        } catch (error) {
            console.error('Error loading categories', error);
        } finally {
            setLoading(false);
        }
    }

    async function handleDelete(id: string) {
        if (!window.confirm('Are you sure you want to delete this category?')) return;
        try {
            await categoryService.deleteCategory(id);
            setCategories(categories.filter(c => c.id !== id));
        } catch (error) {
            console.error('Error deleting category', error);
            alert('Failed to delete category');
        }
    }

    const filteredCategories = categories.filter(category =>
        category.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) return <Loader />;

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                <h1 className="text-2xl font-bold text-gray-900">Categories</h1>
                <Link
                    to="/admin/categories/new"
                    className="inline-flex items-center bg-primary-700 text-white px-4 py-2 rounded-lg hover:bg-primary-800 transition-colors"
                >
                    <Plus className="w-5 h-5 mr-2" />
                    Add Category
                </Link>
            </div>

            {/* Search Bar */}
            <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                    type="text"
                    placeholder="Search categories..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-gray-50 text-gray-700 uppercase font-semibold">
                            <tr>
                                <th className="px-6 py-4">Name</th>
                                <th className="px-6 py-4">Slug</th>
                                <th className="px-6 py-4">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {filteredCategories.length > 0 ? (
                                filteredCategories.map((category) => (
                                    <tr key={category.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 font-medium text-gray-900">{category.name}</td>
                                        <td className="px-6 py-4 text-gray-500">{category.slug}</td>
                                        <td className="px-6 py-4 flex space-x-3">
                                            <Link to={`/admin/categories/edit/${category.id}`} className="text-blue-600 hover:text-blue-800" title="Edit">
                                                <Edit className="w-5 h-5" />
                                            </Link>
                                            <button onClick={() => handleDelete(category.id)} className="text-red-500 hover:text-red-700" title="Delete">
                                                <Trash2 className="w-5 h-5" />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={3} className="px-6 py-8 text-center text-gray-500">
                                        No categories found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
