import { useState, useEffect } from 'react';
import RequestCard from '../components/RequestCard';
import { getMyRequests, acceptMatchRequest, declineMatchRequest } from '../services/api';

export default function RequestsInbox() {
  const [tab, setTab] = useState('received');
  const [data, setData] = useState({ sent: [], received: [] });
  const [loading, setLoading] = useState(true);

  const loadRequests = () => {
    setLoading(true);
    getMyRequests()
      .then((res) => setData(res.data))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadRequests();
  }, []);

  const handleAccept = async (id) => {
    await acceptMatchRequest(id);
    loadRequests();
  };

  const handleDecline = async (id) => {
    await declineMatchRequest(id);
    loadRequests();
  };

  const list = data[tab] || [];

  return (
    <div className="max-w-2xl mx-auto px-6 py-16">
      <h1 className="font-label text-xl text-ink mb-1">requests</h1>
      <p className="text-sm text-ink/60 mb-8">Track requests you've sent and received.</p>

      <div className="flex gap-2 mb-8 font-label text-xs">
        <button
          onClick={() => setTab('received')}
          className={`px-3 py-1.5 rounded-sm border ${
            tab === 'received' ? 'bg-ink text-paper border-ink' : 'border-ink/30 text-ink/60'
          }`}
        >
          received {data.received?.length ? `(${data.received.length})` : ''}
        </button>
        <button
          onClick={() => setTab('sent')}
          className={`px-3 py-1.5 rounded-sm border ${
            tab === 'sent' ? 'bg-ink text-paper border-ink' : 'border-ink/30 text-ink/60'
          }`}
        >
          sent {data.sent?.length ? `(${data.sent.length})` : ''}
        </button>
      </div>

      {loading && <p className="text-sm text-ink/50">loading...</p>}

      {!loading && list.length === 0 && (
        <p className="text-sm text-ink/60">
          {tab === 'received' ? "No requests received yet." : "You haven't sent any requests yet."}
        </p>
      )}

      {list.map((request) => (
        <RequestCard
          key={request._id}
          request={request}
          direction={tab}
          onAccept={handleAccept}
          onDecline={handleDecline}
        />
      ))}
    </div>
  );
}
