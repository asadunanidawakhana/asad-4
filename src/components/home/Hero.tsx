import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function Hero() {
    return (
        <div className="relative bg-primary-50 overflow-hidden min-h-[600px] flex items-center">
            {/* Background Pattern - Soft and Subtle */}
            <div className="absolute inset-0 opacity-30">
                <svg className="h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                    <path d="M0 100 Q 50 50 100 100 L 100 0 L 0 0 Z" fill="white" />
                </svg>
            </div>

            {/* Soft Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-white/90 via-white/60 to-transparent"></div>

            <div className="relative w-full max-w-screen-2xl mx-auto px-6 sm:px-12 lg:px-20 flex flex-col md:flex-row items-center justify-between">
                <div className="md:w-1/2 pt-16 pb-16 md:pt-0 md:pb-0 z-10 md:pr-12 lg:pr-20">
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <motion.span
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="inline-flex items-center py-1 px-3 rounded-full bg-green-100 text-primary-800 text-sm font-semibold mb-6 border border-green-200"
                        >
                            <span className="mr-2">🌿</span> 100% Natural & Organic
                        </motion.span>
                        <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6 leading-tight tracking-tight">
                            Revitalize Life <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-700 to-primary-500">
                                With Nature
                            </span>
                        </h1>
                        <p className="text-xl text-gray-600 mb-8 max-w-lg leading-relaxed font-light">
                            Authentic Unani remedies crafted with care. Restore your health balance naturally without side effects.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4">
                            <Link
                                to="/shop"
                                className="bg-primary-700 text-white px-8 py-4 rounded-full font-semibold hover:bg-primary-800 transition-all transform hover:-translate-y-1 shadow-xl shadow-primary-700/20 flex items-center justify-center"
                            >
                                Start Healing <ArrowRight className="ml-2 w-5 h-5" />
                            </Link>
                            <Link
                                to="/contact"
                                className="group bg-white border border-gray-200 text-gray-700 px-8 py-4 rounded-full font-semibold hover:border-primary-500 hover:text-primary-700 transition-all shadow-sm flex items-center justify-center"
                            >
                                Consult Hakim
                            </Link>
                        </div>
                    </motion.div>
                </div>

                <div className="md:w-1/2 h-full flex justify-center md:justify-end items-center relative z-0 mt-12 md:mt-0 pl-4">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 1 }}
                        className="relative w-full max-w-lg aspect-square flex items-center justify-center"
                    >
                        {/* Abstract Organic Shapes Blob */}
                        <div className="absolute inset-0 bg-green-100 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-blob"></div>
                        <div className="absolute top-0 -right-4 w-72 h-72 bg-yellow-50 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-blob animation-delay-2000"></div>
                        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-emerald-50 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-blob animation-delay-4000"></div>

                        {/* Center Product Visual */}
                        <div className="relative z-10 w-80 h-auto transform rotate-3 hover:rotate-0 transition-all duration-500">
                            <img
                                src="/images/hero-product.png"
                                alt="Premium Unani Herbal Medicine"
                                className="w-full h-full object-contain drop-shadow-2xl rounded-2xl"
                            />

                            {/* Decorative Elements */}
                            <div className="absolute -top-6 -right-6 w-16 h-16 bg-white rounded-2xl shadow-lg flex items-center justify-center transform rotate-12 animate-bounce-slow">
                                <span className="text-2xl">✨</span>
                            </div>
                            <div className="absolute -bottom-6 -left-6 w-auto px-4 py-2 bg-primary-700 text-white rounded-full shadow-lg flex items-center justify-center transform -rotate-6 text-sm font-bold">
                                100% Organic
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
