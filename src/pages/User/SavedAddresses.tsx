import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { addressService, type Address } from '../../services/addressService';
import Loader from '../../components/Loader';
import { MapPin, Plus, Edit, Trash2, X, Check, Home } from 'lucide-react';

export default function SavedAddresses() {
    const { user } = useAuth();
    const [addresses, setAddresses] = useState<Address[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);

    const [formData, setFormData] = useState<Partial<Address>>({
        full_name: '',
        phone: '',
        address_line1: '',
        address_line2: '',
        city: '',
        state: '',
        zip_code: '',
        is_default: false
    });

    useEffect(() => {
        if (user) loadAddresses();
    }, [user]);

    async function loadAddresses() {
        try {
            const data = await addressService.getUserAddresses(user!.id);
            setAddresses(data);
        } catch (error) {
            console.error('Error loading addresses', error);
        } finally {
            setLoading(false);
        }
    }

    const openModal = (address?: Address) => {
        if (address) {
            setEditingId(address.id);
            setFormData({ ...address });
        } else {
            setEditingId(null);
            setFormData({
                full_name: '',
                phone: '',
                address_line1: '',
                address_line2: '',
                city: '',
                state: '',
                zip_code: '',
                is_default: false
            });
        }
        setIsModalOpen(true);
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm('Delete this address?')) return;
        try {
            await addressService.deleteAddress(id);
            setAddresses(prev => prev.filter(a => a.id !== id));
        } catch (error) {
            console.error('Error deleting address', error);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (editingId) {
                await addressService.updateAddress(editingId, { ...formData, user_id: user!.id });
            } else {
                await addressService.addAddress({ ...formData, user_id: user!.id } as Address);
            }
            setIsModalOpen(false);
            loadAddresses();
        } catch (error) {
            console.error('Error saving address', error);
        }
    };

    if (loading) return <Loader />;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-900">Saved Addresses</h1>
                <button
                    onClick={() => openModal()}
                    className="inline-flex items-center px-4 py-2 bg-primary-700 text-white rounded-lg hover:bg-primary-800 transition-colors"
                >
                    <Plus className="w-5 h-5 mr-2" /> Add New
                </button>
            </div>

            {addresses.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-xl border border-gray-100 shadow-sm">
                    <MapPin className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900">No saved addresses</h3>
                    <p className="text-gray-500 mb-6">Add an address to speed up checkout.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {addresses.map((addr) => (
                        <div key={addr.id} className={`bg-white border rounded-xl p-6 shadow-sm relative ${addr.is_default ? 'border-primary-500 ring-1 ring-primary-500' : 'border-gray-200'}`}>
                            {addr.is_default && (
                                <span className="absolute top-4 right-4 text-xs font-bold text-primary-700 bg-primary-50 px-2 py-1 rounded-full flex items-center">
                                    <Check className="w-3 h-3 mr-1" /> Default
                                </span>
                            )}
                            <div className="flex items-start space-x-3 mb-4">
                                <div className="p-2 bg-gray-100 rounded-lg">
                                    <Home className="w-5 h-5 text-gray-500" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-gray-900">{addr.full_name}</h3>
                                    <p className="text-sm text-gray-500">{addr.phone}</p>
                                </div>
                            </div>
                            <div className="space-y-1 text-sm text-gray-600 mb-6">
                                <p>{addr.address_line1}</p>
                                {addr.address_line2 && <p>{addr.address_line2}</p>}
                                <p>{addr.city}{addr.state ? `, ${addr.state}` : ''} {addr.zip_code}</p>
                            </div>
                            <div className="flex space-x-3 border-t pt-4">
                                <button onClick={() => openModal(addr)} className="text-blue-600 font-medium text-sm flex items-center hover:underline">
                                    <Edit className="w-4 h-4 mr-1" /> Edit
                                </button>
                                {!addr.is_default && (
                                    <button onClick={() => handleDelete(addr.id)} className="text-red-600 font-medium text-sm flex items-center hover:underline">
                                        <Trash2 className="w-4 h-4 mr-1" /> Delete
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
                        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50 sticky top-0">
                            <h3 className="text-lg font-bold text-gray-900">{editingId ? 'Edit Address' : 'Add New Address'}</h3>
                            <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                                    <input required type="text" className="w-full px-4 py-2 border rounded-lg"
                                        value={formData.full_name} onChange={e => setFormData({ ...formData, full_name: e.target.value })} />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                                    <input required type="tel" className="w-full px-4 py-2 border rounded-lg"
                                        value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Address Line 1</label>
                                <input required type="text" className="w-full px-4 py-2 border rounded-lg"
                                    value={formData.address_line1} onChange={e => setFormData({ ...formData, address_line1: e.target.value })} />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Address Line 2 (Optional)</label>
                                <input type="text" className="w-full px-4 py-2 border rounded-lg"
                                    value={formData.address_line2 || ''} onChange={e => setFormData({ ...formData, address_line2: e.target.value })} />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                                    <input required type="text" className="w-full px-4 py-2 border rounded-lg"
                                        value={formData.city} onChange={e => setFormData({ ...formData, city: e.target.value })} />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Postal Code</label>
                                    <input required type="text" className="w-full px-4 py-2 border rounded-lg"
                                        value={formData.zip_code} onChange={e => setFormData({ ...formData, zip_code: e.target.value })} />
                                </div>
                            </div>

                            <div className="flex items-center">
                                <input
                                    type="checkbox"
                                    id="is_default"
                                    checked={formData.is_default}
                                    onChange={e => setFormData({ ...formData, is_default: e.target.checked })}
                                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                                />
                                <label htmlFor="is_default" className="ml-2 block text-sm text-gray-900">Set as default shipping address</label>
                            </div>

                            <div className="pt-4">
                                <button type="submit" className="w-full bg-primary-700 text-white py-3 rounded-lg font-bold hover:bg-primary-800 transition-colors">
                                    Save Address
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
