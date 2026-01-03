import { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { blogService, type BlogPost } from '../../../services/blogService';
import { aiService } from '../../../services/aiService';
import { useAuth } from '../../../context/AuthContext';
import Loader from '../../../components/Loader';
import { Upload, X, ArrowLeft, Sparkles, Wand2 } from 'lucide-react';

export default function BlogForm() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const isEditMode = !!id;

    const [formData, setFormData] = useState<Partial<BlogPost>>({
        title: '',
        slug: '',
        content: '',
        excerpt: '',
        is_published: true,
        image: ''
    });

    // AI Generation State
    const [topic, setTopic] = useState('');
    const [generating, setGenerating] = useState(false);

    const [selectedImage, setSelectedImage] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [initialLoading, setInitialLoading] = useState(isEditMode);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (isEditMode && id) {
            fetchBlog(id);
        }
    }, [id]);

    const fetchBlog = async (blogId: string) => {
        try {
            const allBlogs = await blogService.getAllBlogs(true);
            const blog = allBlogs.find(b => b.id === blogId);

            if (blog) {
                setFormData({
                    title: blog.title,
                    slug: blog.slug,
                    content: blog.content,
                    excerpt: blog.excerpt,
                    is_published: blog.is_published,
                    image: blog.image
                });
                if (blog.image) setPreviewUrl(blog.image);
            }
        } catch (error) {
            console.error("Error fetching blog", error);
        } finally {
            setInitialLoading(false);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));

        if (name === 'title' && !isEditMode) {
            const slug = value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
            setFormData(prev => ({ ...prev, slug }));
        }
    };

    const handleGenerateAI = async () => {
        if (!topic.trim()) {
            alert("Please enter a topic first!");
            return;
        }

        setGenerating(true);
        try {
            const data = await aiService.generateBlog(topic);

            // Generate Slug
            const slug = data.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

            // Ensure excerpt isn't too long
            const safeExcerpt = data.excerpt.length > 200 ? data.excerpt.substring(0, 197) + '...' : data.excerpt;

            // Generate Image URL
            const imageUrl = await aiService.generateImageUrl(data.image_prompt);

            setFormData(prev => ({
                ...prev,
                title: data.title,
                slug: slug,
                content: data.content,
                excerpt: safeExcerpt,
                image: imageUrl
            }));

            setPreviewUrl(imageUrl);
            setSelectedImage(null); // Clear manual upload file if any

        } catch (error: any) {
            console.error("AI Generation failed", error);
            alert(`Failed to generate blog: ${error.message || "Unknown error"}`);
        } finally {
            setGenerating(false);
        }
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setSelectedImage(file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            if (isEditMode && id) {
                await blogService.updateBlog(id, formData, selectedImage || undefined);
            } else {
                if (!user) throw new Error("User not found");
                await blogService.createBlog({
                    ...formData,
                    author_id: user.id
                }, selectedImage || undefined);
            }
            navigate('/admin/blogs');
        } catch (error) {
            console.error("Error saving blog", error);
            alert("Failed to save blog");
        } finally {
            setLoading(false);
        }
    };

    if (initialLoading) return <Loader />;

    return (
        <div className="max-w-4xl mx-auto pb-10">
            <div className="flex items-center mb-6">
                <button onClick={() => navigate('/admin/blogs')} className="mr-4 text-gray-500 hover:text-gray-900">
                    <ArrowLeft className="w-6 h-6" />
                </button>
                <h1 className="text-2xl font-bold text-gray-900">{isEditMode ? 'Edit Blog' : 'Write New Blog'}</h1>
            </div>

            {/* AI Generator Section */}
            {!isEditMode && (
                <div className="bg-gradient-to-r from-purple-50 to-indigo-50 p-6 rounded-xl border border-indigo-100 mb-8 shadow-sm">
                    <div className="flex items-start gap-4">
                        <div className="bg-indigo-100 p-3 rounded-lg">
                            <Sparkles className="w-6 h-6 text-indigo-600" />
                        </div>
                        <div className="flex-1">
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">Generate with AI</h3>
                            <p className="text-sm text-gray-600 mb-4">
                                Enter a topic and let our AI write the blog post and generate an image for you.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4">
                                <input
                                    type="text"
                                    value={topic}
                                    onChange={(e) => setTopic(e.target.value)}
                                    placeholder="e.g., Benefits of Black Seed Oil..."
                                    className="flex-1 px-4 py-2 border border-indigo-200 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                                />
                                <button
                                    onClick={handleGenerateAI}
                                    disabled={generating}
                                    className="px-6 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 disabled:opacity-70 transition-colors flex items-center justify-center min-w-[140px]"
                                >
                                    <Wand2 className="w-4 h-4 mr-2" />
                                    {generating ? 'Working...' : 'Generate'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-8">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 space-y-6">
                    {/* Image Upload */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Cover Image</label>
                        <div
                            className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${previewUrl ? 'border-primary-500 bg-gray-50' : 'border-gray-300 hover:border-primary-500'
                                }`}
                            onClick={() => fileInputRef.current?.click()}
                        >
                            {previewUrl ? (
                                <div className="relative inline-block group">
                                    <img src={previewUrl} alt="Preview" className="max-h-64 rounded-lg shadow-sm" />
                                    <button
                                        type="button"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setPreviewUrl(null);
                                            setSelectedImage(null);
                                            setFormData(prev => ({ ...prev, image: '' }));
                                        }}
                                        className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full shadow-md hover:bg-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                </div>
                            ) : (
                                <div className="space-y-2">
                                    <Upload className="w-12 h-12 text-gray-400 mx-auto" />
                                    <p className="text-gray-500">Click to upload cover image (or use AI generated)</p>
                                </div>
                            )}
                            <input
                                type="file"
                                ref={fileInputRef}
                                className="hidden"
                                accept="image/*"
                                onChange={handleImageChange}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                            <input
                                type="text"
                                name="title"
                                required
                                value={formData.title}
                                onChange={handleInputChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                                placeholder="Enter blog title..."
                            />
                        </div>

                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Slug (URL)</label>
                            <input
                                type="text"
                                name="slug"
                                required
                                value={formData.slug}
                                onChange={handleInputChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500 font-mono text-sm"
                                placeholder="enter-blog-slug"
                            />
                        </div>

                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Excerpt (Short Description)</label>
                            <textarea
                                name="excerpt"
                                rows={3}
                                required
                                value={formData.excerpt}
                                onChange={handleInputChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                                placeholder="Brief summary of the article..."
                            />
                        </div>

                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Content</label>
                            <textarea
                                name="content"
                                rows={15}
                                required
                                value={formData.content}
                                onChange={handleInputChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500 font-mono"
                                placeholder="Write your article here..."
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                            <select
                                name="is_published"
                                value={formData.is_published ? 'true' : 'false'}
                                onChange={(e) => setFormData(prev => ({ ...prev, is_published: e.target.value === 'true' }))}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                            >
                                <option value="true">Published</option>
                                <option value="false">Draft</option>
                            </select>
                        </div>
                    </div>
                </div>

                <div className="flex justify-end">
                    <button
                        type="submit"
                        disabled={loading}
                        className="px-8 py-3 bg-primary-700 text-white rounded-lg font-bold hover:bg-primary-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    >
                        {loading ? 'Saving...' : 'Save Blog Post'}
                    </button>
                </div>
            </form>
        </div>
    );
}
