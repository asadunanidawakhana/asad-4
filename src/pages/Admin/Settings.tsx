import { Save, Globe, Shield, Bell } from 'lucide-react';

export default function Settings() {
    return (
        <div className="space-y-6 max-w-4xl">
            <h1 className="text-2xl font-bold text-gray-900">Settings</h1>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="grid md:grid-cols-3 min-h-[400px]">
                    {/* Sidebar */}
                    <div className="bg-gray-50 border-r border-gray-200 p-4">
                        <nav className="space-y-1">
                            <button className="w-full flex items-center px-3 py-2 text-sm font-medium bg-white text-primary-700 shadow-sm rounded-md">
                                <Globe className="w-4 h-4 mr-3" /> General
                            </button>
                            <button className="w-full flex items-center px-3 py-2 text-sm font-medium text-gray-600 hover:bg-white hover:text-gray-900 rounded-md">
                                <Shield className="w-4 h-4 mr-3" /> Security
                            </button>
                            <button className="w-full flex items-center px-3 py-2 text-sm font-medium text-gray-600 hover:bg-white hover:text-gray-900 rounded-md">
                                <Bell className="w-4 h-4 mr-3" /> Notifications
                            </button>
                        </nav>
                    </div>

                    {/* Content */}
                    <div className="md:col-span-2 p-6 space-y-6">
                        <div>
                            <h3 className="text-lg font-bold text-gray-900 mb-4">General Settings</h3>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Store Name</label>
                                    <input type="text" defaultValue="Asad Unani Dawakhana" className="w-full px-4 py-2 border rounded-lg" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Support Email</label>
                                    <input type="email" defaultValue="info@asadunanidawakhana.com" className="w-full px-4 py-2 border rounded-lg" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Currency</label>
                                    <select className="w-full px-4 py-2 border rounded-lg">
                                        <option>PKR (Pakistani Rupee)</option>
                                        <option>USD (US Dollar)</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        <div className="pt-4 border-t border-gray-100 flex justify-end">
                            <button className="flex items-center bg-primary-700 text-white px-6 py-2 rounded-lg hover:bg-primary-800 transition-colors font-bold">
                                <Save className="w-4 h-4 mr-2" /> Save Changes
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
