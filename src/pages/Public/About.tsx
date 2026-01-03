import { motion } from 'framer-motion';

export default function About() {
    return (
        <div className="pt-24 pb-16 bg-white">
            <div className="container mx-auto px-4 max-w-4xl">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-16"
                >
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">Our Legacy of Healing</h1>
                    <p className="text-xl text-gray-600 leading-relaxed">
                        Combining centuries-old Unani wisdom with modern quality standards to bring you nature's best remedies.
                    </p>
                </motion.div>

                <div className="space-y-16">
                    <section className="grid md:grid-cols-2 gap-12 items-center">
                        <div>
                            <img
                                src="https://images.unsplash.com/photo-1544367563-12123d8965cd?auto=format&fit=crop&q=80&w=800"
                                alt="Herbal Preparation"
                                className="rounded-2xl shadow-xl hover:shadow-2xl transition-shadow duration-500"
                            />
                        </div>
                        <div>
                            <h2 className="text-3xl font-bold text-primary-800 mb-4">About Asad Unani Dawakhana</h2>
                            <p className="text-gray-600 mb-4 leading-relaxed">
                                Established with a vision to revive the authentic Unani system of medicine, Asad Unani Dawakhana has been serving the community with dedication and integrity. We believe in the holistic approach of Unani medicine, which treats the root cause of the ailment rather than just the symptoms.
                            </p>
                            <p className="text-gray-600 leading-relaxed">
                                Our remedies are crafted from the finest natural herbs, strictly adhering to traditional formulations while ensuring hygiene and purity. We are committed to providing safe, effective, and affordable healthcare solutions to all.
                            </p>
                        </div>
                    </section>

                    <section className="bg-primary-50 rounded-3xl p-8 md:p-12 text-center">
                        <h2 className="text-3xl font-bold text-primary-900 mb-8">Why Choose Us?</h2>
                        <div className="grid md:grid-cols-3 gap-8">
                            <div>
                                <div className="h-16 w-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 text-2xl shadow-sm">🌿</div>
                                <h3 className="font-bold text-lg mb-2">100% Natural</h3>
                                <p className="text-sm text-gray-600">Pure herbal ingredients with no harmful chemicals.</p>
                            </div>
                            <div>
                                <div className="h-16 w-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 text-2xl shadow-sm">📜</div>
                                <h3 className="font-bold text-lg mb-2">Authentic Formulas</h3>
                                <p className="text-sm text-gray-600">Based on time-tested Unani manuscripts and wisdom.</p>
                            </div>
                            <div>
                                <div className="h-16 w-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 text-2xl shadow-sm">👨‍⚕️</div>
                                <h3 className="font-bold text-lg mb-2">Expert Guidance</h3>
                                <p className="text-sm text-gray-600">Supervised by qualified Hakims and medical experts.</p>
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
}
