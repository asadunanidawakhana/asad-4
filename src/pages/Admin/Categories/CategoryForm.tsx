import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { categoryService, type Category } from '../../../services/categoryService';
import { storageService } from '../../../services/storageService';
import Loader from '../../../components/Loader';
import { ArrowLeft, Save } from 'lucide-react';

export default function CategoryForm() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const isEditMode = !!id;

    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [initialLoading, setInitialLoading] = useState(isEditMode);

    const [formData, setFormData] = useState<Partial<Category>>({
        name: '',
        slug: '',
        image: ''
    });

    useEffect(() => {
        if (isEditMode && id) {
            loadCategory(id);
        }
    }, [id, isEditMode]);

    async function loadCategory(categoryId: string) {
        try {
            const data = await categoryService.getCategoryById(categoryId);
            setFormData(data);
        } catch (error) {
            console.error("Error loading category", error);
            navigate('/admin/categories');
        } finally {
            setInitialLoading(false);
        }
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => {
            const newData = { ...prev, [name]: value };
            // Auto-generate slug from name if not manually edited
            if (name === 'name' && !isEditMode) {
                newData.slug = value.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
            }
            return newData;
        });
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || e.target.files.length === 0) return;

        const file = e.target.files[0];
        setUploading(true);
        try {
            const imageUrl = await storageService.uploadImage(file, 'categories');
            setFormData(prev => ({ ...prev, image: imageUrl }));
        } catch (error: any) {
            console.error('Upload failed:', error);
            alert(`Failed to upload image: ${error.message || 'Unknown error'}`);
        } finally {
            setUploading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        // Sanitize data
        const dataToSave = {
            ...formData,
            image: formData.image?.trim() || undefined // Use undefined instead of null to match optional type
        };

        try {
            if (isEditMode && id) {
                await categoryService.updateCategory(id, dataToSave);
            } else {
                await categoryService.createCategory(dataToSave as Category);
            }
            navigate('/admin/categories');
        } catch (error: any) {
            console.error("Error saving category", error);
            alert(`Failed to save category: ${error.message || 'Unknown error'}`);
        } finally {
            setLoading(false);
        }
    };

    if (initialLoading) return <Loader />;

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <div className="flex items-center space-x-4">
                <button onClick={() => navigate('/admin/categories')} className="text-gray-500 hover:text-gray-900">
                    <ArrowLeft className="w-6 h-6" />
                </button>
                <h1 className="text-2xl font-bold text-gray-900">{isEditMode ? 'Edit Category' : 'Add New Category'}</h1>
            </div>

            <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-6">

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Category Name</label>
                    <input
                        type="text"
                        name="name"
                        required
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                        placeholder="e.g. Herbal Teas"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Slug</label>
                    <input
                        type="text"
                        name="slug"
                        required
                        value={formData.slug}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500 bg-gray-50"
                        placeholder="herbal-teas"
                    />
                    <p className="text-xs text-gray-500 mt-1">Unique URL identifier for the category.</p>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Category Image</label>
                    <div className="flex items-center space-x-4">
                        {formData.image && (
                            <div className="w-20 h-20 rounded-lg overflow-hidden border border-gray-200">
                                <img src={formData.image} alt="Preview" className="w-full h-full object-cover" />
                            </div>
                        )}
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
                    </div>
                    {uploading && <p className="text-sm text-gray-500 mt-2">Uploading image...</p>}
                    <input type="hidden" name="image" value={formData.image || ''} />
                </div>

                <div className="flex justify-end pt-4">
                    <button
                        type="submit"
                        disabled={loading}
                        className="inline-flex items-center px-6 py-3 bg-primary-700 text-white font-bold rounded-lg hover:bg-primary-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    >
                        <Save className="w-5 h-5 mr-2" />
                        {loading ? 'Saving...' : 'Save Category'}
                    </button>
                </div>

            </form>
        </div>
    );
}
