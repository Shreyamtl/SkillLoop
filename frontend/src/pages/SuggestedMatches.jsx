import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import MatchCard from '../components/MatchCard';
import { getSuggestedMatches, sendMatchRequest } from '../services/api';

export default function SuggestedMatches() {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    getSuggestedMatches()
      .then((res) => setMatches(res.data))
      .catch(() => setError('Could not load matches. Try again later.'))
      .finally(() => setLoading(false));
  }, []);

  const handleSendRequest = async (userId, skill, message) => {
    await sendMatchRequest({ toUser: userId, skill, message });
  };

  return (
    <div className="max-w-2xl mx-auto px-6 py-16">
      <h1 className="font-label text-xl text-ink mb-1">suggested matches</h1>
      <p className="text-sm text-ink/60 mb-8">
        People whose skills overlap with what you want to learn. Shared skills are highlighted.
      </p>

      {loading && <p className="text-sm text-ink/50">loading matches...</p>}
      {error && <p className="text-sm text-rust">{error}</p>}

      {!loading && !error && matches.length === 0 && (
        <div className="hairline pb-8">
          <p className="text-sm text-ink/60">
            No matches yet. Add more skills to your profile, or check back once more students join.
          </p>
          <Link to="/profile" className="text-sm text-ink underline mt-2 inline-block">
            Update your profile
          </Link>
        </div>
      )}

      {matches.map((match) => (
        <MatchCard key={match._id} match={match} onSendRequest={handleSendRequest} />
      ))}
    </div>
  );
}
