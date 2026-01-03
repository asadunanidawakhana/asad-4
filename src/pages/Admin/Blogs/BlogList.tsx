import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Edit, Trash2, FileText } from 'lucide-react';
import { blogService, type BlogPost } from '../../../services/blogService';
import Loader from '../../../components/Loader';

export default function BlogList() {
    const [blogs, setBlogs] = useState<BlogPost[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchBlogs();
    }, []);

    const fetchBlogs = async () => {
        try {
            const data = await blogService.getAllBlogs(true);
            setBlogs(data);
        } catch (error) {
            console.error("Error fetching blogs", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm("Are you sure you want to delete this blog?")) return;
        try {
            await blogService.deleteBlog(id);
            setBlogs(blogs.filter(b => b.id !== id));
        } catch (error) {
            console.error("Error deleting blog", error);
            alert("Failed to delete blog");
        }
    };

    if (loading) return <Loader />;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-900">Health Blogs</h1>
                <Link
                    to="/admin/blogs/new"
                    className="inline-flex items-center px-4 py-2 bg-primary-700 text-white rounded-lg hover:bg-primary-800 transition-colors"
                >
                    <Plus className="w-5 h-5 mr-2" />
                    Write New Blog
                </Link>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <table className="w-full text-left text-sm">
                    <thead className="bg-gray-50 text-gray-700 uppercase font-semibold">
                        <tr>
                            <th className="px-6 py-4">Title</th>
                            <th className="px-6 py-4">Author</th>
                            <th className="px-6 py-4">Status</th>
                            <th className="px-6 py-4">Created At</th>
                            <th className="px-6 py-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {blogs.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                                    <FileText className="w-12 h-12 mx-auto text-gray-300 mb-4" />
                                    <p>No blogs found. Start writing!</p>
                                </td>
                            </tr>
                        ) : (
                            blogs.map((blog) => (
                                <tr key={blog.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 font-medium text-gray-900">
                                        <div className="flex items-center">
                                            {blog.image && (
                                                <img src={blog.image} alt="" className="w-10 h-10 rounded object-cover mr-3" />
                                            )}
                                            {blog.title}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-gray-500">{blog.author?.full_name || 'Unknown'}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${blog.is_published ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                                            }`}>
                                            {blog.is_published ? 'Published' : 'Draft'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-gray-500">
                                        {new Date(blog.created_at).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4 text-right space-x-2">
                                        <Link
                                            to={`/admin/blogs/edit/${blog.id}`}
                                            className="text-blue-600 hover:text-blue-800 inline-block"
                                            title="Edit"
                                        >
                                            <Edit className="w-5 h-5" />
                                        </Link>
                                        <button
                                            onClick={() => handleDelete(blog.id)}
                                            className="text-red-600 hover:text-red-800 inline-block"
                                            title="Delete"
                                        >
                                            <Trash2 className="w-5 h-5" />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
