import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { supabase } from '../../../services/supabaseClient';
import { productService, type Product } from '../../../services/productService';
import { categoryService, type Category } from '../../../services/categoryService';
import { storageService } from '../../../services/storageService';
import { ArrowLeft, Save, AlertCircle } from 'lucide-react';

export default function ProductForm() {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEditMode = !!id;

    const [formData, setFormData] = useState<Partial<Product>>({
        name: '',
        description: '',
        price: 0,
        stock_quantity: 0,
        category_id: '',
        image_url: '',
        sku: '',
        is_active: true
    });

    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [fetching, setFetching] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        loadData();
    }, [id]);

    async function loadData() {
        setFetching(true);
        try {
            const [cats, product] = await Promise.all([
                categoryService.getAllCategories(),
                isEditMode && id ? productService.getProductById(id) : Promise.resolve(null)
            ]);

            setCategories(cats);
            if (product) {
                setFormData(product);
            }
        } catch (error) {
            console.error("Error loading data", error);
            setError('Failed to load data so form may not work correctly.');
            navigate('/admin/products'); // Or handle error display
        } finally {
            setFetching(false);
        }
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'number' ? parseFloat(value) : value
        }));
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || e.target.files.length === 0) return;

        const file = e.target.files[0];
        setUploading(true);
        try {
            const imageUrl = await storageService.uploadImage(file, 'products');
            setFormData(prev => ({ ...prev, image_url: imageUrl }));
        } catch (error: any) {
            console.error('Upload failed:', error);
            setError(`Failed to upload image: ${error.message || 'Unknown error'}`);
        } finally {
            setUploading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        // Basic Validation
        if (!formData.name || !formData.price || !formData.category_id) {
            setError('Please fill in all required fields (Name, Price, Category)');
            setLoading(false);
            return;
        }

        try {
            const payload = {
                name: formData.name,
                description: formData.description,
                price: Number(formData.price) || 0,
                stock_quantity: Number(formData.stock_quantity) || 0,
                category_id: formData.category_id,
                image_url: formData.image_url,
                sku: formData.sku,
                slug: (formData.name || '').toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, ''),
            };

            if (isEditMode) {
                const { error } = await supabase
                    .from('products')
                    .update(payload)
                    .eq('id', id);
                if (error) throw error;
            } else {
                const { error } = await supabase
                    .from('products')
                    .insert([payload]);
                if (error) throw error;
            }

            navigate('/admin/products');
        } catch (err: any) {
            console.error('Error saving product:', err);
            setError(err.message || 'Failed to save product');
        } finally {
            setLoading(false);
        }
    };

    if (fetching) return <div className="p-8 text-center text-gray-500">Loading form...</div>;

    return (
        <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center">
                    <Link to="/admin/products" className="mr-4 p-2 rounded-full hover:bg-gray-200 transition-colors">
                        <ArrowLeft className="w-5 h-5 text-gray-600" />
                    </Link>
                    <h1 className="text-2xl font-bold text-gray-900">
                        {isEditMode ? 'Edit Product' : 'Add New Product'}
                    </h1>
                </div>
                <button
                    onClick={handleSubmit}
                    disabled={loading}
                    className="inline-flex items-center px-6 py-2.5 bg-primary-700 text-white rounded-lg hover:bg-primary-800 disabled:opacity-50 transition-colors shadow-sm"
                >
                    <Save className="w-5 h-5 mr-2" />
                    {loading ? 'Saving...' : 'Save Product'}
                </button>
            </div>

            {error && (
                <div className="mb-6 bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg flex items-center">
                    <AlertCircle className="w-5 h-5 mr-2" />
                    {error}
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Info */}
                <div className="lg:col-span-2 space-y-6">

                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Product Name *</label>
                                <input
                                    name="name"
                                    type="text"
                                    required
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                                    placeholder="e.g. Habbe Nishat"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                <textarea
                                    name="description"
                                    rows={4}
                                    value={formData.description}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                                    placeholder="Describe the product benefits and usage..."
                                />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Pricing & Inventory</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Price (PKR) *</label>
                                <input
                                    name="price"
                                    type="number"
                                    min="0"
                                    required
                                    value={formData.price}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                                    placeholder="0.00"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Stock Quantity</label>
                                <input
                                    name="stock_quantity"
                                    type="number"
                                    min="0"
                                    value={formData.stock_quantity}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                                    placeholder="100"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">SKU (Optional)</label>
                                <input
                                    name="sku"
                                    type="text"
                                    value={formData.sku}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                                    placeholder="SKU-123"
                                />
                            </div>
                        </div>
                    </div>

                </div>

                {/* Sidebar Settings */}
                <div className="space-y-6">
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Organization</h3>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
                            <select
                                name="category_id"
                                required
                                value={formData.category_id}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                            >
                                <option value="">Select Category</option>
                                {categories.map(cat => (
                                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Media</h3>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Product Image</label>
                            <div className="flex items-center space-x-4 mb-4">
                                {formData.image_url && (
                                    <div className="relative w-24 h-24 rounded-lg overflow-hidden border border-gray-200">
                                        <img src={formData.image_url} alt="Preview" className="w-full h-full object-cover" />
                                    </div>
                                )}
                                <div className="flex-1">
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageUpload}
                                        disabled={uploading}
                                        className="block w-full text-sm text-gray-500
                                            file:mr-4 file:py-2 file:px-4
                                            file:rounded-full file:border-0
                                            file:text-sm file:font-semibold
                                            file:bg-primary-50 file:text-primary-700
                                            hover:file:bg-primary-100"
                                    />
                                    {uploading && <p className="text-sm text-gray-500 mt-1">Uploading...</p>}
                                </div>
                            </div>
                            <input type="hidden" name="image_url" value={formData.image_url || ''} />
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}
