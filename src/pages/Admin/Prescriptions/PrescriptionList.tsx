import { useState, useEffect } from 'react';
import { prescriptionService, type Prescription } from '../../../services/prescriptionService';
import Loader from '../../../components/Loader';
import { Eye, Check, X, FileText } from 'lucide-react';

export default function PrescriptionList() {
    const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchPrescriptions();
    }, []);

    async function fetchPrescriptions() {
        setLoading(true);
        try {
            const data = await prescriptionService.getAllPrescriptions();
            setPrescriptions(data);
        } catch (error) {
            console.error('Error fetching prescriptions:', error);
        } finally {
            setLoading(false);
        }
    }

    const handleStatusUpdate = async (id: string, status: 'approved' | 'rejected') => {
        if (!window.confirm(`Are you sure you want to mark this as ${status}?`)) return;
        try {
            await prescriptionService.updateStatus(id, status);
            setPrescriptions(prescriptions.map(p => p.id === id ? { ...p, status } : p));
        } catch (error) {
            console.error("Failed to update status", error);
            alert("Failed to update status");
        }
    };

    if (loading) return <Loader />;

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-gray-900">Manage Prescriptions</h1>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-gray-50 text-gray-700 uppercase font-semibold">
                            <tr>
                                <th className="px-6 py-4">User</th>
                                <th className="px-6 py-4">Date</th>
                                <th className="px-6 py-4">Image</th>
                                <th className="px-6 py-4">Notes</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {prescriptions.length > 0 ? (
                                prescriptions.map((p) => (
                                    <tr key={p.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 block min-w-[150px]">
                                            <div className="font-medium text-gray-900">{p.user?.email}</div>
                                        </td>
                                        <td className="px-6 py-4 text-gray-500 whitespace-nowrap">
                                            {new Date(p.created_at).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4">
                                            <a href={p.file_url} target="_blank" rel="noopener noreferrer" className="group relative block h-10 w-10 rounded overflow-hidden bg-gray-100 border border-gray-200">
                                                <img src={p.file_url} alt="Prescription" className="h-full w-full object-cover" />
                                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                                                    <Eye className="w-4 h-4 text-white opacity-0 group-hover:opacity-100" />
                                                </div>
                                            </a>
                                        </td>
                                        <td className="px-6 py-4 text-gray-500 max-w-xs truncate" title={p.notes}>
                                            {p.notes || '-'}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${p.status === 'approved' ? 'bg-green-100 text-green-800' :
                                                    p.status === 'rejected' ? 'bg-red-100 text-red-800' :
                                                        'bg-yellow-100 text-yellow-800'
                                                }`}>
                                                {p.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right whitespace-nowrap space-x-2">
                                            {p.status === 'pending' && (
                                                <>
                                                    <button
                                                        onClick={() => handleStatusUpdate(p.id, 'approved')}
                                                        className="inline-flex p-1.5 text-green-600 hover:bg-green-50 rounded transition-colors"
                                                        title="Approve"
                                                    >
                                                        <Check className="w-5 h-5" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleStatusUpdate(p.id, 'rejected')}
                                                        className="inline-flex p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors"
                                                        title="Reject"
                                                    >
                                                        <X className="w-5 h-5" />
                                                    </button>
                                                </>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                                        <FileText className="w-12 h-12 mx-auto text-gray-300 mb-3" />
                                        No prescriptions found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
