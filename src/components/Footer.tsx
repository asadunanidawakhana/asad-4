import { Facebook, Instagram, Twitter, MapPin, Phone, Mail, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Footer() {
    return (
        <footer className="bg-primary-900 text-white pt-16 pb-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
                    {/* Brand Info */}
                    <div>
                        <h3 className="text-2xl font-bold mb-6">Asad<span className="text-accent-DEFAULT">Unani</span></h3>
                        <p className="text-primary-100 text-sm leading-relaxed mb-6">
                            Providing authentic Unani and Herbal remedies since 1995. Natural healing for a healthier life using time-tested traditional wisdom.
                        </p>
                        <div className="flex space-x-4">
                            <a href="#" className="bg-primary-800 p-2 rounded-full hover:bg-accent-DEFAULT transition-colors">
                                <Facebook className="w-5 h-5" />
                            </a>
                            <a href="#" className="bg-primary-800 p-2 rounded-full hover:bg-accent-DEFAULT transition-colors">
                                <Instagram className="w-5 h-5" />
                            </a>
                            <a href="#" className="bg-primary-800 p-2 rounded-full hover:bg-accent-DEFAULT transition-colors">
                                <Twitter className="w-5 h-5" />
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="text-lg font-semibold mb-6">Quick Links</h4>
                        <ul className="space-y-3 text-sm text-primary-100">
                            <li><Link to="/about" className="hover:text-accent-DEFAULT transition-colors">About Us</Link></li>
                            <li><Link to="/shop" className="hover:text-accent-DEFAULT transition-colors">Our Shop</Link></li>
                            <li><Link to="/blog" className="hover:text-accent-DEFAULT transition-colors">Health Tips</Link></li>
                            <li><Link to="/contact" className="hover:text-accent-DEFAULT transition-colors">Contact Us</Link></li>
                            <li><Link to="/faq" className="hover:text-accent-DEFAULT transition-colors">FAQ</Link></li>
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h4 className="text-lg font-semibold mb-6">Contact Us</h4>
                        <ul className="space-y-4 text-sm text-primary-100">
                            <li className="flex items-start">
                                <MapPin className="w-5 h-5 mr-3 text-accent-DEFAULT flex-shrink-0" />
                                <span>Asad unani Dawakhana near iqbal public school al quresh phase 2 multan</span>
                            </li>
                            <li className="flex items-center">
                                <Phone className="w-5 h-5 mr-3 text-accent-DEFAULT flex-shrink-0" />
                                <span>03087817695</span>
                            </li>
                            <li className="flex items-center">
                                <Mail className="w-5 h-5 mr-3 text-accent-DEFAULT flex-shrink-0" />
                                <span>hakeemrazq@gmail.com</span>
                            </li>
                        </ul>
                    </div>

                    {/* Newsletter */}
                    <div>
                        <h4 className="text-lg font-semibold mb-6">Newsletter</h4>
                        <p className="text-primary-100 text-sm mb-4">Subscribe to get special offers, free giveaways, and once-in-a-lifetime deals.</p>
                        <div className="flex flex-col space-y-2">
                            <input
                                type="email"
                                placeholder="Your email address"
                                className="bg-primary-800 border border-transparent focus:border-accent-DEFAULT text-white px-4 py-2 rounded-md focus:outline-none placeholder-primary-400 text-sm"
                            />
                            <button className="bg-accent-DEFAULT text-white px-4 py-2 rounded-md hover:bg-accent-hover transition-colors font-medium flex justify-center items-center">
                                Subscribe
                                <ArrowRight className="w-4 h-4 ml-2" />
                            </button>
                        </div>
                    </div>
                </div>

                <div className="border-t border-primary-800 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-primary-300">
                    <p>&copy; {new Date().getFullYear()} Asad Unani Dawakhana. All rights reserved.</p>
                    <div className="flex space-x-6 mt-4 md:mt-0">
                        <Link to="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
                        <Link to="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
