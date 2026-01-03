import { useState, useEffect } from 'react';
import { supportService, type Ticket } from '../../../services/supportService';
import Loader from '../../../components/Loader';
// Status Badge logic handled via select classes

export default function TicketList() {
    const [tickets, setTickets] = useState<Ticket[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<'all' | 'open' | 'closed'>('all');

    useEffect(() => {
        fetchTickets();
    }, []);

    async function fetchTickets() {
        try {
            const data = await supportService.getAllTickets();
            setTickets(data);
        } catch (error) {
            console.error('Error loading tickets', error);
        } finally {
            setLoading(false);
        }
    }

    const handleStatusUpdate = async (id: string, newStatus: 'open' | 'in-progress' | 'closed') => {
        try {
            await supportService.updateTicketStatus(id, newStatus);
            setTickets(tickets.map(t => t.id === id ? { ...t, status: newStatus } : t));
        } catch (error) {
            console.error('Failed to update status', error);
            alert('Failed to update status');
        }
    };

    const filteredTickets = tickets.filter(t => {
        if (filter === 'all') return true;
        if (filter === 'open') return t.status !== 'closed';
        return t.status === 'closed';
    });

    if (loading) return <Loader />;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-900">Support Tickets</h1>
                <div className="flex space-x-2">
                    <button
                        onClick={() => setFilter('all')}
                        className={`px-3 py-1 rounded-full text-sm font-medium ${filter === 'all' ? 'bg-primary-700 text-white' : 'bg-gray-100 text-gray-600'}`}
                    >
                        All
                    </button>
                    <button
                        onClick={() => setFilter('open')}
                        className={`px-3 py-1 rounded-full text-sm font-medium ${filter === 'open' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}
                    >
                        Open
                    </button>
                    <button
                        onClick={() => setFilter('closed')}
                        className={`px-3 py-1 rounded-full text-sm font-medium ${filter === 'closed' ? 'bg-gray-200 text-gray-700' : 'bg-gray-100 text-gray-600'}`}
                    >
                        Closed
                    </button>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="divide-y divide-gray-200">
                    {filteredTickets.length > 0 ? (
                        filteredTickets.map((ticket) => (
                            <div key={ticket.id} className="p-6">
                                <div className="flex justify-between items-start mb-2">
                                    <div>
                                        <h3 className="font-bold text-gray-900 text-lg">{ticket.subject}</h3>
                                        <div className="text-sm text-gray-500 mb-2">
                                            From: <span className="font-medium text-gray-700">{ticket.user?.email || 'Unknown User'}</span>
                                            &nbsp;•&nbsp;
                                            {new Date(ticket.created_at).toLocaleDateString()}
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <select
                                            value={ticket.status}
                                            onChange={(e) => handleStatusUpdate(ticket.id, e.target.value as any)}
                                            className={`text-sm rounded-full px-3 py-1 font-medium border-none ring-1 ring-inset ${ticket.status === 'closed' ? 'bg-gray-50 text-gray-600 ring-gray-200' :
                                                ticket.status === 'in-progress' ? 'bg-blue-50 text-blue-700 ring-blue-200' :
                                                    'bg-green-50 text-green-700 ring-green-200'
                                                }`}
                                        >
                                            <option value="open">Open</option>
                                            <option value="in-progress">In Progress</option>
                                            <option value="closed">Closed</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="bg-gray-50 p-4 rounded-lg text-gray-700 text-sm">
                                    {ticket.message}
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="p-12 text-center text-gray-500">
                            No tickets found matching filter.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
