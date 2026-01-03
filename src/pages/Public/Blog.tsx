import { useEffect, useState } from 'react';
import { Calendar, User, ArrowRight, BookOpen } from 'lucide-react';
import { Link } from 'react-router-dom';
import { blogService, type BlogPost } from '../../services/blogService';
import Loader from '../../components/Loader';

export default function Blog() {
    const [posts, setPosts] = useState<BlogPost[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const data = await blogService.getAllBlogs(false); // Fetch only published
                setPosts(data);
            } catch (error) {
                console.error("Error fetching blogs", error);
            } finally {
                setLoading(false);
            }
        };
        fetchPosts();
    }, []);

    if (loading) return <Loader />;

    return (
        <div className="pt-24 pb-16 bg-gray-50 min-h-screen">
            <div className="container mx-auto px-4">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">Health Tips & Insights</h1>
                    <p className="text-gray-600 max-w-2xl mx-auto">
                        Explore the wisdom of Unani medicine, healthy living tips, and natural remedies curated by our experts.
                    </p>
                </div>

                {posts.length === 0 ? (
                    <div className="text-center py-20">
                        <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <h2 className="text-xl font-medium text-gray-900">No stories yet</h2>
                        <p className="text-gray-500">Check back later for new health insights.</p>
                    </div>
                ) : (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {posts.map(post => (
                            <article key={post.id} className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow duration-300 flex flex-col">
                                <div className="h-48 overflow-hidden bg-gray-100">
                                    {post.image ? (
                                        <img
                                            src={post.image}
                                            alt={post.title}
                                            className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-500"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-gray-300">
                                            <BookOpen className="w-12 h-12" />
                                        </div>
                                    )}
                                </div>
                                <div className="p-6 flex flex-col flex-grow">
                                    <div className="flex items-center text-xs text-gray-500 mb-3 space-x-4">
                                        <span className="flex items-center"><Calendar className="w-3 h-3 mr-1" /> {new Date(post.created_at).toLocaleDateString()}</span>
                                        <span className="flex items-center"><User className="w-3 h-3 mr-1" /> {post.author?.full_name || 'Admin'}</span>
                                    </div>
                                    <h2 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 hover:text-primary-700 transition-colors">
                                        <Link to="#">{post.title}</Link>
                                    </h2>
                                    <p className="text-gray-600 text-sm mb-4 flex-grow line-clamp-3">
                                        {post.excerpt}
                                    </p>
                                    <Link to="#" className="inline-flex items-center text-primary-700 font-bold hover:underline mt-auto">
                                        Read More <ArrowRight className="w-4 h-4 ml-1" />
                                    </Link>
                                </div>
                            </article>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
