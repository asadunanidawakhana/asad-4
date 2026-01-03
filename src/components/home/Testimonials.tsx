import { motion } from 'framer-motion';

const REVIEWS = [
    { id: 1, name: 'Ahmed Khan', role: 'Verified Customer', text: "The herbal hair oil is amazing! I saw results in just 2 weeks. Extremely authentic products.", rating: 5 },
    { id: 2, name: 'Saima bibi', role: 'Verified Customer', text: "Finally found a cure for my digestion issues. The Hakim's advice was very helpful.", rating: 5 },
    { id: 3, name: 'Usman Ali', role: 'Verified Customer', text: "Delivery was fast and the packaging is very premium. Subscribed for monthly medicines.", rating: 4 },
];

export default function Testimonials() {
    return (
        <section className="py-20 bg-primary-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="text-3xl font-bold text-gray-900">Trusted by Thousands</h2>
                    <p className="mt-4 text-gray-600">See what our community has to say about their healing journey.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {REVIEWS.map((review, index) => (
                        <motion.div
                            key={review.id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 relative"
                        >
                            <div className="text-accent-DEFAULT text-6xl absolute top-4 right-6 opacity-20">"</div>
                            <div className="flex text-yellow-400 mb-4">
                                {'★'.repeat(review.rating)}
                            </div>
                            <p className="text-gray-700 italic mb-6 leading-relaxed relative z-10">{review.text}</p>
                            <div className="flex items-center">
                                <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center font-bold text-gray-500">
                                    {review.name[0]}
                                </div>
                                <div className="ml-3">
                                    <h4 className="font-bold text-gray-900">{review.name}</h4>
                                    <p className="text-xs text-primary-600">{review.role}</p>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
