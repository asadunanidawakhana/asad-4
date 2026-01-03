import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import { prescriptionService, type Prescription } from '../../services/prescriptionService';
import Loader from '../../components/Loader';
import { FileText, Upload, Plus, X, Eye, CheckCircle, XCircle, Clock } from 'lucide-react';

export default function UserPrescriptions() {
    const { user } = useAuth();
    const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    // Form Status
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [notes, setNotes] = useState('');
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (user) {
            fetchPrescriptions();
        }
    }, [user]);

    async function fetchPrescriptions() {
        try {
            const data = await prescriptionService.getUserPrescriptions(user!.id);
            setPrescriptions(data);
        } catch (error) {
            console.error("Error fetching prescriptions:", error);
        } finally {
            setLoading(false);
        }
    }

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setSelectedFile(e.target.files[0]);
        }
    };

    const handleUpload = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedFile || !user) return;

        setUploading(true);
        setMessage(null);

        try {
            await prescriptionService.uploadPrescription(user.id, selectedFile, notes);
            setMessage({ type: 'success', text: 'Prescription uploaded successfully!' });
            setSelectedFile(null);
            setNotes('');
            setIsModalOpen(false);
            fetchPrescriptions(); // Refresh list
        } catch (error: any) {
            console.error("Upload failed", error);
            setMessage({ type: 'error', text: error.message || 'Failed to upload' });
        } finally {
            setUploading(false);
        }
    };

    if (loading) return <Loader />;

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                <h1 className="text-2xl font-bold text-gray-900">My Prescriptions</h1>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="inline-flex items-center px-4 py-2 bg-primary-700 text-white rounded-lg hover:bg-primary-800 transition-colors"
                >
                    <Plus className="w-5 h-5 mr-2" />
                    Upload New
                </button>
            </div>

            {message && (
                <div className={`p-4 rounded-lg flex items-center justify-between ${message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                    <span>{message.text}</span>
                    <button onClick={() => setMessage(null)}><X className="w-4 h-4" /></button>
                </div>
            )}

            {prescriptions.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-xl border border-gray-100 shadow-sm">
                    <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900">No prescriptions yet</h3>
                    <p className="text-gray-500 mb-6">Upload your doctor's prescription to order medicines.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {prescriptions.map((prescription) => (
                        <div key={prescription.id} className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow">
                            <div className="flex justify-between items-start mb-4">
                                <StatusBadge status={prescription.status} />
                                <span className="text-xs text-gray-500">{new Date(prescription.created_at).toLocaleDateString()}</span>
                            </div>

                            <div className="flex items-center mb-4">
                                <div className="h-16 w-16 bg-gray-100 rounded-lg border border-gray-200 overflow-hidden flex items-center justify-center mr-4">
                                    {prescription.file_url ? (
                                        <img src={prescription.file_url} alt="Prescription" className="h-full w-full object-cover" />
                                    ) : (
                                        <FileText className="w-8 h-8 text-gray-400" />
                                    )}
                                </div>
                                <div>
                                    <p className="font-medium text-gray-900 line-clamp-1">{prescription.notes || 'No notes provided'}</p>
                                    <a href={prescription.file_url} target="_blank" rel="noopener noreferrer" className="text-sm text-primary-600 hover:underline inline-flex items-center mt-1">
                                        View Full Image <Eye className="w-3 h-3 ml-1" />
                                    </a>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Upload Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                            <h3 className="text-lg font-bold text-gray-900">Upload Prescription</h3>
                            <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <form onSubmit={handleUpload} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Prescription Image</label>
                                <div
                                    className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-primary-500 transition-colors cursor-pointer"
                                    onClick={() => fileInputRef.current?.click()}
                                >
                                    <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                                    <p className="text-sm text-gray-500">
                                        {selectedFile ? selectedFile.name : 'Click to upload image'}
                                    </p>
                                    <input
                                        type="file"
                                        ref={fileInputRef}
                                        className="hidden"
                                        accept="image/*,.pdf"
                                        onChange={handleFileChange}
                                        required
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Notes (Optional)</label>
                                <textarea
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                                    rows={3}
                                    placeholder="Any specific medicines or instructions..."
                                    value={notes}
                                    onChange={(e) => setNotes(e.target.value)}
                                ></textarea>
                            </div>
                            <div className="pt-2">
                                <button
                                    type="submit"
                                    disabled={uploading || !selectedFile}
                                    className="w-full bg-primary-700 text-white py-2 rounded-lg font-bold hover:bg-primary-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex justify-center items-center"
                                >
                                    {uploading ? 'Uploading...' : 'Submit Prescription'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

function StatusBadge({ status }: { status: string }) {
    if (status === 'approved') return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800"><CheckCircle className="w-3 h-3 mr-1" /> Approved</span>;
    if (status === 'rejected') return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800"><XCircle className="w-3 h-3 mr-1" /> Rejected</span>;
    return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800"><Clock className="w-3 h-3 mr-1" /> Pending Review</span>;
}
