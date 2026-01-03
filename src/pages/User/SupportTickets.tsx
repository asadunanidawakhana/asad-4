import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { supportService, type Ticket } from '../../services/supportService';
import Loader from '../../components/Loader';
import { MessageSquare, Plus, Clock, CheckCircle } from 'lucide-react';

export default function SupportTickets() {
    const { user } = useAuth();
    const [tickets, setTickets] = useState<Ticket[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    // Form
    const [subject, setSubject] = useState('');
    const [message, setMessage] = useState('');

    useEffect(() => {
        if (user) loadTickets();
    }, [user]);

    async function loadTickets() {
        try {
            const data = await supportService.getUserTickets(user!.id);
            setTickets(data);
        } catch (error) {
            console.error('Error loading tickets', error);
        } finally {
            setLoading(false);
        }
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (!user) return;
        setSubmitting(true);
        try {
            await supportService.createTicket(subject, message, user.id);
            setSubject('');
            setMessage('');
            setIsModalOpen(false);
            loadTickets();
        } catch (error) {
            console.error('Error creating ticket', error);
            alert('Failed to create ticket');
        } finally {
            setSubmitting(false);
        }
    }

    if (loading) return <Loader />;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-900">Support Tickets</h1>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="inline-flex items-center px-4 py-2 bg-primary-700 text-white rounded-lg hover:bg-primary-800 transition-colors"
                >
                    <Plus className="w-5 h-5 mr-2" />
                    New Ticket
                </button>
            </div>

            {tickets.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-xl border border-gray-100 shadow-sm">
                    <MessageSquare className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900">No support tickets</h3>
                    <p className="text-gray-500 mb-6">Need help? Create a ticket and we will get back to you.</p>
                </div>
            ) : (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="divide-y divide-gray-200">
                        {tickets.map((ticket) => (
                            <div key={ticket.id} className="p-6 hover:bg-gray-50 transition-colors">
                                <div className="flex justify-between items-start mb-2">
                                    <h3 className="font-bold text-gray-900">{ticket.subject}</h3>
                                    <StatusBadge status={ticket.status} />
                                </div>
                                <p className="text-gray-600 text-sm mb-4 line-clamp-2">{ticket.message}</p>
                                <div className="text-xs text-gray-400">
                                    Created on {new Date(ticket.created_at).toLocaleDateString()}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* New Ticket Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
                        <h2 className="text-xl font-bold text-gray-900 mb-4">Create New Ticket</h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                                <input
                                    type="text"
                                    required
                                    className="w-full px-4 py-2 border rounded-lg"
                                    value={subject}
                                    onChange={e => setSubject(e.target.value)}
                                    placeholder="Brief summary of issue"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                                <textarea
                                    required
                                    rows={4}
                                    className="w-full px-4 py-2 border rounded-lg"
                                    value={message}
                                    onChange={e => setMessage(e.target.value)}
                                    placeholder="Describe your issue in detail..."
                                ></textarea>
                            </div>
                            <div className="flex justify-end space-x-3 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="px-6 py-2 bg-primary-700 text-white rounded-lg hover:bg-primary-800 disabled:opacity-50"
                                >
                                    {submitting ? 'Submitting...' : 'Submit Ticket'}
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
    if (status === 'closed') return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800"><CheckCircle className="w-3 h-3 mr-1" /> Closed</span>;
    if (status === 'in-progress') return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"><Clock className="w-3 h-3 mr-1" /> In Progress</span>;
    return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800"><MessageSquare className="w-3 h-3 mr-1" /> Open</span>;
}
