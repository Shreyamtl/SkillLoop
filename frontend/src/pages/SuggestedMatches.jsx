import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import MatchCard from '../components/MatchCard';
import { getSuggestedMatches, sendMatchRequest, getAllUsers } from '../services/api';
import toast from 'react-hot-toast';

export default function SuggestedMatches() {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const searchQuery = params.get('search') || '';
  const modeParam = params.get('mode') || '';

  const [matches, setMatches] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState(searchQuery);
  const [filterType, setFilterType] = useState('matches');
  const [viewMode, setViewMode] = useState(modeParam === 'browse' ? 'browse' : 'matches');

  useEffect(() => {
    setLoading(true);
    Promise.all([
      getSuggestedMatches(),
      getAllUsers()
    ])
      .then(([matchesRes, usersRes]) => {
        setMatches(matchesRes.data);
        setAllUsers(usersRes.data);
      })
      .catch(() => setError('Could not load data. Try again later.'))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    let result = [];

    if (viewMode === 'matches') {
      result = [...matches];
      if (filterType === 'mutual') {
        result = result.filter(match => match.mutual === true);
      }
    } else {
      result = [...allUsers];
    }

    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase().trim();
      result = result.filter(user =>
        user.name?.toLowerCase().includes(term) ||
        user.skillsToTeach?.some(skill => skill.toLowerCase().includes(term))
      );
    }

    setFilteredUsers(result);
  }, [searchTerm, filterType, matches, allUsers, viewMode]);

  const handleSendRequest = async (userId, skill, message) => {
    try {
      await sendMatchRequest({ toUser: userId, skill, message });
      toast.success(`Request sent for ${skill}!`);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to send request');
    }
  };

  const formatUserAsMatch = (user) => {
    const match = matches.find(m => m._id === user._id);
    if (match) return match;
    return {
      _id: user._id,
      name: user.name,
      skillsToTeach: user.skillsToTeach || [],
      sharedSkills: [],
      mutual: false,
    };
  };

  if (loading) return <p className="text-center py-16 text-ink/50 text-sm">loading...</p>;

  return (
    <div className="max-w-2xl mx-auto px-6 py-16">
      <h1 className="font-label text-xl text-ink mb-1">Suggested Matches</h1>
      <p className="text-sm text-ink/60 mb-8">
        People whose skills overlap with what you want to learn. Shared skills are highlighted.
      </p>

      <div className="flex gap-2 mb-6">
        <button
          onClick={() => {
            setViewMode('matches');
            setSearchTerm('');
          }}
          className={`px-4 py-2 rounded-xl text-sm font-medium transition ${
            viewMode === 'matches' && !searchTerm
              ? 'bg-indigo-600 text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          My Matches ({matches.length})
        </button>
        <button
          onClick={() => {
            setViewMode('browse');
            setSearchTerm('');
          }}
          className={`px-4 py-2 rounded-xl text-sm font-medium transition ${
            viewMode === 'browse' && !searchTerm
              ? 'bg-indigo-600 text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          Browse All ({allUsers.length})
        </button>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search by name or skill..."
          className="flex-1 border border-ink/30 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-500 transition"
        />
        {viewMode === 'matches' && !searchTerm && (
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="border border-ink/30 rounded-xl px-4 py-2.5 text-sm bg-white focus:outline-none focus:border-indigo-500 transition"
          >
            <option value="all">All Matches</option>
            <option value="mutual">Mutual Only</option>
          </select>
        )}
      </div>

      {!error && (
        <p className="text-sm text-gray-500 mb-4">
          {searchTerm ? (
            `Found ${filteredUsers.length} user${filteredUsers.length !== 1 ? 's' : ''} for "${searchTerm}"`
          ) : (
            `Showing ${filteredUsers.length} ${viewMode === 'matches' ? 'match' : 'user'}${filteredUsers.length !== 1 ? 'es' : ''}`
          )}
        </p>
      )}

      {error && <p className="text-sm text-rust">{error}</p>}

      {!error && filteredUsers.length === 0 && (
        <div className="hairline pb-8">
          <p className="text-sm text-ink/60">
            {searchTerm
              ? `No users found matching "${searchTerm}".`
              : viewMode === 'matches'
                ? 'No matches yet. Add more skills to your profile, or browse all users.'
                : 'No other users found. Invite your friends to join!'}
          </p>
          {viewMode === 'matches' && !searchTerm && (
            <button
              onClick={() => {
                setViewMode('browse');
                setSearchTerm('');
              }}
              className="text-sm text-indigo-600 underline mt-2 inline-block"
            >
              Browse all users instead
            </button>
          )}
        </div>
      )}

      {filteredUsers.map((user) => {
        const isMatch = matches.some(m => m._id === user._id);
        return (
          <MatchCard 
            key={user._id} 
            match={formatUserAsMatch(user)} 
            onSendRequest={handleSendRequest}
            isBrowseMode={viewMode === 'browse' && !isMatch}
          />
        );
      })}
    </div>
  );
}