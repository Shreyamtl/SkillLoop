const statusColor = {
  pending: 'text-amber border-amber bg-amber/10',
  accepted: 'text-sage border-sage bg-sage/10',
  declined: 'text-rust border-rust bg-rust/10',
};

/**
 * Props:
 *  - request: { _id, skill, message, status, fromUser, toUser, contactEmail }
 *  - direction: 'sent' | 'received'
 *  - onAccept, onDecline: (id) => void   (only used when direction === 'received')
 */
export default function RequestCard({ request, direction, onAccept, onDecline }) {
  const otherParty = direction === 'sent' ? request.toUser : request.fromUser;

  return (
    <div className="hairline pb-5 mb-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="font-semibold text-ink">{otherParty?.name}</p>
          <p className="text-sm text-ink/70 mt-0.5">
            skill: <span className="skill-tag ml-1">{request.skill}</span>
          </p>
          {request.message && (
            <p className="text-sm text-ink/60 mt-2 italic">"{request.message}"</p>
          )}
          {request.status === 'accepted' && otherParty?.email && (
            <p className="font-label text-xs text-sage mt-2">
              contact: {otherParty.email}
            </p>
          )}
        </div>

        <span
          className={`font-label text-[10px] uppercase tracking-wide border px-2 py-0.5 rounded-sm shrink-0 ${statusColor[request.status]}`}
        >
          {request.status}
        </span>
      </div>

      {direction === 'received' && request.status === 'pending' && (
        <div className="flex gap-2 mt-3">
          <button
            onClick={() => onAccept(request._id)}
            className="font-label text-xs bg-ink text-paper px-3 py-1.5 rounded-sm hover:bg-sage transition-colors"
          >
            accept
          </button>
          <button
            onClick={() => onDecline(request._id)}
            className="font-label text-xs border border-ink/30 text-ink/70 px-3 py-1.5 rounded-sm hover:border-rust hover:text-rust transition-colors"
          >
            decline
          </button>
        </div>
      )}
    </div>
  );
}
