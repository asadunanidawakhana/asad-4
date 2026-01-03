import { motion } from 'framer-motion';

export default function DoctorMessage() {
    return (
        <section className="py-20 bg-white overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col lg:flex-row items-center gap-12">
                    <div className="lg:w-1/2">
                        <div className="relative">
                            <div className="absolute -inset-4 bg-accent-DEFAULT/20 rounded-xl transform rotate-3"></div>
                            <img
                                src="/images/hakim.png"
                                alt="Hakim Abdul Razzaq"
                                className="relative rounded-xl shadow-lg w-full object-cover"
                            />
                        </div>
                    </div>
                    <div className="lg:w-1/2">
                        <motion.div
                            initial={{ opacity: 0, x: 50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                        >
                            <h2 className="text-3xl font-bold text-gray-900 mb-6">A Message from <span className="text-primary-700">Hakim Abdul Razzaq</span></h2>
                            <blockquote className="text-xl text-gray-600 italic mb-8 border-l-4 border-accent-DEFAULT pl-6">
                                "Our mission is to bring the ancient wisdom of Unani medicine to the modern world.
                                We believe in healing the root cause of ailments, not just suppressing symptoms.
                                Every product is crafted with purity, prayer, and precision."
                            </blockquote>
                            <div className="flex items-center space-x-4">
                                <div>
                                    <p className="font-bold text-gray-900">Hakim Abdul Razzaq</p>
                                    <p className="text-primary-600 text-sm">Founder of Asad Unani Dawakhana</p>
                                </div>
                                <img src="https://placehold.co/100x50/white/black?text=Signature" alt="Signature" className="h-10 opacity-60" />
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </section>
    );
}
